/**
 * LYNX PARTNERSHIP PROPOSAL
 * Optimized Cinematic Interactions
 * Performance-focused version
 */

// ==========================================
// Global Animation Controller (Single RAF Loop)
// ==========================================
class AnimationController {
    constructor() {
        this.callbacks = [];
        this.isRunning = false;
        this.lastTime = 0;
        this.targetFPS = 60;
        this.frameInterval = 1000 / this.targetFPS;
    }

    add(callback) {
        this.callbacks.push(callback);
        if (!this.isRunning) this.start();
    }

    remove(callback) {
        this.callbacks = this.callbacks.filter(cb => cb !== callback);
        if (this.callbacks.length === 0) this.stop();
    }

    start() {
        this.isRunning = true;
        this.tick();
    }

    stop() {
        this.isRunning = false;
    }

    tick(currentTime = 0) {
        if (!this.isRunning) return;

        requestAnimationFrame((time) => this.tick(time));

        const delta = currentTime - this.lastTime;
        if (delta < this.frameInterval) return;

        this.lastTime = currentTime - (delta % this.frameInterval);
        this.callbacks.forEach(cb => cb(delta));
    }
}

const animationController = new AnimationController();

// ==========================================
// Global Mouse State (Single Listener)
// ==========================================
const mouseState = { x: 0, y: 0, moved: false };
let scrollY = 0;
let ticking = false;

document.addEventListener('mousemove', (e) => {
    mouseState.x = e.clientX;
    mouseState.y = e.clientY;
    mouseState.moved = true;
}, { passive: true });

window.addEventListener('scroll', () => {
    scrollY = window.pageYOffset;
    if (!ticking) {
        requestAnimationFrame(() => {
            document.dispatchEvent(new CustomEvent('optimizedScroll', { detail: scrollY }));
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// ==========================================
// Device Detection
// ==========================================
const isDesktop = window.innerWidth > 768;
const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ==========================================
// Text Scramble Effect
// ==========================================
class TextScramble {
    constructor() {
        this.chars = '!<>-_\\/[]{}—=+*^?#';
        this.elements = document.querySelectorAll('.scramble');
        this.init();
    }

    init() {
        if (prefersReducedMotion) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.scrambled) {
                    entry.target.dataset.scrambled = 'true';
                    this.scramble(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.elements.forEach(el => {
            el.dataset.originalText = el.textContent;
            observer.observe(el);
        });
    }

    scramble(el) {
        const originalText = el.dataset.originalText;
        const length = originalText.length;
        let iteration = 0;
        const maxIterations = length * 2; // Reduced iterations

        const interval = setInterval(() => {
            el.textContent = originalText
                .split('')
                .map((char, index) => {
                    if (char === ' ') return ' ';
                    if (index < iteration / 2) return originalText[index];
                    return this.chars[Math.floor(Math.random() * this.chars.length)];
                })
                .join('');

            iteration++;
            if (iteration >= maxIterations) {
                clearInterval(interval);
                el.textContent = originalText;
            }
        }, 40); // Slightly slower for less CPU
    }
}

// ==========================================
// Optimized Cursor Trail (Reduced to 6 elements)
// ==========================================
class CursorGlowTrail {
    constructor() {
        if (!isDesktop || prefersReducedMotion) return;

        this.trails = [];
        this.trailCount = 6; // Reduced from 12
        this.positions = [];
        this.init();
    }

    init() {
        this.container = document.createElement('div');
        this.container.className = 'cursor-trail-container';
        document.body.appendChild(this.container);

        for (let i = 0; i < this.trailCount; i++) {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.setProperty('--trail-index', i);
            this.container.appendChild(trail);
            this.trails.push(trail);
            this.positions.push({ x: 0, y: 0 });
        }

        animationController.add(() => this.animate());
    }

    animate() {
        this.positions.forEach((pos, index) => {
            const target = index === 0 ? mouseState : this.positions[index - 1];
            const ease = 0.3 - (index * 0.04);

            pos.x += (target.x - pos.x) * ease;
            pos.y += (target.y - pos.y) * ease;

            this.trails[index].style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
        });
    }
}

// ==========================================
// Simplified Particle System (Reduced count)
// ==========================================
class ParticleSystem {
    constructor() {
        if (prefersReducedMotion || isLowEnd) return;

        this.container = document.createElement('div');
        this.container.className = 'particles';
        document.body.appendChild(this.container);
        this.particleCount = isDesktop ? 15 : 8; // Reduced from 25
        this.init();
    }

    init() {
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 1.5 + 0.5;
        const left = Math.random() * 100;
        const delay = Math.random() * 20;
        const duration = Math.random() * 15 + 25;

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
        `;

        particle.style.background = '#ffffff';
        this.container.appendChild(particle);
    }
}

// ==========================================
// Optimized Card Tilt (Throttled)
// ==========================================
class CardTilt {
    constructor() {
        if (!isDesktop || prefersReducedMotion) return;

        this.cards = document.querySelectorAll('.feature-card, .benefit-card');
        this.activeCard = null;
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => this.activeCard = card, { passive: true });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                this.activeCard = null;
            }, { passive: true });
        });

        animationController.add(() => this.update());
    }

    update() {
        if (!this.activeCard || !mouseState.moved) return;

        const card = this.activeCard;
        const rect = card.getBoundingClientRect();
        const x = mouseState.x - rect.left;
        const y = mouseState.y - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 25; // Reduced intensity
        const rotateY = (centerX - x) / 25;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    }
}

// ==========================================
// Cinematic Scroll Animations
// ==========================================
class CinematicScroll {
    constructor() {
        this.elements = document.querySelectorAll('.fade-in');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Stop observing once visible
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.forEach(el => observer.observe(el));

        // Hero elements visible immediately
        const heroElements = document.querySelectorAll('.hero .fade-in');
        heroElements.forEach((el, index) => {
            setTimeout(() => el.classList.add('visible'), index * 100);
        });
    }
}

// ==========================================
// Text Reveal Animation
// ==========================================
class TextReveal {
    constructor() {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.querySelectorAll('.line').forEach(line => {
                const text = line.innerHTML;
                line.innerHTML = `<span class="line-inner">${text}</span>`;
            });
        }
    }
}

// ==========================================
// Optimized Number Counter
// ==========================================
class DramaticCounter {
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
        const duration = 2000; // Reduced from 2500
        const start = performance.now();
        const formatter = new Intl.NumberFormat();

        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3); // Simpler easing

            el.textContent = formatter.format(Math.floor(target * ease));

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = formatter.format(target);
            }
        };

        requestAnimationFrame(update);
    }
}

// ==========================================
// Smooth Scroll
// ==========================================
class SmoothScroll {
    constructor() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
}

// ==========================================
// Navigation Effects (Throttled)
// ==========================================
class NavEffects {
    constructor() {
        this.nav = document.querySelector('.nav');
        document.addEventListener('optimizedScroll', (e) => {
            if (e.detail > 100) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }
        });
    }
}

// ==========================================
// Aurora Background Creator
// ==========================================
class AuroraBackground {
    constructor() {
        if (prefersReducedMotion) return;

        const aurora = document.createElement('div');
        aurora.className = 'aurora';
        document.body.insertBefore(aurora, document.body.firstChild);

        if (!isLowEnd) {
            const mesh = document.createElement('div');
            mesh.className = 'mesh-gradient';
            document.body.insertBefore(mesh, document.body.firstChild);
        }
    }
}

// ==========================================
// Scroll Progress Indicator
// ==========================================
class ScrollProgress {
    constructor() {
        this.progressBar = document.createElement('div');
        this.progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 2px;
            background: linear-gradient(90deg, #a855f7, #6366f1, #10b981);
            z-index: 10001;
            width: 0%;
            will-change: width;
        `;
        document.body.appendChild(this.progressBar);

        document.addEventListener('optimizedScroll', (e) => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (e.detail / windowHeight) * 100;
            this.progressBar.style.width = `${scrolled}%`;
        });
    }
}

// ==========================================
// Ripple Effect (Simplified)
// ==========================================
class RippleEffect {
    constructor() {
        const elements = document.querySelectorAll('.cta-button, .nav-cta, .platform-link, .preview-cta');
        elements.forEach(el => {
            el.addEventListener('click', (e) => {
                const rect = el.getBoundingClientRect();
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.left = `${e.clientX - rect.left}px`;
                ripple.style.top = `${e.clientY - rect.top}px`;
                el.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }
}

// ==========================================
// Screen Loader
// ==========================================
class ScreenLoader {
    constructor() {
        this.loader = document.getElementById('loader');
        this.minDisplayTime = 800; // Reduced from 1200
        this.startTime = Date.now();
        window.addEventListener('load', () => this.hideLoader());
    }

    hideLoader() {
        const elapsed = Date.now() - this.startTime;
        const remainingTime = Math.max(0, this.minDisplayTime - elapsed);

        setTimeout(() => {
            if (this.loader) {
                this.loader.classList.add('loaded');
                setTimeout(() => this.loader.remove(), 600);
            }
        }, remainingTime);
    }
}

// ==========================================
// Floating Blobs (Desktop only, simplified)
// ==========================================
class FloatingParallax {
    constructor() {
        if (!isDesktop || prefersReducedMotion || isLowEnd) return;

        this.blobs = document.querySelectorAll('.blob');
        animationController.add(() => this.update());
    }

    update() {
        if (!mouseState.moved) return;

        const mx = (mouseState.x / window.innerWidth - 0.5) * 2;
        const my = (mouseState.y / window.innerHeight - 0.5) * 2;

        this.blobs.forEach((blob, index) => {
            const speed = (index + 1) * 10;
            blob.style.transform = `translate(${mx * speed}px, ${my * speed}px)`;
        });
    }
}

// Initialize loader immediately
new ScreenLoader();

// ==========================================
// Initialize on DOM Ready
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Background
    new AuroraBackground();

    // Core (always run)
    new TextReveal();
    new CinematicScroll();
    new DramaticCounter();
    new SmoothScroll();
    new NavEffects();
    new ScrollProgress();

    // Desktop only
    if (isDesktop && !prefersReducedMotion) {
        new CursorGlowTrail();
        new CardTilt();
        new FloatingParallax();
        new TextScramble();
        new RippleEffect();
    }

    // Particles (reduced on mobile)
    if (!prefersReducedMotion) {
        new ParticleSystem();
    }
});

// ==========================================
// Reduced Motion Override
// ==========================================
if (prefersReducedMotion) {
    document.documentElement.style.setProperty('--duration-fast', '0.01s');
    document.documentElement.style.setProperty('--duration-normal', '0.01s');
    document.documentElement.style.setProperty('--duration-slow', '0.01s');
    document.documentElement.style.setProperty('--duration-slower', '0.01s');
}

// ==========================================
// Section Navigation
// ==========================================
class SectionNavigation {
    constructor() {
        this.navItems = document.querySelectorAll('.section-nav-item');
        this.sections = [];
        this.currentSection = 'hero';
        this.init();
    }

    init() {
        // Get all sections referenced in nav
        this.navItems.forEach(item => {
            const sectionId = item.dataset.section;
            const section = document.getElementById(sectionId);
            if (section) {
                this.sections.push({ id: sectionId, element: section, navItem: item });
            }

            // Click to scroll
            item.addEventListener('click', () => {
                const target = document.getElementById(sectionId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Use scroll event for more reliable tracking
        this.handleScroll = this.handleScroll.bind(this);
        window.addEventListener('scroll', this.handleScroll, { passive: true });

        // Initial check
        this.handleScroll();
    }

    handleScroll() {
        const scrollPosition = window.scrollY + window.innerHeight / 3;

        let activeSection = this.sections[0]?.id || 'hero';

        for (const { id, element } of this.sections) {
            const rect = element.getBoundingClientRect();
            const offsetTop = element.offsetTop;

            if (scrollPosition >= offsetTop) {
                activeSection = id;
            }
        }

        if (activeSection !== this.currentSection) {
            this.currentSection = activeSection;
            this.setActive(activeSection);
        }
    }

    setActive(sectionId) {
        this.navItems.forEach(item => {
            const isActive = item.dataset.section === sectionId;
            item.classList.toggle('active', isActive);
        });
    }
}

// ==========================================
// Floating CTA Button
// ==========================================
class FloatingCTA {
    constructor() {
        this.button = document.getElementById('floatingCta');
        if (!this.button) return;
        this.init();
    }

    init() {
        // Show after scrolling past hero
        const hero = document.getElementById('hero');
        if (!hero) {
            this.button.classList.add('visible');
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past)
                this.button.classList.toggle('visible', !entry.isIntersecting);
            });
        }, { threshold: 0.1 });

        observer.observe(hero);
    }
}

// ==========================================
// Signature Animation
// ==========================================
class SignatureAnimation {
    constructor() {
        this.signatureBlock = document.querySelector('.signature-block');
        if (!this.signatureBlock) return;
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(this.signatureBlock);
    }
}

// ==========================================
// Risk Accordion
// ==========================================
class RiskAccordion {
    constructor() {
        this.items = document.querySelectorAll('.risk-item');
        this.init();
    }

    init() {
        this.items.forEach(item => {
            const question = item.querySelector('.risk-question');
            if (question) {
                question.addEventListener('click', () => this.toggle(item));
            }
        });

        // Open first item by default
        if (this.items.length > 0) {
            this.items[0].classList.add('active');
        }
    }

    toggle(item) {
        const isActive = item.classList.contains('active');

        // Close all items
        this.items.forEach(i => i.classList.remove('active'));

        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    }
}

// Initialize new features
document.addEventListener('DOMContentLoaded', () => {
    new SectionNavigation();
    new FloatingCTA();
    new SignatureAnimation();
    new RiskAccordion();
});
