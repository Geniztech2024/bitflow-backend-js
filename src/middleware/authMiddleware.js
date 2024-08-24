import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check if the authorization header exists and is in the correct format
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        // Extract the token from the authorization header
        const token = authHeader.split(' ')[1];

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user ID from the decoded token to the request object
        req.userId = decoded.id;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Handle specific errors for better clarity
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }

        // Log the error for debugging purposes
        console.error('Token verification error:', error.message);

        // Respond with a generic error message for other token-related issues
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};
                                                                                                                                                                                                                                                                                                                                                           