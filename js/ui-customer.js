// ============================================
// UI-CUSTOMER.JS - Customer-Facing UI
// ============================================

// Customer State
let cart = [];
let currentCategory = 'all';
let selectedItem = null;
let modalQuantity = 1;
let currentDietFilter = 'all';
let combos = [...defaultCombos];
let selectedCombo = null;
let reviews = [];
let currentReviewRating = 0;
let currentOrderNumber = '';
let promos = [...defaultPromos];

// Promo Carousel State
let currentPromoSlide = 0;
let promoSlideInterval = null;

// Order Tracking State
let trackingOrderNumber = null;
let orderPollInterval = null;

// ==================== NAVIGATION ====================

function showLanding() {
    hideAllPages();
    document.getElementById('landingPage').classList.remove('hidden');
    document.querySelector('.header').classList.add('hidden');
    showBottomNav();
}

function showMenu() {
    hideAllPages();
    document.getElementById('menuPage').classList.remove('hidden');
    document.querySelector('.header').classList.remove('hidden');
    showBottomNav();

    renderMenuItems();

    // Animate menu items
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
    showBottomNav();
    renderCartItems();
}

function showCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    hideAllPages();
    document.getElementById('checkoutPage').classList.remove('hidden');
    document.querySelector('.header').classList.remove('hidden');
    hideBottomNav();
    renderCheckoutSummary();
}

function showOrderTracking() {
    hideAllPages();

    // Create order tracking page if it doesn't exist
    let trackingPage = document.getElementById('orderTrackingPage');
    if (!trackingPage) {
        trackingPage = createOrderTrackingPage();
        document.body.appendChild(trackingPage);
    }

    trackingPage.classList.remove('hidden');
    document.querySelector('.header').classList.remove('hidden');
    showBottomNav();

    // If we have a tracking order, show status
    if (trackingOrderNumber) {
        loadOrderStatus(trackingOrderNumber);
    }
}

function hideAllPages() {
    const pages = [
        'landingPage', 'menuPage', 'cartPage', 'checkoutPage',
        'adminPage', 'kitchenPage', 'orderTrackingPage',
        'menuManagementPage', 'comboManagementPage', 'ordersManagementPage'
    ];

    pages.forEach(id => {
        const page = document.getElementById(id);
        if (page) page.classList.add('hidden');
    });
}

// ==================== BOTTOM NAV ====================

function showBottomNav() {
    const nav = document.getElementById('bottomNav');
    if (nav) nav.classList.remove('hidden');
}

function hideBottomNav() {
    const nav = document.getElementById('bottomNav');
    if (nav) nav.classList.add('hidden');
}

// ==================== MENU FUNCTIONS ====================

function renderMenuItems(category = null) {
    const container = document.getElementById('menuContainer');
    category = category || currentCategory;

    // Handle combos category
    if (category === 'combos') {
        renderCombos();
        return;
    }

    let filteredItems = category === 'all'
        ? menuItems
        : menuItems.filter(item => item.category === category);

    // Apply diet filter
    if (currentDietFilter === 'veg') {
        filteredItems = filteredItems.filter(item =>
            item.isVeg === true && !['coffee', 'beverages'].includes(item.category)
        );
    } else if (currentDietFilter === 'non-veg') {
        filteredItems = filteredItems.filter(item =>
            item.isVeg === false && !['coffee', 'beverages'].includes(item.category)
        );
    }

    container.innerHTML = filteredItems.map((item, index) => `
        <div class="menu-item fade-in-up" style="animation-delay: ${index * 0.05}s" onclick="showItemDetail(${item.id})">
            <div class="menu-item-image skeleton-box">
                <img src="${item.image}" alt="${item.name}"
                     onload="this.parentElement.classList.remove('skeleton-box'); this.classList.add('loaded')"
                     onerror="this.parentElement.classList.remove('skeleton-box'); this.src='https://via.placeholder.com/400x300/D2042D/ffffff?text=Item'">
                <div class="rating-badge">
                    <i class="fas fa-star"></i>
                    <span class="rating-value">${item.rating || '4.5'}</span>
                </div>
                <div class="diet-badge ${item.isVeg ? 'veg' : 'non-veg'}">
                    <span class="diet-indicator"></span>
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

function renderCombos() {
    const container = document.getElementById('menuContainer');

    let filteredCombos = combos;
    if (currentDietFilter === 'veg') {
        filteredCombos = combos.filter(combo => combo.isVeg === true);
    } else if (currentDietFilter === 'non-veg') {
        filteredCombos = combos.filter(combo => combo.isVeg === false);
    }

    container.innerHTML = filteredCombos.map(combo => `
        <div class="combo-card" onclick="showComboDetail('${combo.id}')">
            <div class="combo-image skeleton-box">
                <img src="${combo.image}" alt="${combo.name}"
                     onload="this.parentElement.classList.remove('skeleton-box'); this.classList.add('loaded')"
                     onerror="this.parentElement.classList.remove('skeleton-box'); this.src='https://via.placeholder.com/400x300/D2042D/ffffff?text=Combo'">
                <div class="combo-badge">COMBO</div>
                <div class="savings-badge">Save ₹${combo.savings}</div>
                <div class="rating-badge">
                    <i class="fas fa-star"></i>
                    <span class="rating-value">${combo.rating || '4.5'}</span>
                </div>
                <div class="diet-badge ${combo.isVeg ? 'veg' : 'non-veg'}">
                    <span class="diet-indicator"></span>
                </div>
            </div>
            <div class="combo-content">
                <div class="combo-name">${combo.name}</div>
                <div class="combo-description">${combo.description}</div>
                <div class="combo-items-preview">
                    ${combo.items.slice(0, 2).map(item => item.name).join(' + ')}
                    ${combo.items.length > 2 ? ` + ${combo.items.length - 2} more` : ''}
                </div>
                <div class="combo-footer">
                    <div class="combo-pricing">
                        <span class="original-price">₹${combo.originalPrice}</span>
                        <span class="combo-price">₹${combo.price}</span>
                    </div>
                    <button class="add-to-cart-btn" onclick="event.stopPropagation(); addComboToCart('${combo.id}')">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterCategory(category, element) {
    currentCategory = category;
    renderMenuItems(category);

    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (element) element.classList.add('active');
}

function toggleDietFilter(filter, element) {
    currentDietFilter = filter;

    // Update active button states
    document.querySelectorAll('.diet-filter-btn').forEach(btn => btn.classList.remove('active'));
    if (element) element.classList.add('active');

    renderMenuItems(currentCategory);
}

function searchMenu() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    let filteredItems = menuItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm)
    );

    // Apply diet filter
    if (currentDietFilter === 'veg') {
        filteredItems = filteredItems.filter(item =>
            item.isVeg === true && !['coffee', 'beverages'].includes(item.category)
        );
    } else if (currentDietFilter === 'non-veg') {
        filteredItems = filteredItems.filter(item =>
            item.isVeg === false && !['coffee', 'beverages'].includes(item.category)
        );
    }

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
                     onerror="this.parentElement.classList.remove('skeleton-box'); this.src='https://via.placeholder.com/400x300/D2042D/ffffff?text=Item'">
                <div class="rating-badge">
                    <i class="fas fa-star"></i>
                    <span class="rating-value">${item.rating || '4.5'}</span>
                </div>
                <div class="diet-badge ${item.isVeg ? 'veg' : 'non-veg'}">
                    <span class="diet-indicator"></span>
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

// ==================== ITEM DETAIL MODAL ====================

function showItemDetail(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;

    selectedItem = item;
    modalQuantity = 1;

    const modalImageContainer = document.getElementById('modalItemImage');
    modalImageContainer.className = 'item-detail-image skeleton-box';
    modalImageContainer.innerHTML = `
        <img src="${item.image}" alt="${item.name}"
             onload="this.parentElement.classList.remove('skeleton-box'); this.classList.add('loaded')"
             onerror="this.parentElement.classList.remove('skeleton-box'); this.src='https://via.placeholder.com/400x300/D2042D/ffffff?text=Item'">
        <div class="diet-badge ${item.isVeg ? 'veg' : 'non-veg'}">
            <span class="diet-indicator"></span>
        </div>`;

    document.getElementById('modalItemName').textContent = item.name;
    document.getElementById('modalItemRating').textContent = item.rating || '4.5';
    document.getElementById('modalItemDescription').textContent = item.description;
    document.getElementById('modalItemPrice').textContent = `₹${item.price}`;
    document.getElementById('itemQuantity').value = modalQuantity;

    // Reset special instructions
    const specialField = document.getElementById('itemSpecialInstructions');
    if (specialField) {
        specialField.value = '';
        updateCharCount();
    }

    // Hide size section (removed sizes requirement)
    const sizeSection = document.getElementById('sizeSection');
    if (sizeSection) sizeSection.style.display = 'none';

    document.getElementById('itemModal').classList.remove('hidden');
}

function closeItemModal() {
    document.getElementById('itemModal').classList.add('hidden');
    selectedItem = null;
    modalQuantity = 1;
}

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

function updateCharCount() {
    const textarea = document.getElementById('itemSpecialInstructions');
    const charCount = document.getElementById('charCount');
    if (textarea && charCount) {
        charCount.textContent = textarea.value.length;
    }
}

function addToCartFromModal() {
    if (selectedItem) {
        const specialInstructions = document.getElementById('itemSpecialInstructions').value.trim();
        addToCart(selectedItem.id, modalQuantity, specialInstructions);
        closeItemModal();
        showToast(`${selectedItem.name} added to cart!`, 'success');
    }
}

// ==================== COMBO DETAIL MODAL ====================

function showComboDetail(comboId) {
    selectedCombo = combos.find(c => c.id === comboId);
    if (!selectedCombo) return;

    const modal = document.createElement('div');
    modal.id = 'comboModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content combo-modal">
            <button class="close-btn" onclick="closeComboModal()">
                <i class="fas fa-times"></i>
            </button>
            <div class="combo-detail-content">
                <div class="combo-detail-image skeleton-box">
                    <img src="${selectedCombo.image}" alt="${selectedCombo.name}"
                         onload="this.parentElement.classList.remove('skeleton-box'); this.classList.add('loaded')"
                         onerror="this.parentElement.classList.remove('skeleton-box'); this.src='https://via.placeholder.com/400x300/D2042D/ffffff?text=Combo'">
                    <div class="combo-badge">COMBO</div>
                    <div class="savings-badge">Save ₹${selectedCombo.savings}</div>
                </div>
                <div class="combo-info">
                    <h2 class="combo-title">${selectedCombo.name}</h2>
                    <div class="combo-rating">
                        <i class="fas fa-star"></i>
                        <span>${selectedCombo.rating}</span>
                    </div>
                    <p class="combo-description">${selectedCombo.description}</p>

                    <div class="combo-items-section">
                        <h3>What's included:</h3>
                        <div class="combo-items-list">
                            ${selectedCombo.items.map(item => `
                                <div class="combo-item">
                                    <span class="combo-item-name">${item.name}</span>
                                    ${item.quantity > 1 ? `<span class="combo-item-qty">x${item.quantity}</span>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="combo-pricing-detail">
                        <div class="original-pricing">
                            <span>Original Price: </span>
                            <span class="original-price">₹${selectedCombo.originalPrice}</span>
                        </div>
                        <div class="combo-pricing">
                            <span>Combo Price: </span>
                            <span class="combo-price">₹${selectedCombo.price}</span>
                        </div>
                        <div class="savings-highlight">
                            You Save: ₹${selectedCombo.savings}
                        </div>
                    </div>

                    <div class="quantity-selector">
                        <button type="button" onclick="decreaseComboQuantity()">-</button>
                        <input type="number" id="comboQuantity" value="1" min="1" readonly>
                        <button type="button" onclick="increaseComboQuantity()">+</button>
                    </div>

                    <button class="btn-primary" onclick="addComboToCartFromModal()">
                        <i class="fas fa-shopping-cart"></i>
                        <span>Add to Cart - ₹${selectedCombo.price}</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modalQuantity = 1;
}

function closeComboModal() {
    const modal = document.getElementById('comboModal');
    if (modal) modal.remove();
    selectedCombo = null;
    modalQuantity = 1;
}

function increaseComboQuantity() {
    modalQuantity++;
    document.getElementById('comboQuantity').value = modalQuantity;
}

function decreaseComboQuantity() {
    if (modalQuantity > 1) {
        modalQuantity--;
        document.getElementById('comboQuantity').value = modalQuantity;
    }
}

function addComboToCartFromModal() {
    if (selectedCombo) {
        addComboToCart(selectedCombo.id, modalQuantity);
        closeComboModal();
        showToast(`${selectedCombo.name} added to cart!`, 'success');
    }
}

// ==================== CART FUNCTIONS ====================

function addToCart(itemId, quantity = 1, specialInstructions = '') {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;

    const existingItem = cart.find(i =>
        i.id === itemId && (i.specialInstructions || '') === specialInstructions
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...item, quantity, specialInstructions });
    }

    updateCartCount();
    animateCartBounce();

    if (!selectedItem) {
        showToast(`${item.name} added to cart!`, 'success');
    }
}

function addComboToCart(comboId, quantity = 1) {
    const combo = combos.find(c => c.id === comboId);
    if (!combo) return;

    const existingCombo = cart.find(item => item.id === comboId && item.isCombo);

    if (existingCombo) {
        existingCombo.quantity += quantity;
    } else {
        cart.push({
            ...combo,
            quantity: quantity,
            isCombo: true,
            comboItems: combo.items
        });
    }

    updateCartCount();
    animateCartBounce();

    if (!selectedCombo) {
        showToast(`${combo.name} added to cart!`, 'success');
    }
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartCount();
    renderCartItems();
}

function removeFromCartByIndex(index) {
    cart.splice(index, 1);
    updateCartCount();
    renderCartItems();
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
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) cartCountEl.textContent = totalItems;
}

function animateCartBounce() {
    const cartButton = document.querySelector('.cart-button');
    if (cartButton) {
        cartButton.classList.add('cart-bounce');
        setTimeout(() => cartButton.classList.remove('cart-bounce'), 500);
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
            <div class="cart-item-image skeleton-box">
                <img src="${item.image}" alt="${item.name}"
                     onload="this.parentElement.classList.remove('skeleton-box'); this.classList.add('loaded')"
                     onerror="this.parentElement.classList.remove('skeleton-box'); this.src='https://via.placeholder.com/100x100/D2042D/ffffff?text=Item'">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                ${item.specialInstructions ? `
                    <div class="cart-item-instructions">
                        <i class="fas fa-sticky-note"></i>
                        <span>${item.specialInstructions}</span>
                    </div>
                ` : ''}
                <div class="cart-item-price">₹${item.price * item.quantity}</div>
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
    const tax = 0; // Tax at 0 as per requirements
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = `₹${Math.round(subtotal)}`;
    document.getElementById('tax').textContent = `₹${Math.round(tax)}`;
    document.getElementById('total').textContent = `₹${Math.round(total)}`;
}

// ==================== CHECKOUT FUNCTIONS ====================

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
    const tax = 0; // Tax at 0
    const total = subtotal + tax;

    document.getElementById('checkoutSubtotal').textContent = `₹${Math.round(subtotal)}`;
    document.getElementById('checkoutTax').textContent = `₹${Math.round(tax)}`;
    document.getElementById('checkoutTotal').textContent = `₹${Math.round(total)}`;
}

async function handleCheckout(event) {
    event.preventDefault();

    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone')?.value.trim() || '';
    const email = document.getElementById('customerEmail')?.value.trim() || '';
    const instructions = document.getElementById('specialInstructions')?.value.trim() || '';

    if (!name) {
        showToast('Please enter your name', 'error');
        return;
    }

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = 0;
    const total = subtotal + tax;

    // Prepare order data
    const orderData = {
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        items: cart.map(item => ({
            itemId: item.id.toString(),
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            specialInstructions: item.specialInstructions || '',
            isCombo: item.isCombo || false,
            comboItems: item.comboItems || []
        })),
        subtotal: subtotal,
        tax: tax,
        total: total,
        paymentMethod: 'counter',
        specialInstructions: instructions
    };

    try {
        const response = await cafeAPI.createOrder(orderData);

        if (response.success && response.data) {
            const order = response.data;
            currentOrderNumber = order.orderNumber;
            trackingOrderNumber = order.orderNumber;

            // Show confirmation modal
            document.getElementById('orderNumber').textContent = order.orderNumber;
            document.getElementById('confirmationModal').classList.remove('hidden');

            // Launch confetti
            launchConfetti();

            // Start redirect countdown
            startOrderRedirect();
        }
    } catch (error) {
        console.error('Error creating order:', error);
        showToast('Error placing order. Please try again.', 'error');
    }
}

// ==================== ORDER CONFIRMATION & TRACKING ====================

function startOrderRedirect() {
    let countdown = 5;
    const countdownEl = document.getElementById('redirectCountdown');

    if (countdownEl) {
        const interval = setInterval(() => {
            countdown--;
            countdownEl.textContent = countdown;

            if (countdown <= 0) {
                clearInterval(interval);
                closeConfirmationAndTrack();
            }
        }, 1000);
    }
}

function closeConfirmationAndTrack() {
    document.getElementById('confirmationModal').classList.add('hidden');

    // Clear cart
    cart = [];
    updateCartCount();

    // Reset form
    document.getElementById('checkoutForm')?.reset();

    // Navigate to tracking
    showOrderTracking();
    startOrderPolling();
}

function createOrderTrackingPage() {
    const page = document.createElement('div');
    page.id = 'orderTrackingPage';
    page.className = 'order-tracking-page hidden';
    page.innerHTML = `
        <div class="tracking-header">
            <h2>Order Status</h2>
            <p class="tracking-order-number">Order #<span id="trackingOrderNumber">${trackingOrderNumber || '----'}</span></p>
        </div>

        <div class="tracking-status-container" id="trackingStatusContainer">
            <div class="tracking-step received active">
                <div class="step-icon"><i class="fas fa-clipboard-check"></i></div>
                <div class="step-info">
                    <span class="step-title">Order Received</span>
                    <span class="step-desc">Waiting for payment</span>
                </div>
            </div>
            <div class="tracking-step preparing">
                <div class="step-icon"><i class="fas fa-fire"></i></div>
                <div class="step-info">
                    <span class="step-title">Preparing</span>
                    <span class="step-desc">Your order is being prepared</span>
                </div>
            </div>
            <div class="tracking-step ready">
                <div class="step-icon"><i class="fas fa-bell"></i></div>
                <div class="step-info">
                    <span class="step-title">Ready</span>
                    <span class="step-desc">Order ready for pickup</span>
                </div>
            </div>
            <div class="tracking-step served">
                <div class="step-icon"><i class="fas fa-check-circle"></i></div>
                <div class="step-info">
                    <span class="step-title">Served</span>
                    <span class="step-desc">Enjoy your order!</span>
                </div>
            </div>
        </div>

        <div class="tracking-message" id="trackingMessage">
            Please proceed to the counter to pay for your order.
        </div>

        <button class="btn-secondary" onclick="showMenu()">
            <i class="fas fa-arrow-left"></i> Back to Menu
        </button>
    `;

    return page;
}

async function loadOrderStatus(orderNumber) {
    try {
        const response = await cafeAPI.getOrder(orderNumber);

        if (response.success && response.data) {
            updateTrackingUI(response.data);
        }
    } catch (error) {
        console.error('Error loading order status:', error);
    }
}

function updateTrackingUI(order) {
    document.getElementById('trackingOrderNumber').textContent = order.orderNumber;

    const statuses = ['received', 'preparing', 'ready', 'served'];
    const currentIndex = statuses.indexOf(order.orderStatus);

    const container = document.getElementById('trackingStatusContainer');
    const steps = container.querySelectorAll('.tracking-step');

    steps.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index < currentIndex) {
            step.classList.add('completed');
        } else if (index === currentIndex) {
            step.classList.add('active');
        }
    });

    // Update message
    const messages = {
        'received': 'Please proceed to the counter to pay for your order.',
        'preparing': 'Your order is being prepared. Please wait.',
        'ready': 'Your order is ready! Please collect from the counter.',
        'served': 'Thank you for visiting Cafe Coffeto!'
    };

    document.getElementById('trackingMessage').textContent = messages[order.orderStatus] || '';
}

function startOrderPolling() {
    if (orderPollInterval) clearInterval(orderPollInterval);

    orderPollInterval = setInterval(async () => {
        if (trackingOrderNumber) {
            await loadOrderStatus(trackingOrderNumber);
        }
    }, 5000); // 5 seconds
}

function stopOrderPolling() {
    if (orderPollInterval) {
        clearInterval(orderPollInterval);
        orderPollInterval = null;
    }
}

// ==================== PROMO CAROUSEL ====================

function showPromoSlide(index) {
    const slides = document.querySelectorAll('.promo-slide');
    const dots = document.querySelectorAll('.promo-dots .dot');

    if (!slides.length || !dots.length) return;

    slides.forEach(slide => slide.classList.remove('active', 'prev'));
    dots.forEach(dot => dot.classList.remove('active'));

    if (slides[currentPromoSlide]) {
        slides[currentPromoSlide].classList.add('prev');
    }

    currentPromoSlide = index;
    if (currentPromoSlide >= slides.length) currentPromoSlide = 0;
    if (currentPromoSlide < 0) currentPromoSlide = slides.length - 1;

    slides[currentPromoSlide].classList.add('active');
    dots[currentPromoSlide].classList.add('active');
}

function nextPromoSlide() {
    showPromoSlide(currentPromoSlide + 1);
}

function goToPromoSlide(index) {
    showPromoSlide(index);
    clearInterval(promoSlideInterval);
    startPromoAutoSlide();
}

function startPromoAutoSlide() {
    promoSlideInterval = setInterval(nextPromoSlide, 5000); // 5 seconds
}

// ==================== REVIEWS ====================

async function renderReviews() {
    const reviewsContainer = document.getElementById('reviewsCarousel');
    if (!reviewsContainer) return;

    try {
        const response = await cafeAPI.getFeaturedReviews(6);

        if (response.success && response.data && response.data.length > 0) {
            reviews = response.data.map(review => ({
                id: review.id,
                name: review.customerName,
                rating: review.rating,
                comment: review.comment,
                instagram: review.instagram || '',
                date: new Date(review.createdAt).toLocaleDateString()
            }));
        } else {
            const storedReviews = localStorage.getItem('cafeReviews');
            reviews = storedReviews ? JSON.parse(storedReviews) : [];
        }
    } catch (error) {
        console.warn('Loading reviews from localStorage:', error.message);
        const storedReviews = localStorage.getItem('cafeReviews');
        reviews = storedReviews ? JSON.parse(storedReviews) : [];
    }

    if (reviews.length === 0) {
        reviewsContainer.innerHTML = `
            <div class="review-placeholder">
                <p>Be the first to leave a review!</p>
            </div>
        `;
        return;
    }

    const displayReviews = reviews.slice(0, 6);
    reviewsContainer.innerHTML = displayReviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="review-author">
                    <div class="review-avatar">${review.name.charAt(0).toUpperCase()}</div>
                    <div class="review-author-info">
                        <h4>${review.name}</h4>
                        ${review.instagram ? `<a href="https://instagram.com/${review.instagram.replace('@', '')}" target="_blank" class="review-instagram"><i class="fab fa-instagram"></i> ${review.instagram}</a>` : ''}
                    </div>
                </div>
                <div class="review-rating">
                    ${generateStars(review.rating)}
                </div>
            </div>
            <p class="review-comment">${review.comment}</p>
            <span class="review-date">${review.date}</span>
        </div>
    `).join('');
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fas fa-star${i <= rating ? ' active' : ''}"></i>`;
    }
    return stars;
}

function showReviewModal() {
    document.getElementById('confirmationModal').classList.add('hidden');
    document.getElementById('reviewModal').classList.remove('hidden');
}

function closeReviewModal() {
    document.getElementById('reviewModal').classList.add('hidden');
    resetAppAfterOrder();
}

function skipReview() {
    closeReviewModal();
}

function setRating(rating) {
    currentReviewRating = rating;
    document.getElementById('reviewRating').value = rating;

    const stars = document.querySelectorAll('#starRating i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
}

async function submitReview(event) {
    event.preventDefault();

    const name = document.getElementById('reviewName').value.trim();
    const rating = parseInt(document.getElementById('reviewRating').value);
    const comment = document.getElementById('reviewComment').value.trim();
    const instagram = document.getElementById('reviewInstagram').value.trim();

    if (!rating) {
        showToast('Please select a rating!', 'error');
        return;
    }

    const reviewData = {
        customerName: name,
        rating: rating,
        comment: comment,
        instagram: instagram ? `@${instagram}` : '',
        orderNumber: currentOrderNumber
    };

    try {
        const response = await cafeAPI.createReview(reviewData);

        if (response.success) {
            showToast('Thank you for your feedback!', 'success');
            renderReviews();
            closeReviewModal();
        }
    } catch (error) {
        console.error('Error submitting review:', error);

        // Fallback to localStorage
        const review = {
            id: Date.now(),
            name: name,
            rating: rating,
            comment: comment,
            instagram: instagram ? `@${instagram}` : '',
            date: new Date().toLocaleDateString(),
            orderNumber: currentOrderNumber
        };

        reviews.unshift(review);
        if (reviews.length > 20) reviews.splice(20);
        localStorage.setItem('cafeReviews', JSON.stringify(reviews));

        showToast('Thank you for your feedback!', 'success');
        renderReviews();
        closeReviewModal();
    }

    document.getElementById('reviewForm').reset();
    currentReviewRating = 0;
}

function resetAppAfterOrder() {
    cart = [];
    updateCartCount();
    document.getElementById('checkoutForm')?.reset();
    document.getElementById('confirmationModal').classList.add('hidden');
    showMenu();
    currentCategory = 'all';
    renderMenuItems('all');
}

// ==================== CONFETTI EFFECT ====================

function launchConfetti() {
    const confettiShapes = ['*', '**', '**', '*', '**', '**'];

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-50px';
            confetti.style.fontSize = '1.5rem';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '10001';
            confetti.textContent = confettiShapes[Math.floor(Math.random() * confettiShapes.length)];
            confetti.style.color = ['#D2042D', '#FFD700', '#4CAF50', '#FF9800'][Math.floor(Math.random() * 4)];
            confetti.style.transition = `all ${2 + Math.random() * 2}s ease-in`;
            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.style.top = window.innerHeight + 'px';
                confetti.style.transform = `rotate(${Math.random() * 720 - 360}deg)`;
                confetti.style.opacity = '0';
            }, 10);

            setTimeout(() => confetti.remove(), 4000);
        }, i * 30);
    }
}

// ==================== UTILITY FUNCTIONS ====================

function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Close modals on outside click
document.addEventListener('click', (e) => {
    if (e.target.id === 'itemModal') closeItemModal();
    if (e.target.id === 'confirmationModal') closeConfirmationAndTrack();
    if (e.target.id === 'comboModal') closeComboModal();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showLanding, showMenu, showCart, showCheckout, showOrderTracking,
        hideAllPages, showBottomNav, hideBottomNav,
        renderMenuItems, renderCombos, filterCategory, toggleDietFilter, searchMenu,
        showItemDetail, closeItemModal, addToCart, addComboToCart,
        renderCartItems, updateCartCount, handleCheckout,
        renderReviews, submitReview,
        showPromoSlide, startPromoAutoSlide,
        showToast, launchConfetti
    };
}
