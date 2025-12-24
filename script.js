/**
 * LYNX PARTNERSHIP PROPOSAL
 * One-Page Premium Design — JavaScript
 */

// ==========================================
// Custom Cursor
// ==========================================
class CustomCursor {
    constructor() {
        this.cursor = document.getElementById('cursor');
        this.follower = document.getElementById('cursorFollower');
        this.pos = { x: 0, y: 0 };
        this.mouse = { x: 0, y: 0 };
        this.speed = 0.15;

        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Hover states
        const hoverables = document.querySelectorAll('a, button, .chip, .feature-card, .benefit-card, .cta-button, .platform-link, .nav-cta');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => this.cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => this.cursor.classList.remove('hover'));
        });

        this.render();
    }

    render() {
        this.pos.x += (this.mouse.x - this.pos.x) * this.speed;
        this.pos.y += (this.mouse.y - this.pos.y) * this.speed;

        this.cursor.style.left = `${this.mouse.x}px`;
        this.cursor.style.top = `${this.mouse.y}px`;

        this.follower.style.left = `${this.pos.x}px`;
        this.follower.style.top = `${this.pos.y}px`;

        requestAnimationFrame(() => this.render());
    }
}

// ==========================================
// Scroll Animations
// ==========================================
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.fade-in');
        this.init();
    }

    init() {
        // Create intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all fade-in elements
        this.elements.forEach(el => observer.observe(el));

        // Make hero elements visible immediately
        document.querySelectorAll('.hero .fade-in').forEach(el => {
            el.classList.add('visible');
        });
    }
}

// ==========================================
// Number Counter Animation
// ==========================================
class NumberCounter {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number[data-count]');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateNumber(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(el => observer.observe(el));
    }

    animateNumber(el) {
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const start = performance.now();

        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);
            const value = Math.floor(target * ease);

            el.textContent = value.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString();
            }
        };

        requestAnimationFrame(update);
    }
}

// ==========================================
// Smooth Scroll for Anchor Links
// ==========================================
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ==========================================
// Navigation Background on Scroll
// ==========================================
class NavScroll {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.nav.style.background = 'rgba(9, 9, 11, 0.95)';
            } else {
                this.nav.style.background = 'linear-gradient(180deg, rgba(9, 9, 11, 0.9) 0%, transparent 100%)';
            }
        });
    }
}

// ==========================================
// Initialize
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Only init cursor on desktop
    if (window.innerWidth > 768) {
        new CustomCursor();
    }

    new ScrollAnimations();
    new NumberCounter();
    new SmoothScroll();
    new NavScroll();

    // Console branding
    console.log('%c✦ Partnership Proposal', 'font-size: 20px; font-weight: 600; color: #a855f7;');
    console.log('%cLynx Group × Tech Creative', 'font-size: 12px; color: #71717a;');
});
