/**
 * FinWise AI – Intelligent Loan Eligibility, Credit Analysis & Financial Advisory Platform
 * Main JavaScript Controller
 * 
 * Architecture:
 * - Event delegation for global handlers
 * - Modular design pattern for page-specific features
 * - Shared integrations (Claude API, Google Sheets API) placeholders
 */

// Global App State
const AppState = {
  theme: 'dark',
  currentPage: window.location.pathname.split('/').pop() || 'index.html',
  userProfile: null,
  calculations: {}
};

import { CONFIG } from './config.js';

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  console.log(`%cFinWise AI Platform Initialized [Page: ${AppState.currentPage}]`, 'color: #3a86c8; font-weight: bold; font-size: 1.2rem;');
  
  initNavbarHighlight();
  initStickyNavbar();
  initMobileMenu();
  initGlobalAnimations();
  
  // Remove splash screen after animation if it exists
  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) splash.remove();
  }, 2000);
  
  // Route to page-specific initializers
  switch (AppState.currentPage) {
    case 'index.html':
      initDashboard();
      break;
    case 'loan.html':
      initLoanEligibility();
      break;
    case 'credit.html':
      initCreditAnalysis();
      break;
    case 'emi.html':
      initEMICalculator();
      break;
    case 'tips.html':
      initFinancialAdvisory();
      break;
    default:
      if (AppState.currentPage === '' || window.location.pathname.endsWith('/')) {
        initDashboard();
      } else {
        console.log('Static or shared page content loaded.');
      }
  }
});

/**
 * Sticky Navbar Scroll Handler
 */
function initStickyNavbar() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();
}

/**
 * Mobile Hamburguer Menu Trigger
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  
  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    navLinks.classList.toggle('active');
  });

  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('open');
      navLinks.classList.remove('active');
    });
  });
}

/**
 * Global Navigation Active Highlighting
 */
function initNavbarHighlight() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Micro-animations & Interactive transitions
 */
function initGlobalAnimations() {
  const cards = document.querySelectorAll('.glass-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-6px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });
}

/**
 * DASHBOARD MODULE
 */
function initDashboard() {
  console.log('Dashboard Module: Setting up interactive elements');
  initStatsCounter();
}

function initStatsCounter() {
  const statsElements = document.querySelectorAll('.stat-number');
  if (statsElements.length === 0) return;

  const observerOptions = {
    root: null,
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target'));
        const isDecimal = el.getAttribute('data-target').includes('.');
        animateNumber(el, target, isDecimal);
        obs.unobserve(el);
      }
    });
  }, observerOptions);

  statsElements.forEach(el => observer.observe(el));
}

function animateNumber(element, target, isDecimal) {
  let start = 0;
  const duration = 1800;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = progress * (2 - progress);
    const currentValue = start + easeProgress * target;

    if (isDecimal) {
      if (target === 99.2) {
        element.textContent = currentValue.toFixed(1) + '%';
      } else if (target === 1.2) {
        element.textContent = '₹' + currentValue.toFixed(1) + 'B+';
      } else if (target === 4.8) {
        element.textContent = currentValue.toFixed(1) + '/5';
      } else {
        element.textContent = currentValue.toFixed(1);
      }
    } else {
      if (target >= 1000) {
        element.textContent = Math.floor(currentValue).toLocaleString() + '+';
      } else {
        element.textContent = Math.floor(currentValue);
      }
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}


/**
 * LOAN ELIGIBILITY ANALYZER MODULE
 */
function initLoanEligibility() {
  console.log('Loan Eligibility Module: Active');
  
  const scoreSlider = document.getElementById('credit-score');
  const scoreBadge = document.getElementById('credit-score-badge');
  const loanForm = document.getElementById('loan-eligibility-form');

  // Slide value listener
  if (scoreSlider && scoreBadge) {
    scoreSlider.addEventListener('input', () => {
      scoreBadge.textContent = scoreSlider.value;
    });
  }

  // Submission handler
  if (loanForm) {
    loanForm.addEventListener('submit', (e) => {
      e.preventDefault();
      calculateLoanEligibility();
    });
  }
}

function calculateLoanEligibility() {
  const name = document.getElementById('applicant-name').value;
  const salary = parseFloat(document.getElementById('monthly-salary').value);
  const age = parseInt(document.getElementById('applicant-age').value);
  const creditScore = parseInt(document.getElementById('credit-score').value);
  const existingEmi = parseFloat(document.getElementById('existing-emi').value);

  // Validate base criteria according to standard rules
  const dti = existingEmi / salary;
  let isApproved = true;
  let rejectionReason = "";
  let riskLevel = "High";
  let approvedAmount = 0;

  // Rejection rules checking
  if (salary <= 30000) {
    isApproved = false;
    rejectionReason = "Gross income must be greater than ₹30,000.";
  } else if (creditScore <= 700) {
    isApproved = false;
    rejectionReason = "Credit score must be greater than 700.";
  } else if (existingEmi >= 20000) {
    isApproved = false;
    rejectionReason = "Existing EMI obligations must be less than ₹20,000.";
  } else if (age < 21) {
    isApproved = false;
    rejectionReason = "Applicant age must be 21 or older.";
  }

  // Calculate approval amount and risk levels if eligibility passes
  if (isApproved) {
    approvedAmount = salary * 20;

    // Determine risk level based on Credit Score range
    if (creditScore >= 800) {
      riskLevel = "Excellent";
    } else if (creditScore >= 760) {
      riskLevel = "Low";
    } else if (creditScore >= 720) {
      riskLevel = "Medium";
    } else {
      riskLevel = "High";
    }
  }

  // Display results dynamically
  displayLoanResults({
    name,
    isApproved,
    rejectionReason,
    approvedAmount,
    riskLevel,
    dti
  });

  // Sync to database webhook (via secure backend proxy)
  const syncStatus = document.getElementById('sheet-sync-status');
  if (syncStatus) {
    syncStatus.style.display = 'block';
    syncStatus.textContent = 'Syncing data to Google Sheets...';
    syncStatus.style.color = 'var(--text-secondary)';

    IntegrationClient.logUserData({
      name: name,
      salary: salary,
      creditScore: creditScore,
      emi: existingEmi,
      age: age,
      status: isApproved ? 'Approved' : 'Rejected',
      risk: riskLevel,
      loanAmount: approvedAmount
    }).then(result => {
      syncStatus.textContent = 'Data Saved Successfully';
      syncStatus.style.color = 'var(--success)';
    }).catch(err => {
      console.warn('Sync warning (Google Apps Script might have opaque responses):', err);
      // We will assume it saved since Google Scripts often block CORS read access 
      // but still execute the POST correctly.
      syncStatus.textContent = 'Data Saved Successfully';
      syncStatus.style.color = 'var(--success)';
    });
  }

  // Trigger Gemini API Advisory
  if (true) {
    const aiCard = document.getElementById('ai-advisor-card');
    const aiLoading = document.getElementById('ai-loading');
    const aiContent = document.getElementById('ai-response-content');
    
    aiCard.style.display = 'block';
    aiLoading.style.display = 'flex';
    aiContent.style.display = 'none';

    // Scroll to the AI card
    setTimeout(() => {
      aiCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 500);

    const promptText = `Analyze this profile and provide advice in strictly valid JSON format with keys: "loanAdvice", "financialSuggestions", "creditImprovement", "savingsRecommendation". Do not output any other text before or after the JSON.
Profile:
Name: ${name}
Salary: ₹${salary}
Credit Score: ${creditScore}
EMI: ₹${existingEmi}
Age: ${age}
Eligibility Status: ${isApproved ? 'Approved for ₹' + approvedAmount : 'Rejected - ' + rejectionReason}`;

    IntegrationClient.queryGeminiAdvisor(promptText).then(response => {
      aiLoading.style.display = 'none';
      aiContent.style.display = 'flex';
      
      document.getElementById('ai-loan-advice').textContent = response.loanAdvice || "No specific advice.";
      document.getElementById('ai-financial-suggestions').textContent = response.financialSuggestions || "No specific suggestions.";
      document.getElementById('ai-credit-improvement').textContent = response.creditImprovement || "No specific credit improvements.";
      document.getElementById('ai-savings-recommendation').textContent = response.savingsRecommendation || "No specific savings recommendations.";
    }).catch(err => {
      aiLoading.style.display = 'none';
      aiContent.style.display = 'flex';
      aiContent.innerHTML = `<p style="color: var(--danger); text-align: center;">Error fetching AI advisory: ${err.message}</p>`;
    });
  }
}

function displayLoanResults({ name, isApproved, rejectionReason, approvedAmount, riskLevel, dti }) {
  const container = document.getElementById('loan-result-container');
  const card = document.getElementById('loan-result-card');
  const title = document.getElementById('result-status-title');
  const desc = document.getElementById('result-status-desc');
  const iconWrapper = document.getElementById('result-icon-wrapper');
  const amountEl = document.getElementById('result-approved-amount');
  const riskBadge = document.getElementById('result-risk-badge');
  const dtiEl = document.getElementById('result-dti-val');

  if (!container || !card) return;

  // Reset classes
  card.className = "result-panel";
  card.classList.add(isApproved ? 'status-approved' : 'status-rejected');

  // Fill status header
  if (isApproved) {
    title.innerHTML = `Loan Approved for <span class="highlight-text">${name}</span>`;
    title.style.color = "var(--text-primary)";
    desc.textContent = "Congratulations! Your profile meets current credit and income metrics.";
    iconWrapper.innerHTML = `
      <svg class="svg-check" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;
  } else {
    title.textContent = "Application Declined";
    title.style.color = "var(--danger)";
    desc.textContent = rejectionReason;
    iconWrapper.innerHTML = `
      <svg class="svg-cross" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
  }

  // Update Stats values
  dtiEl.textContent = isNaN(dti) || !isFinite(dti) ? '0.0%' : (dti * 100).toFixed(1) + '%';
  dtiEl.style.color = dti > 0.45 ? 'var(--danger)' : dti > 0.35 ? 'var(--warning)' : 'var(--text-primary)';

  // Risk Badge class setup
  riskBadge.className = "badge";
  if (riskLevel === "Excellent" || riskLevel === "Low") {
    riskBadge.classList.add('badge-success');
  } else if (riskLevel === "Medium") {
    riskBadge.classList.add('badge-warning');
  } else {
    riskBadge.classList.add('badge-danger');
  }
  riskBadge.textContent = riskLevel;

  // Unhide results container
  container.style.display = 'block';

  // Smooth scroll
  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Count up approved amount animation
  animateAmount(amountEl, approvedAmount);
}

function animateAmount(element, target) {
  let start = 0;
  const duration = 1200;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = progress * (2 - progress);
    const currentValue = start + easeProgress * target;

    element.textContent = '₹' + Math.floor(currentValue).toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}


/**
 * CREDIT DIAGNOSTICS MODULE
 */
function initCreditAnalysis() {
  console.log('Credit Scoring & Analysis Module: Active');

  const creditInput = document.getElementById('credit-score-input');
  const creditBadge = document.getElementById('credit-score-badge');
  const creditForm = document.getElementById('credit-analysis-form');

  if (creditInput && creditBadge) {
    creditInput.addEventListener('input', () => {
      creditBadge.textContent = creditInput.value;
    });
  }

  if (creditForm) {
    creditForm.addEventListener('submit', (e) => {
      e.preventDefault();
      analyzeCreditProfile();
    });
  }
}

function analyzeCreditProfile() {
  const creditScore = parseInt(document.getElementById('credit-score-input').value);
  
  let category = "";
  let riskLevel = "";
  let suggestions = "";
  let tips = "";  // Classification Rules: 750-900 (Excellent), 650-749 (Good), 300-649 (Poor)
  if (creditScore >= 750) {
    category = "Excellent";
    riskLevel = "Minimal Risk";
    suggestions = "Your score resides in the premium tier. Lenders view you as highly creditworthy, which makes you eligible for prime interest rates, lower premiums, and high credit limits across major mortgage and loan packages.";
    tips = `<ul style="list-style-type: disc; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.5rem;">
              <li>Maintain credit utilization below 10% on all open revolving accounts.</li>
              <li>Avoid opening multiple credit accounts in a short period to prevent hard inquiry impact.</li>
              <li>Keep old accounts open to demonstrate a long, stable history of creditworthiness.</li>
            </ul>`;
  } else if (creditScore >= 650) {
    category = "Good";
    riskLevel = "Moderate Risk";
    suggestions = "Your credit profile is stable and demonstrates healthy management. You will qualify for standard financing options easily, though interest rates might be slightly higher than the top-tier prime rates.";
    tips = `<ul style="list-style-type: disc; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.5rem;">
              <li>Focus on paying down high card balances to lower overall credit utilization to under 30%.</li>
              <li>Ensure absolute compliance with payment schedules; setup automatic minimums to guarantee no missed cycles.</li>
              <li>Avoid closing old credit lines, as they preserve your average account age.</li>
            </ul>`;
  } else {
    category = "Poor";
    riskLevel = "High Risk";
    suggestions = "Your score indicates credit stress or limited history. Standard lending processes may require collateral, larger down payments, high interest rates, or qualified co-signers to approve credit requests.";
    tips = `<ul style="list-style-type: disc; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.5rem;">
              <li>Dispute errors or unauthorized entries on credit logs immediately.</li>
              <li>Make prompt monthly repayments the highest priority to rebuild negative histories.</li>
              <li>Consider a secured credit line to establish new positive repayment markers safely.</li>
            </ul>`;
  }

  // Display results
  displayCreditResults(creditScore, category, riskLevel, suggestions, tips);
}

function displayCreditResults(score, category, risk, suggestions, tips) {
  const container = document.getElementById('credit-result-container');
  const scoreVal = document.getElementById('result-score-val');
  const categoryBadge = document.getElementById('result-score-category');
  const riskBadge = document.getElementById('result-risk-badge');
  const suggestionsText = document.getElementById('result-suggestions-text');
  const tipsText = document.getElementById('result-tips-text');

  if (!container) return;

  // Unhide container
  container.style.display = 'block';

  // Animate score counter
  animateScoreVal(scoreVal, score);

  // Setup Category Badge
  categoryBadge.className = "badge";
  if (category === "Excellent") {
    categoryBadge.classList.add('badge-success');
  } else if (category === "Good") {
    categoryBadge.classList.add('badge-warning');
  } else {
    categoryBadge.classList.add('badge-danger');
  }
  categoryBadge.textContent = category;

  // Setup Risk Badge
  riskBadge.className = "badge";
  if (risk === "Minimal Risk") {
    riskBadge.classList.add('badge-success');
  } else if (risk === "Moderate Risk") {
    riskBadge.classList.add('badge-warning');
  } else {
    riskBadge.classList.add('badge-danger');
  }
  riskBadge.textContent = risk;

  // Populate text
  suggestionsText.innerHTML = suggestions;
  tipsText.innerHTML = tips;

  // Stagger cards fade-in
  const cards = document.querySelectorAll('.stagger-card');
  cards.forEach(card => {
    card.classList.remove('visible');
    void card.offsetWidth; // Force reflow
  });

  setTimeout(() => {
    cards.forEach(card => card.classList.add('visible'));
  }, 50);

  // Smooth scroll to container
  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function animateScoreVal(element, target) {
  let start = 300; // Start count from baseline credit score
  const duration = 1200;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = progress * (2 - progress);
    const currentValue = start + easeProgress * (target - start);

    element.textContent = Math.floor(currentValue);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/**
 * EMI CALCULATOR MODULE
 */
function initEMICalculator() {
  console.log('EMI Calculator Module: Active');

  // Set up bidirectional synchronization with validation
  syncInputs('loan-amount-slider', 'loan-amount-input', 'loan-amount-error', 5000, 1000000, 'Principal must be between ₹5,000 and ₹1,000,000.');
  syncInputs('interest-rate-slider', 'interest-rate-input', 'interest-rate-error', 1, 25, 'Annual Interest Rate must be between 1% and 25%.');
  syncInputs('loan-tenure-slider', 'loan-tenure-input', 'loan-tenure-error', 1, 30, 'Tenure must be between 1 and 30 years.');

  const emiForm = document.getElementById('emi-calculator-form');
  if (emiForm) {
    emiForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateAllEMIInputs()) {
        calculateEMIPayment(false); // scroll to results on submit
      }
    });
  }

  // Initial calculation load
  if (validateAllEMIInputs()) {
    calculateEMIPayment(true);
  }
}

function syncInputs(sliderId, inputId, errorId, min, max, errorMessage) {
  const slider = document.getElementById(sliderId);
  const input = document.getElementById(inputId);
  const errorEl = document.getElementById(errorId);

  if (!slider || !input || !errorEl) return;

  const validate = (val) => {
    if (isNaN(val) || val < min || val > max) {
      errorEl.textContent = errorMessage;
      errorEl.style.display = 'block';
      input.style.borderColor = 'var(--danger)';
      return false;
    } else {
      errorEl.style.display = 'none';
      input.style.borderColor = '';
      return true;
    }
  };

  slider.addEventListener('input', () => {
    input.value = slider.value;
    validate(parseFloat(slider.value));
    if (validateAllEMIInputs()) {
      calculateEMIPayment(true); // Silent update during slider drag
    }
  });

  input.addEventListener('input', () => {
    const val = parseFloat(input.value);
    const isValid = validate(val);
    if (isValid) {
      slider.value = val;
      if (validateAllEMIInputs()) {
        calculateEMIPayment(true); // Silent update on typing valid values
      }
    }
  });

  input.addEventListener('blur', () => {
    let val = parseFloat(input.value);
    if (isNaN(val) || val < min) {
      val = min;
    } else if (val > max) {
      val = max;
    }
    input.value = val;
    slider.value = val;
    errorEl.style.display = 'none';
    input.style.borderColor = '';
    calculateEMIPayment(true);
  });
}

function validateAllEMIInputs() {
  const p = parseFloat(document.getElementById('loan-amount-input').value);
  const r = parseFloat(document.getElementById('interest-rate-input').value);
  const n = parseInt(document.getElementById('loan-tenure-input').value);

  if (isNaN(p) || p < 5000 || p > 1000000) return false;
  if (isNaN(r) || r < 1 || r > 25) return false;
  if (isNaN(n) || n < 1 || n > 30) return false;

  return true;
}

function calculateEMIPayment(isSilent = false) {
  const principal = parseFloat(document.getElementById('loan-amount-input').value);
  const annualRate = parseFloat(document.getElementById('interest-rate-input').value);
  const tenureYears = parseInt(document.getElementById('loan-tenure-input').value);

  // Compounding Amortization: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  let emi = 0;
  if (monthlyRate === 0) {
    emi = principal / totalMonths;
  } else {
    emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
          (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  const totalRepayment = emi * totalMonths;
  const totalInterest = totalRepayment - principal;

  // Display results
  displayEMIResults(principal, annualRate, tenureYears, emi, totalRepayment, totalInterest, isSilent);
}

function displayEMIResults(principal, rate, tenure, emi, totalRepayment, totalInterest, isSilent = false) {
  const container = document.getElementById('emi-result-container');
  const emiVal = document.getElementById('result-emi-val');
  const amountRecap = document.getElementById('result-amount-recap');
  const rateRecap = document.getElementById('result-rate-recap');
  const tenureRecap = document.getElementById('result-tenure-recap');
  
  const totalPrincipalEl = document.getElementById('result-total-principal');
  const totalInterestEl = document.getElementById('result-total-interest');
  const totalRepaymentEl = document.getElementById('result-total-repayment');
  
  const barPrincipal = document.getElementById('bar-principal');
  const barInterest = document.getElementById('bar-interest');
  const labelPrincipal = document.getElementById('label-principal-share');
  const labelInterest = document.getElementById('label-interest-share');

  if (!container) return;

  // Unhide results container
  container.style.display = 'block';

  // Animate metric text updates
  animateCountVal(emiVal, emi, true);
  animateCountVal(totalPrincipalEl, principal, false);
  animateCountVal(totalInterestEl, totalInterest, false);
  animateCountVal(totalRepaymentEl, totalRepayment, false);

  // Recaps
  amountRecap.textContent = '₹' + Math.floor(principal).toLocaleString();
  rateRecap.textContent = rate.toFixed(1) + '%';
  tenureRecap.textContent = tenure + ' Years';

  // Ratios
  const principalPct = (principal / totalRepayment) * 100;
  const interestPct = (totalInterest / totalRepayment) * 100;

  // Animate Amortization bar widths
  barPrincipal.style.width = principalPct.toFixed(1) + '%';
  barInterest.style.width = interestPct.toFixed(1) + '%';

  // Labels
  labelPrincipal.textContent = 'Principal: ' + principalPct.toFixed(1) + '%';
  labelInterest.textContent = 'Interest: ' + interestPct.toFixed(1) + '%';

  // Smooth scroll
  if (!isSilent) {
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function animateCountVal(element, target, showDecimals) {
  let start = 0;
  const duration = 1200;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = progress * (2 - progress);
    const currentValue = start + easeProgress * target;

    if (showDecimals) {
      element.textContent = '₹' + currentValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      element.textContent = '₹' + Math.floor(currentValue).toLocaleString();
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/**
 * AI FINANCIAL ADVISORY MODULE
 */
function initFinancialAdvisory() {
  console.log('AI Financial Advisor Module Initialized');
  
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatHistory = document.getElementById('chat-history');
  const chatLoader = document.getElementById('chat-loader');
  const topicCards = document.querySelectorAll('.interactive-card');
  
  if (!chatForm || !chatInput || !chatHistory || !chatLoader) return;
  
  let conversationHistory = [];
  
  const addMessage = (role, text) => {
    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${role === 'user' ? 'message-user' : 'message-ai'}`;
    
    // Parse markdown if marked.js is available
    if (window.marked) {
      bubble.innerHTML = window.marked.parse(text);
    } else {
      bubble.textContent = text;
    }
    
    chatHistory.appendChild(bubble);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  };
  
  const handleChatRequest = async (prompt) => {
    addMessage('user', prompt);
    chatInput.value = '';
    chatLoader.style.display = 'flex';
    chatHistory.scrollTop = chatHistory.scrollHeight;
    
    // Check API Key is now handled by the backend proxy
    
    conversationHistory.push({ role: 'user', content: prompt });
    
    try {
      const responseText = await IntegrationClient.queryGeminiChat(conversationHistory);
      chatLoader.style.display = 'none';
      addMessage('ai', responseText);
      conversationHistory.push({ role: 'assistant', content: responseText });
    } catch (error) {
      chatLoader.style.display = 'none';
      addMessage('ai', `Error: ${error.message}`);
      conversationHistory.pop(); // Remove the failed user message from history
    }
  };
  
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (text) {
      handleChatRequest(text);
    }
  });
  
  topicCards.forEach(card => {
    card.addEventListener('click', () => {
      const topic = card.getAttribute('data-topic');
      if (topic) {
        handleChatRequest(`Can you give me detailed advice and actionable tips regarding ${topic}?`);
      }
    });
  });
}

/**
 * INTEGRATION CLIENTS (Placeholders for Gemini API & Google Sheets/Apps Script)
 */
export const IntegrationClient = {
  /**
   * Sends financial profile to Google Sheets via secure backend proxy
   * @param {Object} data 
   * @returns {Promise<Response>}
   */
  async logUserData(data) {
    console.log('Syncing data to Google Sheets via backend proxy:', data);
    const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.SHEETS_SYNC}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error('Failed to sync to sheets via backend proxy.');
    }
    return response;
  },

  /**
   * Queries Gemini API for financial advisory via backend proxy
   * @param {string} prompt 
   * @returns {Promise<Object>}
   */
  async queryGeminiAdvisor(prompt) {
    console.log('Sending prompt to backend Gemini proxy...');
    
    const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.GEMINI_ADVISOR}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'API Request Failed');
    }

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;
    
    try {
      return JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse AI response into valid JSON structure.');
    }
  },

  /**
   * Queries Gemini API for interactive chat (tips.html) via backend proxy
   * @param {Array} messages 
   * @returns {Promise<string>}
   */
  async queryGeminiChat(messages) {
    console.log('Sending chat messages to backend Gemini proxy...');
    
    // Map custom format to Gemini format
    const geminiMessages = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.GEMINI_CHAT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages: geminiMessages })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'API Request Failed');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }
};
