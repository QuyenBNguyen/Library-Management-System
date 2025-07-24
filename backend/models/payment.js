const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  borrowSession: {
    type: Schema.Types.ObjectId,
    ref: "BorrowSession",
    required: true,
  },
  loans: [{ type: Schema.Types.ObjectId, ref: "Loan", required: true }],
  amount: { type: Number, required: true },
  method: { type: String, required: true },
  transactionId: { type: String },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  paidAt: { type: Date, default: null },
});

module.exports = mongoose.model("Payment", paymentSchema);
