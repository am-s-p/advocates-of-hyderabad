require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const app = express();

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

// Post Schema
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String }, // Base64 encoded image or URL
  createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

// Admin Credentials
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-advocates-hyderabad-123';

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
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmailNotification({ name, email, phone, domainLabel, message, type = 'consultation' }) {
  const recipient = process.env.EMAIL_TO || 'amey9909@gmail.com';

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  Nodemailer not configured (EMAIL_USER or EMAIL_PASS missing).');
    return { success: false, reason: 'credentials_missing' };
  }

  const isCareer = type === 'career';
  const subject = isCareer 
    ? `🎓 First-Gen Lawyer Connect Request: ${name}`
    : `🔔 New Consultation Request: ${name}`;

  const textBody = isCareer
    ? `First-Gen Lawyer Connect Request\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nArea of Interest: ${domainLabel}\n\nMessage/Background:\n${message || 'Not provided'}\n\n-- Sent via Advocates of Hyderabad Website`
    : `New Consultation Request\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nPractice Area: ${domainLabel}\n\nCase Outline:\n${message || 'Not provided'}\n\n-- Sent via Advocates of Hyderabad Website`;

  const htmlBody = isCareer
    ? `
      <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e0e0e0;border-radius:12px;background:#fff;color:#333;">
        <h2 style="border-bottom:2px solid #000;padding-bottom:10px;margin-top:0;color:#1a1a1a;">🎓 First-Gen Lawyer Connect</h2>
        <table style="width:100%;border-collapse:collapse;margin-top:15px;">
          <tr><td style="padding:8px 0;font-weight:bold;width:130px;border-bottom:1px solid #f0f0f0;">Applicant Name:</td><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">${name}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;border-bottom:1px solid #f0f0f0;">Email:</td><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;"><a href="mailto:${email}" style="color:#0066cc;">${email}</a></td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;border-bottom:1px solid #f0f0f0;">Phone:</td><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">${phone ? `<a href="tel:${phone}" style="color:#0066cc;">${phone}</a>` : '<em>Not provided</em>'}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;border-bottom:1px solid #f0f0f0;">Area of Interest:</td><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-weight:600;">${domainLabel}</td></tr>
        </table>
        <div style="margin-top:20px;padding:15px;background:#f9f9f9;border-left:4px solid #000;border-radius:4px;">
          <h4 style="margin:0 0 8px 0;color:#1a1a1a;">Background / Message:</h4>
          <p style="margin:0;line-height:1.6;white-space:pre-wrap;">${message || 'Not provided'}</p>
        </div>
        <hr style="border:0;border-top:1px solid #e0e0e0;margin:25px 0 15px 0;"/>
        <p style="font-size:11px;color:#666;margin:0;text-align:center;">Sent automatically from the Advocates of Hyderabad website.</p>
      </div>
    `
    : `
      <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e0e0e0;border-radius:12px;background:#fff;color:#333;">
        <h2 style="border-bottom:2px solid #000;padding-bottom:10px;margin-top:0;color:#1a1a1a;">⚖️ New Consultation Request</h2>
        <table style="width:100%;border-collapse:collapse;margin-top:15px;">
          <tr><td style="padding:8px 0;font-weight:bold;width:120px;border-bottom:1px solid #f0f0f0;">Client Name:</td><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">${name}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;border-bottom:1px solid #f0f0f0;">Email:</td><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;"><a href="mailto:${email}" style="color:#0066cc;">${email}</a></td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;border-bottom:1px solid #f0f0f0;">Phone:</td><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">${phone ? `<a href="tel:${phone}" style="color:#0066cc;">${phone}</a>` : '<em>Not provided</em>'}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold;border-bottom:1px solid #f0f0f0;">Practice Area:</td><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-weight:600;">${domainLabel}</td></tr>
        </table>
        <div style="margin-top:20px;padding:15px;background:#f9f9f9;border-left:4px solid #000;border-radius:4px;">
          <h4 style="margin:0 0 8px 0;color:#1a1a1a;">Case Outline:</h4>
          <p style="margin:0;line-height:1.6;white-space:pre-wrap;">${message || 'Not provided'}</p>
        </div>
        <hr style="border:0;border-top:1px solid #e0e0e0;margin:25px 0 15px 0;"/>
        <p style="font-size:11px;color:#666;margin:0;text-align:center;">Sent automatically from the Advocates of Hyderabad website contact form.</p>
      </div>
    `;

  const mailOptions = {
    from: `"Advocates of Hyderabad" <${process.env.EMAIL_USER}>`,
    to: recipient,
    subject,
    text: textBody,
    html: htmlBody
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true };
  } catch (err) {
    console.error('❌ Email failed:', err.message);
    return { success: false, reason: 'send_error', detail: err.message };
  }
}

// ─── Routes ─────────────────────────────────────────────────────────────────
app.post('/api/consultations', async (req, res) => {
  try {
    const { name, email, phone, domain, message } = req.body;

    if (!name || !email || !domain) {
      return res.status(400).json({ success: false, error: 'Name, email, and domain are required.' });
    }

    try {
      const doc = new Consultation({ name, email, phone, domain, message });
      await doc.save();
    } catch (dbErr) {
      console.warn('DB save skipped:', dbErr.message);
    }

    const domainLabel = DOMAIN_LABELS[domain] || domain;
    const emailResult = await sendEmailNotification({ name, email, phone, domainLabel, message, type: 'consultation' });

    return res.status(201).json({
      success: true,
      emailSent: emailResult.success,
      emailStatus: emailResult.reason || 'sent',
      message: emailResult.success
        ? 'Consultation saved and email notification sent.'
        : `Consultation saved. Email unavailable: ${emailResult.reason}.`
    });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

app.post('/api/careers', async (req, res) => {
  try {
    const { name, email, phone, interest, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required.' });
    }

    const emailResult = await sendEmailNotification({ 
      name, 
      email, 
      phone, 
      domainLabel: interest || 'General', 
      message, 
      type: 'career' 
    });

    return res.status(201).json({
      success: true,
      emailSent: emailResult.success,
      emailStatus: emailResult.reason || 'sent',
      message: emailResult.success
        ? 'Connect request sent successfully.'
        : `Request processed but email unavailable: ${emailResult.reason}.`
    });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS),
    emailRecipient: process.env.EMAIL_TO || 'amey9909@gmail.com'
  });
});

// ─── Post & Auth Routes ──────────────────────────────────────────────────────

// Admin Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ success: true, token });
  }
  return res.status(401).json({ success: false, error: 'Invalid credentials' });
});

// JWT Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, error: 'Invalid token' });
  }
};

// Get all posts (Public)
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json({ success: true, posts });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ success: false, error: 'Error fetching posts' });
  }
});

// Create post (Protected)
app.post('/api/posts', verifyToken, async (req, res) => {
  try {
    const { title, content, image } = req.body;
    const newPost = new Post({ title, content, image });
    await newPost.save();
    res.status(201).json({ success: true, post: newPost });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ success: false, error: 'Error creating post' });
  }
});

// Delete post (Protected)
app.delete('/api/posts/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ success: false, error: 'Error deleting post' });
  }
});

// Export for Vercel serverless (and also listen for local dev)
module.exports = app;
module.exports.handler = app;

if (require.main === module) {
  const PORT = process.env.PORT || 5003;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
