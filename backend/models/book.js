const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema({
  ISBN: { 
    type: String, 
    required: [true, 'ISBN is required'], 
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        const cleaned = v.replace(/[-\s]/g, '');
        return /^\d{10}(\d{3})?$/.test(cleaned);
      },
      message: 'ISBN must be 10 or 13 digits'
    }
  },
  imageUrl: { 
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v) || v.startsWith('/uploads/');
      },
      message: 'Image URL must be a valid URL'
    }
  },
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true,
    minlength: [1, 'Title cannot be empty'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  genre: {
    type: String,
    enum: {
      values: [
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
      message: 'Please select a valid genre'
    },
    required: [true, 'Genre is required'],
  },
  author: { 
    type: String, 
    required: [true, 'Author is required'],
    trim: true,
    minlength: [1, 'Author cannot be empty'],
    maxlength: [100, 'Author name cannot exceed 100 characters']
  },
  publishedDate: { 
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v <= new Date();
      },
      message: 'Published date cannot be in the future'
    }
  },
  publisher: { 
    type: String,
    trim: true,
    maxlength: [100, 'Publisher name cannot exceed 100 characters']
  },
  summary: { 
    type: String,
    trim: true,
    maxlength: [1000, 'Summary cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: {
      values: ["available", "checked out", "lost", "damaged", "maintenance", "reserved"],
      message: 'Status must be one of: available, checked out, lost, damaged, maintenance, reserved'
    },
    default: "available",
  },
  createdAt: { type: Date, default: Date.now },
}, {
  timestamps: true
});

// Create indexes for better query performance
bookSchema.index({ ISBN: 1 });
bookSchema.index({ title: 'text', author: 'text' }); // Text index for search
bookSchema.index({ genre: 1 });
bookSchema.index({ status: 1 });

module.exports = mongoose.model("Book", bookSchema);
