const mongoose = require("mongoose");
const { Schema } = mongoose;

const loanSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  borrowDate: { type: Date, required: true, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date, default: null },
  status: {
    type: String,
    enum: ["borrowed", "returned", "overdue"],
    default: "borrowed",
  },
  overdueFee: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false },
});

module.exports = mongoose.model("Loan", loanSchema);
