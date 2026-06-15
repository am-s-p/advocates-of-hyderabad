require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (non-blocking)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/advocates_hyderabad';
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.warn('MongoDB offline (non-blocking):', err.message));

// Mongoose Schema
const consultationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  domain: { type: String, required: true },
  message: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Consultation = mongoose.model('Consultation', consultationSchema);

// Domain Labels
const DOMAIN_LABELS = {
  advocate: 'General Advocacy (D Vijay Kiran)',
  criminal: 'Criminology (D Sai Kumar)',
  corporate: 'Financial Legal Team (Bhavana)',
  family: 'Civil & Divorce (Narasimha)'
};

// ─── Nodemailer Setup ────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // your email (e.g. sender@gmail.com)
    pass: process.env.EMAIL_PASS  // your app password
  }
});

// Function to send Email
async function sendEmailNotification({ name, email, phone, domainLabel, message }) {
  const recipient = process.env.EMAIL_TO || 'amey9909@gmail.com';
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  Nodemailer is not fully configured (EMAIL_USER or EMAIL_PASS missing in .env).');
    return { success: false, reason: 'credentials_missing' };
  }

  const mailOptions = {
    from: `"Advocates of Hyderabad" <${process.env.EMAIL_USER}>`,
    to: recipient,
    subject: `🔔 New Consultation Request: ${name}`,
    text: `
New Consultation Request Received:
----------------------------------
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Practice Area: ${domainLabel}
Case Outline:
${message || 'Not provided'}

--
Sent via Advocates of Hyderabad Website
    `,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff; color: #333333;">
        <h2 style="border-bottom: 2px solid #000000; padding-bottom: 10px; margin-top: 0; color: #1a1a1a;">⚖️ New Consultation Request</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 120px; border-bottom: 1px solid #f0f0f0;">Client Name:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f0f0f0;">Email:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><a href="mailto:${email}" style="color: #0066cc; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f0f0f0;">Phone:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${phone ? `<a href="tel:${phone}" style="color: #0066cc; text-decoration: none;">${phone}</a>` : '<em>Not provided</em>'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f0f0f0;">Practice Area:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-weight: 600;">${domainLabel}</td>
          </tr>
        </table>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #000000; border-radius: 4px;">
          <h4 style="margin: 0 0 8px 0; color: #1a1a1a;">Case Outline:</h4>
          <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${message || 'Not provided'}</p>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 25px 0 15px 0;" />
        <p style="font-size: 11px; color: #666666; margin: 0; text-align: center;">
          This inquiry was sent automatically from the Advocates of Hyderabad website contact form.
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email notification sent successfully:', info.messageId);
    return { success: true };
  } catch (err) {
    console.error('❌ Nodemailer failed to send email:', err.message);
    return { success: false, reason: 'send_error', detail: err.message };
  }
}

// ─── POST /api/consultations ───────────────────────────────────────────────
app.post('/api/consultations', async (req, res) => {
  try {
    const { name, email, phone, domain, message } = req.body;

    if (!name || !email || !domain) {
      return res.status(400).json({ success: false, error: 'Name, email, and domain are required.' });
    }

    // Save to DB (non-blocking)
    try {
      const doc = new Consultation({ name, email, phone, domain, message });
      await doc.save();
      console.log('Saved to MongoDB:', doc._id);
    } catch (dbErr) {
      console.warn('DB save skipped (MongoDB offline):', dbErr.message);
    }

    const domainLabel = DOMAIN_LABELS[domain] || domain;

    // Send email notification via Nodemailer
    const emailResult = await sendEmailNotification({ name, email, phone, domainLabel, message });

    return res.status(201).json({
      success: true,
      emailSent: emailResult.success,
      emailStatus: emailResult.reason || 'sent',
      message: emailResult.success
        ? 'Consultation saved and email notification sent successfully.'
        : `Consultation saved. Email auto-send unavailable (${emailResult.reason || 'unknown'}). Please complete Nodemailer setup.`
    });
  } catch (err) {
    console.error('Error handling intake request:', err);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS),
    emailRecipient: process.env.EMAIL_TO || 'amey9909@gmail.com'
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`   Email Recipient: ${process.env.EMAIL_TO || 'amey9909@gmail.com'}`);
  console.log(`   Nodemailer User: ${process.env.EMAIL_USER ? '✅ configured' : '❌ NOT SET — see setup below'}`);
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('\n══ NODEMAILER GMAIL SETUP (one-time) ══');
    console.log('1. Go to your Google Account Settings -> Security');
    console.log('2. Enable 2-Step Verification');
    console.log('3. Go to "App Passwords" (or search for it)');
    console.log('4. Generate a new app password (select "Mail" and "Other (Custom name)")');
    console.log('5. Copy the 16-character code');
    console.log('6. Add these to server/.env:');
    console.log('   EMAIL_USER=your_gmail@gmail.com');
    console.log('   EMAIL_PASS=your_16_char_app_password');
    console.log('7. Restart the server.\n');
  }
});
