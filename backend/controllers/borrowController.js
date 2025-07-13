const BorrowSession = require('../models/borrowSession');
const BorrowBook = require('../models/borrowBook');
const Book = require('../models/book');
const User = require('../models/user');

// Borrow books
exports.borrowBooks = async (req, res) => {
  try {
    const { bookIds, dueDate } = req.body;
    const memberId = req.user._id;

    if (!bookIds || !Array.isArray(bookIds) || bookIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Book IDs are required and must be an array'
      });
    }

    if (!dueDate) {
      return res.status(400).json({
        success: false,
        error: 'Due date is required'
      });
    }

    // Check if books are available
    const books = await Book.find({ _id: { $in: bookIds } });
    
    if (books.length !== bookIds.length) {
      return res.status(400).json({
        success: false,
        error: 'Some books not found'
      });
    }

    // Check if books are available for borrowing
    const unavailableBooks = books.filter(book => book.status !== 'available');
    if (unavailableBooks.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Books not available: ${unavailableBooks.map(b => b.title).join(', ')}`
      });
    }

    // Create borrow session
    const borrowSession = new BorrowSession({
      member: memberId,
      dueDate: new Date(dueDate)
    });

    await borrowSession.save();

    // Create borrow book records
    const borrowBooks = [];
    for (const bookId of bookIds) {
      const borrowBook = new BorrowBook({
        book: bookId,
        borrowSession: borrowSession._id
      });
      await borrowBook.save();
      borrowBooks.push(borrowBook);

      // Update book status to checked out
      await Book.findByIdAndUpdate(bookId, { status: 'checked out' });
    }

    // Populate the response
    await borrowSession.populate({
      path: 'member',
      select: 'name email'
    });

    await BorrowBook.populate(borrowBooks, {
      path: 'book',
      select: 'title author ISBN'
    });

    res.status(201).json({
      success: true,
      data: {
        sessionId: borrowSession._id,
        member: borrowSession.member,
        borrowDate: borrowSession.borrowDate,
        dueDate: borrowSession.dueDate,
        books: borrowBooks.map(bb => ({
          bookId: bb.book._id,
          title: bb.book.title,
          author: bb.book.author,
          ISBN: bb.book.ISBN
        }))
      },
      message: 'Books borrowed successfully'
    });

  } catch (error) {
    console.error('Error borrowing books:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Return books
exports.returnBooks = async (req, res) => {
  try {
    const { borrowBookIds } = req.body;
    const memberId = req.user._id;

    if (!borrowBookIds || !Array.isArray(borrowBookIds) || borrowBookIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Borrow book IDs are required and must be an array'
      });
    }

    // Find borrow books and check if they belong to the user
    const borrowBooks = await BorrowBook.find({
      _id: { $in: borrowBookIds }
    }).populate({
      path: 'borrowSession',
      match: { member: memberId }
    });

    const validBorrowBooks = borrowBooks.filter(bb => bb.borrowSession);
    
    if (validBorrowBooks.length !== borrowBookIds.length) {
      return res.status(400).json({
        success: false,
        error: 'Some borrow records not found or not authorized'
      });
    }

    // Calculate fines and update records
    const returnDate = new Date();
    const updatedBooks = [];
    let totalFine = 0;

    for (const borrowBook of validBorrowBooks) {
      const dueDate = new Date(borrowBook.borrowSession.dueDate);
      const overdueDays = Math.max(0, Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24)));
      const fineAmount = overdueDays > 0 ? overdueDays * 1.0 : 0; // $1 per day

      borrowBook.returnDate = returnDate;
      borrowBook.overdueDay = overdueDays;
      borrowBook.fineAmount = fineAmount;
      
      await borrowBook.save();
      totalFine += fineAmount;

      // Update book status back to available
      await Book.findByIdAndUpdate(borrowBook.book, { status: 'available' });

      updatedBooks.push({
        bookId: borrowBook.book,
        returnDate: borrowBook.returnDate,
        overdueDays: borrowBook.overdueDay,
        fineAmount: borrowBook.fineAmount
      });
    }

    res.status(200).json({
      success: true,
      data: {
        returnedBooks: updatedBooks,
        totalFine: totalFine,
        returnDate: returnDate
      },
      message: 'Books returned successfully'
    });

  } catch (error) {
    console.error('Error returning books:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get user's current borrows
exports.getCurrentBorrows = async (req, res) => {
  try {
    const memberId = req.user._id;

    const borrowSessions = await BorrowSession.find({ member: memberId })
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
          member: session.member,
          borrowDate: session.borrowDate,
          dueDate: session.dueDate,
          isOverdue: new Date() > session.dueDate,
          overdueDays: Math.max(0, Math.floor((new Date() - session.dueDate) / (1000 * 60 * 60 * 24))),
          books: borrowBooks.map(borrowBook => ({
            borrowBookId: borrowBook._id,
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

// Get overdue books
exports.getOverdueBooks = async (req, res) => {
  try {
    const { userId } = req.params;
    const query = userId ? { member: userId } : {};
    
    const borrowSessions = await BorrowSession.find(query)
      .populate({
        path: 'member',
        select: 'name email'
      })
      .sort({ borrowDate: -1 });

    const overdueBooks = [];
    
    for (const session of borrowSessions) {
      const borrowBooks = await BorrowBook.find({ 
        borrowSession: session._id,
        returnDate: null // Only books that haven't been returned
      })
      .populate({
        path: 'book',
        select: 'title author ISBN status'
      });

      const overdueInSession = borrowBooks.filter(borrowBook => {
        return new Date() > session.dueDate;
      });

      if (overdueInSession.length > 0) {
        const overdueDays = Math.max(0, Math.floor((new Date() - session.dueDate) / (1000 * 60 * 60 * 24)));
        const fineAmount = overdueDays * 1.0; // $1 per day

        overdueBooks.push({
          sessionId: session._id,
          member: session.member,
          borrowDate: session.borrowDate,
          dueDate: session.dueDate,
          overdueDays: overdueDays,
          fineAmount: fineAmount,
          books: overdueInSession.map(borrowBook => ({
            borrowBookId: borrowBook._id,
            bookId: borrowBook.book._id,
            title: borrowBook.book.title,
            author: borrowBook.book.author,
            ISBN: borrowBook.book.ISBN
          }))
        });
      }
    }

    res.status(200).json({
      success: true,
      data: overdueBooks,
      count: overdueBooks.length
    });

  } catch (error) {
    console.error('Error fetching overdue books:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}; 