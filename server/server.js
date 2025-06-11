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

    res.json({ message: "✅ Your message has been sent! We'll get back to you shortly." });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ message: "❌ Failed to send your query. Please try again later." });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
