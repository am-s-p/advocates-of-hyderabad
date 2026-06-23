import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const WHATSAPP_NUMBER = '917600079980';
// Uses relative path — works in both local dev (via Vite proxy) and Vercel production
const SERVER_URL = '';

// Fallback: build WhatsApp URL on client in case server is unreachable
function buildWhatsAppUrl({ name, email, phone, domain, message }) {
  const labels = {
    advocate: 'General Advocacy & Document Verification (D Vijay Kiran)',
    criminal: 'Criminal Law (D Sai Kumar)',
    corporate: 'Financial & Loan Settlements (Bhavana)',
    family: 'Criminal, Civil & Mutual Divorce (Narasimha)'
  };
  const text = [
    '🔔 New Consultation Request',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    `Practice Area: ${labels[domain] || domain}`,
    `Case Outline: ${message || 'N/A'}`
  ].filter(Boolean).join('\n');
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

const QUOTES = [
  {
    text: "Governments may come and go... but the Constitution must remain untouchable at its core.",
    author: "Kesavananda Bharati vs State of Kerala"
  },
  {
    text: "An FIR is not proof of guilt. But for many people, society punishes before courts do.",
    author: "Advocates of Hyderabad"
  },
  {
    text: "Laws can change nations. But one determined person can start the change that creates new laws.",
    author: "RTI Act, 2005"
  },
  {
    text: "A good lawyer knows the law. A clever lawyer knows the judge. But the best lawyer — knowing both — still stands on the side of justice.",
    author: "Advocates of Hyderabad"
  },
  {
    text: "Kings, politicians, billionaires, and beggars all fear the same thing. The law has a name for it.",
    author: "Act of God"
  },
  {
    text: "One signature. One Emergency. Millions lost freedoms. The law never forgets — and neither should we.",
    author: "Indian Emergency, 1975–1977"
  },
  {
    text: "Article 32 is not just a provision. It is the guardian of your rights — standing firm even when everything else fails you.",
    author: "Constitution of India"
  },
  {
    text: "Behind prison walls, law still survives.",
    author: "Advocates of Hyderabad"
  }
];

const LAWYER_DATA = {
  advocate: {
    name: "D Vijay Kiran",
    role: "Senior Legal Advocate",
    tag: "Senior Advocate",
    icon: "logo",
    quote: "\u201cNot Just A Lawyer, Your Legal Shield.\u201d",
    bio: "D Vijay Kiran is the founder and principal legal advocate of Advocates of Hyderabad. With over 9 years of experience, he leads high-stakes constitutional matters, document verification, administrative appeals, and comprehensive legal advisory in Telangana and beyond.",
    successes: [
      "Secured positive landmark judgments in major land and inheritance disputes.",
      "Successfully defended fundamental liberties in constitutional public interest litigations.",
      "Pioneered secure mediation services for major regional enterprise boards."
    ]
  },
  criminal: {
    name: "D Sai Kumar",
    role: "Criminal Lawyer",
    tag: "Criminal Law",
    icon: "\u00a7",
    quote: "\u201cA defense is not a technicality; it is the vital shield of liberty that protects the citizen.\u201d",
    bio: "D Sai Kumar is a dedicated criminal lawyer. He excels in navigating complex trial procedures, forensic verification, bail applications, and state appellate defense for all criminal cases.",
    successes: [
      "State v. Kumar \u2013 Achieved complete exoneration in a high-profile white collar trial.",
      "Successfully secured urgent bail grants in multiple critical trial court hearings.",
      "Navigated defense representations in multi-jurisdiction regulatory investigations."
    ]
  },
  corporate: {
    name: "Bhavana",
    role: "Financial & Loan Settlements Lead",
    tag: "Financial Legal Team",
    icon: "\ud83c\udfe2",
    quote: "\u201cFinancial integrity and regulatory compliance are the cornerstones of corporate trust.\u201d",
    bio: "Bhavana integrates financial expertise with legal strategy, advising clients on loan settlements, tax disputes, corporate auditing, capital structure disputes, and compliance frameworks.",
    successes: [
      "Audited and restructured legal-compliance setups for prominent regional corporations.",
      "Resolved complex financial tax disputes saving millions in regulatory liability.",
      "Managed due diligence and contract negotiations for major corporate mergers."
    ]
  },
  family: {
    name: "Narasimha",
    role: "Criminal & Civil Law Expert",
    tag: "Criminal, Civil & Family",
    icon: "\u2696",
    quote: "\u201cResolving disputes requires a balance of rigorous legal strategy and deep empathy.\u201d",
    bio: "Narasimha is excellent in criminal and civil law, specializing in mutual divorce, domestic violence, will settlements, and general civil property disputes. His objective is to deliver peace of mind and secure resolutions.",
    successes: [
      "Successfully mediated high-asset property divisions in complex family estate separations.",
      "Secured sole guardianship protections in sensitive domestic violence and custody matters.",
      "Resolved multi-decade civil boundary disputes through expert title litigation."
    ]
  }
};

const REVIEWS = [
  { name: "Saiteja nyalam", rating: 5, time: "a week ago", text: "I had a very positive experience with them for my loan settlement. They were professional, knowledgeable, and guided me clearly through each step of the process. Their negotiation skills helped me reach a fair settlement..." },
  { name: "Shalem Raj Baddanapally", rating: 5, time: "4 months ago", text: "Needed to make a Will for family property and wanted proper legal guidance. A neighbour suggested this legal team near Hitech City. After calling them, they arranged a home visit, which was very helpful as elders were involved." },
  { name: "Dhanavath Jalini", rating: 5, time: "8 months ago", text: "I approached this Law Services for help with my divorce case in Hyderabad. The advocates were very understanding and explained every legal option clearly. They handled my case professionally and always respected my privacy." },
  { name: "Mouli Yalla", rating: 5, time: "7 months ago", text: "I had given loan amount to my friend and he didn’t return it on time. I was not sure what to do, but this legal team near Hitech City helped me file a civil money recovery case. They managed all documents and represented me perfectly..." },
  { name: "Ainapur Rushi prasad", rating: 5, time: "7 months ago", text: "A false complaint in our society WhatsApp group damaged my reputation badly. I was emotionally drained and didn’t know what to do legally. This legal team in Kondapur helped me file a civil defamation suit and guided me on sending proper notices." },
  { name: "Janardan Bahirat", rating: 5, time: "8 months ago", text: "Advocate of Hyderabad played a crucial role in resolving my case within just two weeks — a matter that had been pending for nearly five months with another firm. I truly appreciate their dedication and prompt action." },
  { name: "Vinod Kumar Muthyala", rating: 5, time: "8 months ago", text: "Truly impressed by the professionalism and dedication shown throughout the process. Every detail was handled with care, and the communication was always clear and timely. Highly recommend for anyone looking for trustworthy and reliable legal support." },
  { name: "Roja Mani", rating: 5, time: "a day ago", text: "Great team . Went for property document verification satisfied with service. Highly recommend in this area .Trusted advocates." }
];

const StarIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="#fbbc04" stroke="#fbbc04" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);


const LogoIcon = ({ size = 36 }) => (
  <svg className="logo-svg" viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
    <circle className="logo-circle" cx="50" cy="50" r="46" />
    <path className="logo-wings" d="M 32 30 L 50 48 L 68 30" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <rect className="logo-band" x="38" y="48" width="10" height="32" />
    <rect className="logo-band" x="52" y="48" width="10" height="32" />
  </svg>
);

const AdminPortal = ({ token, setToken, onExit, fetchPublicPosts }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [posts, setPosts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postForm, setPostForm] = useState({ id: null, title: '', content: '', image: '' });

  const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5003');

  useEffect(() => {
    if (token) {
      fetchAdminPosts();
    }
  }, [token]);

  const fetchAdminPosts = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/posts`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);
    try {
      const res = await fetch(`${baseUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success && data.token) {
        setToken(data.token);
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch (err) {
      setLoginError('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setPostForm({ id: null, title: '', content: '', image: '' });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setPostForm(prev => ({ ...prev, image: dataUrl }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSavePost = async (e) => {
    e.preventDefault();
    if (!postForm.title || !postForm.content) return;
    setIsSubmitting(true);
    try {
      const method = postForm.id ? 'PUT' : 'POST';
      const url = postForm.id ? `${baseUrl}/api/posts/${postForm.id}` : `${baseUrl}/api/posts`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title: postForm.title, content: postForm.content, image: postForm.image })
      });
      if (res.ok) {
        setPostForm({ id: null, title: '', content: '', image: '' });
        fetchAdminPosts();
        fetchPublicPosts(); // refresh public feed
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save post.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`${baseUrl}/api/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAdminPosts();
        fetchPublicPosts();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete post.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (post) => {
    setPostForm({ id: post._id, title: post.title, content: post.content, image: post.image || '' });
    window.scrollTo(0, 0);
  };

  if (!token) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <button className="admin-back-btn" onClick={onExit}>← Back to Main Site</button>
          <h2>Team Login</h2>
          <p>Sign in to manage firm updates and posts.</p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {loginError && <p className="error-msg">{loginError}</p>}
            <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
              {isSubmitting ? 'Authenticating...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <h2>Admin Portal</h2>
          <div className="admin-actions">
            <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
            <button className="btn btn-primary" onClick={onExit}>View Public Site →</button>
          </div>
        </div>
      </header>

      <div className="admin-content-grid">
        <div className="admin-form-panel">
          <h3>{postForm.id ? 'Edit Post' : 'Create New Post'}</h3>
          <form onSubmit={handleSavePost}>
            <div className="form-group">
              <label>Post Title</label>
              <input type="text" value={postForm.title} onChange={e => setPostForm(prev => ({ ...prev, title: e.target.value }))} required placeholder="e.g. Landmark Judgment in Apex Court" />
            </div>
            <div className="form-group">
              <label>Post Content</label>
              <textarea value={postForm.content} onChange={e => setPostForm(prev => ({ ...prev, content: e.target.value }))} required rows="6" placeholder="Write your insight, thought, or update here..."></textarea>
            </div>
            <div className="form-group">
              <label>Image Attachment (Optional)</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              {postForm.image && <div className="image-preview"><img src={postForm.image} alt="Preview" /></div>}
            </div>
            <div className="admin-form-actions">
              {postForm.id && <button type="button" className="btn btn-secondary" onClick={() => setPostForm({ id: null, title: '', content: '', image: '' })}>Cancel Edit</button>}
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : (postForm.id ? 'Update Post' : 'Publish Post')}</button>
            </div>
          </form>
        </div>

        <div className="admin-posts-list">
          <h3>Recent Posts</h3>
          {posts.length === 0 ? <p className="text-muted">No posts yet.</p> : (
            <div className="admin-posts-stack">
              {posts.map(post => (
                <div key={post._id} className="admin-post-card">
                  {post.image && <img src={post.image} alt={post.title} className="admin-post-thumb" />}
                  <div className="admin-post-info">
                    <h4>{post.title}</h4>
                    <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                    <div className="admin-post-actions">
                      <button onClick={() => handleEditClick(post)}>Edit</button>
                      <button className="text-danger" onClick={() => handleDeletePost(post._id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeQuote, setActiveQuote] = useState(0);
  const [activeModal, setActiveModal] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [currentView, setCurrentView] = useState('home'); // 'home' | 'admin'
  const [adminToken, setAdminToken] = useState(null);
  const [posts, setPosts] = useState([]);

  // Language State
  const getInitialLanguage = () => {
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
    return match ? match[1] : 'en';
  };
  const [currentLang, setCurrentLang] = useState(getInitialLanguage());

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setCurrentLang(lang);
    if (lang === 'en') {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${window.location.hostname}; path=/;`;
    } else {
      document.cookie = `googtrans=/en/${lang}; path=/;`;
      document.cookie = `googtrans=/en/${lang}; domain=.${window.location.hostname}; path=/;`;
    }
    window.location.reload();
  };

  const [formState, setFormState] = useState({ name: '', email: '', phone: '', domain: '', message: '' });
  const [formErrors, setFormErrors] = useState({ name: false, email: false, domain: false });
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [whatsappFallbackUrl, setWhatsappFallbackUrl] = useState('');

  const [careerFormState, setCareerFormState] = useState({ name: '', email: '', phone: '', interest: '', message: '' });
  const [careerFormErrors, setCareerFormErrors] = useState({ name: false, email: false, interest: false });
  const [isCareerSuccess, setIsCareerSuccess] = useState(false);
  const [isCareerSubmitting, setIsCareerSubmitting] = useState(false);
  const [careerServerError, setCareerServerError] = useState('');

  const quoteInterval = useRef(null);

  // Sync Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Close mobile nav on outside click
  useEffect(() => {
    if (!mobileNavOpen) return;
    const handler = () => setMobileNavOpen(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [mobileNavOpen]);

  // Fetch Posts
  const fetchPosts = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5003');
      const response = await fetch(`${baseUrl}/api/posts`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Lock body scroll when modal open
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [activeModal]);

  // Navbar Scroll Trigger
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Quotes Auto Rotator
  const startQuoteInterval = () => {
    stopQuoteInterval();
    quoteInterval.current = setInterval(() => {
      setActiveQuote((prev) => (prev + 1) % QUOTES.length);
    }, 8000);
  };

  const stopQuoteInterval = () => {
    if (quoteInterval.current) clearInterval(quoteInterval.current);
  };

  useEffect(() => {
    startQuoteInterval();
    return () => stopQuoteInterval();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrevQuote = () => {
    stopQuoteInterval();
    setActiveQuote((prev) => (prev === 0 ? QUOTES.length - 1 : prev - 1));
  };

  const handleNextQuote = () => {
    stopQuoteInterval();
    setActiveQuote((prev) => (prev + 1) % QUOTES.length);
  };

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  // Form Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: false }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = {
      name: !formState.name.trim(),
      email: !validateEmail(formState.email),
      domain: !formState.domain
    };
    setFormErrors(errors);
    if (errors.name || errors.email || errors.domain) return;

    setIsSubmitting(true);
    setServerError('');

    try {
      const response = await fetch(`${SERVER_URL}/api/consultations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      });

      const data = await response.json();

      if (data.success) {
        const randCode = 'VP-' + Math.floor(1000 + Math.random() * 9000);
        setConfirmationCode(randCode);

        // If email was sent, we don't strictly require a WhatsApp fallback but we can provide it optionally.
        // If email was NOT sent (e.g. credentials missing in .env), we trigger the WhatsApp fallback URL.
        if (!data.emailSent) {
          setWhatsappFallbackUrl(buildWhatsAppUrl(formState));
        } else {
          setWhatsappFallbackUrl('');
        }
        setIsSuccess(true);
      } else {
        setServerError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      // Server unreachable — show fallback WhatsApp link
      console.error('Server unreachable:', err);
      setWhatsappFallbackUrl(buildWhatsAppUrl(formState));
      const randCode = 'VP-' + Math.floor(1000 + Math.random() * 9000);
      setConfirmationCode(randCode);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setFormState({ name: '', email: '', phone: '', domain: '', message: '' });
    setFormErrors({ name: false, email: false, domain: false });
    setServerError('');
    setConfirmationCode('');
    setWhatsappFallbackUrl('');
  };

  const handleCareerInputChange = (e) => {
    const { name, value } = e.target;
    setCareerFormState((prev) => ({ ...prev, [name]: value }));
    if (careerFormErrors[name]) {
      setCareerFormErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleCareerSubmit = async (e) => {
    e.preventDefault();

    const errors = {
      name: !careerFormState.name.trim(),
      email: !validateEmail(careerFormState.email),
      interest: !careerFormState.interest
    };

    setCareerFormErrors(errors);

    if (Object.values(errors).some(Boolean)) {
      return;
    }

    setIsCareerSubmitting(true);
    setCareerServerError('');

    try {
      const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5003');
      const response = await fetch(`${baseUrl}/api/careers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(careerFormState)
      });

      const data = await response.json();

      if (response.ok) {
        setIsCareerSuccess(true);
      } else {
        setCareerServerError(data.error || 'Failed to submit request.');
      }
    } catch (error) {
      setCareerServerError('Network error. Please try again later.');
    } finally {
      setIsCareerSubmitting(false);
    }
  };

  const resetCareerForm = () => {
    setIsCareerSuccess(false);
    setCareerFormState({ name: '', email: '', phone: '', interest: '', message: '' });
    setCareerFormErrors({ name: false, email: false, interest: false });
    setCareerServerError('');
  };

  const handleModalBook = () => {
    const selectedDomain = activeModal;
    setFormState((prev) => ({ ...prev, domain: selectedDomain }));
    setActiveModal(null);
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileNavOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const selectedLawyer = activeModal ? LAWYER_DATA[activeModal] : null;

  return (
    <>
      {/* ═══ NAVIGATION ═══ */}
      {currentView !== 'admin' && (
        <nav className={`nav-bar ${isScrolled ? 'scrolled' : ''}`} id="navbar" role="navigation" aria-label="Main navigation">
          <div className="nav-container">
            <a href="#" className="nav-logo" aria-label="Advocates of Hyderabad – Home" onClick={(e) => { e.preventDefault(); setCurrentView('home'); window.scrollTo(0, 0); }}>
              <LogoIcon size={36} />
              <span className="logo-text">ADVOCATES OF HYDERABAD</span>
            </a>

            {/* Desktop Nav */}
            <ul className="nav-links" role="list">
              <li><a href="#about" className="nav-link" onClick={(e) => { if (currentView !== 'home') setCurrentView('home'); handleNavClick(e, '#about'); }}>About</a></li>
              <li><a href="#team" className="nav-link" onClick={(e) => { if (currentView !== 'home') setCurrentView('home'); handleNavClick(e, '#team'); }}>Counsel</a></li>
              <li><a href="#reviews" className="nav-link" onClick={(e) => { if (currentView !== 'home') setCurrentView('home'); handleNavClick(e, '#reviews'); }}>Reviews</a></li>
              <li><a href="#quotes" className="nav-link" onClick={(e) => { if (currentView !== 'home') setCurrentView('home'); handleNavClick(e, '#quotes'); }}>Philosophy</a></li>
              <li><a href="#posts" className="nav-link" onClick={(e) => { if (currentView !== 'home') setCurrentView('home'); handleNavClick(e, '#posts'); }}>Posts</a></li>
              <li><a href="#careers" className="nav-link" onClick={(e) => { if (currentView !== 'home') setCurrentView('home'); handleNavClick(e, '#careers'); }}>Connect</a></li>
              <li><a href="#contact" className="nav-link button-outline" onClick={(e) => { if (currentView !== 'home') setCurrentView('home'); handleNavClick(e, '#contact'); }}>Consultation</a></li>
            </ul>

            <div className="nav-right">
              <select 
                value={currentLang} 
                onChange={handleLanguageChange}
                style={{
                  background: 'transparent',
                  color: 'var(--text-color)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  marginRight: '0.5rem',
                  outline: 'none'
                }}
                aria-label="Select Language"
              >
                <option value="en">Eng</option>
                <option value="hi">हिन्दी</option>
                <option value="te">తెలుగు</option>
              </select>
              <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle light/dark theme" id="theme-toggle-btn">
                <svg className="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="5"></circle>
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
                </svg>
                <svg className="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              </button>
              <button className="nav-link" onClick={() => setCurrentView('admin')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Team Login</button>

              {/* Hamburger */}
              <button
                className={`hamburger ${mobileNavOpen ? 'open' : ''}`}
                onClick={(e) => { e.stopPropagation(); setMobileNavOpen((v) => !v); }}
                aria-label="Toggle mobile menu"
                aria-expanded={mobileNavOpen}
                id="hamburger-btn"
              >
                <span></span><span></span><span></span>
              </button>
            </div>
          </div>

          {/* Mobile Nav Drawer */}
          <div className={`mobile-nav ${mobileNavOpen ? 'open' : ''}`} aria-hidden={!mobileNavOpen}>
            <ul role="list">
              <li><a href="#about" onClick={(e) => { if (currentView !== 'home') setCurrentView('home'); handleNavClick(e, '#about'); }}>About</a></li>
              <li><a href="#team" onClick={(e) => { if (currentView !== 'home') setCurrentView('home'); handleNavClick(e, '#team'); }}>Counsel</a></li>
              <li><a href="#reviews" onClick={(e) => { if (currentView !== 'home') setCurrentView('home'); handleNavClick(e, '#reviews'); }}>Reviews</a></li>
              <li><a href="#quotes" onClick={(e) => { if (currentView !== 'home') setCurrentView('home'); handleNavClick(e, '#quotes'); }}>Philosophy</a></li>
              <li><a href="#posts" onClick={(e) => { if (currentView !== 'home') setCurrentView('home'); handleNavClick(e, '#posts'); }}>Posts</a></li>
              <li><a href="#careers" onClick={(e) => { if (currentView !== 'home') setCurrentView('home'); handleNavClick(e, '#careers'); }}>Connect</a></li>
              <li><a href="#contact" className="mobile-cta" onClick={(e) => { if (currentView !== 'home') setCurrentView('home'); handleNavClick(e, '#contact'); }}>Book Consultation</a></li>
              <li><button onClick={() => { setCurrentView('admin'); setMobileNavOpen(false); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent-color)', fontSize: '1rem', marginTop: '16px', fontWeight: 'bold' }}>Team Login</button></li>
            </ul>
            <div className="mobile-nav-contact">
              <a href="tel:+919493456771">📞 +91 94934 56771</a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">💬 WhatsApp Us</a>
            </div>
          </div>
        </nav>
      )}

      {currentView === 'home' && (
        <>
          {/* ═══ HERO SECTION ═══ */}
          <section className="hero" id="about" aria-label="About Advocates of Hyderabad">
            <div className="hero-bg-overlay" aria-hidden="true"></div>
            <div className="hero-content">
              <div className="hero-badge" aria-label="Established 1998">EST. 2016</div>
              <h1 className="hero-title">
                Not Just A Lawyer,<br />
                <span className="serif-title">Your Legal Shield.</span>
              </h1>
              <p className="hero-subtitle">
                Advocates of Hyderabad — premier legal representation in Criminology, Civil litigation, Divorce disputes, and Corporate Financial legal counsel. Serving India
              </p>
              <div className="hero-actions">
                <a href="#team" className="btn btn-primary" id="meet-counsel-btn" onClick={(e) => handleNavClick(e, '#team')}>Meet Our Counsel</a>
                <a href="#contact" className="btn btn-secondary" id="case-review-btn" onClick={(e) => handleNavClick(e, '#contact')}>Request Case Review</a>
              </div>

              <div className="scroll-indicator" aria-hidden="true">
                <span className="scroll-text">Explore Philosophy</span>
                <div className="scroll-mouse">
                  <div className="scroll-wheel"></div>
                </div>
              </div>
            </div>
          </section>

          {/* ═══ TEAM SECTION ═══ */}
          <section className="team-section" id="team" aria-label="Our legal team">
            <div className="container">
              <div className="section-header">
                <span className="section-tag">Elite Advocacy</span>
                <h2 className="section-title">Our Legal Minds</h2>
                <p className="section-subtitle">Choose a domain expert to review their profile and book a confidential consultation.</p>
              </div>

              <div className="lawyer-grid" role="list">
                {Object.keys(LAWYER_DATA).map((key) => {
                  const lawyer = LAWYER_DATA[key];
                  return (
                    <article
                      key={key}
                      className="lawyer-card"
                      onClick={() => setActiveModal(key)}
                      role="listitem"
                      tabIndex={0}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveModal(key)}
                      aria-label={`${lawyer.name}, ${lawyer.role} — Click to view profile`}
                      id={`lawyer-card-${key}`}
                    >
                      <div className="lawyer-img-wrapper">
                        <div className="lawyer-placeholder-graphic" aria-hidden="true">
                          {lawyer.icon === 'logo' ? <LogoIcon size={70} /> : <span>{lawyer.icon}</span>}
                        </div>
                        <div className="lawyer-badge">{lawyer.tag}</div>
                      </div>
                      <div className="lawyer-info">
                        <h3 className="lawyer-name">{lawyer.name}</h3>
                        <p className="lawyer-title">{lawyer.role}</p>
                        <p className="lawyer-quote">{lawyer.quote}</p>
                        <button className="btn btn-card-details" tabIndex={-1} aria-hidden="true">View Profile &amp; Case History</button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ═══ LAWYER MODAL ═══ */}
          {selectedLawyer && (
            <div
              className="modal-overlay active"
              role="dialog"
              aria-modal="true"
              aria-label={`${selectedLawyer.name} profile`}
              onClick={(e) => e.target.classList.contains('modal-overlay') && setActiveModal(null)}
            >
              <div className="modal-card">
                <button className="modal-close" onClick={() => setActiveModal(null)} aria-label="Close modal" id="modal-close-btn">✕</button>
                <div className="modal-content-grid">
                  <div className="modal-side-graphic">
                    <div className="modal-icon" aria-hidden="true">
                      {selectedLawyer.icon === 'logo' ? <LogoIcon size={80} /> : selectedLawyer.icon}
                    </div>
                    <h2 className="modal-lawyer-name">{selectedLawyer.name}</h2>
                    <p className="modal-lawyer-role">{selectedLawyer.role}</p>
                    <span className="modal-lawyer-tag">{selectedLawyer.tag}</span>
                  </div>
                  <div className="modal-details-body">
                    <h3 className="modal-subheader">Core Philosophy</h3>
                    <p className="modal-bio-quote">{selectedLawyer.quote}</p>

                    <h3 className="modal-subheader">Expertise &amp; Experience</h3>
                    <p className="modal-bio-text">{selectedLawyer.bio}</p>

                    <h3 className="modal-subheader">Notable Successes</h3>
                    <ul className="modal-list">
                      {selectedLawyer.successes.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>

                    <div className="modal-action-row">
                      <button className="btn btn-primary" onClick={handleModalBook} id="modal-book-btn">Book Consultation</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ REVIEWS SECTION ═══ */}
          <section className="reviews-section" id="reviews" aria-label="Client Testimonials and Google Reviews">
            <div className="container">
              <div className="section-header">
                <h2>Client <span className="serif-title">Trust</span></h2>
                <p className="section-subtitle">Real experiences from our clients across Hyderabad.</p>
              </div>
            </div>
            <div className="marquee-container">
              {/* Double the array for seamless infinite scroll */}
              {[...REVIEWS, ...REVIEWS].map((review, index) => (
                <div className="review-card" key={index}>
                  <div className="review-header">
                    <div className="reviewer-info">
                      <h4>{review.name}</h4>
                      <span className="review-time">{review.time}</span>
                    </div>
                    <div className="google-logo">
                      <svg viewBox="0 0 48 48" width="24" height="24">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.9c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.13-10.36 7.13-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                      </svg>
                    </div>
                  </div>
                  <div className="review-stars">
                    {[...Array(review.rating)].map((_, i) => <StarIcon key={i} />)}
                  </div>
                  <p className="review-text">"{review.text}"</p>
                </div>
              ))}
            </div>
          </section>

          {/* ═══ QUOTES SECTION ═══ */}
          <section className="quotes-section" id="quotes" aria-label="Legal philosophy quotes">
            <div className="container">
              <div className="section-header">
                <span className="section-tag">Philosophy</span>
                <h2 className="section-title">Guided by Truth</h2>
              </div>

              <div className="quote-slider-container" role="region" aria-label="Legal quotes carousel" aria-live="polite">
                {QUOTES.map((q, idx) => (
                  <div
                    key={idx}
                    className={`quote-slide ${activeQuote === idx ? 'active' : ''}`}
                    style={{ display: activeQuote === idx ? 'block' : 'none' }}
                    role="blockquote"
                  >
                    <span className="quote-mark" aria-hidden="true">"</span>
                    <p className="quote-text">{q.text}</p>
                    <cite className="quote-author">— {q.author}</cite>
                  </div>
                ))}

                <div className="quote-controls" role="group" aria-label="Quote navigation">
                  <button className="quote-btn" onClick={handlePrevQuote} aria-label="Previous quote" id="prev-quote-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                  </button>
                  <div className="quote-dots">
                    {QUOTES.map((_, idx) => (
                      <button
                        key={idx}
                        className={`dot ${activeQuote === idx ? 'active' : ''}`}
                        onClick={() => { stopQuoteInterval(); setActiveQuote(idx); }}
                        aria-label={`Quote ${idx + 1}`}
                        aria-current={activeQuote === idx ? 'true' : 'false'}
                        id={`quote-dot-${idx}`}
                      />
                    ))}
                  </div>
                  <button className="quote-btn" onClick={handleNextQuote} aria-label="Next quote" id="next-quote-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ═══ POSTS / UPDATES SECTION ═══ */}
          <section className="posts-section" id="posts" aria-label="Insights and Updates" style={{ backgroundColor: 'var(--bg-secondary)', padding: '5rem 0' }}>
            <div className="container">
              <div className="section-header text-center">
                <span className="section-subtitle" style={{ color: 'var(--accent-color)', fontSize: '0.9rem', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase' }}>Insights & Updates</span>
                <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '1rem 0' }}><span className="serif-title">Firm</span> Perspectives</h2>
              </div>
              {posts.length === 0 ? (
                <p className="text-center text-muted" style={{ padding: '2rem 0' }}>Stay tuned for updates.</p>
              ) : (
                <div className="marquee-container" style={{ marginTop: '3rem' }}>
                  {[...posts, ...posts].map((post, idx) => (
                    <div key={`${post._id}-${idx}`} className="post-card review-card" style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', minWidth: '320px', transition: 'transform 0.3s ease, box-shadow 0.3s ease', display: 'flex', flexDirection: 'column' }}>
                      {post.image && (
                        <div className="post-image-wrapper" style={{ width: '100%', height: 'auto', maxHeight: '300px', display: 'flex', justifyContent: 'center', backgroundColor: 'var(--bg-secondary)' }}>
                          <img src={post.image} alt={post.title} style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'contain' }} />
                        </div>
                      )}
                      <div className="post-content" style={{ padding: '1.5rem', flexGrow: 1 }}>
                        <span className="post-date" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                          {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        <h3 className="post-title" style={{ fontSize: '1.25rem', marginBottom: '1rem', lineHeight: '1.4' }}>{post.title}</h3>
                        <p className="post-excerpt" style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{post.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ═══ CAREERS / FIRST GEN LAWYERS SECTION ═══ */}
          <section className="first-gen-section" id="careers" aria-label="First Generation Lawyers Connect">
            <div className="container">
              <div className="first-gen-grid">
                <div className="first-gen-info">
                  <span className="section-subtitle">Join The Team</span>
                  <h2><span className="serif-title">First-Gen</span><br />Lawyers Connect</h2>
                  <p className="first-gen-desc">
                    Are you a first-generation lawyer looking for mentorship, guidance, or an opportunity to work with us? We believe in nurturing raw talent and providing a platform for the next generation of legal minds.
                  </p>
                  <div className="first-gen-perks">
                    <div className="perk-item">
                      <div className="perk-icon">🎓</div>
                      <div className="perk-text">
                        <h4>Mentorship</h4>
                        <p>Learn directly from seasoned trial advocates.</p>
                      </div>
                    </div>
                    <div className="perk-item">
                      <div className="perk-icon">💼</div>
                      <div className="perk-text">
                        <h4>High-Stakes Exposure</h4>
                        <p>Work on complex constitutional and corporate matters.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="first-gen-form-container">
                  {!isCareerSuccess ? (
                    <div className="form-card">
                      <h3>Start Your Journey</h3>
                      <form onSubmit={handleCareerSubmit} noValidate className="modern-form">
                        <div className="form-group floating">
                          <input
                            type="text"
                            id="career-name"
                            name="name"
                            value={careerFormState.name}
                            onChange={handleCareerInputChange}
                            className={careerFormErrors.name ? 'error' : ''}
                            placeholder=" "
                            aria-required="true"
                          />
                          <label htmlFor="career-name">Full Name *</label>
                          {careerFormErrors.name && <span className="error-msg">Name is required</span>}
                        </div>

                        <div className="form-group floating">
                          <input
                            type="email"
                            id="career-email"
                            name="email"
                            value={careerFormState.email}
                            onChange={handleCareerInputChange}
                            className={careerFormErrors.email ? 'error' : ''}
                            placeholder=" "
                            aria-required="true"
                          />
                          <label htmlFor="career-email">Email Address *</label>
                          {careerFormErrors.email && <span className="error-msg">Valid email is required</span>}
                        </div>

                        <div className="form-row split">
                          <div className="form-group floating">
                            <input
                              type="tel"
                              id="career-phone"
                              name="phone"
                              value={careerFormState.phone}
                              onChange={handleCareerInputChange}
                              placeholder=" "
                            />
                            <label htmlFor="career-phone">Phone (Optional)</label>
                          </div>
                          <div className="form-group">
                            <select
                              id="career-interest"
                              name="interest"
                              value={careerFormState.interest}
                              onChange={handleCareerInputChange}
                              className={`modern-select ${careerFormErrors.interest ? 'error' : ''}`}
                              aria-required="true"
                            >
                              <option value="" disabled>Select Area of Interest *</option>
                              <option value="Litigation">Litigation & Trial</option>
                              <option value="Corporate">Corporate & Financial</option>
                              <option value="Research">Legal Research & Drafting</option>
                              <option value="Internship">Internship / Observation</option>
                            </select>
                            {careerFormErrors.interest && <span className="error-msg">Please select an area</span>}
                          </div>
                        </div>

                        <div className="form-group floating">
                          <textarea
                            id="career-message"
                            name="message"
                            value={careerFormState.message}
                            onChange={handleCareerInputChange}
                            rows="3"
                            placeholder=" "
                          ></textarea>
                          <label htmlFor="career-message">Your Background / Why connect?</label>
                        </div>

                        {careerServerError && (
                          <div className="form-server-error" role="alert">
                            ⚠️ {careerServerError}
                          </div>
                        )}
                        <button
                          type="submit"
                          className={`btn btn-primary btn-block ${isCareerSubmitting ? 'submitting' : ''}`}
                          disabled={isCareerSubmitting}
                        >
                          {isCareerSubmitting ? (
                            <span className="spinner-text">
                              <span className="btn-spinner" aria-hidden="true"></span>
                              Submitting...
                            </span>
                          ) : (
                            <span>🎓 Apply to Connect</span>
                          )}
                        </button>
                        <p className="form-note text-center">
                          Your details will be emailed directly to our team.
                        </p>
                      </form>
                    </div>
                  ) : (
                    <div className="form-success-state active">
                      <div className="success-icon-wrapper">
                        <svg className="success-checkmark" viewBox="0 0 52 52">
                          <circle className="success-checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                          <path className="success-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                        </svg>
                      </div>
                      <h3 className="success-title">Application Sent!</h3>
                      <p className="success-text">
                        We've received your request and will review your profile shortly. Keep an eye on your inbox!
                      </p>
                      <button className="btn btn-secondary" onClick={resetCareerForm}>Submit Another</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
          {/* ═══ CONTACT SECTION ═══ */}
          <section className="contact-section" id="contact" aria-label="Contact and consultation booking">
            <div className="container">
              <div className="contact-grid">

                {/* Info Panel */}
                <div className="contact-info-panel">
                  <span className="section-tag">Connect</span>
                  <h2 className="section-title">Initiate Consultation</h2>
                  <p className="contact-lead-text">
                    Fill out the secure intake form — your details will be sent directly to our WhatsApp. We respond within 2 business hours.
                  </p>

                  <div className="contact-meta-item">
                    <a href="tel:+919493456771" className="meta-link" aria-label="Call D Vijay Kiran at +91 94934 56771" id="phone-link-1">
                      <div className="meta-icon" aria-hidden="true">✆</div>
                      <div className="meta-details">
                        <h3>Direct Call</h3>
                        <p>+91 94934 56771</p>
                      </div>
                    </a>
                  </div>

                  <div className="contact-meta-item">
                    <a href="tel:+919618013964" className="meta-link" aria-label="Call alternate line at +91 96180 13964" id="phone-link-2">
                      <div className="meta-icon" aria-hidden="true">📞</div>
                      <div className="meta-details">
                        <h3>Alternate Line</h3>
                        <p>+91 96180 13964</p>
                      </div>
                    </a>
                  </div>

                  <div className="contact-meta-item">
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="meta-link"
                      aria-label="Chat on WhatsApp"
                      id="whatsapp-direct-link"
                    >
                      <div className="meta-icon" aria-hidden="true" style={{ fontSize: '1.4rem' }}>💬</div>
                      <div className="meta-details">
                        <h3>WhatsApp</h3>
                        <p>+91 76000 79980</p>
                      </div>
                    </a>
                  </div>

                  <div className="contact-meta-item">
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Near+Bharani+Apartment+Kondapur+Hyderabad+Telangana+500084"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="meta-link"
                      aria-label="View office location on Google Maps"
                      id="maps-link"
                    >
                      <div className="meta-icon" aria-hidden="true">📍</div>
                      <div className="meta-details">
                        <h3>Office Location</h3>
                        <address style={{ fontStyle: 'normal', fontSize: '0.9rem', lineHeight: '1.5' }}>
                          Near Bharani Apartment, 62–63,<br />
                          near Tata Zudio, Kondapur,<br />
                          Kothaguda, Hyderabad — 500084
                        </address>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Form Panel */}
                <div className="contact-form-panel">
                  {!isSuccess ? (
                    <div className="form-wrapper">
                      <form onSubmit={handleFormSubmit} noValidate aria-label="Consultation intake form">
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="client-name">Full Name <span aria-hidden="true">*</span></label>
                            <input
                              type="text"
                              id="client-name"
                              name="name"
                              value={formState.name}
                              onChange={handleInputChange}
                              className={formErrors.name ? 'invalid' : ''}
                              placeholder="Your full name"
                              autoComplete="name"
                              required
                              aria-required="true"
                              aria-invalid={formErrors.name}
                            />
                            {formErrors.name && <span className="error-msg" role="alert" style={{ display: 'block' }}>Name is required</span>}
                          </div>
                        </div>

                        <div className="form-row two-col">
                          <div className="form-group">
                            <label htmlFor="client-email">Email Address <span aria-hidden="true">*</span></label>
                            <input
                              type="email"
                              id="client-email"
                              name="email"
                              value={formState.email}
                              onChange={handleInputChange}
                              className={formErrors.email ? 'invalid' : ''}
                              placeholder="john@example.com"
                              autoComplete="email"
                              required
                              aria-required="true"
                              aria-invalid={formErrors.email}
                            />
                            {formErrors.email && <span className="error-msg" role="alert" style={{ display: 'block' }}>Valid email required</span>}
                          </div>
                          <div className="form-group">
                            <label htmlFor="client-phone">Phone Number</label>
                            <input
                              type="tel"
                              id="client-phone"
                              name="phone"
                              value={formState.phone}
                              onChange={handleInputChange}
                              placeholder="+91 98765 43210"
                              autoComplete="tel"
                              aria-label="Your phone number (optional)"
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="legal-domain">Practice Area <span aria-hidden="true">*</span></label>
                            <select
                              id="legal-domain"
                              name="domain"
                              value={formState.domain}
                              onChange={handleInputChange}
                              className={formErrors.domain ? 'invalid' : ''}
                              required
                              aria-required="true"
                              aria-invalid={formErrors.domain}
                            >
                              <option value="" disabled>Select a practice area...</option>
                              <option value="advocate">General Advocacy & Document Verification (D Vijay Kiran)</option>
                              <option value="criminal">Criminal Law (D Sai Kumar)</option>
                              <option value="corporate">Financial & Loan Settlements (Bhavana)</option>
                              <option value="family">Criminal, Civil & Mutual Divorce (Narasimha)</option>
                            </select>
                            {formErrors.domain && <span className="error-msg" role="alert" style={{ display: 'block' }}>Please select a domain</span>}
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="client-message">Brief Case Outline <span className="optional-tag">(Confidential)</span></label>
                            <textarea
                              id="client-message"
                              name="message"
                              value={formState.message}
                              onChange={handleInputChange}
                              rows="4"
                              placeholder="Briefly describe your legal matter..."
                              aria-label="Optional brief description of your case"
                            ></textarea>
                          </div>
                        </div>

                        {serverError && (
                          <div className="form-server-error" role="alert">
                            ⚠️ {serverError}
                          </div>
                        )}
                        <button
                          type="submit"
                          className={`btn btn-primary btn-block ${isSubmitting ? 'submitting' : ''}`}
                          disabled={isSubmitting}
                          id="submit-consultation-btn"
                        >
                          {isSubmitting ? (
                            <span className="spinner-text">
                              <span className="btn-spinner" aria-hidden="true"></span>
                              Submitting Consultation...
                            </span>
                          ) : (
                            <span>📤 Submit Request</span>
                          )}
                        </button>
                        <p className="form-note" aria-live="polite">
                          Your details will be emailed directly to our team at <strong>advocatesofhyderabad@gmail.com</strong>.
                        </p>
                      </form>
                    </div>
                  ) : (
                    <div className="form-success-state active" role="status" aria-live="assertive">
                      <div className="success-icon-wrapper">
                        <svg className="success-checkmark" viewBox="0 0 52 52" aria-hidden="true">
                          <circle className="success-checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                          <path className="success-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                        </svg>
                      </div>
                      {!whatsappFallbackUrl ? (
                        <>
                          <h3 className="success-title">Consultation Sent! ✅</h3>
                          <p className="success-text">
                            Your request has been successfully emailed to our legal team.<br />
                            We will review your case outline and reply to you shortly.
                          </p>
                        </>
                      ) : (
                        <>
                          <h3 className="success-title">Consultation Saved</h3>
                          <p className="success-text">
                            Your request was saved. Note: To complete auto-email delivery, please configure the <code>EMAIL_USER</code> and <code>EMAIL_PASS</code> in the server <code>.env</code>.
                          </p>
                          <p className="success-text" style={{ fontWeight: '500' }}>
                            In the meantime, you can send us the details directly on WhatsApp:
                          </p>
                          <a
                            href={whatsappFallbackUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-whatsapp"
                            style={{ marginBottom: '16px', display: 'inline-flex', gap: '8px', alignItems: 'center' }}
                          >
                            💬 Send details via WhatsApp
                          </a>
                        </>
                      )}
                      <p className="success-reference">
                        Confirmation Code: <strong>{confirmationCode}</strong>
                      </p>
                      <button className="btn btn-secondary" onClick={resetForm} id="submit-another-btn">Submit Another Request</button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </section>
        </>
      )}

      {currentView === 'admin' && (
        <AdminPortal token={adminToken} setToken={setAdminToken} onExit={() => setCurrentView('home')} fetchPublicPosts={fetchPosts} />
      )}

      {/* ═══ FOOTER ═══ */}
      <footer className="site-footer" role="contentinfo">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <span className="footer-logo">
                <LogoIcon size={24} />
                <span style={{ marginLeft: '8px', verticalAlign: 'middle' }}>ADVOCATES OF HYDERABAD</span>
              </span>
              <p className="footer-desc">Not Just A Lawyer, Your Legal Shield.</p>
              <p className="footer-desc" style={{ marginTop: '8px' }}>
                Kondapur, Hyderabad — Telangana 500084<br />
                <a href="tel:+919493456771" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>+91 94934 56771</a>
              </p>
            </div>
            <div className="footer-links-group">
              <h4>Practice Areas</h4>
              <ul>
                <li><a href="#team" onClick={(e) => handleNavClick(e, '#team')}>General Advocacy</a></li>
                <li><a href="#team" onClick={(e) => handleNavClick(e, '#team')}>Criminal &amp; Criminology</a></li>
                <li><a href="#team" onClick={(e) => handleNavClick(e, '#team')}>Financial Legal Team</a></li>
                <li><a href="#team" onClick={(e) => handleNavClick(e, '#team')}>Civil &amp; Divorce</a></li>
              </ul>
            </div>
            <div className="footer-links-group">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#about" onClick={(e) => handleNavClick(e, '#about')}>About Us</a></li>
                <li><a href="#quotes" onClick={(e) => handleNavClick(e, '#quotes')}>Philosophy</a></li>
                <li><a href="#contact" onClick={(e) => handleNavClick(e, '#contact')}>Book Consultation</a></li>
                <li><a href="#careers" onClick={(e) => handleNavClick(e, '#careers')}>First-Gen Connect</a></li>
                <li>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Near+Bharani+Apartment+Kondapur+Hyderabad+Telangana+500084"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Directions
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <hr className="footer-divider" />
          <div className="footer-bottom">
            <p>© 2026 Advocates of Hyderabad. All rights reserved. Attorney Advertising.</p>
            <p style={{ fontSize: '0.75rem', marginTop: '4px', opacity: 0.6 }}>
              Results may vary. Prior outcomes do not guarantee future results.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
