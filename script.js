/**
 * LYNX PARTNERSHIP PROPOSAL
 * Premium Presentation — Refined JavaScript
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
        const hoverables = document.querySelectorAll('a, button, .chip, .dot, .benefit-card, .stat-card');
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
// Slide Presentation
// ==========================================
class Presentation {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.getElementById('dots');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.progressCircle = document.getElementById('progressCircle');
        this.progressText = document.getElementById('progressText');

        this.current = 0;
        this.total = this.slides.length;
        this.isAnimating = false;

        this.init();
    }

    init() {
        this.createDots();
        this.bindEvents();
        this.updateProgress();
        this.triggerSlideAnimations();
    }

    createDots() {
        for (let i = 0; i < this.total; i++) {
            const dot = document.createElement('div');
            dot.className = `dot${i === 0 ? ' active' : ''}`;
            dot.addEventListener('click', () => this.goTo(i));
            this.dots.appendChild(dot);
        }
    }

    bindEvents() {
        // Buttons
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());

        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                this.next();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prev();
            } else if (e.key === 'f' || e.key === 'F') {
                this.toggleFullscreen();
            }
        });

        // Touch
        let touchStartX = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? this.next() : this.prev();
            }
        }, { passive: true });

        // Wheel
        let wheelTimeout;
        document.addEventListener('wheel', (e) => {
            if (wheelTimeout) return;
            wheelTimeout = setTimeout(() => wheelTimeout = null, 800);

            if (e.deltaY > 30) this.next();
            else if (e.deltaY < -30) this.prev();
        }, { passive: true });
    }

    goTo(index) {
        if (this.isAnimating || index === this.current) return;
        if (index < 0 || index >= this.total) return;

        this.isAnimating = true;

        // Update slides
        this.slides[this.current].classList.remove('active');
        this.current = index;
        this.slides[this.current].classList.add('active');

        // Update dots
        document.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === this.current);
        });

        // Update buttons
        this.prevBtn.disabled = this.current === 0;
        this.nextBtn.disabled = this.current === this.total - 1;

        this.updateProgress();
        this.triggerSlideAnimations();

        setTimeout(() => this.isAnimating = false, 600);
    }

    next() {
        if (this.current < this.total - 1) this.goTo(this.current + 1);
    }

    prev() {
        if (this.current > 0) this.goTo(this.current - 1);
    }

    updateProgress() {
        const progress = ((this.current + 1) / this.total) * 100;
        const circumference = 2 * Math.PI * 16; // r=16
        const offset = circumference - (progress / 100) * circumference;

        this.progressCircle.style.strokeDasharray = circumference;
        this.progressCircle.style.strokeDashoffset = offset;
        this.progressText.textContent = this.current + 1;
    }

    triggerSlideAnimations() {
        const slide = this.slides[this.current];

        // Animate numbers
        slide.querySelectorAll('.mega-number[data-count]').forEach(el => {
            this.animateNumber(el, parseInt(el.dataset.count));
        });
    }

    animateNumber(el, target) {
        const duration = 2000;
        const start = performance.now();

        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);
            const value = Math.floor(target * ease);

            el.textContent = value.toLocaleString();

            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target.toLocaleString();
        };

        requestAnimationFrame(update);
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen();
        }
    }
}

// ==========================================
// Chart Animation
// ==========================================
class ChartAnimator {
    constructor() {
        this.observe();
    }

    observe() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const path = entry.target.querySelector('.chart-line');
                    if (path) {
                        path.style.animation = 'none';
                        path.offsetHeight;
                        path.style.animation = 'drawChart 1.5s ease forwards';
                    }
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.dash-chart').forEach(el => observer.observe(el));
    }
}

// ==========================================
// Ambient Light Updater
// ==========================================
class AmbientLight {
    constructor() {
        this.light = document.querySelector('.ambient-light');
        this.observe();
    }

    observe() {
        const slides = document.querySelectorAll('.slide');

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.classList.contains('active')) {
                    const theme = mutation.target.dataset.theme;
                    this.updateTheme(theme);
                }
            });
        });

        slides.forEach(slide => {
            observer.observe(slide, { attributes: true, attributeFilter: ['class'] });
        });

        // Initial theme
        const activeSlide = document.querySelector('.slide.active');
        if (activeSlide) this.updateTheme(activeSlide.dataset.theme);
    }

    updateTheme(theme) {
        const colors = {
            dark: 'rgba(139, 92, 246, 0.15)',
            brilla: 'rgba(99, 102, 241, 0.12)',
            trade: 'rgba(16, 185, 129, 0.1)',
            cta: 'rgba(168, 85, 247, 0.2)'
        };

        const color = colors[theme] || colors.dark;
        this.light.style.background = `radial-gradient(ellipse at center, ${color} 0%, transparent 70%)`;
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

    new Presentation();
    new ChartAnimator();
    new AmbientLight();

    // Add SVG gradient for chart
    const svg = document.querySelector('.dash-chart svg');
    if (svg) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = `
            <linearGradient id="tradeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#10b981"/>
                <stop offset="100%" stop-color="#3b82f6"/>
            </linearGradient>
        `;
        svg.insertBefore(defs, svg.firstChild);
    }

    // Console branding
    console.log('%c✦ Partnership Proposal', 'font-size: 20px; font-weight: 600; color: #a855f7;');
    console.log('%cLynx Group × Tech Creative', 'font-size: 12px; color: #71717a;');
});
