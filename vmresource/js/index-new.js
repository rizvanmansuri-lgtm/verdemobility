/* ============================================
   VerdeMobility Premium Resources JS
   ============================================ */

// Mobile Menu
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Quick Navigation Filters
const quickNavItems = document.querySelectorAll('.quick-nav__item');
const productSections = document.querySelectorAll('.products-section');

quickNavItems.forEach(item => {
    item.addEventListener('click', () => {
        const filter = item.getAttribute('data-filter');
        
        // Update active state
        quickNavItems.forEach(i => i.style.opacity = '0.6');
        item.style.opacity = '1';
        
        // Filter products
        if (filter === 'all') {
            productSections.forEach(section => {
                section.style.display = 'block';
            });
        } else {
            productSections.forEach(section => {
                if (section.getAttribute('data-section') === filter) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        }
        
        // Scroll to content
        setTimeout(() => {
            document.getElementById('resources').scrollIntoView({ behavior: 'smooth' });
        }, 100);
    });
});

// FAQ Accordion
const faqTriggers = document.querySelectorAll('.faq-card__trigger');

faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        const content = trigger.nextElementSibling;
        
        // Close other FAQs
        faqTriggers.forEach(other => {
            if (other !== trigger && other.getAttribute('aria-expanded') === 'true') {
                other.setAttribute('aria-expanded', 'false');
                other.nextElementSibling.hidden = true;
            }
        });
        
        // Toggle current FAQ
        trigger.setAttribute('aria-expanded', !isExpanded);
        content.hidden = isExpanded;
    });
});

// Contact Form
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Show success message
        const submitButton = contactForm.querySelector('[type="submit"]');
        const message = contactForm.querySelector('.form-message');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = '✓ Message Sent!';
        submitButton.disabled = true;
        message.hidden = false;
        
        console.log('Contact form submitted:', data);
        
        // Reset form
        contactForm.reset();
        
        // Restore button
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            message.hidden = true;
        }, 3000);
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Header shadow on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'var(--shadow-sm)';
    }
});

console.log('✓ VerdeMobility Resources loaded');
