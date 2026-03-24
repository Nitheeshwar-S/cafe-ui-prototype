// ============================================
// MAIN.JS - App Initialization
// ============================================

// Global state for orders (shared across modules)
let orders = [];

// Initialize the App
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Cafe Coffeto - Initializing...');

    // Load orders from localStorage
    loadOrdersFromStorage();

    // Load combos from API or use defaults
    await loadCombos();

    // Initialize authentication
    initAuth();

    // Initialize login access (triple-click)
    initLoginAccess();

    // Initialize UI
    renderMenuItems();
    updateCartCount();

    // Initialize reviews
    await renderReviews();

    // Initialize promo carousel
    showPromoSlide(0);
    startPromoAutoSlide();

    // Add promo carousel hover pause
    const promoCarousel = document.querySelector('.promo-carousel');
    if (promoCarousel) {
        promoCarousel.addEventListener('mouseenter', () => {
            clearInterval(promoSlideInterval);
        });
        promoCarousel.addEventListener('mouseleave', () => {
            startPromoAutoSlide();
        });
    }

    // Initialize special instructions character counter
    const textarea = document.getElementById('itemSpecialInstructions');
    if (textarea) {
        textarea.addEventListener('input', updateCharCount);
    }

    // Initialize floating particles
    createFloatingParticles();

    // Add keyboard navigation support
    initKeyboardNavigation();

    // Add toast styles
    addToastStyles();

    // Add ripple effect
    initRippleEffect();

    console.log('Cafe Coffeto - Ready!');
});

// Load combos from API or use defaults
async function loadCombos() {
    try {
        const response = await cafeAPI.getCombos();
        if (response.success && response.data && response.data.length > 0) {
            combos = response.data;
        }
    } catch (error) {
        console.warn('Using default combos due to API error:', error.message);
        combos = [...defaultCombos];
    }
}

// Load orders from localStorage
function loadOrdersFromStorage() {
    try {
        const storedOrders = localStorage.getItem('cafeOrders');
        if (storedOrders) {
            orders = JSON.parse(storedOrders);
        }
    } catch (error) {
        console.warn('Error loading orders from localStorage:', error);
        orders = [];
    }
}

// Create floating coffee particles in background
function createFloatingParticles() {
    const particles = ['coffee', 'pastry', 'cake', 'coffee', 'drink'];
    const body = document.body;

    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.fontSize = '2rem';
        particle.style.opacity = '0.05';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '0';
        particle.textContent = ['*', '**', '*', '**', '*'][Math.floor(Math.random() * 5)];
        particle.style.color = THEME.primary;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${5 + Math.random() * 5}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        body.appendChild(particle);
    }

    // Add float animation
    const floatStyle = document.createElement('style');
    floatStyle.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(10deg); }
        }
    `;
    document.head.appendChild(floatStyle);
}

// Initialize keyboard navigation support
function initKeyboardNavigation() {
    const focusableElements = document.querySelectorAll('button, a, input, textarea, select');
    focusableElements.forEach(el => {
        el.addEventListener('focus', () => {
            el.style.outline = `2px solid ${THEME.primary}`;
            el.style.outlineOffset = '2px';
        });

        el.addEventListener('blur', () => {
            el.style.outline = 'none';
        });
    });
}

// Add toast notification styles
function addToastStyles() {
    const toastStyle = document.createElement('style');
    toastStyle.textContent = `
        .toast-notification {
            position: fixed;
            top: -100px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
            z-index: 10000;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            max-width: 90%;
        }

        .toast-notification.show {
            top: 20px;
        }

        .toast-notification i {
            font-size: 1.25rem;
        }

        .toast-success i {
            color: #4CAF50;
        }

        .toast-error i {
            color: #f44336;
        }

        .toast-notification span {
            font-size: 0.95rem;
            font-weight: 500;
        }

        .cart-bounce {
            animation: cartBounce 0.5s ease;
        }

        @keyframes cartBounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .fade-in-up {
            animation: fadeInUp 0.5s ease backwards;
        }
    `;
    document.head.appendChild(toastStyle);
}

// Add ripple effect on button click
function initRippleEffect() {
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            const btn = e.target.tagName === 'BUTTON' ? e.target : e.target.closest('button');
            createRipple(btn, e);
        }
    });

    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
}

function createRipple(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s ease-out';
    ripple.style.pointerEvents = 'none';

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to search
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', debounce(searchMenu, 300));
}

// Scroll to top helper
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadCombos,
        loadOrdersFromStorage,
        createFloatingParticles,
        debounce,
        scrollToTop
    };
}
