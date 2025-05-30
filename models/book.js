const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookSchema = new Schema({
    ISBN: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    genre: { type: String },
    author: { type: String, required: true },
    publishedDate: { type: Date },
    publisher: { type: String},
    status: { type: Schema.Types.ObjectId, ref: 'Status', required: true },

});

module.exports = mongoose.model('Book', bookSchema);
