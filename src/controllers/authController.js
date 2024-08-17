import User from '../models/userModel.js';
import crypto from 'crypto';
import { sendOTPEmail } from '../services/smsService.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { addCountryCode } from '../utils/phoneUtils.js';
import passport from 'passport';

// Register a new user
export const register = async (req, res) => {
    console.log('Request Body:', req.body);
    const { fullName, email, password, confirmPassword, gender, phoneNumber, googleId } = req.body;

    try {
        // Validate input
        if (!fullName || !email || !password || !confirmPassword || !gender || !phoneNumber) {
            return res.status(400).json({ message: 'all fields required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = crypto.randomBytes(3).toString('hex');
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            gender,
            phoneNumber,
            otp,
            otpExpires,
            ...(googleId && { googleId })
        });

        await newUser.save();

        // Send OTP via email
        try {
            await sendOTPEmail(email, otp);
        } catch (error) {
            console.error('Error sending OTP email:', error.message);
            return res.status(500).json({ message: 'User registered, but failed to send OTP' });
        }

        res.status(201).json({ message: 'User registered. OTP sent to email.' });
    } catch (error) {
        console.error('Error occurred during registration:', error);
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
    const {otp } = req.body;

    try {
        if (!otp) {
            return res.status(400).json({ message: ' OTP are required' });
        }

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
        console.error('Error occurred during OTP verification:', error);
        res.status(500).json({ message: 'Server error during OTP verification', error: error.message });
    }
};

// Resend OTP
export const requestOtp = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

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
        try {
            await sendOTPEmail(user.email, otp);
        } catch (error) {
            console.error('Error sending OTP email:', error.message);
            return res.status(500).json({ message: 'Failed to send new OTP' });
        }

        res.status(200).json({ message: 'New OTP sent to email.' });
    } catch (error) {
        console.error('Error occurred during OTP request:', error);
        res.status(500).json({ message: 'Server error during OTP request', error: error.message });
    }
};

// Login
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

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
        console.error('Error occurred during login:', error);
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};

// Google OAuth
export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

// Google OAuth callback
export const googleAuthCallback = passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/dashboard'
});
