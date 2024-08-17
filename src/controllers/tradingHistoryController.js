import TradingHistory from '../models/tradingHistoryModel.js';

export const getTradingHistory = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const history = await TradingHistory.find({ userId }).sort({ createdAt: -1 }).exec();

        return res.status(200).json(history);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch trading history', error: error.message });
    }
};
