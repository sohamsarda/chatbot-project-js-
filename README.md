

## 💬 Chatbot Contact Widget

A simple and responsive contact form popup for websites, styled like a chatbot. Visitors can submit their details and receive an auto-reply instantly.

---

### ✨ Features

* Popup contact form with name, email, phone, and message
* Sends data to a backend API (`/api/query`)
* Displays an auto-reply and message summary
* Mobile-friendly and easy to integrate

---

### 🚀 How It Works

1. User clicks the chat button to open the form.
2. Fills in the details and clicks "Send Message".
3. The form sends data to your API using `fetch()`.
4. A thank-you message and auto-reply appear inside the popup.

---

### 🔧 Setup

1. Add the HTML, CSS, and JS code to your website.
2. Update the API URL in the JavaScript:

   ```js
   fetch('https://your-api-url.com/api/query', { ... })
   ```
3. Ensure your backend returns a JSON like:

   ```json
   { "autoReply": "Thanks! We’ll get back to you soon." }
   ```

---

### 📬 Backend Sample

Expected POST request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "message": "Your message here"
}
```

---

### 📄 License

Free to use and modify. Attribution appreciated but not required.
