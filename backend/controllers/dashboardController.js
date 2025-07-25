const Book = require("../models/book");
const User = require("../models/user");
const Loan = require("../models/loan");
const Payment = require("../models/payment");

const getDashboard = async (req, res) => {
  const totalBooks = await Book.countDocuments();
  const totalUsers = await User.countDocuments({ role: "member" });
  const totalLoans = await Loan.countDocuments({ status: "borrowed" });
  const totalPayments = await Payment.countDocuments({ status: "success" });

  res.json({ totalBooks, totalUsers, totalLoans, totalPayments });
};

module.exports = { getDashboard };
