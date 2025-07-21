require("dotenv").config();

const vnpayConfig = {
  vnp_TmnCode: process.env.VNP_TMN_CODE,
  vnp_HashSecret: process.env.VNP_HASH_SECRET,
  vnp_Url: process.env.VNP_URL,
  vnp_Api: process.env.VNP_API,
  vnp_IpnUrl: process.env.VNP_IPN_URL,
  vnp_ReturnUrl: process.env.VNP_RETURN_URL,
};

module.exports = vnpayConfig;
