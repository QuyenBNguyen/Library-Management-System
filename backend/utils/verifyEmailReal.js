const dns = require("dns").promises;

// Kiểm tra domain email có MX record không (tồn tại mail server)
async function isEmailDomainValid(email) {
  const domain = email.split("@")[1];
  try {
    const mx = await dns.resolveMx(domain);
    return mx && mx.length > 0;
  } catch {
    return false;
  }
}

module.exports = isEmailDomainValid;
