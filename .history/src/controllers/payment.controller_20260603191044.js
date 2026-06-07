import Razorpay from "razorpay";
import Payment from "../models/Payment.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // convert ₹ to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json(order);
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};

import crypto from "crypto";
import Wallet from "../models/Wallet.js";

// Verify Payment & Add Tokens
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      tokens,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(
        razorpay_order_id + "|" + razorpay_payment_id
      )
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Payment verification failed",
      });
    }

    let wallet = await Wallet.findOne({
      user: req.user.id,
    });

    if (!wallet) {
      wallet = await Wallet.create({
        user: req.user.id,
        balance: 100,
      });
    }

    wallet.balance += Number(tokens);
    await wallet.save();
    await Payment.create({
        user: req.user.id,
        amountPaid: Number(tokens) === 100
          ? 99
          : Number(tokens) === 250
          ? 199
          : 399,
      
        tokensPurchased: Number(tokens),
      
        razorpayOrderId: razorpay_order_id,
      
        razorpayPaymentId: razorpay_payment_id,
      
        status: "success",
      });

    res.json({
      success: true,
      message: "Payment verified successfully",
      newBalance: wallet.balance,
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);

    res.status(500).json({
      message: "Payment verification failed",
      error: error.message,
    });
  }
};