document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth scroll for anchor links in mobile menu to close the menu
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // Smooth scroll helpers for hero buttons
    const scrollToSection = (sectionId) => {
        const target = document.getElementById(sectionId);
        if (!target) return;

        const headerOffset = 100; // account for sticky header height
        const rect = target.getBoundingClientRect();
        const offsetTop = window.pageYOffset + rect.top - headerOffset;

        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth',
        });
    };

    const heroContactBtn = document.getElementById('hero-contact-btn');
    if (heroContactBtn) {
        heroContactBtn.addEventListener('click', () => {
            scrollToSection('contact-form');
        });
    }

    const heroViewCoursesBtn = document.getElementById('hero-view-courses-btn');
    if (heroViewCoursesBtn) {
        heroViewCoursesBtn.addEventListener('click', () => {
            scrollToSection('learning-path');
        });
    }

    // Contact form – submit to Zapier webhook
    const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/13711388/u0wcv8a/';
    const contactForm = document.getElementById('contact-form-el');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending…';

            const payload = {
                'full-name': contactForm.querySelector('#full-name').value.trim(),
                email: contactForm.querySelector('#email').value.trim(),
                phone: contactForm.querySelector('#phone').value.trim(),
                message: contactForm.querySelector('#message').value.trim()
            };

            const body = new URLSearchParams(payload).toString();

            try {
                const res = await fetch(ZAPIER_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body
                });
                // Zapier often doesn't send CORS headers, so res.ok may be false (opaque response) even when the hook succeeded
                const success = res.ok || res.status === 0;
                if (success) {
                    contactForm.reset();
                    submitBtn.textContent = 'Message sent!';
                    submitBtn.classList.add('!bg-green-600');
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.classList.remove('!bg-green-600');
                        submitBtn.disabled = false;
                    }, 3000);
                } else {
                    throw new Error('Request failed: ' + res.status);
                }
            } catch (err) {
                console.error('Form submit error:', err);
                submitBtn.textContent = 'Error – try again';
                submitBtn.classList.add('!bg-red-600');
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.classList.remove('!bg-red-600');
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }
});
