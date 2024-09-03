import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    phoneNumber: { type: String },
    otpExpires: { type: Date },
    wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' } // Add wallet reference
}, { timestamps: true });

// Virtual field to get the string representation of _id
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

const User = mongoose.model('User', userSchema);
export default User;
