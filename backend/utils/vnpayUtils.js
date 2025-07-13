const crypto = require("crypto");
const qs = require("qs");
const vnpayConfig = require("../config/vnpayConfig");

function sortObject(obj) {
  return Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
}

const createVNPayUrl = (req) => {
  const date = new Date();
  const createDate = date.toISOString().replace(/[-:]/g, "").slice(0, 14);
  const orderId = Date.now().toString();
  const amount = 100000; // hoặc lấy từ req.body.amount nếu dùng POST

  const ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    "127.0.0.1";

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: vnpayConfig.tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Payment for order ${orderId}`,
    vnp_OrderType: "other",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: vnpayConfig.returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  vnp_Params = sortObject(vnp_Params);

  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", vnpayConfig.secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  vnp_Params.vnp_SecureHash = signed;

  return `${vnpayConfig.paymentUrl}?${qs.stringify(vnp_Params, {
    encode: false,
  })}`;
};

const verifyVNPayReturn = (query) => {
  const secureHash = query.vnp_SecureHash;
  const inputData = { ...query };

  delete inputData.vnp_SecureHash;
  delete inputData.vnp_SecureHashType;

  const sortedData = sortObject(inputData);
  const signData = qs.stringify(sortedData, { encode: false });

  const hmac = crypto.createHmac("sha512", vnpayConfig.secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  return {
    isValid: signed === secureHash,
    data: sortedData,
  };
};

module.exports = {
  createVNPayUrl,
  verifyVNPayReturn,
};
