// ============================================
// AUTH.JS - Authentication & Role Management
// ============================================

// Auth State
let currentUser = null;
let isLoggedIn = false;
let userRole = null; // 'admin' or 'kitchen'

// Triple-click detection for login access
let logoClickCount = 0;
let logoClickTimer = null;

// Initialize authentication from localStorage
function initAuth() {
    const token = localStorage.getItem('cafeToken');
    const role = localStorage.getItem('cafeUserRole');

    if (token && role) {
        isLoggedIn = true;
        userRole = role;
        currentUser = { token, role };
    }
}

// Initialize login access via logo triple-click
function initLoginAccess() {
    const brandLogo = document.getElementById('brandLogo');
    if (!brandLogo) return;

    brandLogo.addEventListener('click', handleLogoClick);

    // Add shake animation style
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px) rotate(-5deg); }
            75% { transform: translateX(10px) rotate(5deg); }
        }
    `;
    document.head.appendChild(shakeStyle);
}

// Handle logo click for triple-click detection
function handleLogoClick(e) {
    logoClickCount++;

    // Clear previous timer
    if (logoClickTimer) {
        clearTimeout(logoClickTimer);
    }

    // Reset counter after 1 second of no clicks
    logoClickTimer = setTimeout(() => {
        logoClickCount = 0;
    }, 1000);

    // Check if triple clicked
    if (logoClickCount === 3) {
        logoClickCount = 0;
        clearTimeout(logoClickTimer);
        showLoginModal();

        // Add subtle feedback
        const brandLogo = e.target.closest('#brandLogo') || e.target;
        brandLogo.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            brandLogo.style.animation = '';
        }, 500);
    }
}

// Show Login Modal
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.getElementById('loginUsername').focus();
        // Reset form
        document.getElementById('loginForm').reset();
        const errorEl = document.getElementById('loginError');
        if (errorEl) errorEl.classList.add('hidden');
    }
}

// Close Login Modal
function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('hidden');
        document.getElementById('loginForm').reset();
        const errorEl = document.getElementById('loginError');
        if (errorEl) errorEl.classList.add('hidden');
    }
}

// Handle Login Form Submit
async function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await cafeAPI.login({ username, password });

        if (response.success) {
            isLoggedIn = true;
            userRole = response.user?.role || 'admin';
            currentUser = response.user;

            closeLoginModal();

            // Show success message for 1 second
            showToast('Login successful!', 'success');

            // Navigate based on role
            setTimeout(() => {
                if (userRole === 'kitchen') {
                    showKitchenDashboard();
                } else {
                    showAdminDashboard();
                }
            }, 1000);
        } else {
            showLoginError('Invalid credentials');
        }
    } catch (error) {
        console.error('Login error:', error);
        showLoginError('Login failed. Please try again.');
    }
}

// Show login error
function showLoginError(message) {
    const errorEl = document.getElementById('loginError');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
    }

    // Clear password
    document.getElementById('loginPassword').value = '';
    document.getElementById('loginPassword').focus();

    // Shake the form
    const form = document.getElementById('loginForm');
    form.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        form.style.animation = '';
    }, 500);
}

// Logout
function logout() {
    cafeAPI.logout();

    isLoggedIn = false;
    userRole = null;
    currentUser = null;

    // Navigate back to landing page
    hideAllPages();
    document.getElementById('landingPage').classList.remove('hidden');
    document.querySelector('.header').classList.add('hidden');

    // Show bottom nav for customer
    showBottomNav();

    showToast('Logged out successfully', 'success');
}

// Check if user has specific role
function hasRole(role) {
    return isLoggedIn && userRole === role;
}

// Check if user is admin
function isAdmin() {
    return hasRole('admin');
}

// Check if user is kitchen staff
function isKitchen() {
    return hasRole('kitchen');
}

// Check if user is logged in
function isAuthenticated() {
    return isLoggedIn;
}

// Get current user role
function getCurrentRole() {
    return userRole;
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Require authentication for a function
function requireAuth(callback, requiredRole = null) {
    return function(...args) {
        if (!isLoggedIn) {
            showToast('Please login to continue', 'error');
            showLoginModal();
            return;
        }

        if (requiredRole && userRole !== requiredRole) {
            showToast('Access denied', 'error');
            return;
        }

        return callback.apply(this, args);
    };
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const loginModal = document.getElementById('loginModal');
    if (e.target === loginModal) {
        closeLoginModal();
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initAuth,
        initLoginAccess,
        showLoginModal,
        closeLoginModal,
        handleLogin,
        logout,
        hasRole,
        isAdmin,
        isKitchen,
        isAuthenticated,
        getCurrentRole,
        getCurrentUser,
        requireAuth
    };
}
