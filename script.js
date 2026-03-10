// Menu Data
const menuItems = [
    // Coffee & Hot Drinks
    {
        id: 1,
        name: "Caffe Mocha",
        category: "coffee",
        price: 349,
        description: "Deep Foam",
        image: "https://images.unsplash.com/photo-1607260550778-aa9d29444ce1?w=400&h=300&fit=crop",
        rating: 4.8,
        sizes: ["S", "M", "L"]
    },
    {
        id: 2,
        name: "Flat White",
        category: "coffee",
        price: 299,
        description: "Espresso",
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop",
        rating: 4.6,
        sizes: ["S", "M", "L"]
    },
    {
        id: 3,
        name: "Cappuccino",
        category: "coffee",
        price: 329,
        description: "With Steamed Milk",
        image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&h=300&fit=crop",
        rating: 4.9,
        sizes: ["S", "M", "L"]
    },
    {
        id: 4,
        name: "Caffe Latte",
        category: "coffee",
        price: 359,
        description: "With Milk",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop",
        rating: 4.7,
        sizes: ["S", "M", "L"]
    },
    {
        id: 5,
        name: "Americano",
        category: "coffee",
        price: 279,
        description: "With Water",
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop",
        rating: 4.5,
        sizes: ["S", "M", "L"]
    },
    {
        id: 6,
        name: "Espresso",
        category: "coffee",
        price: 259,
        description: "Pure Coffee",
        image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop",
        rating: 4.8,
        sizes: ["S", "M"]
    },
    
    // Cold Drinks
    {
        id: 7,
        name: "Iced Coffee",
        category: "cold-drinks",
        price: 329,
        description: "With Ice",
        image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop",
        rating: 4.6,
        sizes: ["M", "L"]
    },
    {
        id: 8,
        name: "Iced Latte",
        category: "cold-drinks",
        price: 379,
        description: "With Milk",
        image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop",
        rating: 4.7,
        sizes: ["M", "L"]
    },
    {
        id: 9,
        name: "Frappe",
        category: "cold-drinks",
        price: 429,
        description: "Blended",
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop",
        rating: 4.8,
        sizes: ["M", "L"]
    },
    {
        id: 10,
        name: "Cold Brew",
        category: "cold-drinks",
        price: 399,
        description: "Slow Steeped",
        image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop",
        rating: 4.9,
        sizes: ["M", "L"]
    },
    
    // Food & Snacks
    {
        id: 11,
        name: "Croissant",
        category: "food",
        price: 249,
        description: "French Pastry",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop",
        rating: 4.5,
        sizes: []
    },
    {
        id: 12,
        name: "Blueberry Muffin",
        category: "food",
        price: 279,
        description: "Fresh Baked",
        image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=300&fit=crop",
        rating: 4.7,
        sizes: []
    },
    
    // Desserts
    {
        id: 13,
        name: "Chocolate Cake",
        category: "desserts",
        price: 429,
        description: "With Ganache",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
        rating: 4.9,
        sizes: []
    },
    {
        id: 14,
        name: "Cheesecake",
        category: "desserts",
        price: 449,
        description: "New York Style",
        image: "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=400&h=300&fit=crop",
        rating: 4.8,
        sizes: []
    }
];

// Cart State
let cart = [];
let currentCategory = 'all';
let selectedItem = null;
let modalQuantity = 1;
let selectedPaymentMethod = 'cash';

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    renderMenuItems();
    updateCartCount();
    createFloatingParticles();
});

// Create floating coffee particles in background
function createFloatingParticles() {
    const particles = ['☕', '🥐', '🍰', '☕', '🥤'];
    const body = document.body;
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.fontSize = '2rem';
        particle.style.opacity = '0.1';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '0';
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${5 + Math.random() * 5}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        body.appendChild(particle);
    }
}

// Navigation Functions
function showMenu() {
    hideAllPages();
    document.getElementById('menuPage').classList.remove('hidden');
    document.querySelector('.header').classList.remove('hidden');
    
    // Add stagger animation to menu items
    setTimeout(() => {
        const items = document.querySelectorAll('.menu-item');
        items.forEach((item, index) => {
            item.style.animation = `fadeInUp 0.5s ease ${index * 0.05}s backwards`;
        });
    }, 50);
}

function showCart() {
    hideAllPages();
    document.getElementById('cartPage').classList.remove('hidden');
    document.querySelector('.header').classList.remove('hidden');
    renderCartItems();
}

function showCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    hideAllPages();
    document.getElementById('checkoutPage').classList.remove('hidden');
    document.querySelector('.header').classList.remove('hidden');
    renderCheckoutSummary();
}

function hideAllPages() {
    document.getElementById('landingPage').classList.add('hidden');
    document.getElementById('menuPage').classList.add('hidden');
    document.getElementById('cartPage').classList.add('hidden');
    document.getElementById('checkoutPage').classList.add('hidden');
}

// Menu Functions
function renderMenuItems(category = 'all') {
    const container = document.getElementById('menuContainer');
    const filteredItems = category === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === category);
    
    container.innerHTML = filteredItems.map(item => `
        <div class="menu-item" onclick="showItemDetail(${item.id})">
            <div class="menu-item-image skeleton-box">
                <img src="${item.image}" alt="${item.name}" 
                     onload="this.parentElement.classList.remove('skeleton-box'); this.classList.add('loaded')" 
                     onerror="this.parentElement.classList.remove('skeleton-box'); this.src='https://via.placeholder.com/400x300/C67C4E/ffffff?text=Coffee'">
                <div class="rating-badge">
                    <i class="fas fa-star"></i>
                    <span class="rating-value">${item.rating || '4.5'}</span>
                </div>
            </div>
            <div class="menu-item-content">
                <div class="menu-item-name">${item.name}</div>
                <div class="menu-item-description">${item.description}</div>
                <div class="menu-item-footer">
                    <div class="menu-item-price">₹${item.price}</div>
                    <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${item.id})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Search functionality
function searchMenu() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredItems = menuItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm) || 
        item.description.toLowerCase().includes(searchTerm)
    );
    
    const container = document.getElementById('menuContainer');
    if (filteredItems.length === 0) {
        container.innerHTML = '<p class="no-results">No items found</p>';
        return;
    }
    
    container.innerHTML = filteredItems.map(item => `
        <div class="menu-item" onclick="showItemDetail(${item.id})">
            <div class="menu-item-image skeleton-box">
                <img src="${item.image}" alt="${item.name}" 
                     onload="this.parentElement.classList.remove('skeleton-box'); this.classList.add('loaded')" 
                     onerror="this.parentElement.classList.remove('skeleton-box'); this.src='https://via.placeholder.com/400x300/C67C4E/ffffff?text=Coffee'">
                <div class="rating-badge">
                    <i class="fas fa-star"></i>
                    <span class="rating-value">${item.rating || '4.5'}</span>
                </div>
            </div>
            <div class="menu-item-content">
                <div class="menu-item-name">${item.name}</div>
                <div class="menu-item-description">${item.description}</div>
                <div class="menu-item-footer">
                    <div class="menu-item-price">₹${item.price}</div>
                    <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${item.id})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterCategory(category) {
    currentCategory = category;
    renderMenuItems(category);
    
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Item Detail Modal
let selectedSize = 'M';

function showItemDetail(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;
    
    selectedItem = item;
    modalQuantity = 1;
    selectedSize = item.sizes && item.sizes.length > 0 ? item.sizes[0] : 'M';
    
    document.getElementById('modalItemImage').innerHTML = `<img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/400x300/C67C4E/ffffff?text=Coffee'">`;
    document.getElementById('modalItemName').textContent = item.name;
    document.getElementById('modalItemRating').textContent = item.rating || '4.5';
    document.getElementById('modalItemDescription').textContent = item.description;
    document.getElementById('modalItemPrice').textContent = `₹${item.price}`;
    document.getElementById('itemQuantity').value = modalQuantity;    
    // Reset special instructions field
    const specialInstructionsField = document.getElementById('itemSpecialInstructions');
    if (specialInstructionsField) {
        specialInstructionsField.value = '';
        updateCharCount();
    }    
    // Render size options
    const sizeSection = document.getElementById('sizeSection');
    const sizeOptions = document.getElementById('sizeOptions');
    
    if (item.sizes && item.sizes.length > 0) {
        sizeSection.style.display = 'block';
        sizeOptions.innerHTML = item.sizes.map(size => `
            <button class="size-btn ${size === selectedSize ? 'active' : ''}" 
                    onclick="selectSize('${size}')">
                ${size}
            </button>
        `).join('');
    } else {
        sizeSection.style.display = 'none';
    }
    
    document.getElementById('itemModal').classList.remove('hidden');
}

function selectSize(size) {
    selectedSize = size;
    const buttons = document.querySelectorAll('.size-btn');
    buttons.forEach(btn => {
        if (btn.textContent.trim() === size) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function closeItemModal() {
    document.getElementById('itemModal').classList.add('hidden');
    selectedItem = null;
    modalQuantity = 1;
}

// Character counter for special instructions
function updateCharCount() {
    const textarea = document.getElementById('itemSpecialInstructions');
    const charCount = document.getElementById('charCount');
    if (textarea && charCount) {
        charCount.textContent = textarea.value.length;
    }
}

// Add event listener for character counter
document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('itemSpecialInstructions');
    if (textarea) {
        textarea.addEventListener('input', updateCharCount);
    }
});

function increaseQuantity() {
    modalQuantity++;
    document.getElementById('itemQuantity').value = modalQuantity;
}

function decreaseQuantity() {
    if (modalQuantity > 1) {
        modalQuantity--;
        document.getElementById('itemQuantity').value = modalQuantity;
    }
}

function addToCartFromModal() {
    if (selectedItem) {
        const specialInstructions = document.getElementById('itemSpecialInstructions').value.trim();
        addToCart(selectedItem.id, modalQuantity, specialInstructions);
        closeItemModal();
    }
}

// Cart Functions
function addToCart(itemId, quantity = 1, specialInstructions = '') {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;
    
    // Find existing item with same ID and same special instructions
    const existingItem = cart.find(i => 
        i.id === itemId && 
        (i.specialInstructions || '') === specialInstructions
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...item, quantity, specialInstructions });
    }
    
    updateCartCount();
    showCartNotification();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartCount();
    renderCartItems();
}

// New index-based functions to handle items with special instructions
function removeFromCartByIndex(index) {
    cart.splice(index, 1);
    updateCartCount();
    renderCartItems();
}

function updateQuantity(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(itemId);
    } else {
        updateCartCount();
        renderCartItems();
    }
}

function updateQuantityByIndex(index, change) {
    const item = cart[index];
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCartByIndex(index);
    } else {
        updateCartCount();
        renderCartItems();
    }
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

function showCartNotification() {
    // Enhanced feedback animation on cart button
    const cartBtn = document.querySelector('.cart-button');
    cartBtn.style.animation = 'heartbeat 0.5s ease';
    
    // Create floating particles effect
    createAddToCartParticles(cartBtn);
    
    setTimeout(() => {
        cartBtn.style.animation = '';
    }, 500);
}

// Create particles when adding to cart
function createAddToCartParticles(element) {
    const rect = element.getBoundingClientRect();
    const particles = ['✨', '⭐', '💫', '🌟'];
    
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = rect.left + rect.width / 2 + 'px';
        particle.style.top = rect.top + rect.height / 2 + 'px';
        particle.style.fontSize = '1.5rem';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        particle.style.transition = 'all 1s ease-out';
        document.body.appendChild(particle);
        
        // Animate particle
        setTimeout(() => {
            const angle = (Math.PI * 2 * i) / 6;
            const distance = 50 + Math.random() * 30;
            particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
            particle.style.opacity = '0';
        }, 10);
        
        // Remove particle
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

function renderCartItems() {
    const container = document.getElementById('cartItems');
    const emptyState = document.getElementById('cartEmpty');
    const summary = document.getElementById('cartSummary');
    
    if (cart.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        summary.classList.add('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    summary.classList.remove('hidden');
    
    container.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/100x100/C67C4E/ffffff?text=Item'">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                ${item.specialInstructions ? `
                    <div class="cart-item-instructions">
                        <i class="fas fa-sticky-note"></i>
                        <span>${item.specialInstructions}</span>
                    </div>
                ` : ''}
                <div class="cart-item-price">₹${item.price}</div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button onclick="updateQuantityByIndex(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantityByIndex(${index}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCartByIndex(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05; // GST in India
    const total = subtotal + tax;
    
    document.getElementById('subtotal').textContent = `₹${Math.round(subtotal)}`;
    document.getElementById('tax').textContent = `₹${Math.round(tax)}`;
    document.getElementById('total').textContent = `₹${Math.round(total)}`;
}

// Checkout Functions
function renderCheckoutSummary() {
    const container = document.getElementById('checkoutSummary');
    
    container.innerHTML = cart.map(item => `
        <div class="summary-item">
            <div class="summary-item-details">
                <span class="summary-item-name">${item.name}</span>
                ${item.specialInstructions ? `
                    <div class="summary-item-instructions">
                        <i class="fas fa-sticky-note"></i>
                        <span>${item.specialInstructions}</span>
                    </div>
                ` : ''}
            </div>
            <span class="summary-item-qty">x${item.quantity}</span>
            <span class="summary-item-price">₹${item.price * item.quantity}</span>
        </div>
    `).join('');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05; // GST
    const total = subtotal + tax;
    
    document.getElementById('checkoutSubtotal').textContent = `₹${Math.round(subtotal)}`;
    document.getElementById('checkoutTax').textContent = `₹${Math.round(tax)}`;
    document.getElementById('checkoutTotal').textContent = `₹${Math.round(total)}`;
}

// Payment Selection
function selectPayment(method) {
    selectedPaymentMethod = method;
    
    // Update button states
    document.querySelectorAll('.payment-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.payment-btn').classList.add('active');
}

function handleCheckout(event) {
    event.preventDefault();
    
    const name = document.getElementById('customerName').value;
    const table = document.getElementById('tableNumber').value;
    const instructions = document.getElementById('specialInstructions').value;
    
    // Generate order number
    const orderNumber = Math.floor(1000 + Math.random() * 9000);
    
    // Show confirmation modal with confetti
    document.getElementById('orderNumber').textContent = orderNumber;
    document.getElementById('confirmationModal').classList.remove('hidden');
    
    // Launch confetti!
    launchConfetti();
    
    // Log order (in production, this would be sent to backend)
    console.log('Order placed:', {
        orderNumber,
        customer: { name, table },
        paymentMethod: selectedPaymentMethod,
        items: cart,
        instructions,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.1
    });
}

// Confetti celebration effect
function launchConfetti() {
    const confettiColors = ['#6B4423', '#A67C52', '#D4A574', '#FF5733', '#FFD700', '#4CAF50'];
    const confettiShapes = ['🎉', '🎊', '✨', '⭐', '🌟', '💫'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-50px';
            confetti.style.fontSize = '1.5rem';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '1001';
            confetti.textContent = confettiShapes[Math.floor(Math.random() * confettiShapes.length)];
            confetti.style.transition = `all ${2 + Math.random() * 2}s ease-in`;
            document.body.appendChild(confetti);
            
            // Animate falling
            setTimeout(() => {
                confetti.style.top = window.innerHeight + 'px';
                confetti.style.transform = `rotate(${Math.random() * 720 - 360}deg)`;
                confetti.style.opacity = '0';
            }, 10);
            
            // Remove
            setTimeout(() => {
                confetti.remove();
            }, 4000);
        }, i * 30);
    }
}

function resetApp() {
    // Clear cart
    cart = [];
    updateCartCount();
    
    // Reset form
    document.getElementById('checkoutForm').reset();
    
    // Hide modal and show menu
    document.getElementById('confirmationModal').classList.add('hidden');
    showMenu();
    
    // Reset to all categories
    currentCategory = 'all';
    renderMenuItems('all');
    document.querySelector('.tab-btn').classList.add('active');
}

// Close modals when clicking outside
document.getElementById('itemModal').addEventListener('click', (e) => {
    if (e.target.id === 'itemModal') {
        closeItemModal();
    }
});

document.getElementById('confirmationModal').addEventListener('click', (e) => {
    if (e.target.id === 'confirmationModal') {
        resetApp();
    }
});

// Add hover sound effects (visual feedback)
function addHoverEffects() {
    const buttons = document.querySelectorAll('button, .menu-item, .tab-btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
    });
}

// Call this on page load
setTimeout(addHoverEffects, 500);

// Add ripple effect on click
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        const btn = e.target.tagName === 'BUTTON' ? e.target : e.target.closest('button');
        createRipple(btn, e);
    }
});

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

// Add ripple animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// PROFESSIONAL ENHANCEMENTS
// ============================================

// Image Loading Handler for Skeleton Effect
function handleImageLoad() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
            img.addEventListener('error', () => {
                img.classList.add('loaded');
                // Fallback to a default image or show error state
                console.warn('Image failed to load:', img.src);
            });
        }
    });
}

// Call image handler on page load and after DOM changes
handleImageLoad();

// Observer for dynamically added images
const imageObserver = new MutationObserver(() => {
    handleImageLoad();
});

imageObserver.observe(document.body, {
    childList: true,
    subtree: true
});

// Toast Notification System
function showToast(message, type = 'success') {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add toast styles
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
`;
document.head.appendChild(toastStyle);

// Enhanced Add to Cart with Toast
const originalAddToCart = window.addToCart;
window.addToCart = function(itemId) {
    originalAddToCart(itemId);
    const item = menuItems.find(i => i.id === itemId);
    showToast(`${item.name} added to cart!`, 'success');
};

const originalAddToCartFromModal = window.addToCartFromModal;
window.addToCartFromModal = function() {
    originalAddToCartFromModal();
    const itemName = document.getElementById('modalItemName').textContent;
    showToast(`${itemName} added to cart!`, 'success');
};

// Smooth Page Transitions
function smoothPageTransition(showFunc) {
    const pages = document.querySelectorAll('.landing-page, .menu-page, .cart-page, .checkout-page');
    pages.forEach(page => {
        if (!page.classList.contains('hidden')) {
            page.style.opacity = '0';
            page.style.transform = 'translateY(20px)';
        }
    });
    
    setTimeout(() => {
        showFunc();
        setTimeout(() => {
            const newPage = document.querySelector('.landing-page:not(.hidden), .menu-page:not(.hidden), .cart-page:not(.hidden), .checkout-page:not(.hidden)');
            if (newPage) {
                newPage.style.opacity = '1';
                newPage.style.transform = 'translateY(0)';
            }
        }, 50);
    }, 300);
}

// Scroll to Top on Page Change
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Enhanced Navigation Functions
const originalShowMenu = window.showMenu;
window.showMenu = function() {
    scrollToTop();
    originalShowMenu();
    handleImageLoad();
};

const originalShowCart = window.showCart;
window.showCart = function() {
    scrollToTop();
    originalShowCart();
};

const originalShowCheckout = window.showCheckout;
window.showCheckout = function() {
    scrollToTop();
    originalShowCheckout();
};

// Add loading state to buttons
function addButtonLoadingState(button, duration = 1000) {
    const originalContent = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '<span class="loading"></span>';
    
    setTimeout(() => {
        button.innerHTML = originalContent;
        button.disabled = false;
    }, duration);
}

// Enhanced Checkout with Better UX
const originalHandleCheckout = window.handleCheckout;
window.handleCheckout = function(event) {
    event.preventDefault();
    const submitButton = event.target.querySelector('button[type="submit"]');
    
    // Add loading state
    addButtonLoadingState(submitButton, 1500);
    
    setTimeout(() => {
        originalHandleCheckout(event);
        showToast('Order placed successfully!', 'success');
    }, 1500);
};

// Add focus styles for accessibility
document.addEventListener('DOMContentLoaded', () => {
    // Add keyboard navigation support
    const focusableElements = document.querySelectorAll('button, a, input, textarea, select');
    
    focusableElements.forEach(el => {
        el.addEventListener('focus', () => {
            el.style.outline = '2px solid var(--primary-color)';
            el.style.outlineOffset = '2px';
        });
        
        el.addEventListener('blur', () => {
            el.style.outline = 'none';
        });
    });
});

// Preload critical images
function preloadImages() {
    const imagesToPreload = [
        'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800',
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800'
    ];
    
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

preloadImages();

// Performance optimization - Debounce search
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

// ============================================
// PROMO CAROUSEL AUTO-SLIDER
// ============================================
let currentPromoSlide = 0;
let promoSlideInterval;

function showPromoSlide(index) {
    const slides = document.querySelectorAll('.promo-slide');
    const dots = document.querySelectorAll('.promo-dots .dot');
    
    if (!slides.length || !dots.length) return;
    
    // Remove active class from all
    slides.forEach(slide => {
        slide.classList.remove('active', 'prev');
    });
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Add prev class to current slide for animation
    if (slides[currentPromoSlide]) {
        slides[currentPromoSlide].classList.add('prev');
    }
    
    // Update current slide
    currentPromoSlide = index;
    if (currentPromoSlide >= slides.length) currentPromoSlide = 0;
    if (currentPromoSlide < 0) currentPromoSlide = slides.length - 1;
    
    // Activate new slide
    slides[currentPromoSlide].classList.add('active');
    dots[currentPromoSlide].classList.add('active');
}

function nextPromoSlide() {
    showPromoSlide(currentPromoSlide + 1);
}

function goToPromoSlide(index) {
    showPromoSlide(index);
    // Reset auto-slide timer when manually changed
    clearInterval(promoSlideInterval);
    startPromoAutoSlide();
}

function startPromoAutoSlide() {
    // Auto-slide every 4 seconds
    promoSlideInterval = setInterval(nextPromoSlide, 4000);
}

// Initialize promo carousel
document.addEventListener('DOMContentLoaded', () => {
    showPromoSlide(0);
    startPromoAutoSlide();
});

// Pause auto-slide when user hovers over promo
const promoCarousel = document.querySelector('.promo-carousel');
if (promoCarousel) {
    promoCarousel.addEventListener('mouseenter', () => {
        clearInterval(promoSlideInterval);
    });
    
    promoCarousel.addEventListener('mouseleave', () => {
        startPromoAutoSlide();
    });
}

// Log initialization
console.log('%c🚀 Cafe UI Prototype Loaded Successfully!', 'color: #C67C4E; font-size: 16px; font-weight: bold;');
console.log('%c✨ Professional features activated', 'color: #4CAF50; font-size: 12px;');
