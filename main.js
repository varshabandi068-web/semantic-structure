/**
 * Main Javascript File
 * Handles: Light/Dark Theme Toggle, Mobile Navigation, and Focus Management.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
});

/**
 * Theme Toggle Functionality (Dark / Light Mode)
 * Ensures compliance with prefers-color-scheme and maintains screen-reader states.
 */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  // Check storage or system preferences
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Default to dark unless explicit light preference exists
  let currentTheme = 'dark';
  if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
    currentTheme = 'light';
  }

  // Apply theme
  setTheme(currentTheme);

  // Toggle event handler
  themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  });
}

function setTheme(theme) {
  const themeToggle = document.getElementById('theme-toggle');
  
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', 'true');
      themeToggle.setAttribute('aria-label', 'Switch to dark theme');
    }
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'dark');
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', 'false');
      themeToggle.setAttribute('aria-label', 'Switch to light theme');
    }
  }
}

/**
 * Mobile Navigation Menu Functionality
 * Manages responsive drawer state, aria-expanded, and traps keyboard focus when open.
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (!toggleBtn || !navMenu) return;

  const focusableEls = navMenu.querySelectorAll('a, button');
  const firstFocusable = focusableEls[0];
  const lastFocusable = focusableEls[focusableEls.length - 1];

  function toggleMenu(isOpen) {
    if (isOpen) {
      navMenu.classList.add('open');
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.setAttribute('aria-label', 'Close menu');
      // Focus on the first element in navigation
      setTimeout(() => firstFocusable?.focus(), 100);
      document.body.style.overflow = 'hidden'; // Prevent scroll background
    } else {
      navMenu.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-label', 'Open menu');
      toggleBtn.focus();
      document.body.style.overflow = '';
    }
  }

  // Toggle button click
  toggleBtn.addEventListener('click', () => {
    const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleMenu(!isOpen);
  });

  // Close menu on navigation click (for hash links or pages)
  navMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      toggleMenu(false);
    }
  });

  // Handle focus trapping inside mobile nav
  document.addEventListener('keydown', (e) => {
    const isMenuOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
    if (!isMenuOpen) return;

    if (e.key === 'Escape') {
      toggleMenu(false);
      return;
    }

    if (e.key === 'Tab') {
      // Shift + Tab
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else { // Tab
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  });
}
