const nodemailer = require('nodemailer');

// Helper function to send email
const sendEmail = async (options) => {
    // Create a transporter using your email service (e.g., Gmail)
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or your preferred service
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"${options.fromName || 'Portfolio Website'}" <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
    };

    if (options.replyTo) {
        mailOptions.replyTo = options.replyTo;
    }

    await transporter.sendMail(mailOptions);
};

// @desc    Handle incoming contact form submissions
// @route   POST /api/contact
// @access  Public
const submitContactForm = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Please provide name, email, and message' });
    }

    try {
        // 1. Send the email to the portfolio owner
        await sendEmail({
            to: process.env.EMAIL_USER, // Send to your own email
            subject: `New Contact Request from ${name}`,
            replyTo: email,
            html: `
                <h3>New message from your Portfolio Contact Form</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <h4>Message:</h4>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `
        });

        // 2. Send an auto-reply back to the sender
        await sendEmail({
            to: email, // Send back to the user who filled the form
            fromName: "Boggarapu Sai Jayanth",
            subject: "Thank you for getting in touch!",
            html: `
                <h3>Hello ${name},</h3>
                <p>Thank you for reaching out! I have received your message and will get back to you as soon as possible.</p>
                <br>
                <p><strong>Your original message:</strong></p>
                <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; color: #555;">
                    <p>${message.replace(/\n/g, '<br>')}</p>
                </blockquote>
                <br>
                <p>Best regards,</p>
                <p>Boggarapu Sai Jayanth</p>
                <p><small>This is an automated response. Please do not reply to this email.</small></p>
            `
        });

        res.status(200).json({ success: true, message: 'Message sent successfully' });

    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({ message: 'Failed to send message. Please try again later.' });
    }
};

module.exports = {
    submitContactForm
};
