/**
 * Contact Form Validation & Accessibility Script
 * Implements real-time validation, keyboard focus management, and screen-reader status announcements.
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
});

function initContactForm() {
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const statusAnnouncer = document.getElementById('form-status');

  if (!form) return;

  // Validation Rules
  const validators = {
    name: {
      validate: (val) => val.trim().length > 0,
      errorEl: document.getElementById('name-error'),
      msg: 'Name is required.'
    },
    email: {
      validate: (val) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(val.trim());
      },
      errorEl: document.getElementById('email-error'),
      msg: 'Please enter a valid email address.'
    },
    message: {
      validate: (val) => val.trim().length >= 10,
      errorEl: document.getElementById('message-error'),
      msg: 'Message must be at least 10 characters long.'
    }
  };

  // Real-time validation on Blur (moving away from input)
  [nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('blur', () => {
      validateField(input);
    });

    // Clear error classes on input if user starts typing to fix it
    input.addEventListener('input', () => {
      if (input.classList.contains('is-invalid')) {
        const config = validators[input.id];
        if (config.validate(input.value)) {
          clearError(input, config);
        }
      }
    });
  });

  // Submit Handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isFormValid = true;
    let firstInvalidInput = null;

    // Validate all fields
    [nameInput, emailInput, messageInput].forEach(input => {
      const isValid = validateField(input);
      if (!isValid) {
        isFormValid = false;
        if (!firstInvalidInput) {
          firstInvalidInput = input;
        }
      }
    });

    if (!isFormValid) {
      // Focus on the first invalid field
      if (firstInvalidInput) {
        firstInvalidInput.focus();
      }
      
      // Announce error to screen readers
      showStatus('Form submission failed. Please review and correct the highlighted errors.', 'error');
    } else {
      // Success flow
      showStatus('Thank you! Your message has been sent successfully. Varsha will contact you shortly.', 'success');
      
      // Reset form
      form.reset();
      
      // Reset accessibility states
      [nameInput, emailInput, messageInput].forEach(input => {
        input.setAttribute('aria-invalid', 'false');
        input.classList.remove('is-invalid');
      });
    }
  });

  /**
   * Validates a single input element and updates its ARIA states
   */
  function validateField(input) {
    const config = validators[input.id];
    if (!config) return true;

    const isValid = config.validate(input.value);

    if (!isValid) {
      applyError(input, config);
    } else {
      clearError(input, config);
    }

    return isValid;
  }

  function applyError(input, config) {
    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');
    if (config.errorEl) {
      config.errorEl.classList.add('show');
      config.errorEl.innerHTML = `
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        ${config.msg}
      `;
    }
  }

  function clearError(input, config) {
    input.classList.remove('is-invalid');
    input.setAttribute('aria-invalid', 'false');
    if (config.errorEl) {
      config.errorEl.classList.remove('show');
      config.errorEl.textContent = '';
    }
  }

  /**
   * Sets the visual and acoustic alerts using assertive aria-live announcements
   */
  function showStatus(message, type) {
    if (!statusAnnouncer) return;

    // Reset status class
    statusAnnouncer.className = 'form-status';
    statusAnnouncer.classList.add(type);
    statusAnnouncer.textContent = message;

    // Scroll slightly to status announcer if submission fails
    if (type === 'error') {
      statusAnnouncer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
}
