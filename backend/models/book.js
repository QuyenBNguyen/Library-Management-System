const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookSchema = new Schema({
    ISBN: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    genre: { type: String },
    author: { type: String, required: true },
    publishedDate: { type: Date },
    publisher: { type: String},
    status: { 
        type: String,
        enum: ['available', 'checked out', 'lost', 'damaged', 'maintenance'],
        default: 'available',
    },
});

module.exports = mongoose.model('Book', bookSchema);
