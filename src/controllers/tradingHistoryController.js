// src/controllers/tradingHistoryController.js
import TradingHistory from '../models/tradingHistoryModel.js';

export const getTradingHistory = async (req, res) => {
    try {
        const userId = req.userId; // Use req.userId instead of req.user?.id

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const history = await TradingHistory.find({ userId }).sort({ createdAt: -1 }).exec();

        if (!history.length) {
            return res.status(404).json({ message: 'No trading history found' });
        }

        return res.status(200).json(history);
    } catch (error) {
        console.error(`Error fetching trading history: ${error.message}`);
        return res.status(500).json({ message: 'Failed to fetch trading history', error: error.message });
    }
};

