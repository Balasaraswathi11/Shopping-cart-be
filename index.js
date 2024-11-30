import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./ConnectDb/connection.js";
import Razorpay from "razorpay";
import Payment from "./Schema/payment.schema.js";
import crypto from "crypto";  // Import crypto module for signature verification

dotenv.config();

// Razorpay instance initialization
const instance = new Razorpay({
  key_id: process.env.Razorpay_key,
  key_secret: process.env.Razorpay_secret,
});

const app = express();
app.use(express.json());
app.use(cors());

// Test route
app.get("/", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Connect to MongoDB
connectDb();

// Create an Order
// Create an Order
app.post("/create-order", async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const options = {
      amount: amount * 100, // Razorpay accepts amounts in paise
      currency: currency || "INR",
    };

    const order = await instance.orders.create(options);

    // Save payment details in MongoDB (do not set paymentId here)
    const newPayment = new Payment({
      orderId: order.id,
      amount: order.amount / 100, // Convert amount back to rupees
      currency: order.currency,
    });

    await newPayment.save();

    // Respond with order details
    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// Verify Payment and Update Status
// Verify Payment and Update Status
app.post('/verify-payment', async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  // Log the payment id for debugging
  console.log('Razorpay Payment ID:', razorpay_payment_id);

  // Retrieve Razorpay secret key from environment variables
  const razorpay_secret = process.env.Razorpay_secret;

  // Generate signature using the razorpay_order_id and razorpay_payment_id
  const generated_signature = crypto
    .createHmac('sha256', razorpay_secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  // Compare the generated signature with the one sent by Razorpay
  if (generated_signature === razorpay_signature) {
    // Signature matched, update payment status in the database
    try {
      const payment = await Payment.findOne({ orderId: razorpay_order_id });

      if (payment) {
        // Update paymentId with the razorpay_payment_id
        payment.paymentId = razorpay_payment_id;  // Only set the paymentId after verification
        payment.status = 'Paid';  // Update payment status to 'Paid'
        await payment.save();

        res.status(200).json({
          success: true,
          message: 'Payment verified and saved successfully',
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Order not found in the database',
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } else {
    // Signature mismatch, payment may be tampered
    res.status(400).json({
      success: false,
      message: 'Payment signature verification failed',
    });
  }
});


  


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
