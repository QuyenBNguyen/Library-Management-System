const BorrowSession = require("../models/borrowSession");
const BorrowBook = require("../models/borrowBook");
const Book = require("../models/book");
const User = require("../models/user");
const mongoose = require("mongoose");

// POST /api/borrow/checkout
// Body: { bookIds: [bookId], dueDate }
exports.checkoutBooks = async (req, res) => {
  try {
    const { bookIds, dueDate, memberId } = req.body;
    let userId = req.user._id;
    
    // Allow librarian to checkout books for members
    if (req.user.role === "librarian" && memberId) {
      userId = memberId;
    }
    console.log("checkoutBooks:", {
      userRole: req.user.role,
      memberId,
      usedUserId: userId,
    });
    
    // Validate inputs
    if (!Array.isArray(bookIds) || bookIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "No books selected." });
    }
    if (!dueDate) {
      return res
        .status(400)
        .json({ success: false, error: "Due date required." });
    }
    
    // Validate memberId if provided (for librarian)
    if (req.user.role === 'librarian' && memberId) {
      if (!mongoose.Types.ObjectId.isValid(memberId)) {
        return res.status(400).json({ success: false, error: 'Invalid member ID.' });
      }
      // Check if member exists
      const memberExists = await User.findById(memberId);
      if (!memberExists) {
        return res.status(404).json({ success: false, error: 'Member not found.' });
      }
      userId = memberId;
    }
    
    // Validate all bookIds
    for (const bookId of bookIds) {
      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(400).json({ success: false, error: `Invalid book ID: ${bookId}` });
      }
      
      // Check if book exists and is available
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ success: false, error: `Book not found: ${bookId}` });
      }
      if (book.status !== 'available') {
        return res.status(400).json({ success: false, error: `Book "${book.title}" is not available for checkout.` });
      }
    }
    
    console.log('checkoutBooks:', { userRole: req.user.role, memberId, usedUserId: userId });
    
    // Create BorrowSession
    const session = await BorrowSession.create({ member: userId, dueDate });
    
    // Create BorrowBook for each book
    const borrowBooks = await Promise.all(
      bookIds.map(async (bookId) => {
        // Update book status
        await Book.findByIdAndUpdate(bookId, { status: "checked out" });
        const borrowBook = await BorrowBook.create({
          book: bookId,
          borrowSession: session._id,
          isPaid: false,
        });
        return borrowBook;
      })
    );
    res.status(201).json({ success: true, data: { session, borrowBooks } });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/borrow/return
// Body: { borrowBookIds: [borrowBookId] }
exports.returnBooks = async (req, res) => {
  try {
    const { borrowBookIds } = req.body;
    
    // Validate input
    if (!Array.isArray(borrowBookIds) || borrowBookIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "No borrowBookIds provided." });
    }
    
    // Validate all borrowBookIds
    for (const id of borrowBookIds) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: `Invalid borrowBook ID: ${id}` });
      }
    }
    
    const now = new Date();
    const updated = [];
    
    for (const id of borrowBookIds) {
      const borrowBook = await BorrowBook.findById(id)
        .populate("borrowSession")
        .populate("book");
      
      if (!borrowBook) {
        console.warn(`BorrowBook not found: ${id}`);
        continue;
      }
      
      if (borrowBook.returnDate) {
        console.warn(`BorrowBook already returned: ${id}`);
        continue; // already returned
      }
      
      if (!borrowBook.book) {
        console.warn(`Book not found for borrowBook: ${id}`);
        continue;
      }
      borrowBook.returnDate = now;
      
      // Calculate overdue
      const due = borrowBook.borrowSession.dueDate;
      let overdueDay = 0;
      let fineAmount = 0;
      
      if (now > due) {
        overdueDay = Math.ceil((now - due) / (1000 * 60 * 60 * 24));
        fineAmount = overdueDay * 10000; // 50,000 VND per day
      }
      
      borrowBook.overdueDay = overdueDay;
      borrowBook.fineAmount = fineAmount;
      if (typeof req.body.isPaid === "boolean") {
        borrowBook.isPaid = req.body.isPaid;
      }
      await borrowBook.save();
      
      // Update book status back to available
      await Book.findByIdAndUpdate(borrowBook.book._id, { 
        status: "available" 
      });
      updated.push(borrowBook);
    }
    
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Return books error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/borrow/history
// For member: their sessions; for librarian/manager: all
exports.getBorrowHistory = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "member") {
      filter.member = req.user._id;
    }
    const sessions = await BorrowSession.find(filter)
      .populate("member", "name email")
      .sort({ borrowDate: -1 });
    const now = new Date();
    // For each session, get its BorrowBooks
    let result = await Promise.all(
      sessions.map(async (session) => {
        const books = await BorrowBook.find({
          borrowSession: session._id,
        }).populate("book");
        // Calculate overdueDay and fineAmount for unreturned books
        const booksWithOverdue = books.map((b) => {
          if (!b.returnDate && new Date(session.dueDate) < now) {
            const overdueDay = Math.max(
              0,
              Math.ceil(
                (now - new Date(session.dueDate)) / (1000 * 60 * 60 * 24)
              )
            );
            const fineAmount = overdueDay * 10000; // 50,000 VND per day
            return { ...b.toObject(), overdueDay, fineAmount };
          }
          // Ensure fineAmount is always present for returned books
          return { ...b.toObject(), fineAmount: b.fineAmount || 0 };
        });
        console.log("booksWithOverdue", booksWithOverdue);
        return { session, books: booksWithOverdue };
      })
    );
    // If overdue=true, filter sessions
    if (req.query.overdue === "true") {
      result = result.filter(
        ({ session, books }) =>
          new Date(session.dueDate) < now && books.some((b) => !b.returnDate)
      );
    }
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/borrow/books - list all BorrowBooks (with optional filters)
exports.getAllBorrowBooks = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.status = status;
    // Optionally filter by book title or user
    if (search) {
      // Need to populate for search, so do after find
    }
    const count = await BorrowBook.countDocuments(query);
    let borrowBooks = await BorrowBook.find(query)
      .populate({ path: "book", select: "title author" })
      .populate({
        path: "borrowSession",
        populate: { path: "member", select: "name email" },
      })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    // Filter by search if needed
    if (search) {
      borrowBooks = borrowBooks.filter(
        (b) =>
          b.book?.title?.toLowerCase().includes(search.toLowerCase()) ||
          b.borrowSession?.member?.name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          b.borrowSession?.member?.email
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }
    res.status(200).json({
      data: borrowBooks,
      page: Number(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/borrow/my-books - list current user's BorrowBooks (flat)
exports.getMyBorrowBooks = async (req, res) => {
  console.log("getMyBorrowBooks", req.user._id);
  try {
    // Find all BorrowBooks for sessions belonging to this user
    const sessions = await BorrowSession.find({ member: req.user._id });
    const sessionIds = sessions.map((s) => s._id);
    const borrowBooks = await BorrowBook.find({
      borrowSession: { $in: sessionIds },
    })
      .populate({ path: "book" })
      .populate({ path: "borrowSession", select: "dueDate borrowDate" });

    console.log("borrowBooks", borrowBooks);

    res.status(200).json({ data: borrowBooks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/borrow/my-borrowing - checked out books
exports.getMyBorrowingBooks = async (req, res) => {
  try {
    const sessions = await BorrowSession.find({ member: req.user._id });
    const sessionIds = sessions.map((s) => s._id);
    const borrowBooks = await BorrowBook.find({
      borrowSession: { $in: sessionIds },
    })
      .populate({ path: "book" })
      .populate({ path: "borrowSession", select: "dueDate borrowDate" });
    const result = borrowBooks.filter(
      (bb) => !bb.returnDate && bb.book && bb.book.status === "checked out"
    );

    console.log("result", result);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/borrow/my-reserving - reserved books
exports.getMyReservingBooks = async (req, res) => {
  try {
    const sessions = await BorrowSession.find({ member: req.user._id });
    const sessionIds = sessions.map((s) => s._id);
    const borrowBooks = await BorrowBook.find({
      borrowSession: { $in: sessionIds },
    })
      .populate({ path: "book" })
      .populate({ path: "borrowSession", select: "dueDate borrowDate" });
    const result = borrowBooks.filter(
      (bb) => !bb.returnDate && bb.book && bb.book.status === "reserved"
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/borrow/my-overdue - overdue books
exports.getMyOverdueBooks = async (req, res) => {
  try {
    await updateOverdueFinesForUser(req.user._id);
    const sessions = await BorrowSession.find({ member: req.user._id });
    const sessionIds = sessions.map((s) => s._id);
    const now = new Date();
    const borrowBooks = await BorrowBook.find({
      borrowSession: { $in: sessionIds },
    })
      .populate({ path: "book" })
      .populate({ path: "borrowSession", select: "dueDate borrowDate" });
    const result = borrowBooks
      .filter((bb) => {
        if (bb.returnDate) return false;
        const due = bb.borrowSession?.dueDate;
        return (
          bb.book &&
          bb.book.status === "checked out" &&
          due &&
          new Date(due) < now
        );
      })
      .map((bb) => {
        return { ...bb.toObject() };
      });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/borrow/book/:id - get a single BorrowBook by ID
exports.getBorrowBookById = async (req, res) => {
  try {
    const borrowBook = await BorrowBook.findById(req.params.id)
      .populate({ path: "book", select: "title author" })
      .populate({
        path: "borrowSession",
        populate: { path: "member", select: "name email" },
      });
    if (borrowBook) {
      res.status(200).json(borrowBook);
    } else {
      res.status(404).json({ message: "BorrowBook not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/borrow/book - create a BorrowBook (for completeness)
exports.createBorrowBook = async (req, res) => {
  try {
    const { book, borrowSession, returnDate, overdueDay, fineAmount, isPaid } =
      req.body;
    const borrowBook = await BorrowBook.create({
      book,
      borrowSession,
      returnDate,
      overdueDay,
      fineAmount,
      isPaid,
    });
    res.status(201).json(borrowBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/borrow/book/:id - update a BorrowBook by ID
exports.updateBorrowBookById = async (req, res) => {
  try {
    const borrowBook = await BorrowBook.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (borrowBook) {
      res.status(200).json(borrowBook);
    } else {
      res.status(404).json({ message: "BorrowBook not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/borrow/book/:id - delete a BorrowBook by ID
exports.deleteBorrowBookById = async (req, res) => {
  try {
    const borrowBook = await BorrowBook.findByIdAndDelete(req.params.id);
    if (borrowBook) {
      res.status(200).json({ message: "BorrowBook deleted successfully" });
    } else {
      res.status(404).json({ message: "BorrowBook not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Utility: Update overdueDay and fineAmount for all overdue BorrowBooks of a user
async function updateOverdueFinesForUser(userId) {
  const sessions = await BorrowSession.find({ member: userId });
  const sessionIds = sessions.map((s) => s._id);
  const now = new Date();
  const borrowBooks = await BorrowBook.find({
    borrowSession: { $in: sessionIds },
  }).populate("borrowSession");
  for (const bb of borrowBooks) {
    if (
      !bb.returnDate &&
      bb.borrowSession &&
      bb.borrowSession.dueDate &&
      new Date(bb.borrowSession.dueDate) < now
    ) {
      const overdueDay = Math.max(
        0,
        Math.ceil(
          (now - new Date(bb.borrowSession.dueDate)) / (1000 * 60 * 60 * 24)
        )
      );
      const fineAmount = overdueDay * 10000;
      if (bb.overdueDay !== overdueDay || bb.fineAmount !== fineAmount) {
        bb.overdueDay = overdueDay;
        bb.fineAmount = fineAmount;
        await bb.save();
      }
    }
  }
}

// Cancel reserved books over 7 days
exports.cleanupExpiredReservations = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    // Find all BorrowBooks where book.status is 'reserved' and session.borrowDate is over 7 days ago
    const expired = await BorrowBook.find()
      .populate("book")
      .populate("borrowSession");
    let count = 0;
    for (const bb of expired) {
      if (
        bb.book &&
        bb.book.status === "reserved" &&
        bb.borrowSession &&
        bb.borrowSession.borrowDate &&
        new Date(bb.borrowSession.borrowDate) < sevenDaysAgo &&
        !bb.returnDate
      ) {
        // Set book status to available
        bb.book.status = "available";
        await bb.book.save();
        // Remove the BorrowBook entry
        await BorrowBook.findByIdAndDelete(bb._id);
        count++;
      }
    }
    res
      .status(200)
      .json({ message: `Cleaned up ${count} expired reservations.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
