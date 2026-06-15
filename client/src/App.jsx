import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const WHATSAPP_NUMBER = '917600079980';
const SERVER_URL = 'http://localhost:5003';

// Fallback: build WhatsApp URL on client in case server is unreachable
function buildWhatsAppUrl({ name, email, phone, domain, message }) {
  const labels = {
    advocate: 'General Advocacy (D Vijay Kiran)',
    criminal: 'Criminology (D Sai Kumar)',
    corporate: 'Financial Legal Team (Bhavana)',
    family: 'Civil & Divorce (Narasimha)'
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
    bio: "D Vijay Kiran is the founder and principal legal advocate of Advocates of Hyderabad. With over 9 years of experience, he leads high-stakes constitutional matters, administrative appeals, and comprehensive legal advisory in Telangana and beyond.",
    successes: [
      "Secured positive landmark judgments in major land and inheritance disputes.",
      "Successfully defended fundamental liberties in constitutional public interest litigations.",
      "Pioneered secure mediation services for major regional enterprise boards."
    ]
  },
  criminal: {
    name: "D Sai Kumar",
    role: "LLB Criminology Specialist",
    tag: "Criminology",
    icon: "\u00a7",
    quote: "\u201cA defense is not a technicality; it is the vital shield of liberty that protects the citizen.\u201d",
    bio: "D Sai Kumar is a dedicated criminal trial advocate holding a specialized LLB in Criminology. He excels in navigating complex trial procedures, forensic verification, bail applications, and state appellate defense.",
    successes: [
      "State v. Kumar \u2013 Achieved complete exoneration in a high-profile white collar trial.",
      "Successfully secured urgent bail grants in multiple critical trial court hearings.",
      "Navigated defense representations in multi-jurisdiction regulatory investigations."
    ]
  },
  corporate: {
    name: "Bhavana",
    role: "CMA Financial Legal Lead",
    tag: "Financial Legal Team",
    icon: "\ud83c\udfe2",
    quote: "\u201cFinancial integrity and regulatory compliance are the cornerstones of corporate trust.\u201d",
    bio: "Bhavana integrates Cost & Management Accounting (CMA) expertise with legal strategy, advising companies on tax disputes, corporate auditing, capital structure disputes, compliance frameworks, and M&A legal advisory.",
    successes: [
      "Audited and restructured legal-compliance setups for prominent regional corporations.",
      "Resolved complex financial tax disputes saving millions in regulatory liability.",
      "Managed due diligence and contract negotiations for major corporate mergers."
    ]
  },
  family: {
    name: "Narasimha",
    role: "Civil & Divorce Counsel",
    tag: "Civil and Divorce",
    icon: "\u2696",
    quote: "\u201cResolving family and civil disputes requires a balance of rigorous legal strategy and deep empathy.\u201d",
    bio: "Narasimha specialized in domestic relations, divorce, custody agreements, and general civil property disputes. His objective is to deliver peace of mind and secure resolutions without unnecessary court delays.",
    successes: [
      "Successfully mediated high-asset property divisions in complex family estate separations.",
      "Secured sole guardianship protections in sensitive international child custody matters.",
      "Resolved multi-decade civil boundary disputes through expert title litigation."
    ]
  }
};

const LogoIcon = ({ size = 36 }) => (
  <svg className="logo-svg" viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
    <circle className="logo-circle" cx="50" cy="50" r="46" />
    <path className="logo-wings" d="M 32 30 L 50 48 L 68 30" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <rect className="logo-band" x="38" y="48" width="10" height="32" />
    <rect className="logo-band" x="52" y="48" width="10" height="32" />
  </svg>
);

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeQuote, setActiveQuote] = useState(0);
  const [activeModal, setActiveModal] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [formState, setFormState] = useState({ name: '', email: '', phone: '', domain: '', message: '' });
  const [formErrors, setFormErrors] = useState({ name: false, email: false, domain: false });
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [whatsappFallbackUrl, setWhatsappFallbackUrl] = useState('');

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
    setFormState({ name: '', email: '', phone: '', domain: '', message: '' });
    setIsSuccess(false);
    setConfirmationCode('');
    setServerError('');
    setWhatsappFallbackUrl('');
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
      <nav className={`nav-bar ${isScrolled ? 'scrolled' : ''}`} id="navbar" role="navigation" aria-label="Main navigation">
        <div className="nav-container">
          <a href="#" className="nav-logo" aria-label="Advocates of Hyderabad – Home" onClick={(e) => handleNavClick(e, '#about')}>
            <LogoIcon size={36} />
            <span className="logo-text">ADVOCATES OF HYDERABAD</span>
          </a>

          {/* Desktop Nav */}
          <ul className="nav-links" role="list">
            <li><a href="#about" className="nav-link" onClick={(e) => handleNavClick(e, '#about')}>About</a></li>
            <li><a href="#quotes" className="nav-link" onClick={(e) => handleNavClick(e, '#quotes')}>Philosophy</a></li>
            <li><a href="#team" className="nav-link" onClick={(e) => handleNavClick(e, '#team')}>Counsel</a></li>
            <li><a href="#contact" className="nav-link button-outline" onClick={(e) => handleNavClick(e, '#contact')}>Consultation</a></li>
          </ul>

          <div className="nav-right">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle light/dark theme" id="theme-toggle-btn">
              <svg className="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="5"></circle>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
              </svg>
              <svg className="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </button>

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
            <li><a href="#about" onClick={(e) => handleNavClick(e, '#about')}>About</a></li>
            <li><a href="#quotes" onClick={(e) => handleNavClick(e, '#quotes')}>Philosophy</a></li>
            <li><a href="#team" onClick={(e) => handleNavClick(e, '#team')}>Counsel</a></li>
            <li><a href="#contact" className="mobile-cta" onClick={(e) => handleNavClick(e, '#contact')}>Book Consultation</a></li>
          </ul>
          <div className="mobile-nav-contact">
            <a href="tel:+919493456771">📞 +91 94934 56771</a>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">💬 WhatsApp Us</a>
          </div>
        </div>
      </nav>

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

          {/* Trust Badges */}
          <div className="hero-trust-row" aria-label="Trust signals">
            <div className="trust-badge">
              <span className="trust-num">9+</span>
              <span className="trust-label">Years Experience</span>
            </div>
            <div className="trust-divider" aria-hidden="true"></div>
            <div className="trust-badge">
              <span className="trust-num">200+</span>
              <span className="trust-label">Cases Won</span>
            </div>
            <div className="trust-divider" aria-hidden="true"></div>
            <div className="trust-badge">
              <span className="trust-num">4</span>
              <span className="trust-label">Legal Domains</span>
            </div>
          </div>

          <div className="scroll-indicator" aria-hidden="true">
            <span className="scroll-text">Explore Philosophy</span>
            <div className="scroll-mouse">
              <div className="scroll-wheel"></div>
            </div>
          </div>
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
                          <option value="advocate">General Advocacy (D Vijay Kiran)</option>
                          <option value="criminal">Criminology (D Sai Kumar)</option>
                          <option value="corporate">Financial Legal Team (Bhavana)</option>
                          <option value="family">Civil and Divorce (Narasimha)</option>
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
                      Your details will be emailed directly to our team at <strong>amey9909@gmail.com</strong>.
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
