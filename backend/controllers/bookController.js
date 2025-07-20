const Book = require("../models/book");
const mongoose = require("mongoose");

// get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// create a new book
const createBook = async (req, res) => {
  const { ISBN, title, genre, author, publishedDate, publisher, status } =
    req.body;
  // Validate required fields
  if (!ISBN || !title || !author) {
    return res
      .status(400)
      .json({ message: "ISBN, title, author, and status are required." });
  }

  try {
    const book = new Book({
      ISBN,
      title,
      genre,
      author,
      publishedDate,
      publisher,
      status, // just assign the string
    });

    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
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
  const { ISBN, title, genre, author, publishedDate, publisher, status } =
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
