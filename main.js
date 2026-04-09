// ── LANGUAGE ──
let currentLang = 'ro';

function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('#lang-bar button').forEach(b => b.classList.remove('active'));
  document.querySelector(`#lang-bar button:${lang==='ro'?'first':'last'}-child`).classList.add('active');
  document.querySelectorAll('[data-ro]').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    if (val) el.innerHTML = val;
  });
}

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = scrollY;
}, { passive: true });

// ── HAMBURGER MENU ──
function toggleMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
}

function closeMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  hamburger.classList.remove('active');
  navLinks.classList.remove('open');
  document.body.style.overflow = '';
}

// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(r => observer.observe(r));

// ── LIGHTBOX ──
function openLightbox(src) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// ── GALLERY SLIDER ──
function slideGallery(direction) {
  const gallery = document.querySelector('.gallery-scroll');
  const scrollAmount = 300; // Scroll by one image width approx
  if (gallery) {
    gallery.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  }
}

// ── SET DEFAULT DATES ──
(function() {
  const checkin = document.getElementById('checkin');
  const checkout = document.getElementById('checkout');
  if (checkin && checkout) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);
    
    checkin.min = today.toISOString().split('T')[0];
    checkin.value = tomorrow.toISOString().split('T')[0];
    checkout.min = tomorrow.toISOString().split('T')[0];
    checkout.value = dayAfter.toISOString().split('T')[0];
    
    checkin.addEventListener('change', () => {
      const ci = new Date(checkin.value);
      ci.setDate(ci.getDate() + 1);
      checkout.min = ci.toISOString().split('T')[0];
      if (new Date(checkout.value) <= new Date(checkin.value)) {
        checkout.value = ci.toISOString().split('T')[0];
      }
    });
  }
})();

// ── THEME TOGGLE ──
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  // Check initial state set by head script
  if (document.documentElement.getAttribute('data-theme') === 'dark') {
    themeToggle.textContent = '☀️';
  }

  themeToggle.addEventListener('click', () => {
    let currentTheme = document.documentElement.getAttribute('data-theme');
    let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  });
}
