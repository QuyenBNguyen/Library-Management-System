const mongoose = require('mongoose');
const { Schema } = mongoose;

const borrowBookSchema = new Schema({
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    borrowSession: { type: Schema.Types.ObjectId, ref: 'BorrowSession', required: true },
    returnDate: { type: Date, default: null },
    overdueDay: { type: Number, default: 0 },
    fineAmount: { type: Number, default: 0 },
    isPaid: { type: Boolean, default: false },
});

module.exports = mongoose.model('BorrowBook', borrowBookSchema);
