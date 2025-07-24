const Book = require("../models/book");
const User = require("../models/user");
const BorrowBook = require("../models/borrowBook");
const Payment = require("../models/payment");

const getDashboard = async (req, res) => {
  const totalBooks = await Book.countDocuments();
  const totalUsers = await User.countDocuments({ role: "member" });
  const totalLoans = await BorrowBook.countDocuments({ returnDate: null });
  const totalPayments = await Payment.countDocuments({ status: "success" });

  res.json({ totalBooks, totalUsers, totalLoans, totalPayments });
};

module.exports = { getDashboard };
