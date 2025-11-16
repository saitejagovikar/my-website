import mongoose from 'mongoose';

const PaymentMethodSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cardNumber: { type: String, required: true }, // Last 4 digits only for security
    cardHolderName: { type: String, required: true },
    expiryMonth: { type: String, required: true },
    expiryYear: { type: String, required: true },
    cardType: { type: String, enum: ['visa', 'mastercard', 'amex', 'other'], default: 'other' },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const PaymentMethod = mongoose.model('PaymentMethod', PaymentMethodSchema);

