// server/server.js

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
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    // ✅ Send email to support team (you)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: '📨 New Customer Support Query',
      text: `
        Name: ${name}
        Email: ${email}
        Mobile: ${mobile}
        Message: ${message}
      `
    });

    // ✅ Send confirmation email to the customer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email, // customer's email
      subject: '✅ We received your message!',
      html: `
        <p>Hi <strong>${name}</strong>,</p>
        <p>Thank you for reaching out to us. We've received your message and will respond shortly.</p>
        <p><strong>Your message:</strong></p>
        <blockquote>${message}</blockquote>
        <hr/>
        <p>📞 Mobile: ${mobile}</p>
        <p>💬 You contacted us via our support form.</p>
        <br/>
        <p>Warm regards,<br><strong>Customer Support Team</strong></p>
      `
    });

    res.json({ message: "✅ Your message has been sent and a confirmation email has been sent to your inbox!" });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ message: "❌ Failed to send your query. Please try again later." });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
