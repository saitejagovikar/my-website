import mongoose from 'mongoose';

const OTPSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        otp: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
        },
        attempts: {
            type: Number,
            default: 0,
            max: 3,
        },
        verified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Index for automatic deletion of expired OTPs
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for faster email lookups
OTPSchema.index({ email: 1, verified: 1 });

// Method to check if OTP is expired
OTPSchema.methods.isExpired = function () {
    return new Date() > this.expiresAt;
};

// Method to check if max attempts reached
OTPSchema.methods.hasMaxAttempts = function () {
    return this.attempts >= 3;
};

// Method to increment attempts
OTPSchema.methods.incrementAttempts = async function () {
    this.attempts += 1;
    await this.save();
};

export const OTP = mongoose.model('OTP', OTPSchema);
