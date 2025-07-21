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
    return (isbn || '').replace(/[-\s]/g, '').toUpperCase();
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
  console.log('CREATE BOOK req.body:', req.body);
  console.log('CREATE BOOK req.file:', req.file);
  const { ISBN, title, genre, author, publishedDate, publisher, status, summary, imageUrl: imageUrlFromBody } =
    req.body;

  let imageUrl = null;
  if (req.file) {
    imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  } else if (imageUrlFromBody) {
    imageUrl = imageUrlFromBody;
  }

  // Validate required fields
  if (!ISBN || !title || !author || !genre || !status) {
    return res
      .status(400)
      .json({ message: "ISBN, title, author, genre, and status are required." });
  }

  try {
    const book = new Book({
      ISBN,
      title,
      imageUrl,
      genre,
      author,
      publishedDate,
      publisher,
      status, // just assign the string
      summary
    });

    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    console.error('CREATE BOOK ERROR:', err);
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
  const { ISBN, title, genre, author, publishedDate, publisher, status, summary, imageUrl: imageUrlFromBody } =
    req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid book ID." });
  }

  try {
    const book = await Book.findById(id);
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
      book.imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    } else if (imageUrlFromBody) {
      book.imageUrl = imageUrlFromBody;
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
