const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    try {
        await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
                sender: {
                    name: 'EventManch',
                    email: process.env.EMAIL_USER
                },
                to: [
                    {
                        email: userEmail
                    }
                ],
                subject: `Booking Confirmed: ${eventTitle}`,
                htmlContent: `
                    <h2>Hi ${userName}!</h2>
                    <p>
                        Your booking for the event
                        <strong>${eventTitle}</strong>
                        is successfully confirmed.
                    </p>
                        <p>Thank you for choosing EventManch.</p>
                `
            },
            {
                headers: {
                    'api-key': process.env.BREVO_API_KEY,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error(
            'Error sending booking email:',
            error.response?.data || error.message
        );
    }
};

const sendOTPEmail = async (userEmail, otp, type) => {
    try {
        const title =
            type === 'account_verification'
                ? 'Verify your EventManch Account'
                : 'EventManch Booking Verification';

        const msg =
            type === 'account_verification'
                ? 'Please use the following OTP to verify your new EventManch account.'
                : 'Please use the following OTP to verify and confirm your event booking.';

        await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
                sender: {
                    name: 'EventManch',
                    email: process.env.EMAIL_USER
                },
                to: [
                    {
                        email: userEmail
                    }
                ],
                subject: title,
                htmlContent: `
                    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                        <h2 style="color: #111;">${title}</h2>

                        <p style="color: #555; font-size: 16px;">
                            ${msg}
                        </p>

                        <div style="
                            margin: 20px auto;
                            padding: 15px;
                            font-size: 24px;
                            font-weight: bold;
                            background: #f4f4f4;
                            width: max-content;
                            letter-spacing: 5px;
                        ">
                            ${otp}
                        </div>

                        <p style="color: #999; font-size: 12px;">
                            This code expires in 5 minutes.
                            If you didn't request this, please ignore this email.
                        </p>
                    </div>
                `
            },
            {
                headers: {
                    'api-key': process.env.BREVO_API_KEY,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error(
            'Error sending OTP email:',
            error.response?.data || error.message
        );

        throw error;
    }
};

module.exports = { sendBookingEmail, sendOTPEmail };
