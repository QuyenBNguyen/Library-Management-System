const BorrowSession = require('../models/borrowSession');
const BorrowBook = require('../models/borrowBook');
const Book = require('../models/book');
const User = require('../models/user');
const mongoose = require('mongoose');

// POST /api/borrow/checkout
// Body: { bookIds: [bookId], dueDate }
exports.checkoutBooks = async (req, res) => {
  try {
    const { bookIds, dueDate, memberId } = req.body;
    let userId = req.user._id;
    if (req.user.role === 'librarian' && memberId) {
      userId = memberId;
    }
    console.log('checkoutBooks:', { userRole: req.user.role, memberId, usedUserId: userId });
    if (!Array.isArray(bookIds) || bookIds.length === 0) {
      return res.status(400).json({ success: false, error: 'No books selected.' });
    }
    if (!dueDate) {
      return res.status(400).json({ success: false, error: 'Due date required.' });
    }
    // Create BorrowSession
    const session = await BorrowSession.create({ member: userId, dueDate });
    // Create BorrowBook for each book
    const borrowBooks = await Promise.all(bookIds.map(async (bookId) => {
      // Optionally update book status
      await Book.findByIdAndUpdate(bookId, { status: 'checked out' });
      return BorrowBook.create({ book: bookId, borrowSession: session._id });
    }));
    res.status(201).json({ success: true, data: { session, borrowBooks } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/borrow/return
// Body: { borrowBookIds: [borrowBookId] }
exports.returnBooks = async (req, res) => {
  try {
    const { borrowBookIds } = req.body;
    if (!Array.isArray(borrowBookIds) || borrowBookIds.length === 0) {
      return res.status(400).json({ success: false, error: 'No borrowBookIds provided.' });
    }
    const now = new Date();
    const updated = [];
    for (const id of borrowBookIds) {
      const borrowBook = await BorrowBook.findById(id).populate('borrowSession').populate('book');
      if (!borrowBook) continue;
      if (borrowBook.returnDate) continue; // already returned
      borrowBook.returnDate = now;
      // Calculate overdue
      const due = borrowBook.borrowSession.dueDate;
      let overdueDay = 0;
      let fineAmount = 0;
      if (now > due) {
        overdueDay = Math.ceil((now - due) / (1000 * 60 * 60 * 24));
        fineAmount = overdueDay * 5; // $5 per day
      }
      borrowBook.overdueDay = overdueDay;
      borrowBook.fineAmount = fineAmount;
      await borrowBook.save();
      // Optionally update book status
      await Book.findByIdAndUpdate(borrowBook.book._id, { status: 'available' });
      updated.push(borrowBook);
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/borrow/history
// For member: their sessions; for librarian/manager: all
exports.getBorrowHistory = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'member') {
      filter.member = req.user._id;
    }
    const sessions = await BorrowSession.find(filter)
      .populate('member', 'name email')
      .sort({ borrowDate: -1 });
    const now = new Date();
    // For each session, get its BorrowBooks
    let result = await Promise.all(sessions.map(async (session) => {
      const books = await BorrowBook.find({ borrowSession: session._id }).populate('book');
      // Calculate overdueDay and fineAmount for unreturned books
      const booksWithOverdue = books.map(b => {
        if (!b.returnDate && new Date(session.dueDate) < now) {
          const overdueDay = Math.max(0, Math.ceil((now - new Date(session.dueDate)) / (1000 * 60 * 60 * 24)));
          const fineAmount = overdueDay * 5; // $5 per day
          return { ...b.toObject(), overdueDay, fineAmount };
        }
        // Ensure fineAmount is always present for returned books
        return { ...b.toObject(), fineAmount: b.fineAmount || 0 };
      });
      console.log('booksWithOverdue', booksWithOverdue);
      return { session, books: booksWithOverdue };
    }));
    // If overdue=true, filter sessions
    if (req.query.overdue === 'true') {
      result = result.filter(({ session, books }) =>
        new Date(session.dueDate) < now && books.some(b => !b.returnDate)
      );
    }
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}; 