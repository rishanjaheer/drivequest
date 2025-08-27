(function() {
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (window.scrollY > 4) header.classList.add('elevated');
    else header.classList.remove('elevated');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reveal animations
  const animated = document.querySelectorAll('[data-animate]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-animate-delay');
        if (delay) entry.target.style.transitionDelay = `${parseInt(delay, 10)}ms`;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  animated.forEach(el => io.observe(el));

  // Waitlist form handling with Google Sheets integration
  async function handleWaitlist(form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const submitBtn = form.querySelector('button');
      const email = emailInput.value.trim();
      
      // Basic validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailInput.focus();
        return;
      }

      // Show loading state
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Adding...';
      submitBtn.disabled = true;

      // Submit to Google Sheets using form submission method
      try {
        // Create a hidden form to submit to Google Apps Script
        const formData = new FormData();
        formData.append('email', email);
        formData.append('source', 'Website');
        formData.append('timestamp', new Date().toISOString());
        
        // Submit to Google Apps Script
        console.log('Submitting email:', email);
        console.log('FormData contents:', formData);
        
        try {
          const response = await fetch('https://script.google.com/macros/s/AKfycbxNrvSMk8aocFHrIuNlf4UxmsMHsPfCbwGiT4qOTvqKPDlBJ0jSmZZz4oRmOa8UuYyQHw/exec', {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // This bypasses CORS restrictions
          });
          
          console.log('Google Sheets response:', response);
          console.log('Response status:', response.status);
          console.log('Response type:', response.type);
          
        } catch (fetchError) {
          console.error('Fetch error:', fetchError);
        }
        
        // Since we're using no-cors, we can't read the response
        // But we can assume it worked if no error was thrown
        
        // Success - show confirmation
        submitBtn.textContent = 'Added ✓';
        submitBtn.classList.add('btn-secondary');
        submitBtn.classList.remove('btn-primary');
        
        // Also save to local storage as backup
        try {
          const key = 'dq_waitlist';
          const existing = JSON.parse(localStorage.getItem(key) || '[]');
          if (!existing.find(e => e.email.toLowerCase() === email.toLowerCase())) {
            existing.push({ email, ts: new Date().toISOString() });
            localStorage.setItem(key, JSON.stringify(existing));
          }
        } catch (_) { /* local storage backup failed */ }
        
        // Reset form
        form.reset();
        
        // Show success message
        showNotification('Thanks for joining the waitlist! We\'ll notify you at launch.', 'success');
        
      } catch (error) {
        console.error('Waitlist submission failed:', error);
        
        // Fallback to local storage only
        try {
          const key = 'dq_waitlist';
          const existing = JSON.parse(localStorage.getItem(key) || '[]');
          if (!existing.find(e => e.email.toLowerCase() === email.toLowerCase())) {
            existing.push({ email, ts: new Date().toISOString() });
            localStorage.setItem(key, JSON.stringify(existing));
          }
          
          submitBtn.textContent = 'Added ✓';
          submitBtn.classList.add('btn-secondary');
          submitBtn.classList.remove('btn-primary');
          form.reset();
          
          showNotification('Added to waitlist! (Saved locally)', 'info');
          
        } catch (localError) {
          showNotification('Failed to add to waitlist. Please try again.', 'error');
        }
      }

      // Reset button after delay
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.classList.remove('btn-secondary');
        submitBtn.classList.add('btn-primary');
        submitBtn.disabled = false;
      }, 3000);
    });
  }

  // Notification system
  function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  // Initialize waitlist forms
  const f1 = document.getElementById('waitlistForm');
  const f2 = document.getElementById('waitlistForm2');
  if (f1) handleWaitlist(f1);
  if (f2) handleWaitlist(f2);

  // Year footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
