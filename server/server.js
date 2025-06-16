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
  let replies = [];

  if (/\b(price|cost|charges|fees|how much|quote|quotation|silver|multi)\b/i.test(msg)) {
    replies.push("Thank you for your interest. Our pricing starts at Tally Silver: Rs. 24,500 + GST and Tally Multi: Rs. 67,500 + GST. Please let us know if you would like a formal quotation.");
  }

  if (/\b(hours|timing|open|working hours|when are you open|availability)\b/i.test(msg)) {
    replies.push("Our working hours are Monday to Saturday, from 9:00 AM to 8:00 PM.");
  }

  if (/\b(product|service|solution|offerings|software|tally)\b/i.test(msg)) {
    replies.push("We offer a range of Tally solutions including Silver, Multi-user, and custom modules. Let us know your requirement.");
  }

  if (/\b(support|issue|problem|help|error|not working|bug|trouble|glitch)\b/i.test(msg)) {
    replies.push("Your support request has been noted. Our technical team will reach out to you shortly.");
  }

  if (/\b(branch|office|location|where|address|located)\b/i.test(msg)) {
    replies.push("Our Head Office is located in Jamnagar, with branch offices in Rajkot and Gandhidham.");
  }

  if (/\b(hi|hello|hey|good morning|good evening|greetings)\b/i.test(msg)) {
    replies.push("Hello! How can we assist you today?");
  }

  if (/\b(contact|email|phone|call|reach you|talk to)\b/i.test(msg)) {
    replies.push("You can reach us at sohamsardawork@gmail.com");
  }

  // Default fallback reply
  if (replies.length === 0) {
    replies.push("Thank you for contacting us. We will get back to you as soon as possible.");
  }

  return replies.join("\n\n");
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
