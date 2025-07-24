const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema({
  ISBN: { type: String, required: true, unique: true },
  imageUrl: { type: String },
  title: { type: String, required: true },
  genre: {
    type: String,
    enum: [
      "Fiction",
      "Mystery",
      "Fantasy",
      "Romance",
      "Science Fiction",
      "Horror",
      "Biography",
      "History",
      "Self-help",
      "Children",
      "Poetry",
      "Philosophy",
      "Business",
      "Travel",
    ],
    required: true,
  },
  author: { type: String, required: true },
  publishedDate: { type: Date },
  publisher: { type: String },
  summary: { type: String },
  status: {
    type: String,
    enum: ["available", "checked out", "lost", "damaged", "maintenance", "reserved"],
    default: "available",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Book", bookSchema);
