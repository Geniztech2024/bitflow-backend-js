// validationSchemas.js
import Joi from 'joi';

// Schema for user registration
export const registerSchema = Joi.object({
    fullName: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({ 'any.only': 'Passwords do not match' }),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    phoneNumber: Joi.string().pattern(/^\+?\d{10,15}$/).required(),
    googleId: Joi.string().optional(),
});

// Schema for OTP verification
export const otpSchema = Joi.object({
    otp: Joi.string().length(6).required(),
});

// Schema for requesting OTP
export const requestOtpSchema = Joi.object({
    email: Joi.string().email().required(),
});

// Schema for login
export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
