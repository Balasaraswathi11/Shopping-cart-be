import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Razorpay from "razorpay";
import crypto from "crypto";
import connectDb from './ConnectDb/connection.js';
import Payment from "./Schema/payment.schema.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
 connectDb()

// Razorpay instance initialization
const razorpayInstance = new Razorpay({
  key_id: process.env.Razorpay_key,
  key_secret: process.env.Razorpay_secret,
});

// Test route
app.get("/", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Create an Order route
app.post("/create-order", async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const options = {
      amount: amount * 100, // Convert to paise
      currency: currency || "INR",
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.post('/verify-payment', async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  

  const razorpaySecret = process.env.Razorpay_secret;


  const generatedSignature = crypto
    .createHmac('sha256', razorpaySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');
 

  if (generatedSignature === razorpay_signature) {
    try {
      const payment = new Payment({
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        amount: req.body.amount,
        currency: req.body.currency || 'INR',
        status: 'Paid',
      });
      

      await payment.save();

      res.status(200).json({
        success: true,
        message: 'Payment verified and saved successfully',
      });
    } catch (error) {
      console.error('Error saving payment details to the database:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save payment details',
      });
    }
  } else {
    console.error('Payment signature verification failed');
    res.status(400).json({
      success: false,
      message: 'Payment signature verification failed',
    });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
