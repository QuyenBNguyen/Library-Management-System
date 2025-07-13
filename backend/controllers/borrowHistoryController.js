const BorrowSession = require('../models/borrowSession');
const BorrowBook = require('../models/borrowBook');
const Book = require('../models/book');
const User = require('../models/user');

// Get borrow history for a specific user
exports.getUserBorrowHistory = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    
    // Find all borrow sessions for the user
    const borrowSessions = await BorrowSession.find({ member: userId })
      .populate({
        path: 'member',
        select: 'name email'
      })
      .sort({ borrowDate: -1 });

    // Get detailed borrow history with book information
    const borrowHistory = [];
    
    for (const session of borrowSessions) {
      const borrowBooks = await BorrowBook.find({ borrowSession: session._id })
        .populate({
          path: 'book',
          select: 'title author ISBN status'
        });

      const sessionHistory = {
        sessionId: session._id,
        borrowDate: session.borrowDate,
        dueDate: session.dueDate,
        isOverdue: new Date() > session.dueDate,
        books: borrowBooks.map(borrowBook => ({
          bookId: borrowBook.book._id,
          title: borrowBook.book.title,
          author: borrowBook.book.author,
          ISBN: borrowBook.book.ISBN,
          returnDate: borrowBook.returnDate,
          overdueDay: borrowBook.overdueDay,
          fineAmount: borrowBook.fineAmount,
          status: borrowBook.returnDate ? 'returned' : 'borrowed'
        }))
      };

      borrowHistory.push(sessionHistory);
    }

    res.status(200).json({
      success: true,
      data: borrowHistory,
      count: borrowHistory.length
    });
  } catch (error) {
    console.error('Error fetching borrow history:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get all borrow history (for librarians/managers)
exports.getAllBorrowHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    
    // Build query
    let query = {};
    
    if (search) {
      // Search by member name or book title
      const sessions = await BorrowSession.find()
        .populate({
          path: 'member',
          match: { name: { $regex: search, $options: 'i' } }
        });
      
      const sessionIds = sessions
        .filter(session => session.member)
        .map(session => session._id);
      
      query.borrowSession = { $in: sessionIds };
    }

    // Get borrow books with pagination
    const borrowBooks = await BorrowBook.find(query)
      .populate({
        path: 'borrowSession',
        populate: {
          path: 'member',
          select: 'name email'
        }
      })
      .populate({
        path: 'book',
        select: 'title author ISBN status'
      })
      .sort({ 'borrowSession.borrowDate': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await BorrowBook.countDocuments(query);

    // Format response
    const history = borrowBooks.map(borrowBook => ({
      id: borrowBook._id,
      memberName: borrowBook.borrowSession.member.name,
      memberEmail: borrowBook.borrowSession.member.email,
      bookTitle: borrowBook.book.title,
      bookAuthor: borrowBook.book.author,
      ISBN: borrowBook.book.ISBN,
      borrowDate: borrowBook.borrowSession.borrowDate,
      dueDate: borrowBook.borrowSession.dueDate,
      returnDate: borrowBook.returnDate,
      overdueDay: borrowBook.overdueDay,
      fineAmount: borrowBook.fineAmount,
      status: borrowBook.returnDate ? 'returned' : 'borrowed',
      isOverdue: new Date() > borrowBook.borrowSession.dueDate && !borrowBook.returnDate
    }));

    res.status(200).json({
      success: true,
      data: history,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching all borrow history:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get borrow history for a specific book
exports.getBookBorrowHistory = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    
    const borrowBooks = await BorrowBook.find({ book: bookId })
      .populate({
        path: 'borrowSession',
        populate: {
          path: 'member',
          select: 'name email'
        }
      })
      .populate({
        path: 'book',
        select: 'title author ISBN'
      })
      .sort({ 'borrowSession.borrowDate': -1 });

    const history = borrowBooks.map(borrowBook => ({
      id: borrowBook._id,
      memberName: borrowBook.borrowSession.member.name,
      memberEmail: borrowBook.borrowSession.member.email,
      borrowDate: borrowBook.borrowSession.borrowDate,
      dueDate: borrowBook.borrowSession.dueDate,
      returnDate: borrowBook.returnDate,
      overdueDay: borrowBook.overdueDay,
      fineAmount: borrowBook.fineAmount,
      status: borrowBook.returnDate ? 'returned' : 'borrowed'
    }));

    res.status(200).json({
      success: true,
      data: history,
      count: history.length
    });
  } catch (error) {
    console.error('Error fetching book borrow history:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get current borrows (not returned)
exports.getCurrentBorrows = async (req, res) => {
  try {
    const { userId } = req.params;
    const query = userId ? { member: userId } : {};
    
    // Get borrow sessions that haven't been returned
    const borrowSessions = await BorrowSession.find(query)
      .populate({
        path: 'member',
        select: 'name email'
      })
      .sort({ borrowDate: -1 });

    const currentBorrows = [];
    
    for (const session of borrowSessions) {
      const borrowBooks = await BorrowBook.find({ 
        borrowSession: session._id,
        returnDate: null // Only books that haven't been returned
      })
      .populate({
        path: 'book',
        select: 'title author ISBN status'
      });

      if (borrowBooks.length > 0) {
        const sessionBorrows = {
          sessionId: session._id,
          memberName: session.member.name,
          memberEmail: session.member.email,
          borrowDate: session.borrowDate,
          dueDate: session.dueDate,
          isOverdue: new Date() > session.dueDate,
          overdueDays: Math.max(0, Math.floor((new Date() - session.dueDate) / (1000 * 60 * 60 * 24))),
          books: borrowBooks.map(borrowBook => ({
            bookId: borrowBook.book._id,
            title: borrowBook.book.title,
            author: borrowBook.book.author,
            ISBN: borrowBook.book.ISBN,
            status: borrowBook.book.status
          }))
        };

        currentBorrows.push(sessionBorrows);
      }
    }

    res.status(200).json({
      success: true,
      data: currentBorrows,
      count: currentBorrows.length
    });
  } catch (error) {
    console.error('Error fetching current borrows:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}; 