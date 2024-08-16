// src/services/emailService.js

import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        text,
    };

    await transporter.sendMail(mailOptions);
};

export default sendEmail;
