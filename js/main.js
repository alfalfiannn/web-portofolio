/* ============================================================
   PORTFOLIO v2 — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ---- DOM Cache ----
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.navbar__link');
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');
    const sections = document.querySelectorAll('section[id]');

    // ---- Overlay ----
    const overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    document.body.appendChild(overlay);

    // ---- Mobile Menu ----
    function openMenu() {
        navToggle.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        navMenu.classList.add('open');
        overlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('open');
        overlay.classList.remove('visible');
        document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', () => {
        navMenu.classList.contains('open') ? closeMenu() : openMenu();
    });

    overlay.addEventListener('click', closeMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) closeMenu();
        });
    });

    // ---- Navbar Scroll ----
    function handleScroll() {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ---- Active Link Scroll Spy ----
    function updateActiveLink() {
        const scrollY = window.scrollY + 150;
        let currentId = '';

        sections.forEach(section => {
            const top = section.offsetTop - 150;
            const height = section.offsetHeight;
            if (scrollY >= top && scrollY < top + height) {
                currentId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();

    // ---- Reveal Animations ----
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
        );

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('visible'));
    }

    // ---- Skill Progress Bars ----
    const skillBars = document.querySelectorAll('.skill-item__fill');

    if ('IntersectionObserver' in window && skillBars.length) {
        const barObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const width = entry.target.getAttribute('data-width');
                        entry.target.style.width = `${width}%`;
                        barObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );

        skillBars.forEach(bar => barObserver.observe(bar));
    }

    // ---- Smooth Scroll ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = navbar.offsetHeight + 10;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ---- Contact Form ----
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            formFeedback.textContent = '';
            formFeedback.className = 'form-feedback';

            if (!name || !email || !message) {
                formFeedback.textContent = 'Please fill in all required fields.';
                formFeedback.classList.add('error');
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                formFeedback.textContent = 'Please enter a valid email address.';
                formFeedback.classList.add('error');
                return;
            }

            const btn = document.getElementById('submitBtn');
            btn.disabled = true;
            btn.innerHTML = '<span>Sending...</span>';

            setTimeout(() => {
                formFeedback.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
                formFeedback.classList.add('success');
                contactForm.reset();
                btn.disabled = false;
                btn.innerHTML = `<span>Send Message</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;

                setTimeout(() => {
                    formFeedback.textContent = '';
                    formFeedback.className = 'form-feedback';
                }, 5000);
            }, 1200);
        });
    }

    // ---- Parallax Orbs (subtle mouse tracking on desktop) ----
    const orbs = document.querySelectorAll('.hero__orb');

    if (window.matchMedia('(min-width: 768px)').matches && orbs.length) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            orbs.forEach((orb, i) => {
                const speed = (i + 1) * 8;
                orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
    }
});
