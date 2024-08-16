// src/middleware/errorHandler.js
import { Request, Response } from 'express';

// Generic error handler middleware
export const errorHandler = (err, req, res) => {
    // Default status code
    const statusCode = err.statusCode || 500;

    // Log the error (you might want to use a logging library here)
    console.error('Error:', err);

    // Send error response
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message: err.message || 'Internal Server Error',
    });
};
