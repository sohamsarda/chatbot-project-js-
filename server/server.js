require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/query', async (req, res) => {
  const { name, email, mobile, message } = req.body;

  console.log("Query received:", name, email, mobile, message);

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS  // app password
      }
    });

    // 1. Send message to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO, // your receiving email
      subject: '📨 New Customer Support Query',
      text: `
        Name: ${name}
        Email: ${email}
        Mobile: ${mobile}
        Message: ${message}
      `
    });

    // 2. Send confirmation to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '✅ We Received Your Message!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #007bff; padding: 20px; color: white; text-align: center;">
            <h2>Thank You for Reaching Out!</h2>
          </div>
          <div style="padding: 20px; color: #333;">
            <p>Hi <strong>${name}</strong>,</p>
            <p>We've received your message and our support team will respond to you as soon as possible.</p>

            <h4 style="margin-top: 30px;">📩 Message Summary:</h4>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold;">Name:</td>
                <td style="padding: 8px;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Email:</td>
                <td style="padding: 8px;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Mobile:</td>
                <td style="padding: 8px;">${mobile}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Message:</td>
                <td style="padding: 8px;">${message}</td>
              </tr>
            </table>

            <p style="margin-top: 30px;">We’ll get back to you shortly. Have a great day!</p>
            <p>– Customer Support Team</p>
          </div>
          <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #888;">
            © ${new Date().getFullYear()} Company Name. All rights reserved.
          </div>
        </div>
      `
    });

    res.json({ message: "✅ Your message has been sent! We'll get back to you shortly." });

  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ message: "❌ Failed to send your query. Please try again later." });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
