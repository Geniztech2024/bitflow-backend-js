// src/controllers/authController.js

import User from '../models/userModel.js';
import crypto from 'crypto';
import { sendOTPEmail } from '../services/smsService.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { addCountryCode } from '../utils/phoneUtils.js';
import passport from 'passport'; // <-- Make sure to import passport here


// Register a new user
export const register = async (req, res) => {
    console.log('Request Body:', req.body);
    const { fullName, email, password, confirmPassword, gender, phoneNumber, googleId } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = crypto.randomBytes(3).toString('hex');
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        const formattedPhoneNumber = addCountryCode(phoneNumber);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            gender,
            phoneNumber: formattedPhoneNumber,
            otp,
            otpExpires,
        });

        if (googleId) {
            newUser.googleId = googleId;
        }

        await newUser.save();

        // Send OTP via email
        await sendOTPEmail(email, otp);

        res.status(201).json({ message: 'User registered. OTP sent to email.' });
    } catch (error) {
        console.error('Error occurred during registration:', error); 
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Verify OTP
export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Account verified' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !user.isVerified) {
            return res.status(400).json({ message: 'Invalid credentials or account not verified' });
        }

        const isMatch = user.password ? await bcrypt.compare(password, user.password) : false;
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Resend OTP
export const resendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Account already verified' });
        }

        // Generate a new OTP
        const otp = crypto.randomBytes(3).toString('hex');
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Update user with the new OTP and expiry time
        user.otp = otp;
        user.otpExpires = otpExpires;

        await user.save();

        // Send the new OTP to the user's email
        await sendOTPEmail(user.email, otp);

        res.status(200).json({ message: 'New OTP sent to email.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Google OAuth
export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

// Google OAuth callback
export const googleAuthCallback = passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/dashboard'
});
