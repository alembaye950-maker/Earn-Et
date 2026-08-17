// app.js — Minimal prototype logic (client-side only)
// WARNING: This is a frontend-only simulation. Do NOT use this as production logic.

const STORAGE_KEY = 'earnet_user';
const BALANCE_KEY = 'earnet_balance';
const VIEWS_KEY = 'earnet_views';
const LAST_VIEW_DAY_KEY = 'earnet_last_view_day';
const DAILY_LIMIT = 100;
const REWARD = 0.10; // per completed view
const AD_DURATION = 30; // seconds

// Simple selectors
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// Auth elements
const authSection = $('#auth');
const mainSection = $('#main');
const loginForm = $('#loginForm');
const signupForm = $('#signupForm');
const loginBox = $('#loginBox');
const signupBox = $('#signupBox');
const showSignup = $('#showSignup');
const showLogin = $('#showLogin');
const logoutBtn = $('#logout');

// App elements
const balanceEl = $('#balance');
const viewsEl = $('#views');
const todayEl = $('#today');
const watchBtn = $('#watchBtn');
const timerWrap = $('#timerWrap');
const progressEl = $('#progress');
const timerText = $('#timerText');
const navBtns = $$('.bottom-nav .nav');
const pages = $$('.page');
const withdrawForm = $('#withdrawForm');
const withdrawMsg = $('#withdrawMessage');
const inviteLink = $('#inviteLink');
const copyInvite = $('#copyInvite');
const copyMsg = $('#copyMsg');
const profileName = $('#profileName');
const profileEmail = $('#profileEmail');
const avatar = $('#avatar');

let timerInterval = null;
let remaining = AD_DURATION;

// Helpers
function readJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch(e){ return fallback; }
}
function writeJSON(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

function getTodayString(){
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}

function ensureDailyReset(){
  const last = localStorage.getItem(LAST_VIEW_DAY_KEY);
  const today = getTodayString();
  if(last !== today){
    writeJSON(VIEWS_KEY, 0);
    localStorage.setItem(LAST_VIEW_DAY_KEY, today);
  }
}

function loadState(){
  ensureDailyReset();
  const bal = readJSON(BALANCE_KEY, 0);
  const views = readJSON(VIEWS_KEY, 0);
  balanceEl.textContent = `$${bal.toFixed(2)}`;
  viewsEl.textContent = views;
  todayEl.textContent = `${views} / ${DAILY_LIMIT}`;
}

function setUserUI(user){
  if(!user) return;
  profileName.textContent = user.name || 'User';
  profileEmail.textContent = user.email || '';
  avatar.textContent = (user.name||'U').charAt(0).toUpperCase();
  inviteLink.value = `${location.origin}${location.pathname}?ref=${encodeURIComponent(user.email)}`;
}

function showPage(pageId){
  pages.forEach(p => p.classList.toggle('active', p.id === pageId));
  navBtns.forEach(b => b.classList.toggle('active', b.dataset.page === pageId));
}

// Auth flow (localStorage prototype only)
function signup(e){
  e.preventDefault();
  const name = $('#signupName').value.trim();
  const email = $('#signupEmail').value.trim().toLowerCase();
  const pass = $('#signupPassword').value;
  if(!name || !email || pass.length < 6) return alert('Please fill valid signup details.');
  const user = { name, email };
  writeJSON(STORAGE_KEY, user);
  // initialize balance/views
  writeJSON(BALANCE_KEY, 0);
  writeJSON(VIEWS_KEY, 0);
  localStorage.setItem(LAST_VIEW_DAY_KEY, getTodayString());
  // show main
  setUserUI(user);
  authSection.classList.add('hidden');
  mainSection.classList.remove('hidden');
  loadState();
}

function login(e){
  e.preventDefault();
  const email = $('#loginEmail').value.trim().toLowerCase();
  const pass = $('#loginPassword').value;
  const user = readJSON(STORAGE_KEY, null);
  if(!user || user.email !== email) return alert('No account found for that email (prototype stores one local account).');
  setUserUI(user);
  authSection.classList.add('hidden');
  mainSection.classList.remove('hidden');
  loadState();
}

function logout(){
  mainSection.classList.add('hidden');
  authSection.classList.remove('hidden');
}

// Ad watching simulation
function startAd(){
  ensureDailyReset();
  const views = readJSON(VIEWS_KEY, 0);
  if(views >= DAILY_LIMIT) return alert('Daily view limit reached.');
  watchBtn.disabled = true;
  timerWrap.classList.remove('hidden');
  remaining = AD_DURATION;
  progressEl.style.width = '0%';
  timerText.textContent = `${remaining} seconds remaining`;
  timerInterval = setInterval(() => {
    remaining -= 1;
    const pct = ((AD_DURATION - remaining) / AD_DURATION) * 100;
    progressEl.style.width = pct + '%';
    timerText.textContent = `${remaining} seconds remaining`;
    if(remaining <= 0){
      clearInterval(timerInterval);
      completeAd();
    }
  }, 1000);
}

function completeAd(){
  timerWrap.classList.add('hidden');
  watchBtn.disabled = false;
  // Credit reward only in this simulation
  const bal = readJSON(BALANCE_KEY, 0);
  const views = readJSON(VIEWS_KEY, 0) + 1;
  writeJSON(BALANCE_KEY, parseFloat((bal + REWARD).toFixed(2)));
  writeJSON(VIEWS_KEY, views);
  loadState();
  alert(`Ad complete — credited $${REWARD.toFixed(2)} (simulation).`);
}

// Withdraw form
function handleWithdraw(e){
  e.preventDefault();
  const amount = parseFloat($('#amount').value);
  const method = $('#method').value;
  const account = $('#account').value.trim();
  const bal = readJSON(BALANCE_KEY, 0);
  withdrawMsg.textContent = '';
  if(isNaN(amount) || amount < 10 || amount > 100) return withdrawMsg.textContent = 'Amount must be between $10 and $100.';
  if(amount > bal) return withdrawMsg.textContent = 'Insufficient balance.';
  if(!account) return withdrawMsg.textContent = 'Enter an account or phone number.';
  // Simulate request
  writeJSON(BALANCE_KEY, parseFloat((bal - amount).toFixed(2)));
  loadState();
  withdrawMsg.textContent = `Withdrawal of $${amount.toFixed(2)} requested via ${method} (simulation).`;
}

// Invite copy
function copyInviteLink(){
  navigator.clipboard.writeText(inviteLink.value).then(()=>{
    copyMsg.textContent = 'Copied!';
    setTimeout(()=>copyMsg.textContent = '', 2000);
  }).catch(()=>{
    copyMsg.textContent = 'Copy failed — select and copy manually.';
  });
}

// Navigation
function initNav(){
  navBtns.forEach(b => b.addEventListener('click', ()=> showPage(b.dataset.page)));
}

// Landing helpers (if opened as landing.html)

// Init
function initApp(){
  const user = readJSON(STORAGE_KEY, null);
  if(user){
    authSection.classList.add('hidden');
    mainSection.classList.remove('hidden');
    setUserUI(user);
    loadState();
  }
  // events
  signupForm.addEventListener('submit', signup);
  loginForm.addEventListener('submit', login);
  showSignup.addEventListener('click', ()=>{ loginBox.classList.add('hidden'); signupBox.classList.remove('hidden'); });
  showLogin.addEventListener('click', ()=>{ signupBox.classList.add('hidden'); loginBox.classList.remove('hidden'); });
  logoutBtn.addEventListener('click', logout);
  watchBtn.addEventListener('click', startAd);
  withdrawForm.addEventListener('submit', handleWithdraw);
  copyInvite.addEventListener('click', copyInviteLink);
  initNav();
}

// Start when DOM ready
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initApp); else initApp();
