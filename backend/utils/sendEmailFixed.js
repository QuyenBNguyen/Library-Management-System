const nodemailer = require("nodemailer");

const sendVerificationEmail = async (toEmail, otp, isRegistration = false) => {
  try {
    console.log(`Sending email to ${toEmail} with OTP: ${otp}`);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Email credentials not configured');
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();
    console.log('Email transporter verified');

    const subject = isRegistration ? 
      "Xác thực tài khoản - Library Management System" : 
      "Đặt lại mật khẩu - Library Management System";
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">${isRegistration ? 'Xác thực tài khoản' : 'Đặt lại mật khẩu'}</h2>
        <p>Xin chào,</p>
        <p>${isRegistration ? 
          'Cảm ơn bạn đã đăng ký tài khoản. Vui lòng sử dụng mã OTP dưới đây để xác thực tài khoản:' : 
          'Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng sử dụng mã OTP dưới đây:'
        }</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #2c5aa0; font-size: 32px; margin: 0;">${otp}</h1>
        </div>
        <p>Mã OTP này có hiệu lực trong 10 phút.</p>
        <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
        <p>Trân trọng,<br>Library Management System</p>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: subject,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully! MessageId: ${result.messageId}`);
    
    return result;
  } catch (error) {
    console.error('Email error:', error.message);
    throw error;
  }
};

module.exports = { sendVerificationEmail };
