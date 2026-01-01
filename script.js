/**
 * LYNX PARTNERSHIP PROPOSAL
 * Cinematic Premium Interactions
 */

// ==========================================
// Text Scramble Effect
// ==========================================
class TextScramble {
    constructor() {
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.elements = document.querySelectorAll('.scramble');
        this.init();
    }

    init() {
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
        const maxIterations = length * 3;

        const interval = setInterval(() => {
            el.textContent = originalText
                .split('')
                .map((char, index) => {
                    if (char === ' ') return ' ';
                    if (index < iteration / 3) {
                        return originalText[index];
                    }
                    return this.chars[Math.floor(Math.random() * this.chars.length)];
                })
                .join('');

            iteration++;

            if (iteration >= maxIterations) {
                clearInterval(interval);
                el.textContent = originalText;
            }
        }, 30);
    }
}

// ==========================================
// Cursor Glow Trail
// ==========================================
class CursorGlowTrail {
    constructor() {
        this.trails = [];
        this.trailCount = 12;
        this.mouse = { x: 0, y: 0 };
        this.positions = [];
        this.init();
    }

    init() {
        // Create trail container
        this.container = document.createElement('div');
        this.container.className = 'cursor-trail-container';
        document.body.appendChild(this.container);

        // Create trail elements
        for (let i = 0; i < this.trailCount; i++) {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.setProperty('--trail-index', i);
            this.container.appendChild(trail);
            this.trails.push(trail);
            this.positions.push({ x: 0, y: 0 });
        }

        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        this.animate();
    }

    animate() {
        // Update positions with easing - each follows the previous
        this.positions.forEach((pos, index) => {
            const target = index === 0 ? this.mouse : this.positions[index - 1];
            const ease = 0.35 - (index * 0.02);

            pos.x += (target.x - pos.x) * ease;
            pos.y += (target.y - pos.y) * ease;

            this.trails[index].style.left = `${pos.x}px`;
            this.trails[index].style.top = `${pos.y}px`;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ==========================================
// Enhanced Custom Cursor with Magnetic Effect
// ==========================================
class MagneticCursor {
    constructor() {
        this.cursor = document.getElementById('cursor');
        this.follower = document.getElementById('cursorFollower');
        this.pos = { x: 0, y: 0 };
        this.mouse = { x: 0, y: 0 };
        this.speed = 0.12;
        this.magneticElements = [];

        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Magnetic elements
        this.magneticElements = document.querySelectorAll('.cta-button, .nav-cta, .platform-link, .cta-link');
        this.magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => this.magnetize(e, el));
            el.addEventListener('mouseleave', (e) => this.resetMagnetic(el));
        });

        // Hover states
        const hoverables = document.querySelectorAll('a, button, .chip, .feature-card, .benefit-card, .cta-button, .platform-link, .nav-cta, .compare-col');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover');
                this.follower.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover');
                this.follower.classList.remove('active');
            });
        });

        this.render();
    }

    magnetize(e, el) {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.3;
        const deltaY = (e.clientY - centerY) * 0.3;

        el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    }

    resetMagnetic(el) {
        el.style.transform = 'translate(0, 0)';
    }

    render() {
        this.pos.x += (this.mouse.x - this.pos.x) * this.speed;
        this.pos.y += (this.mouse.y - this.pos.y) * this.speed;

        if (this.cursor) {
            this.cursor.style.left = `${this.mouse.x}px`;
            this.cursor.style.top = `${this.mouse.y}px`;
        }

        if (this.follower) {
            this.follower.style.left = `${this.pos.x}px`;
            this.follower.style.top = `${this.pos.y}px`;
        }

        requestAnimationFrame(() => this.render());
    }
}

// ==========================================
// Particle System
// ==========================================
class ParticleSystem {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'particles';
        document.body.appendChild(this.container);
        this.particleCount = 25;
        this.init();
    }

    init() {
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle(i);
        }
    }

    createParticle(index) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random properties - smaller and more subtle
        const size = Math.random() * 1.5 + 0.5;
        const left = Math.random() * 100;
        const delay = Math.random() * 20;
        const duration = Math.random() * 15 + 20;

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
        `;

        // Mostly white with occasional color
        const colors = ['#ffffff', '#ffffff', '#ffffff', 'rgba(168, 85, 247, 0.6)', 'rgba(99, 102, 241, 0.6)'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        this.container.appendChild(particle);
    }
}

// ==========================================
// 3D Card Tilt Effect
// ==========================================
class CardTilt {
    constructor() {
        this.cards = document.querySelectorAll('.feature-card, .benefit-card, .compare-col');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.tilt(e, card));
            card.addEventListener('mouseleave', (e) => this.reset(card));
            card.addEventListener('mouseenter', (e) => this.updateMousePosition(e, card));
        });
    }

    updateMousePosition(e, card) {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
    }

    tilt(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;

        // Update mouse position for glow effect
        this.updateMousePosition(e, card);
    }

    reset(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    }
}

// ==========================================
// Mouse-Reactive Orbs
// ==========================================
class ReactiveOrbs {
    constructor() {
        this.orbs = document.querySelectorAll('.orb');
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.update();
        });
    }

    update() {
        this.orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.02;
            const x = (this.mouse.x - window.innerWidth / 2) * speed;
            const y = (this.mouse.y - window.innerHeight / 2) * speed;

            orb.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
}

// ==========================================
// Cinematic Scroll Animations
// ==========================================
class CinematicScroll {
    constructor() {
        this.elements = document.querySelectorAll('.fade-in, .scale-in, .blur-in');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered delay based on element position
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 50);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -80px 0px'
        });

        this.elements.forEach(el => observer.observe(el));

        // Hero elements visible immediately with stagger
        const heroElements = document.querySelectorAll('.hero .fade-in');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 150);
        });
    }
}

// ==========================================
// Text Reveal Animation
// ==========================================
class TextReveal {
    constructor() {
        this.init();
    }

    init() {
        // Wrap hero title lines in spans for animation
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const lines = heroTitle.querySelectorAll('.line');
            lines.forEach(line => {
                const text = line.innerHTML;
                line.innerHTML = `<span class="line-inner">${text}</span>`;
            });
        }
    }
}

// ==========================================
// Dramatic Number Counter
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
        const duration = 2500;
        const start = performance.now();
        const formatter = new Intl.NumberFormat();

        // Add glow effect during animation
        el.style.textShadow = '0 0 60px rgba(168, 85, 247, 0.5)';

        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);

            // Elastic easing
            const ease = progress === 1
                ? 1
                : 1 - Math.pow(2, -10 * progress) * Math.cos((progress * 10 - 0.75) * ((2 * Math.PI) / 3));

            const value = Math.floor(target * ease);
            el.textContent = formatter.format(value);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = formatter.format(target);
                // Pulse effect on complete
                el.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    el.style.transform = 'scale(1)';
                    el.style.textShadow = '';
                }, 200);
            }
        };

        requestAnimationFrame(update);
    }
}

// ==========================================
// Enhanced Smooth Scroll
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
                    const offset = 100;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ==========================================
// Navigation Effects
// ==========================================
class NavEffects {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.init();
    }

    init() {
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }
}

// ==========================================
// Aurora Background Creator
// ==========================================
class AuroraBackground {
    constructor() {
        this.init();
    }

    init() {
        // Create aurora container
        const aurora = document.createElement('div');
        aurora.className = 'aurora';
        document.body.insertBefore(aurora, document.body.firstChild);

        // Create mesh gradient
        const mesh = document.createElement('div');
        mesh.className = 'mesh-gradient';
        document.body.insertBefore(mesh, document.body.firstChild);
    }
}

// ==========================================
// Section Parallax Effect
// ==========================================
class SectionParallax {
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;

            this.sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const speed = 0.1;

                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const yPos = (rect.top - window.innerHeight / 2) * speed;
                    section.style.setProperty('--parallax-y', `${yPos}px`);
                }
            });
        });
    }
}

// ==========================================
// Glowing Buttons
// ==========================================
class GlowingButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.cta-button, .nav-cta');
        this.init();
    }

    init() {
        this.buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                button.style.setProperty('--glow-x', `${x}px`);
                button.style.setProperty('--glow-y', `${y}px`);
            });
        });
    }
}

// ==========================================
// Typing Effect for Tagline
// ==========================================
class TypingEffect {
    constructor() {
        this.tagline = document.querySelector('.tagline');
        if (this.tagline) {
            this.originalText = this.tagline.textContent;
            this.init();
        }
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.type();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(this.tagline);
    }

    type() {
        this.tagline.textContent = '';
        let i = 0;
        const speed = 50;

        const typeChar = () => {
            if (i < this.originalText.length) {
                this.tagline.textContent += this.originalText.charAt(i);
                i++;
                setTimeout(typeChar, speed);
            }
        };

        typeChar();
    }
}

// ==========================================
// Scroll Progress Indicator
// ==========================================
class ScrollProgress {
    constructor() {
        this.createProgressBar();
        this.init();
    }

    createProgressBar() {
        this.progressBar = document.createElement('div');
        this.progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 2px;
            background: linear-gradient(90deg, var(--accent), var(--brilla), var(--trade));
            z-index: 10001;
            transition: width 0.1s ease-out;
            width: 0%;
        `;
        document.body.appendChild(this.progressBar);
    }

    init() {
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.pageYOffset / windowHeight) * 100;
            this.progressBar.style.width = `${scrolled}%`;
        });
    }
}

// ==========================================
// Spotlight Effect
// ==========================================
class SpotlightEffect {
    constructor() {
        this.spotlight = document.getElementById('spotlight');
        if (!this.spotlight) return;

        this.mouse = { x: 0, y: 0 };
        this.current = { x: 0, y: 0 };
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.spotlight.classList.add('active');
        });

        document.addEventListener('mouseleave', () => {
            this.spotlight.classList.remove('active');
        });

        this.animate();
    }

    animate() {
        // Smooth follow
        this.current.x += (this.mouse.x - this.current.x) * 0.08;
        this.current.y += (this.mouse.y - this.current.y) * 0.08;

        this.spotlight.style.left = `${this.current.x}px`;
        this.spotlight.style.top = `${this.current.y}px`;

        requestAnimationFrame(() => this.animate());
    }
}

// ==========================================
// Ripple Click Effect
// ==========================================
class RippleEffect {
    constructor() {
        this.init();
    }

    init() {
        const rippleElements = document.querySelectorAll('.cta-button, .nav-cta, .platform-link, .chip, .cta-link');

        rippleElements.forEach(el => {
            el.style.position = 'relative';
            el.style.overflow = 'hidden';

            el.addEventListener('click', (e) => this.createRipple(e, el));
        });
    }

    createRipple(e, el) {
        const rect = el.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;

        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

        el.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }
}

// ==========================================
// Section Color Shift on Scroll
// ==========================================
class SectionColorShift {
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionType = this.getSectionType(entry.target);
                    this.updateRootColors(sectionType, entry.intersectionRatio);
                }
            });
        }, {
            threshold: [0, 0.25, 0.5, 0.75, 1]
        });

        this.sections.forEach(section => observer.observe(section));
    }

    getSectionType(section) {
        if (section.classList.contains('section-brilla')) return 'brilla';
        if (section.classList.contains('section-trade')) return 'trade';
        if (section.classList.contains('section-cta')) return 'cta';
        return 'default';
    }

    updateRootColors(type, ratio) {
        const root = document.documentElement;

        switch(type) {
            case 'brilla':
                root.style.setProperty('--active-glow', `rgba(99, 102, 241, ${0.15 * ratio})`);
                break;
            case 'trade':
                root.style.setProperty('--active-glow', `rgba(16, 185, 129, ${0.15 * ratio})`);
                break;
            case 'cta':
                root.style.setProperty('--active-glow', `rgba(168, 85, 247, ${0.2 * ratio})`);
                break;
            default:
                root.style.setProperty('--active-glow', 'transparent');
        }
    }
}

// ==========================================
// Enhanced Link Glow
// ==========================================
class LinkGlow {
    constructor() {
        this.links = document.querySelectorAll('.platform-link, .cta-link');
        this.init();
    }

    init() {
        this.links.forEach(link => {
            link.addEventListener('mousemove', (e) => {
                const rect = link.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                link.style.setProperty('--glow-x', `${x}%`);
                link.style.setProperty('--glow-y', `${y}%`);
            });
        });
    }
}

// ==========================================
// Split Text Animation
// ==========================================
class SplitTextReveal {
    constructor() {
        this.elements = document.querySelectorAll('.hero-title .line');
        this.init();
    }

    init() {
        this.elements.forEach((line, lineIndex) => {
            const text = line.innerHTML;
            const chars = text.split('');

            // Only process if not already wrapped
            if (!line.querySelector('.char')) {
                line.innerHTML = chars.map((char, i) => {
                    if (char === ' ') return ' ';
                    if (char === '<') return char; // Skip HTML tags
                    const delay = (lineIndex * 0.1) + (i * 0.02);
                    return `<span class="char" style="animation-delay: ${delay}s">${char}</span>`;
                }).join('');
            }
        });
    }
}

// ==========================================
// Floating Elements Parallax
// ==========================================
class FloatingParallax {
    constructor() {
        this.blobs = document.querySelectorAll('.blob');
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
            this.mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
            this.update();
        });
    }

    update() {
        this.blobs.forEach((blob, index) => {
            const speed = (index + 1) * 15;
            const x = this.mouse.x * speed;
            const y = this.mouse.y * speed;
            blob.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
}

// ==========================================
// Initialize Everything
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Create background effects first
    new AuroraBackground();

    // Only init cursor effects on desktop
    if (window.innerWidth > 768) {
        new MagneticCursor();
        new CardTilt();
        new ReactiveOrbs();
        new CursorGlowTrail();
        new SpotlightEffect();
        new FloatingParallax();
    }

    // Core functionality
    new ParticleSystem();
    new TextReveal();
    new TextScramble();
    new CinematicScroll();
    new DramaticCounter();
    new SmoothScroll();
    new NavEffects();
    new GlowingButtons();
    new SectionParallax();
    new ScrollProgress();
    new RippleEffect();
    new SectionColorShift();
    new LinkGlow();

    // Delayed effects
    setTimeout(() => {
        new TypingEffect();
    }, 1000);

    // Console branding
    console.log('%c✦ LYNX PARTNERSHIP PROPOSAL', 'font-size: 24px; font-weight: 800; color: #a855f7; font-family: system-ui;');
    console.log('%cCinematic Premium Experience', 'font-size: 12px; color: #71717a; font-family: system-ui;');
    console.log('%c─────────────────────────────', 'color: #27272a;');
});

// ==========================================
// Performance: Reduce animations on low-end devices
// ==========================================
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.documentElement.style.setProperty('--duration-slow', '0.4s');
    document.documentElement.style.setProperty('--duration-slower', '0.6s');
}

// ==========================================
// Prefers Reduced Motion
// ==========================================
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--duration-fast', '0s');
    document.documentElement.style.setProperty('--duration-normal', '0s');
    document.documentElement.style.setProperty('--duration-slow', '0s');
    document.documentElement.style.setProperty('--duration-slower', '0s');
}
