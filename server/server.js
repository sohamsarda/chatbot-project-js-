require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// 🔍 Smart auto-reply generator
function generateAutoReply(message) {
  const msg = message.toLowerCase();

  if (msg.includes('price') || msg.includes('cost') || msg.includes('pricing')  || msg.includes('Tally Silver') || msg.includes('Tally Multi') {
    return "Thanks for your interest! Our pricing starts of Tally Silver Rs.24500 + GST   &    Tally Multi Rs.67500 + GST .  Let us know if you'd like a quote.";
  } else if (msg.includes('hours') || msg.includes('timing') || msg.includes('open')) {
    return "We are open Monday to Saturday, 9:00 AM to 8:00 PM.";
  } else if (msg.includes('support') || msg.includes('help') || msg.includes('problem')) {
    return "We've received your request. Our support team will get back to you shortly.";
  } else if (msg.includes('branch') || msg.includes('office') ) {
	return " Our Head office is located in Jamnagar and Branch office Located at Rajkot and Gandhidham ";
  }else {
    return "Thanks for reaching out! We'll get back to you as soon as possible.";
  }
}

app.post('/api/query', async (req, res) => {
  const { name, email, mobile, message } = req.body;

  console.log("Query received:", name, email, mobile, message);
  const autoReply = generateAutoReply(message);

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // 📬 Send email to admin
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

    // 📩 Auto-reply to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '✅ We Received Your Message!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
          <div style="background-color: #007bff; padding: 20px; color: white; text-align: center;">
            <h2>Thank You, ${name}!</h2>
          </div>
          <div style="padding: 20px; color: #333;">
            <p>${autoReply}</p>
            <hr>
            <h4>📩 Your Message Details:</h4>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Mobile:</strong> ${mobile}</p>
            <p><strong>Message:</strong><br>${message}</p>
            <p style="margin-top: 30px;">We'll respond to you soon.</p>
            <p>– Customer Support Team</p>
          </div>
          <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #888;">
            © ${new Date().getFullYear()} Company Name. All rights reserved.
          </div>
        </div>
      `
    });

  res.json({
  message: "✅ Your message has been sent and a confirmation email is on the way!",
  autoReply
});


  } catch (error) {
    console.error("❌ Email send error:", error);
    res.status(500).json({ message: "❌ Failed to send your query. Please try again later." });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
