// src/controllers/transactionController.js
import { depositFunds as depositFundsService, withdrawFunds as withdrawFundsService } from '../services/transactionService.js';

export const depositFunds = async (req, res, next) => {
    try {
        const transaction = await depositFundsService(req);
        return res.status(200).json(transaction);
    } catch (error) {
        next(error);
    }
};

export const withdrawFunds = async (req, res, next) => {
    try {
        const transaction = await withdrawFundsService(req);
        return res.status(200).json(transaction);
    } catch (error) {
        next(error);
    }
};
