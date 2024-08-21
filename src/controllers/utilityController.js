import {
    payElectricityBill as handlePayElectricityBill,
    buyAirtime as handleBuyAirtime,
    buyData as handleBuyData,
    placeBet as handlePlaceBet,
    payCableTV as handlePayCableTV,
} from '../services/utilityService.js';

export const payElectricityBill = async (req, res, next) => {
    try {
        const result = await handlePayElectricityBill(req);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const buyAirtime = async (req, res, next) => {
    try {
        const result = await handleBuyAirtime(req);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const buyData = async (req, res, next) => {
    try {
        const result = await handleBuyData(req);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const placeBet = async (req, res, next) => {
    try {
        const result = await handlePlaceBet(req);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const payCableTV = async (req, res, next) => {
    try {
        const result = await handlePayCableTV(req);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
