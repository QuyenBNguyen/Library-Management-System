const moment = require("moment");
const mongoose = require("mongoose");
const Payment = require("../models/payment");
const BorrowBook = require("../models/borrowBook");
const request = require("request");
const vnpayConfig = require("../config/vnpayConfig");

const getAllPayments = async (req, res, next) => {
  console.log("getAllPayments");
  const { status, search, page = 1, limit = 10 } = req.query;
  const query = {};

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { "user.name": { $regex: search, $options: "i" } },
      { "user.email": { $regex: search, $options: "i" } },
      { "borrowBooks.book.title": { $regex: search, $options: "i" } },
    ];
  }

  try {
    const paymentCount = await Payment.countDocuments(query);

    const payments = await Payment.find(query)
      .populate("user")
      .populate({ path: "borrowBooks", populate: { path: "book" } })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      data: payments,
      page: page,
      totalPages: Math.ceil(paymentCount / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyPayments = async (req, res, next) => {
  const payments = await Payment.find({ user: req.user._id })
    .populate("user")
    .populate({ path: "borrowBooks", populate: { path: "book" } });
  res.status(200).json(payments);
};

const getAllPaymentsByUser = async (req, res, next) => {
  const payments = await Payment.find({ user: req.params.id })
    .populate("user")
    .populate({ path: "borrowBooks", populate: { path: "book" } });
  res.status(200).json(payments);
};

const createPaymentUrl = async (req, res, next) => {
  const borrowBookIds = req.body.borrowBookIds;

  if (!borrowBookIds) {
    return res.status(400).json({ message: "BorrowBook IDs are required" });
  }

  if (!Array.isArray(borrowBookIds)) {
    return res.status(400).json({ message: "BorrowBook IDs must be an array" });
  }

  if (borrowBookIds.length === 0) {
    return res.status(400).json({ message: "BorrowBook IDs must not be empty" });
  }

  if (borrowBookIds.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
    return res.status(400).json({ message: "Invalid BorrowBook ID" });
  }

  const borrowBookIdsSet = new Set(borrowBookIds);
  const uniqueBorrowBookIds = Array.from(borrowBookIdsSet);

  if (uniqueBorrowBookIds.length !== borrowBookIds.length) {
    return res.status(400).json({ message: "Duplicate BorrowBook IDs" });
  }

  let amount = 0;

  for (let i = 0; i < uniqueBorrowBookIds.length; i++) {
    const bb = await BorrowBook.findById(uniqueBorrowBookIds[i]);
    if (!bb) {
      return res.status(400).json({ message: "BorrowBook not found" });
    }
    if (
      !bb.isPaid &&
      (bb.fineAmount > 0)
    ) {
      amount += bb.fineAmount;
    }
  }

  const newPayment = await Payment.create({
    user: req.user._id,
    borrowBooks: uniqueBorrowBookIds,
    amount: amount,
    method: "vnpay",
    status: "pending",
  });

  process.env.TZ = "Asia/Ho_Chi_Minh";

  let date = new Date();
  let createDate = moment(date).format("YYYYMMDDHHmmss");

  let ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  // let config = require("config");

  let tmnCode = vnpayConfig.vnp_TmnCode; // config.get("vnp_TmnCode");
  let secretKey = vnpayConfig.vnp_HashSecret; // config.get("vnp_HashSecret");
  let vnpUrl = vnpayConfig.vnp_Url; // config.get("vnp_Url");
  let returnUrl = vnpayConfig.vnp_ReturnUrl; // config.get("vnp_ReturnUrl");
  let paymentId = newPayment._id;

  let locale = req.body.language || "vn";
  if (locale === null || locale === "") {
    locale = "vn";
  }
  let currCode = "VND";
  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = paymentId;
  vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + paymentId;
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;

  vnp_Params = sortObject(vnp_Params);

  let querystring = require("qs");
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

  console.log("Amount: " + amount * 100);
  console.log(vnpUrl);

  // res.redirect(vnpUrl);

  return res.status(200).json({ url: vnpUrl });
};

const vnpayReturn = async (req, res, next) => {
  const vnp_Params = { ...req.query };
  const secureHash = vnp_Params["vnp_SecureHash"];
  const paymentId = vnp_Params["vnp_TxnRef"];
  const rspCode = vnp_Params["vnp_ResponseCode"];

  const payment = await Payment.findById(paymentId).populate({ path: "borrowBooks", populate: { path: "book" } });
  if (!payment) {
    return res.redirect(
      `http://localhost:3000/payment/success?status=error&message=Payment not found`
    );
  }

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  const sortedParams = sortObject(vnp_Params);
  const querystring = require("qs");
  const crypto = require("crypto");

  const signData = querystring.stringify(sortedParams, { encode: false });
  const signed = crypto
    .createHmac("sha512", vnpayConfig.vnp_HashSecret)
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");

  if (secureHash !== signed) {
    return res.redirect(
      `http://localhost:3000/payment/success?status=error&message=Checksum failed`
    );
  }

  if (payment.status !== "pending") {
    return res.redirect(`http://localhost:3000/payment/success?status=exists`);
  }

  payment.transactionId = vnp_Params["vnp_TransactionNo"];
  payment.paidAt = moment(vnp_Params["vnp_PayDate"], "YYYYMMDDHHmmss").toDate();

  if (rspCode === "00") {
    payment.status = "success";
    await payment.save();
    const BorrowBook = require("../models/borrowBook");
    const Book = require("../models/book");
    for (const bbId of payment.borrowBooks) {
      const bb = await BorrowBook.findByIdAndUpdate(bbId, { isPaid: true }, { new: true });
      if (bb && bb.book) {
        await Book.findByIdAndUpdate(bb.book, { status: "available" });
      }
    }
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      const updatedPayment = await Payment.findById(paymentId).populate('user').populate({ path: 'borrowBooks', populate: { path: 'book' } });
      return res.json({ payment: updatedPayment });
    }
    return res.redirect(
      `http://localhost:3000/payment/success?status=success&amount=${payment.amount}&paymentId=${payment._id}`
    );
  } else {
    payment.status = "failed";
    await payment.save();
    return res.redirect(`http://localhost:3000/payment/success?status=failed`);
  }
};

// const vnpayReturn = async (req, res, next) => {
//   console.log("vnpayReturn called!", req.query);

//   let vnp_Params = { ...req.query };

//   let secureHash = vnp_Params["vnp_SecureHash"];

//   let paymentId = vnp_Params["vnp_TxnRef"];

//   const payment = await Payment.findById(paymentId).populate("loans");
//   if (!payment) {
//     return res
//       .status(404)
//       .json({ RspCode: "01", message: "Payment not found" });
//   }

//   let rspCode = vnp_Params["vnp_ResponseCode"];

//   delete vnp_Params["vnp_SecureHash"];
//   delete vnp_Params["vnp_SecureHashType"];

//   vnp_Params = sortObject(vnp_Params);
//   // let config = require("config");
//   let secretKey = vnpayConfig.vnp_HashSecret; // config.get("vnp_HashSecret");
//   let querystring = require("qs");
//   let signData = querystring.stringify(vnp_Params, { encode: false });
//   let crypto = require("crypto");
//   let hmac = crypto.createHmac("sha512", secretKey);
//   let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

//   let paymentStatus = "0"; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
//   //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
//   //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

//   let checkPaymentId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
//   let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
//   if (secureHash === signed) {
//     //kiểm tra checksum
//     if (checkPaymentId) {
//       if (checkAmount) {
//         if (paymentStatus == "0") {
//           //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
//           if (rspCode == "00") {
//             //thanh cong
//             //paymentStatus = '1'
//             // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
//             payment.status = "success";
//             payment.transactionId = vnp_Params["vnp_TransactionNo"];
//             payment.paidAt = moment(
//               vnp_Params["vnp_PayDate"],
//               "YYYYMMDDHHmmss"
//             ).toDate();
//             await payment.save();

//             for (const loan of payment.loans) {
//               loan.status = "returned";
//               loan.isPaid = true;
//               await loan.save();
//             }
//             res.status(200).json({ RspCode: "00", Message: "Success" });
//           } else {
//             //that bai
//             //paymentStatus = '2'
//             // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
//             payment.status = "failed";
//             payment.transactionId = vnp_Params["vnp_TransactionNo"];
//             payment.paidAt = moment(
//               vnp_Params["vnp_PayDate"],
//               "YYYYMMDDHHmmss"
//             ).toDate();
//             await payment.save();
//             res.status(200).json({ RspCode: "00", Message: "Success" });
//           }
//         } else {
//           res.status(200).json({
//             RspCode: "02",
//             Message: "This order has been updated to the payment status",
//           });
//         }
//       } else {
//         res.status(200).json({ RspCode: "04", Message: "Amount invalid" });
//       }
//     } else {
//       res.status(200).json({ RspCode: "01", Message: "Order not found" });
//     }
//   } else {
//     res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
//   }
// };

const getVNPayIpn = async (req, res, next) => {
  console.log("getVNPayIpn called!", req.query);

  let vnp_Params = req.query;
  let secureHash = vnp_Params["vnp_SecureHash"];

  let paymentId = vnp_Params["vnp_TxnRef"];

  const payment = Payment.findById(paymentId).populate({ path: "borrowBooks", populate: { path: "book" } });
  if (!payment) {
    return res
      .status(404)
      .json({ RspCode: "01", message: "Payment not found" });
  }

  let rspCode = vnp_Params["vnp_ResponseCode"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);
  // let config = require("config");
  let secretKey = vnpayConfig.vnp_HashSecret; // config.get("vnp_HashSecret");
  let querystring = require("qs");
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  let paymentStatus = "0"; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
  //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
  //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

  let checkPaymentId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
  let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
  if (secureHash === signed) {
    //kiểm tra checksum
    if (checkPaymentId) {
      if (checkAmount) {
        if (paymentStatus == "0") {
          //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
          if (rspCode == "00") {
            //thanh cong
            //paymentStatus = '1'
            // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
            payment.status = "success";
            payment.transactionId = vnp_Params["vnp_TransactionNo"];
            payment.paidAt = new Date(vnp_Params["vnp_PayDate"]);
            await payment.save();

            for (const bb of payment.borrowBooks) {
              bb.isPaid = true;
              await bb.save();
            }
            res.status(200).json({ RspCode: "00", Message: "Success" });
          } else {
            //that bai
            //paymentStatus = '2'
            // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
            payment.status = "failed";
            payment.transactionId = vnp_Params["vnp_TransactionNo"];
            payment.paidAt = new Date(vnp_Params["vnp_PayDate"]);
            await payment.save();
            res.status(200).json({ RspCode: "00", Message: "Success" });
          }
        } else {
          res.status(200).json({
            RspCode: "02",
            Message: "This order has been updated to the payment status",
          });
        }
      } else {
        res.status(200).json({ RspCode: "04", Message: "Amount invalid" });
      }
    } else {
      res.status(200).json({ RspCode: "01", Message: "Order not found" });
    }
  } else {
    res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
  }
};

const queryDr = (req, res, next) => {
  process.env.TZ = "Asia/Ho_Chi_Minh";
  let date = new Date();

  // let config = require("config");
  let crypto = require("crypto");

  let vnp_TmnCode = vnpayConfig.vnp_TmnCode; // config.get("vnp_TmnCode");
  let secretKey = vnpayConfig.vnp_HashSecret; // config.get("vnp_HashSecret");
  let vnp_Api = vnpayConfig.vnp_Api; // config.get("vnp_Api");

  let vnp_TxnRef = req.body.paymentId;
  let vnp_TransactionDate = req.body.transDate;

  let vnp_RequestId = moment(date).format("HHmmss");
  let vnp_Version = "2.1.0";
  let vnp_Command = "querydr";
  let vnp_OrderInfo = "Truy van GD ma:" + vnp_TxnRef;

  let vnp_IpAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let currCode = "VND";
  let vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");

  let data =
    vnp_RequestId +
    "|" +
    vnp_Version +
    "|" +
    vnp_Command +
    "|" +
    vnp_TmnCode +
    "|" +
    vnp_TxnRef +
    "|" +
    vnp_TransactionDate +
    "|" +
    vnp_CreateDate +
    "|" +
    vnp_IpAddr +
    "|" +
    vnp_OrderInfo;

  let hmac = crypto.createHmac("sha512", secretKey);
  let vnp_SecureHash = hmac.update(Buffer.from(data, "utf-8")).digest("hex");

  let dataObj = {
    vnp_RequestId: vnp_RequestId,
    vnp_Version: vnp_Version,
    vnp_Command: vnp_Command,
    vnp_TmnCode: vnp_TmnCode,
    vnp_TxnRef: vnp_TxnRef,
    vnp_OrderInfo: vnp_OrderInfo,
    vnp_TransactionDate: vnp_TransactionDate,
    vnp_CreateDate: vnp_CreateDate,
    vnp_IpAddr: vnp_IpAddr,
    vnp_SecureHash: vnp_SecureHash,
  };
  // /merchant_webapi/api/transaction

  request(
    {
      url: vnp_Api,
      method: "POST",
      json: true,
      body: dataObj,
    },
    function (error, response, body) {
      console.log(response);

      if (error) {
        res.status(200).json({ RspCode: "99", Message: "Error" });
      } else {
        if (body.RspCode == "00") {
          res.status(200).json(body);
        } else {
          res.status(200).json(body);
        }
      }
    }
  );
};

const refund = (req, res, next) => {
  process.env.TZ = "Asia/Ho_Chi_Minh";
  let date = new Date();

  // let config = require("config");
  let crypto = require("crypto");

  let vnp_TmnCode = vnpayConfig.vnp_TmnCode; // config.get("vnp_TmnCode");
  let secretKey = vnpayConfig.vnp_HashSecret; // config.get("vnp_HashSecret");
  let vnp_Api = vnpayConfig.vnp_Api; // config.get("vnp_Api");

  let vnp_TxnRef = req.body.paymentId;
  let vnp_TransactionDate = req.body.transDate;
  let vnp_Amount = req.body.amount * 100;
  let vnp_TransactionType = req.body.transType;
  let vnp_CreateBy = req.body.user;

  let currCode = "VND";

  let vnp_RequestId = moment(date).format("HHmmss");
  let vnp_Version = "2.1.0";
  let vnp_Command = "refund";
  let vnp_OrderInfo = "Hoan tien GD ma:" + vnp_TxnRef;

  let vnp_IpAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");

  let vnp_TransactionNo = "0";

  let data =
    vnp_RequestId +
    "|" +
    vnp_Version +
    "|" +
    vnp_Command +
    "|" +
    vnp_TmnCode +
    "|" +
    vnp_TransactionType +
    "|" +
    vnp_TxnRef +
    "|" +
    vnp_Amount +
    "|" +
    vnp_TransactionNo +
    "|" +
    vnp_TransactionDate +
    "|" +
    vnp_CreateBy +
    "|" +
    vnp_CreateDate +
    "|" +
    vnp_IpAddr +
    "|" +
    vnp_OrderInfo;
  let hmac = crypto.createHmac("sha512", secretKey);
  let vnp_SecureHash = hmac.update(Buffer.from(data, "utf-8")).digest("hex");

  let dataObj = {
    vnp_RequestId: vnp_RequestId,
    vnp_Version: vnp_Version,
    vnp_Command: vnp_Command,
    vnp_TmnCode: vnp_TmnCode,
    vnp_TransactionType: vnp_TransactionType,
    vnp_TxnRef: vnp_TxnRef,
    vnp_Amount: vnp_Amount,
    vnp_TransactionNo: vnp_TransactionNo,
    vnp_CreateBy: vnp_CreateBy,
    vnp_OrderInfo: vnp_OrderInfo,
    vnp_TransactionDate: vnp_TransactionDate,
    vnp_CreateDate: vnp_CreateDate,
    vnp_IpAddr: vnp_IpAddr,
    vnp_SecureHash: vnp_SecureHash,
  };

  request(
    {
      url: vnp_Api,
      method: "POST",
      json: true,
      body: dataObj,
    },
    function (error, response, body) {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      const vnp_ResponseCode = body.vnp_ResponseCode;
      const vnp_TransactionNo = body.vnp_TransactionNo;

      console.log(response);

      const redirectUrl = `http://localhost:3000/api/payment/result?vnp_ResponseCode=${vnp_ResponseCode}&vnp_TransactionNo=${vnp_TransactionNo}`;
      res.redirect(redirectUrl);
    }
  );
};

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

module.exports = {
  getAllPayments,
  getMyPayments,
  getAllPaymentsByUser,
  createPaymentUrl,
  vnpayReturn,
  getVNPayIpn,
  queryDr,
  refund,
};
