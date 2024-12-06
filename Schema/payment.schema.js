import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true, 
    unique: true,    
    
  },
  orderId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: 'INR',
  },
  status: {
    type: String,
    required: true,
    enum: ['Created', 'Paid', 'Failed'],
    default: 'Created',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
