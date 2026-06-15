// --- Theme Toggler ---
const themeToggleBtn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'dark';

document.documentElement.setAttribute('data-theme', currentTheme);

themeToggleBtn.addEventListener('click', () => {
  let theme = document.documentElement.getAttribute('data-theme');
  let newTheme = theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

// --- Dynamic Navigation Bar Scroll Effect ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// --- Quotes Data & Slider ---
const quotes = [
  {
    text: "Justice is truth in action. It is the core anchor upon which civilization rests, demanding courage, precision, and relentless advocacy.",
    author: "Benjamin Disraeli"
  },
  {
    text: "The law is not a monument of the past; it is a living shield for the present and a pathfinder for our shared future.",
    author: "Earl Warren"
  },
  {
    text: "In justice, the ultimate victory belongs to the side that upholds truth with the greatest integrity and resilience.",
    author: "Solon of Athens"
  },
  {
    text: "To no one will we sell, to no one deny or delay right or justice. The law must remain our absolute safeguard.",
    author: "Magna Carta"
  }
];

let activeQuoteIndex = 0;
const quoteTextElem = document.getElementById('quote-text');
const quoteAuthorElem = document.getElementById('quote-author');
const prevQuoteBtn = document.getElementById('prev-quote');
const nextQuoteBtn = document.getElementById('next-quote');
const dotElems = document.querySelectorAll('#quote-dots .dot');
const quoteSlide = document.getElementById('quote-slide');

function displayQuote(index) {
  // Fade out
  quoteSlide.classList.remove('active');
  
  setTimeout(() => {
    activeQuoteIndex = index;
    quoteTextElem.textContent = quotes[activeQuoteIndex].text;
    quoteAuthorElem.textContent = `— ${quotes[activeQuoteIndex].author}`;
    
    // Update dots
    dotElems.forEach((dot, idx) => {
      if (idx === activeQuoteIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Fade in
    quoteSlide.classList.add('active');
  }, 350);
}

prevQuoteBtn.addEventListener('click', () => {
  let prevIndex = activeQuoteIndex - 1;
  if (prevIndex < 0) prevIndex = quotes.length - 1;
  displayQuote(prevIndex);
});

nextQuoteBtn.addEventListener('click', () => {
  let nextIndex = activeQuoteIndex + 1;
  if (nextIndex >= quotes.length) nextIndex = 0;
  displayQuote(nextIndex);
});

dotElems.forEach((dot) => {
  dot.addEventListener('click', (e) => {
    const targetIdx = parseInt(e.target.getAttribute('data-index'));
    displayQuote(targetIdx);
  });
});

// Auto rotate quotes every 8 seconds
let quoteInterval = setInterval(() => {
  let nextIndex = activeQuoteIndex + 1;
  if (nextIndex >= quotes.length) nextIndex = 0;
  displayQuote(nextIndex);
}, 8000);

// Stop auto rotation on manual interaction
[prevQuoteBtn, nextQuoteBtn, ...dotElems].forEach(btn => {
  btn.addEventListener('click', () => {
    clearInterval(quoteInterval);
  });
});

// --- Lawyer Details Modal System ---
const lawyerData = {
  advocate: {
    name: "D Vijay Kiran",
    role: "Senior Legal Advocate",
    tag: "Senior Advocate",
    icon: `<svg class="logo-svg" viewBox="0 0 100 100" width="80" height="80">
            <circle class="logo-circle" cx="50" cy="50" r="46" />
            <path class="logo-wings" d="M 32 30 L 50 48 L 68 30" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            <rect class="logo-band" x="38" y="48" width="10" height="32" />
            <rect class="logo-band" x="52" y="48" width="10" height="32" />
          </svg>`,
    quote: "“Not Just A Lawyer, Your Legal Shield.”",
    bio: "D Vijay Kiran is the founder and principal legal advocate of Advocates of Hyderabad. With over 24 years of experience, he leads high-stakes constitutional matters, administrative appeals, and comprehensive legal advisory in Telangana and beyond.",
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
    icon: "§",
    quote: "“A defense is not a technicality; it is the vital shield of liberty that protects the citizen.”",
    bio: "D Sai Kumar is a dedicated criminal trial advocate holding a specialized LLB in Criminology. He excels in navigating complex trial procedures, forensic verification, bail applications, and state appellate defense.",
    successes: [
      "State v. Kumar - Achieved complete exoneration in a high-profile white collar trial.",
      "Successfully secured urgent bail grants in multiple critical trial court hearings.",
      "Navigated defense representations in multi-jurisdiction regulatory investigations."
    ]
  },
  corporate: {
    name: "Bhavana",
    role: "CMA Financial Legal Lead",
    tag: "Financial Legal Team",
    icon: "🏢",
    quote: "“Financial integrity and regulatory compliance are the cornerstones of corporate trust.”",
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
    icon: "⚖",
    quote: "“Resolving family and civil disputes requires a balance of rigorous legal strategy and deep empathy.”",
    bio: "Narasimha specialized in domestic relations, divorce, custody agreements, and general civil property disputes. His objective is to deliver peace of mind and secure resolutions without unnecessary court delays.",
    successes: [
      "Successfully mediated high-asset property divisions in complex family estate separations.",
      "Secured sole guardianship protections in sensitive international child custody matters.",
      "Resolved multi-decade civil boundary disputes through expert title litigation."
    ]
  }
};

const modalOverlay = document.getElementById('lawyer-modal');
const modalClose = document.getElementById('modal-close');
const modalLawyerName = document.getElementById('modal-lawyer-name');
const modalLawyerRole = document.getElementById('modal-lawyer-role');
const modalLawyerTag = document.getElementById('modal-lawyer-tag');
const modalLawyerIcon = document.getElementById('modal-lawyer-icon');
const modalLawyerBioQuote = document.getElementById('modal-lawyer-bio-quote');
const modalLawyerBio = document.getElementById('modal-lawyer-bio');
const modalLawyerSuccess = document.getElementById('modal-lawyer-success');
const modalBookBtn = document.getElementById('modal-book-btn');

function openLawyerModal(domain) {
  const data = lawyerData[domain];
  if (!data) return;

  modalLawyerName.textContent = data.name;
  modalLawyerRole.textContent = data.role;
  modalLawyerTag.textContent = data.tag;
  modalLawyerIcon.innerHTML = data.icon;
  modalLawyerBioQuote.textContent = data.quote;
  modalLawyerBio.textContent = data.bio;
  
  // Populate successes list
  modalLawyerSuccess.innerHTML = '';
  data.successes.forEach(success => {
    const li = document.createElement('li');
    li.textContent = success;
    modalLawyerSuccess.appendChild(li);
  });

  // Prefill the form selection with the clicked domain
  document.getElementById('legal-domain').value = domain;

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden'; // Stop page scrolling
}

function closeLawyerModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = ''; // Resume page scrolling
}

// Attach event listeners to lawyer cards
document.querySelectorAll('.lawyer-card').forEach(card => {
  card.addEventListener('click', (e) => {
    // Avoid double triggering if card button was target
    const domain = card.getAttribute('data-domain');
    openLawyerModal(domain);
  });
});

modalClose.addEventListener('click', closeLawyerModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    closeLawyerModal();
  }
});

// Book btn on modal closes the modal and scrolls to contact
modalBookBtn.addEventListener('click', () => {
  closeLawyerModal();
  setTimeout(() => {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  }, 300);
});


// --- Interactive Contact Form ---
const form = document.getElementById('consultation-form');
const formContainer = document.getElementById('form-container');
const successState = document.getElementById('success-state');
const resetFormBtn = document.getElementById('reset-form-btn');
const confirmationCodeElem = document.getElementById('confirmation-code');

const clientNameInput = document.getElementById('client-name');
const clientEmailInput = document.getElementById('client-email');
const legalDomainSelect = document.getElementById('legal-domain');

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function handleFormSubmit(e) {
  e.preventDefault();
  
  let isValid = true;

  // Validate Name
  if (!clientNameInput.value.trim()) {
    clientNameInput.classList.add('invalid');
    isValid = false;
  } else {
    clientNameInput.classList.remove('invalid');
  }

  // Validate Email
  if (!validateEmail(clientEmailInput.value)) {
    clientEmailInput.classList.add('invalid');
    isValid = false;
  } else {
    clientEmailInput.classList.remove('invalid');
  }

  // Validate Practice Area Selection
  if (!legalDomainSelect.value) {
    legalDomainSelect.classList.add('invalid');
    isValid = false;
  } else {
    legalDomainSelect.classList.remove('invalid');
  }

  if (isValid) {
    // Generate validation code
    const randCode = 'VP-' + Math.floor(1000 + Math.random() * 9000);
    confirmationCodeElem.textContent = randCode;

    // Transition elements
    formContainer.style.display = 'none';
    successState.style.display = 'flex';
  }
}

form.addEventListener('submit', handleFormSubmit);

// Input change events to clear error class on the fly
[clientNameInput, clientEmailInput, legalDomainSelect].forEach(input => {
  input.addEventListener('input', () => {
    if (input.value.trim()) {
      input.classList.remove('invalid');
    }
  });
});

resetFormBtn.addEventListener('click', () => {
  form.reset();
  successState.style.display = 'none';
  formContainer.style.display = 'block';
});
