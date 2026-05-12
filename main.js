/* ═══════════════════════════════════════════════════
   PENSIUNEA DOINA — main.js
   ═══════════════════════════════════════════════════ */

// ── LANGUAGE ──
let currentLang = 'ro';

function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('#lang-bar button').forEach(b => b.classList.remove('active'));
  const btns = document.querySelectorAll('#lang-bar button');
  if (lang === 'ro') btns[0].classList.add('active');
  else btns[1].classList.add('active');

  document.querySelectorAll('[data-ro]').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    if (val !== null) el.innerHTML = val;
  });
}

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 80) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
}, { passive: true });

// ── SCROLL REVEAL ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(r => revealObserver.observe(r));

// ── GALLERY SLIDER ──
function slideGallery(direction) {
  const gallery = document.getElementById('gallery-scroll');
  if (gallery) gallery.scrollBy({ left: direction * 300, behavior: 'smooth' });
}

// ═══════════════════════════════════════════════════
//   LIGHTBOX — universal, supports 3 modes:
//   1. openGalleryLightbox(index)  — main gallery strip
//   2. openRoomLightbox(roomNum)   — per-camera folder
//   3. openLightboxSingle(src)     — single image (about section)
// ═══════════════════════════════════════════════════

let lbImages  = [];   // array of src strings
let lbIndex   = 0;    // current index

const lightbox         = document.getElementById('lightbox');
const lightboxBackdrop = document.getElementById('lightbox-backdrop');
const lightboxImg      = document.getElementById('lightbox-img');
const lightboxCaption  = document.getElementById('lightbox-caption');

// Gallery images (same order as HTML)
const galleryImages = [
  'Poze/vedere-dunare-apus.jpeg',
  'Poze/Exterior spre pensiune jos.jpeg',
  'Poze/foisor-exterior.jpeg',
  'Poze/camera-dubla-padure-1.jpeg',
  'Poze/camera-dubla-canapea-1.jpeg',
  'Poze/Exterior.jpeg',
  'Poze/camera-dubla-roz-decor.jpeg',
  'Poze/camera-dubla-pat-mare-2.jpeg',
  'Poze/hol camere.jpeg',
  'Poze/balcon-vedere-dunare-1.jpeg',
  'Poze/camera-dubla-verde-1.jpeg',
  'Poze/camera-dubla-colorata-2.jpeg',
];

// Room photo folders — add/remove filenames to match what's in each folder.
// Each entry is an array of image paths relative to the repo root.
// Camera covers (thumbnails) are automatically included as the first image.
const roomCovers = [
  'Poze/camera-dubla-eleganta-2.jpeg',
  'Poze/camera-dubla-padure-1.jpeg',
  'Poze/camera-dubla-verde-1.jpeg',
  'Poze/camera-dubla-roz-decor.jpeg',
  'Poze/camera-dubla-luminoasa-2.jpeg',
  'Poze/camera-dubla-eleganta-4.jpeg',
];

const roomGalleries = [
  /* Camera 1 */ [
    'Poze/Camere/Camera 1/Camera 1.jpg',
    'Poze/Camere/Camera 1/Camera 1 colt.jpg',
    'Poze/Camere/Camera 1/Camera 1 hol.jpg',
    'Poze/Camere/Camera 1/Camera 1 profil.jpg',
    'Poze/Camere/Camera 1/Camera 1 terasa.jpg',
    'Poze/Camere/Camera 1/Camera 1 toaleta.jpg',
  ],
  /* Camera 2 */ [
    'Poze/Camere/Camera 2/Camera 2.jpg',
    'Poze/Camere/Camera 2/Camera 2 baie.jpg',
    'Poze/Camere/Camera 2/Camera 2 colt.jpg',
    'Poze/Camere/Camera 2/Camera 2 priveliste.jpg',
    'Poze/Camere/Camera 2/Camera 2 terasa.jpg',
  ],
  /* Camera 3 */ [
    'Poze/Camere/Camera 3/Camera 3.jpg',
    'Poze/Camere/Camera 3/Camera 3 baie.jpg',
    'Poze/Camere/Camera 3/Camera 3 colt.jpg',
    'Poze/Camere/Camera 3/Camera 3 hol.jpg',
  ],
  /* Camera 4 */ [
    'Poze/Camere/Camera 4/Camera 4.jpg',
    'Poze/Camere/Camera 4/Camera 4 baie.jpg',
    'Poze/Camere/Camera 4/Camera 4 colt.jpg',
    'Poze/Camere/Camera 4/Camera 4 priveliste.jpg',
    'Poze/Camere/Camera 4/Camera 4 terasa.jpg',
  ],
  /* Camera 5 */ [
    'Poze/Camere/Camera 5/Camera 5.jpg',
    'Poze/Camere/Camera 5/Camera 5 baie.jpg',
    'Poze/Camere/Camera 5/Camera 5 colt.jpg',
    'Poze/Camere/Camera 5/Camera 5 dulap.jpg',
    'Poze/Camere/Camera 5/Camera 5 hol.jpg',
    'Poze/Camere/Camera 5/Camera 5 priveliste.jpg',
  ],
  /* Camera 6 */ [
    'Poze/Camere/Camera 6/Camera 6.jpg',
    'Poze/Camere/Camera 6/Camera 6 baie.jpg',
    'Poze/Camere/Camera 6/Camera 6 colt.jpg',
    'Poze/Camere/Camera 6/Camera 6 lateral.jpg',
  ],
];

function openLightbox(images, startIndex, caption) {
  lbImages = images;
  lbIndex  = startIndex || 0;
  _showLightboxFrame(caption);
  lightbox.classList.add('open');
  lightboxBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function _showLightboxFrame(caption) {
  lightboxImg.src = lbImages[lbIndex];
  lightboxImg.alt = caption || '';
  if (lbImages.length > 1) {
    lightboxCaption.textContent = `${lbIndex + 1} / ${lbImages.length}`;
  } else {
    lightboxCaption.textContent = caption || '';
  }
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxBackdrop.classList.remove('open');
  document.body.style.overflow = '';
  // clear src after transition to avoid flash
  setTimeout(() => { lightboxImg.src = ''; }, 350);
}

function lightboxNav(direction) {
  if (!lbImages.length) return;
  lbIndex = (lbIndex + direction + lbImages.length) % lbImages.length;

  // Animație direcțională
  const img = document.getElementById('lightbox-img');
  img.classList.remove('anim-next', 'anim-prev');
  void img.offsetWidth; // reflow ca să reseteze animația
  img.classList.add(direction > 0 ? 'anim-next' : 'anim-prev');

  _showLightboxFrame();
}

// Public helpers called from HTML
function openGalleryLightbox(index) {
  openLightbox(galleryImages, index);
}

function openRoomLightbox(roomNum) {
  // roomNum is 1-based
  const images = roomGalleries[roomNum - 1] || [roomCovers[roomNum - 1]];
  openLightbox(images, 0, `Camera ${roomNum}`);
}

function openLightboxSingle(src) {
  openLightbox([src], 0);
}

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')       closeLightbox();
  if (e.key === 'ArrowRight')   lightboxNav(1);
  if (e.key === 'ArrowLeft')    lightboxNav(-1);
});

// ── THEME TOGGLE ──
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  if (document.documentElement.getAttribute('data-theme') === 'dark') {
    themeToggle.textContent = '☀️';
  }
  themeToggle.addEventListener('click', () => {
    const current  = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  });
}
