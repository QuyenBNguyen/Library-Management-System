const nodemailer = require("nodemailer");

const sendVerificationEmail = async (toEmail, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Librarium 📚" <no-reply@librarium.com>',
    to: toEmail,
    subject: "Mã xác thực tài khoản BookWorm",
    html: `<div style='font-family:sans-serif;font-size:16px;'>
      <p>Xin chào,</p>
      <p>Mã xác thực tài khoản của bạn là:</p>
      <div style='font-size:28px;font-weight:bold;letter-spacing:4px;color:#2d7a2d;margin:16px 0;'>${otp}</div>
      <p>Mã này có hiệu lực trong 5 phút.</p>
      <p>Nếu bạn không thực hiện đăng ký, vui lòng bỏ qua email này.</p>
      <hr style='margin:16px 0;border:none;border-top:1px solid #eee;'>
      <div style='color:#888;font-size:13px;'>BookWorm Team</div>
    </div>`,
  });
};

module.exports = sendVerificationEmail;
