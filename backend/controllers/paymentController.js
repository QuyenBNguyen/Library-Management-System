const moment = require("moment");
const crypto = require("crypto");
const qs = require("qs");
const vnpConfig = require("../config/vnpayConfig");

const sortObject = (obj) =>
  Object.keys(obj)
    .sort()
    .reduce((res, key) => {
      res[key] = obj[key];
      return res;
    }, {});

exports.renderForm = (req, res) => {
  res.render("order", { title: "Tạo đơn hàng", amount: 10000 });
};

exports.createPayment = (req, res) => {
  const date = new Date();
  const createDate = moment(date).format("YYYYMMDDHHmmss");
  const orderId = moment(date).format("DDHHmmss");
  const ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const amount = req.body.amount;
  const bankCode = req.body.bankCode || "";
  const locale = req.body.language || "vn";

  let params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: vnpConfig.tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: "Thanh toán đơn hàng: " + orderId,
    vnp_OrderType: "other",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: vnpConfig.returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode) params.vnp_BankCode = bankCode;

  params = sortObject(params);
  const signData = qs.stringify(params, { encode: false });
  const hmac = crypto.createHmac("sha512", vnpConfig.secretKey);
  const signed = hmac.update(signData).digest("hex");
  params.vnp_SecureHash = signed;

  const redirectUrl =
    vnpConfig.paymentUrl + "?" + qs.stringify(params, { encode: false });
  res.redirect(redirectUrl);
};

exports.handleReturn = (req, res) => {
  const vnp_Params = req.query;
  const secureHash = vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHashType;

  const sorted = sortObject(vnp_Params);
  const signData = qs.stringify(sorted, { encode: false });
  const hmac = crypto.createHmac("sha512", vnpConfig.secretKey);
  const signed = hmac.update(signData).digest("hex");

  console.log("===== CHECK SIGNATURE response =====");
  console.log("SIGN DATA    :", signData, "\n");
  console.log("SERVER SIGNED:", signed, "\n");
  console.log("VNPAY SIGNED :", req.query.vnp_SecureHash, "\n");

  if (signed === secureHash) {
    res.render("success", { code: vnp_Params["vnp_ResponseCode"] });
  } else {
    res.render("success", { code: "97" });
  }
};

exports.handleIPN = (req, res) => {
  const vnp_Params = req.query;
  const secureHash = vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHashType;

  const sorted = sortObject(vnp_Params);
  const signData = qs.stringify(sorted, { encode: false });
  const hmac = crypto.createHmac("sha512", vnpConfig.secretKey);
  const signed = hmac.update(signData).digest("hex");

  if (signed === secureHash) {
    // Bạn xử lý lưu trạng thái thanh toán ở đây (CSDL)
    res.status(200).json({ RspCode: "00", Message: "Success" });
  } else {
    res.status(200).json({ RspCode: "97", Message: "Invalid signature" });
  }
};
