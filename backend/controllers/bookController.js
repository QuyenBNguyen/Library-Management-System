const Book = require("../models/book");
const mongoose = require("mongoose");

// get all books
const getAllBooks = async (req, res) => {
  const {
    search = "",
    page = 1,
    limit = 10,
    author,
    status,
    publisher,
    genre,
  } = req.query;

  function normalizeIsbn(isbn) {
    return (isbn || "").replace(/[-\s]/g, "").toUpperCase();
  }

  let query = {};
  if (search) {
    // If search looks like an ISBN (all digits or digits with dashes/spaces, length >= 10)
    const norm = normalizeIsbn(search);
    if (/^\d{9,13}$/.test(norm)) {
      query.ISBN = norm;
    } else {
      query.title = { $regex: search, $options: "i" };
    }
  } else {
    query.title = { $regex: search, $options: "i" };
  }

  if (author) {
    query.author = { $regex: author, $options: "i" };
  }

  if (status) {
    query.status = { $regex: status, $options: "i" };
  }

  if (publisher) {
    query.publisher = { $regex: publisher, $options: "i" };
  }

  if (genre) {
    query.genre = { $regex: genre, $options: "i" };
  }

  try {
    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    return res.status(200).json({
      data: books,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// create a new book
const createBook = async (req, res) => {
  try {
    console.log("CREATE BOOK req.body:", req.body);
    console.log("CREATE BOOK req.file:", req.file);
    
    let {
      ISBN,
      title,
      genre,
      author,
      publishedDate,
      publisher,
      status,
      summary,
      imageUrl,
    } = req.body;

    // Validate required fields
    if (!ISBN || !title || !author || !genre) {
      return res.status(400).json({
        message: "ISBN, title, author, and genre are required.",
      });
    }

    // Validate ISBN format (basic validation)
    const cleanISBN = ISBN.replace(/[-\s]/g, '');
    if (!/^\d{10}(\d{3})?$/.test(cleanISBN)) {
      return res.status(400).json({
        message: "Invalid ISBN format. Must be 10 or 13 digits.",
      });
    }

    // Check if ISBN already exists
    const existingBook = await Book.findOne({ ISBN: cleanISBN });
    if (existingBook) {
      return res.status(400).json({
        message: "A book with this ISBN already exists.",
      });
    }

    // Set default status if not provided
    status = status || 'available';

    // Handle image upload
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const book = new Book({
      ISBN: cleanISBN,
      title: title.trim(),
      genre,
      author: author.trim(),
      publishedDate: publishedDate ? new Date(publishedDate) : undefined,
      publisher: publisher?.trim(),
      status,
      summary: summary?.trim(),
      imageUrl,
    });

    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    console.error("CREATE BOOK ERROR:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Book with this ISBN already exists." });
    }
    res.status(400).json({ message: err.message });
  }
};

// get a book by ID
const getBookById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid book ID." });
  }

  try {
    const book = await Book.findById(id).populate("status");
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update a book by ID
const updateBookById = async (req, res) => {
  const { id } = req.params;
  let {
    ISBN,
    title,
    genre,
    author,
    publishedDate,
    publisher,
    status,
    summary,
    imageUrl,
  } = req.body;

  console.log("CREATE BOOK req.body:", req.body);
  console.log("CREATE BOOK req.file:", req.file);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid book ID." });
  }

  try {
    let book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    book.ISBN = ISBN;
    book.title = title;
    book.genre = genre;
    book.author = author;
    book.publishedDate = publishedDate;
    book.publisher = publisher;
    book.status = status;
    book.summary = summary;
    if (req.file) {
      book.imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    const updatedBook = await book.save();
    res.status(200).json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// delete a book by ID
const deleteBookById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid book ID." });
  }

  try {
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }
    res.status(200).json({ message: "Book deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Export controller functions
module.exports = {
  getAllBooks,
  createBook,
  getBookById,
  updateBookById,
  deleteBookById,
};
