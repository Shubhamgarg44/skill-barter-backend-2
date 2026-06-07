import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amountPaid: {
      type: Number,
      required: true,
    },

    tokensPurchased: {
      type: Number,
      required: true,
    },

    razorpayOrderId: {
      type: String,
      required: true,
    },

    razorpayPaymentId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);