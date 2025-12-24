/**
 * LYNX ACN PARTNERSHIP PROPOSAL
 * Premium Slide-Based Presentation
 * Interactive JavaScript
 */

// ==========================================
// PARTICLE BACKGROUND
// ==========================================
class ParticleBackground {
    constructor() {
        this.canvas = document.getElementById('particles');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.mouse = { x: null, y: null, radius: 150 };

        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        this.resize();
        this.createParticles();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    drawParticles() {
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Mouse interaction
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = particle.x - this.mouse.x;
                const dy = particle.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    particle.x += dx * force * 0.03;
                    particle.y += dy * force * 0.03;
                }
            }

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(139, 92, 246, ${particle.opacity})`;
            this.ctx.fill();

            // Draw connections
            this.particles.slice(index + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * (1 - distance / 120)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// ==========================================
// SLIDE PRESENTATION
// ==========================================
class SlidePresentation {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.isAnimating = false;
        this.touchStartX = 0;
        this.touchEndX = 0;

        this.init();
    }

    init() {
        this.createIndicators();
        this.updateUI();
        this.setupEventListeners();
        this.hideKeyboardHint();
    }

    createIndicators() {
        const container = document.getElementById('slideIndicators');
        for (let i = 0; i < this.totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = `indicator${i === 0 ? ' active' : ''}`;
            indicator.addEventListener('click', () => this.goToSlide(i));
            container.appendChild(indicator);
        }
    }

    updateUI() {
        // Update slide counter
        document.getElementById('currentSlide').textContent =
            String(this.currentSlide + 1).padStart(2, '0');
        document.getElementById('totalSlides').textContent =
            String(this.totalSlides).padStart(2, '0');

        // Update progress bar
        const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;

        // Update indicators
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });

        // Update nav buttons
        document.getElementById('prevBtn').disabled = this.currentSlide === 0;
        document.getElementById('nextBtn').disabled = this.currentSlide === this.totalSlides - 1;
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentSlide) return;
        if (index < 0 || index >= this.totalSlides) return;

        this.isAnimating = true;

        // Remove active class from current slide
        this.slides[this.currentSlide].classList.remove('active');
        this.slides[this.currentSlide].classList.add(index > this.currentSlide ? 'prev' : '');

        // Update current slide index
        const previousSlide = this.currentSlide;
        this.currentSlide = index;

        // Add active class to new slide
        setTimeout(() => {
            this.slides[previousSlide].classList.remove('prev');
            this.slides[this.currentSlide].classList.add('active');
            this.updateUI();

            // Trigger number animations if on stats slides
            this.triggerSlideAnimations();

            setTimeout(() => {
                this.isAnimating = false;
            }, 800);
        }, 50);
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    prevSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    triggerSlideAnimations() {
        const currentSlideEl = this.slides[this.currentSlide];

        // Animate big numbers
        const bigNumbers = currentSlideEl.querySelectorAll('.big-number[data-count]');
        bigNumbers.forEach(num => {
            const target = parseInt(num.dataset.count);
            this.animateNumber(num, target);
        });
    }

    animateNumber(element, target) {
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (target - startValue) * easeProgress);

            element.textContent = currentValue.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target.toLocaleString();
            }
        };

        requestAnimationFrame(update);
    }

    hideKeyboardHint() {
        setTimeout(() => {
            document.getElementById('keyboardHint').classList.add('hidden');
        }, 5000);
    }

    setupEventListeners() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowRight':
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides - 1);
                    break;
            }
        });

        // Button navigation
        document.getElementById('prevBtn').addEventListener('click', () => this.prevSlide());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextSlide());

        // Touch/swipe navigation
        document.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });

        // Mouse wheel navigation (optional, can feel aggressive)
        let wheelTimeout;
        document.addEventListener('wheel', (e) => {
            if (wheelTimeout) return;

            wheelTimeout = setTimeout(() => {
                wheelTimeout = null;
            }, 1000);

            if (e.deltaY > 50) {
                this.nextSlide();
            } else if (e.deltaY < -50) {
                this.prevSlide();
            }
        }, { passive: true });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
}

// ==========================================
// CHART ANIMATION
// ==========================================
class ChartAnimation {
    constructor() {
        this.observeCharts();
    }

    observeCharts() {
        const chartPaths = document.querySelectorAll('.chart-path');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'none';
                    entry.target.offsetHeight; // Trigger reflow
                    entry.target.style.animation = 'drawLine 2s ease forwards';
                }
            });
        }, { threshold: 0.5 });

        chartPaths.forEach(path => observer.observe(path));
    }
}

// ==========================================
// HOVER EFFECTS
// ==========================================
class HoverEffects {
    constructor() {
        this.init();
    }

    init() {
        // Add hover glow effect to cards
        document.querySelectorAll('.stat-card, .platform-chip, .winwin-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });

        // Magnetic button effect
        document.querySelectorAll('.cta-btn, .nav-arrow').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }
}

// ==========================================
// PRELOADER (Optional)
// ==========================================
class Preloader {
    constructor() {
        this.init();
    }

    init() {
        // Wait for fonts to load
        document.fonts.ready.then(() => {
            document.body.classList.add('loaded');
        });
    }
}

// ==========================================
// AUTO-ADVANCE (Optional - for kiosk mode)
// ==========================================
class AutoAdvance {
    constructor(presentation, interval = 10000) {
        this.presentation = presentation;
        this.interval = interval;
        this.timer = null;
        this.isPaused = true; // Start paused by default
    }

    start() {
        this.isPaused = false;
        this.timer = setInterval(() => {
            if (!this.isPaused) {
                if (this.presentation.currentSlide < this.presentation.totalSlides - 1) {
                    this.presentation.nextSlide();
                } else {
                    this.presentation.goToSlide(0);
                }
            }
        }, this.interval);
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    stop() {
        clearInterval(this.timer);
        this.timer = null;
    }
}

// ==========================================
// INITIALIZE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Core features
    const particles = new ParticleBackground();
    const presentation = new SlidePresentation();
    const charts = new ChartAnimation();
    const effects = new HoverEffects();

    // Optional features
    const preloader = new Preloader();
    // const autoAdvance = new AutoAdvance(presentation, 8000);
    // autoAdvance.start(); // Uncomment to enable auto-advance

    // Console branding
    console.log('%c🚀 Partnership Proposal', 'font-size: 24px; font-weight: bold; color: #8B5CF6;');
    console.log('%cLynx Group × Tech Creative', 'font-size: 14px; color: #A78BFA;');
    console.log('%cBrillaPrep.org | TradeMetricsPro.com', 'font-size: 12px; color: #64748B;');

    // Expose presentation for debugging
    window.presentation = presentation;
});

// ==========================================
// FULLSCREEN TOGGLE (Press F for fullscreen)
// ==========================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen not supported');
            });
        } else {
            document.exitFullscreen();
        }
    }
});
