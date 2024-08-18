import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
    let token;

    console.log('Headers:', req.headers);

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else {
        console.log('No token found in headers');
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    console.log('Extracted Token:', token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);

        const user = await User.findById(decoded.id);
        console.log('Found User:', user);

        if (!user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('JWT verification error:', error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};
