//profileValidation.js
import Joi from 'joi';

export const updateKYCValidation = Joi.object({
    fullName: Joi.string().required(),
    dateOfBirth: Joi.date().required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    nationality: Joi.string().required(),
    idDocument: Joi.string().uri().required(),
    addressProof: Joi.string().uri().required(),
    status: Joi.string().valid('pending', 'approved', 'rejected'),
});

export const changePasswordValidation = Joi.object({
    currentPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required(),
});

export const forgotPasswordValidation = Joi.object({
    email: Joi.string().email().required(),
});

export const resetPasswordValidation = Joi.object({
    resetToken: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
});

export const confirmAuthCodeValidation = Joi.object({
    email: Joi.string().email().required(),
    authCode: Joi.string().required(),
});

export const updateProfileValidation = Joi.object({
    fullName: Joi.string().optional(),
    email: Joi.string().email().optional(),
    gender: Joi.string().valid('male', 'female', 'other').optional(),
    phoneNumber: Joi.string().optional(),
});
