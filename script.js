// Language Toggle
let currentLang = 'en';

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    document.body.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.getElementById('lang-text').textContent = currentLang === 'en' ? 'AR' : 'EN';
    
    // Update all translatable elements
    const elements = document.querySelectorAll('[data-en][data-ar]');
    elements.forEach(el => {
        el.textContent = el.getAttribute(`data-${currentLang}`);
    });
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active');
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.mobile-menu .nav-link').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('mobileMenu').classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Fade-in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.stat-card, .feature-card, .pricing-card').forEach(card => {
    observer.observe(card);
});
