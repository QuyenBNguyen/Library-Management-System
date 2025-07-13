require("dotenv").config();

const vnpayConfig = {
  tmnCode: process.env.VNP_TMN_CODE,
  secretKey: process.env.VNP_HASH_SECRET,
  paymentUrl: process.env.VNP_API_URL,
  returnUrl: process.env.VNP_RETURN_URL,
};

module.exports = vnpayConfig;
