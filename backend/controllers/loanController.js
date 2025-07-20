// loancontroller

const Loan = require("../models/loan");

const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().populate("user").populate("book");
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user._id })
      .populate("user")
      .populate("book");
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate("user")
      .populate("book");
    if (loan) {
      res.status(200).json(loan);
    } else {
      res.status(404).json({ message: "Loan not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createLoan = async (req, res) => {
  try {
    const loan = await Loan.create(req.body);
    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLoanById = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (loan) {
      res.status(200).json(loan);
    } else {
      res.status(404).json({ message: "Loan not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteLoanById = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndDelete(req.params.id);
    if (loan) {
      res.status(200).json({ message: "Loan deleted successfully" });
    } else {
      res.status(404).json({ message: "Loan not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllLoans,
  getMyLoans,
  getLoanById,
  createLoan,
  updateLoanById,
  deleteLoanById,
};
