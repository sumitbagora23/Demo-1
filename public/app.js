/* ========================================================================
   CK Group Portal Interactive Script System
   Features: Hybrid Database layer (API <-> IndexedDB), Admin Controls, visual effects
   ======================================================================== */

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. Load Visual Effects & Menu bindings
    initVisualEffects();
    initMobileNav();

    // 2. Register Form Submit + live validation listeners
    initContactForm();
});

// --- Visual Effects & Canvas Animations ---
function initVisualEffects() {
    // Page Loader fader
    const loader = document.getElementById('page-loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 600);
        }, 800);
    }

    // Scroll Progress bar
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        const progress = document.getElementById('scroll-progress');
        if (progress) {
            progress.style.width = scrolled + '%';
        }
    });

    // Mouse Glow tracking
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    }

    // Particles Canvas background
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();
        
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 0.15 - 0.075;
                this.speedY = Math.random() * 0.15 - 0.075;
                this.opacity = Math.random() * 0.4 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        for (let i = 0; i < 40; i++) {
            particles.push(new Particle());
        }
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        };
        animate();
    }
}

// --- Mobile Navigation ---
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const panel = document.getElementById('mobile-panel');

    if (hamburger && panel) {
        hamburger.addEventListener('click', () => {
            const isClosed = panel.classList.contains('translate-x-full');
            if (isClosed) {
                panel.classList.remove('translate-x-full');
                hamburger.querySelector('span:nth-child(1)').style.transform = 'translateY(6px) rotate(45deg)';
                hamburger.querySelector('span:nth-child(2)').style.opacity = '0';
                hamburger.querySelector('span:nth-child(3)').style.transform = 'translateY(-6px) rotate(-45deg)';
            } else {
                panel.classList.add('translate-x-full');
                hamburger.querySelector('span:nth-child(1)').style.transform = 'none';
                hamburger.querySelector('span:nth-child(2)').style.opacity = '1';
                hamburger.querySelector('span:nth-child(3)').style.transform = 'none';
            }
        });
    }
}

function toggleMobileMenu() {
    const panel = document.getElementById('mobile-panel');
    const hamburger = document.getElementById('hamburger');
    
    if (panel) {
        panel.classList.add('translate-x-full');
    }
    if (hamburger) {
        hamburger.querySelector('span:nth-child(1)').style.transform = 'none';
        hamburger.querySelector('span:nth-child(2)').style.opacity = '1';
        hamburger.querySelector('span:nth-child(3)').style.transform = 'none';
    }
}

// --- Form Validation ---

// Each validator returns `true` when valid, or an error message string.
const FIELD_VALIDATORS = {
    inquiry_type: (v) =>
        v.trim() !== '' || 'Please select an enquiry type.',
    full_name: (v) => {
        const t = v.trim();
        if (t.length < 2) return 'Please enter your full name (at least 2 characters).';
        if (!/^[\p{L}\s.'-]+$/u.test(t)) return 'Name can only contain letters, spaces, . \' and -.';
        return true;
    },
    email: (v) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email address.',
    phone: (v) => {
        const t = v.trim();
        if (t === '') return true; // optional
        return /^[+]?[\d\s().-]{7,20}$/.test(t) || 'Please enter a valid phone number.';
    },
    details: (v) => {
        const t = v.trim();
        if (t.length < 10) return 'Please add a few more details (at least 10 characters).';
        return true;
    }
};

function getFieldEl(name) {
    return document.getElementById(name);
}

function setFieldError(name, message) {
    const field = getFieldEl(name);
    const errEl = document.getElementById('err-' + name);
    if (!field || !errEl) return;

    // The select sits inside a styled wrapper; border lives on that wrapper.
    const borderTarget = name === 'inquiry_type' ? field.parentElement : field;

    if (message) {
        borderTarget.classList.add('border-red-500/70');
        borderTarget.classList.remove('border-white/10');
        field.setAttribute('aria-invalid', 'true');
        errEl.textContent = message;
        errEl.classList.remove('hidden');
    } else {
        borderTarget.classList.remove('border-red-500/70');
        borderTarget.classList.add('border-white/10');
        field.removeAttribute('aria-invalid');
        errEl.textContent = '';
        errEl.classList.add('hidden');
    }
}

// Validate a single field; returns true if valid.
function validateField(name) {
    const field = getFieldEl(name);
    if (!field) return true;
    const result = FIELD_VALIDATORS[name](field.value);
    setFieldError(name, result === true ? null : result);
    return result === true;
}

// Validate the whole form; focuses the first invalid field.
function validateContactForm() {
    let firstInvalid = null;
    Object.keys(FIELD_VALIDATORS).forEach((name) => {
        const ok = validateField(name);
        if (!ok && !firstInvalid) firstInvalid = name;
    });
    if (firstInvalid) getFieldEl(firstInvalid).focus();
    return !firstInvalid;
}

function initContactForm() {
    const form = document.getElementById('main-contact-form');
    if (!form) return;

    // Live feedback: validate on blur, and clear the error as the user fixes it.
    Object.keys(FIELD_VALIDATORS).forEach((name) => {
        const field = getFieldEl(name);
        if (!field) return;
        field.addEventListener('blur', () => validateField(name));
        field.addEventListener('input', () => {
            if (field.getAttribute('aria-invalid') === 'true') validateField(name);
        });
        if (field.tagName === 'SELECT') {
            field.addEventListener('change', () => validateField(name));
        }
    });

    form.addEventListener('submit', handleContactSubmit);
}

// --- Form Submission Logic ---
async function handleContactSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = document.getElementById('form-submit-btn');
    const spinner = submitBtn.querySelector('.btn-spinner');
    const btnText = submitBtn.querySelector('.btn-text');

    // 1. Frontend validation gate
    if (!validateContactForm()) {
        showToast('Please correct the highlighted fields.', 'error');
        return;
    }

    const formData = {
        inquiry_type: form.inquiry_type.value,
        full_name: form.full_name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim() || null,
        details: form.details.value.trim()
    };

    // 2. Ensure Firebase layer is available
    if (typeof window.ckSaveInquiry !== 'function') {
        showToast('Form service is still loading. Please try again in a moment.', 'error');
        return;
    }

    submitBtn.disabled = true;
    spinner.classList.remove('hidden');
    btnText.style.opacity = '0.7';

    try {
        const result = await window.ckSaveInquiry(formData);

        // Populate receipt summary inside confirmation success modal
        const refId = result.id ? String(result.id).slice(-6).toUpperCase() : Math.floor(Math.random() * 9000 + 1000);
        document.getElementById('receipt-id').innerText = `#CK-${refId}`;
        document.getElementById('receipt-type').innerText = formData.inquiry_type;
        document.getElementById('receipt-name').innerText = formData.full_name;

        document.getElementById('success-modal').classList.remove('hidden');
        form.reset();
        Object.keys(FIELD_VALIDATORS).forEach((name) => setFieldError(name, null));
        showToast('Inquiry sent successfully!', 'success');

    } catch (error) {
        console.error("Submission failed:", error);
        showToast(`Failed to send inquiry: ${error.message}`, 'error');
    } finally {
        submitBtn.disabled = false;
        spinner.classList.add('hidden');
        btnText.style.opacity = '1';
    }
}

function closeSuccessModal() {
    document.getElementById('success-modal').classList.add('hidden');
}

// --- Toast Alerts ---
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast-notify');
    const toastText = document.getElementById('toast-msg-text');
    const toastIcon = document.getElementById('toast-icon-wrapper');

    if (!toast || !toastText) return;

    toastText.innerText = message;
    toast.className = `toast-notification active ${type}`;

    if (type === 'success') {
        toastIcon.innerHTML = '<i class="fa-solid fa-circle-check text-emerald-400"></i>';
    } else if (type === 'error') {
        toastIcon.innerHTML = '<i class="fa-solid fa-circle-exclamation text-red-500"></i>';
    } else {
        toastIcon.innerHTML = '<i class="fa-solid fa-circle-info text-sky-400"></i>';
    }

    setTimeout(() => {
        toast.classList.remove('active');
    }, 4000);
}


