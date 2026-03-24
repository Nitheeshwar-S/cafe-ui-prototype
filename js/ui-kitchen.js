// ============================================
// UI-KITCHEN.JS - Kitchen Dashboard UI
// ============================================

// Kitchen State
let kitchenOrders = [];
let kitchenPollInterval = null;
let kitchenSoundEnabled = true;
let lastOrderCheck = new Date().toISOString();

// Notification sound
let notificationSound = null;

// Initialize notification sound
function initKitchenSound() {
    // Create audio element for notification
    notificationSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleVxp+cD/30InE1uq2sSWVi4rh72jcJvwqzQTT5HPxaZ/WlWbw5NvotvTIxVaptzFp1lSVqHH1dWDUxs8f7vXuYhfS32/nXyl2OkfF1mg3cmlWVFWo8nY2IhWHTx/u9i6iF9LfL6cfKTX6CAXWqDcyKdaUVeiyNfXhlQdPX+82LmIX0t9v5x8pdnpIBdboN3Ip1lQVqLI19iHVR49f73ZuolgS32/nHyl2OkgF1qg3MmnWVBWocfX14dVHT5/vdm6iWBLfb+cfKXZ6SAXW6HcyKZZUFahx9bXh1UdPn+92bqJYEt9v5x8pdjpIBdboNzJp1lQVqHH1tiHVR0+f73ZuolgS32/nHyl2ekgF1ug3MmnWlFWosfW14dVHT1/vdi6iWBLfb+cfKXY6SAXW6DcyadaUVeiyNbXh1UdPX+92LqJYEt9v5x8pdjpIBdboN3Jp1lRV6LI1teHVR49f73YuolgS32/nHyl2OkgF1ug3MmnWVFXosjW14dVHT1/vdi6iWBLfb+cfKXY6SAXW6DdyadZUVeiyNbXh1UdPn+92LqJYEt9v518pdjpHxdaoNzJp1lRV6LI19eHVR0+f73ZuolgS32/nHyl2OkgF1qg3MinWVBWocfX14dVHT5/vdm6iWBLfb+cfKXY6SAXWqDcyadZUFahx9fXh1UdPn+92bqJYEt9v518pdjpIBdaoNzJp1lQVqHH19eHVR0+f73ZuolgS32/nHyl2OkfF1qg3MinWVBWocfX14dVHT5/vdm6iWBLfb+cfKXY6R8XWqDcyKdZUFahx9fYh1QdPn+92bqJX0t9v5x8pdjpHxdaoNzIp1lQVqHH19iHVR49f73ZuolgS32/nXyl2OkfF1qg3MinWVBWocfX2IdUHT5/vdm6iWBLfb+dfKXY6R8XWqDcyKdZUFahx9fYh1QdPn+92bqJYEt9v518pdjpHxdaoNzIpllQVqHH19iHVR0+f73ZuolgS32/nHyl2OkgF1qg3MinWVBWocfX2IdVHT5/vdm6iWBLfb+cfKXY6R8XWaDcyKdZUFahx9fYh1UdPn+92bqJX0t9v5x8pdjpHxdaoNzIp1lQVqHH19iHVR0+f73ZuolgS32/nHyl2OkfF1qg3MinWVBWocfX2IdVHT5/vdm6iV9Lfb+cfKXY6R8XWqDcyKdZUFahx9fYh1UePn+92bqJYEt9v5x8pdjpHxdaoNzIp1lQVqHH19iHVR0+f73ZuolgS32/nHyl2OkfF1qg3MinWVBWocfX2IdVHT5/vdm6iWBLfb+cfKXY6R8XWqDcyKdZUFahx9fXh1UdPn+92bqJYEt9v518pdjpHxdaoNzIp1lQVqHH19eHVR0+f77ZuolgS32/nHyl2OkfF1qg3MinWVBWocfX14dVHT5/vdm6iWBLfb+cfKXY6R8=');
    notificationSound.volume = 0.5;
}

// Show Kitchen Dashboard
function showKitchenDashboard() {
    hideAllPages();

    // Create kitchen page if it doesn't exist
    let kitchenPage = document.getElementById('kitchenPage');
    if (!kitchenPage) {
        kitchenPage = createKitchenPage();
        document.body.appendChild(kitchenPage);
    }

    kitchenPage.classList.remove('hidden');
    document.querySelector('.header').classList.add('hidden');

    // Hide bottom nav for kitchen
    hideBottomNav();

    // Initialize sound
    initKitchenSound();

    // Load orders and start polling
    loadKitchenOrders();
    startKitchenPolling();
}

// Create Kitchen Page HTML
function createKitchenPage() {
    const page = document.createElement('div');
    page.id = 'kitchenPage';
    page.className = 'kitchen-page hidden';
    page.innerHTML = `
        <div class="kitchen-header">
            <div class="kitchen-header-left">
                <h1>Kitchen Dashboard</h1>
                <span class="kitchen-date">${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div class="kitchen-header-right">
                <button class="sound-toggle ${kitchenSoundEnabled ? 'active' : ''}" onclick="toggleKitchenSound()">
                    <i class="fas fa-${kitchenSoundEnabled ? 'volume-up' : 'volume-mute'}"></i>
                </button>
                <button class="logout-btn" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i>
                    Logout
                </button>
            </div>
        </div>

        <div class="kitchen-stats">
            <div class="stat-card pending">
                <div class="stat-icon"><i class="fas fa-clock"></i></div>
                <div class="stat-info">
                    <span class="stat-value" id="kitchenPending">0</span>
                    <span class="stat-label">Pending</span>
                </div>
            </div>
            <div class="stat-card preparing">
                <div class="stat-icon"><i class="fas fa-fire"></i></div>
                <div class="stat-info">
                    <span class="stat-value" id="kitchenPreparing">0</span>
                    <span class="stat-label">Preparing</span>
                </div>
            </div>
            <div class="stat-card ready">
                <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
                <div class="stat-info">
                    <span class="stat-value" id="kitchenReady">0</span>
                    <span class="stat-label">Ready</span>
                </div>
            </div>
            <div class="stat-card served">
                <div class="stat-icon"><i class="fas fa-utensils"></i></div>
                <div class="stat-info">
                    <span class="stat-value" id="kitchenServed">0</span>
                    <span class="stat-label">Served</span>
                </div>
            </div>
        </div>

        <div class="kitchen-filters">
            <button class="filter-btn active" onclick="filterKitchenOrders('all', this)">All</button>
            <button class="filter-btn" onclick="filterKitchenOrders('received', this)">Pending</button>
            <button class="filter-btn" onclick="filterKitchenOrders('preparing', this)">Preparing</button>
            <button class="filter-btn" onclick="filterKitchenOrders('ready', this)">Ready</button>
        </div>

        <div class="kitchen-orders-container" id="kitchenOrdersContainer">
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Loading orders...</span>
            </div>
        </div>
    `;

    return page;
}

// Load Kitchen Orders
async function loadKitchenOrders() {
    try {
        const response = await cafeAPI.getKitchenOrders();

        if (response.success) {
            kitchenOrders = response.data;
            updateKitchenStats();
            renderKitchenOrders();
        }
    } catch (error) {
        console.error('Error loading kitchen orders:', error);

        // Use local orders
        const today = new Date().toISOString().split('T')[0];
        kitchenOrders = orders.filter(o =>
            o.createdAt && o.createdAt.startsWith(today)
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        updateKitchenStats();
        renderKitchenOrders();
    }
}

// Update Kitchen Stats
function updateKitchenStats() {
    const pending = kitchenOrders.filter(o => o.orderStatus === 'received').length;
    const preparing = kitchenOrders.filter(o => o.orderStatus === 'preparing').length;
    const ready = kitchenOrders.filter(o => o.orderStatus === 'ready').length;
    const served = kitchenOrders.filter(o => o.orderStatus === 'served').length;

    document.getElementById('kitchenPending').textContent = pending;
    document.getElementById('kitchenPreparing').textContent = preparing;
    document.getElementById('kitchenReady').textContent = ready;
    document.getElementById('kitchenServed').textContent = served;
}

// Render Kitchen Orders
function renderKitchenOrders(filter = 'all') {
    const container = document.getElementById('kitchenOrdersContainer');

    let filteredOrders = kitchenOrders;
    if (filter !== 'all') {
        filteredOrders = kitchenOrders.filter(o => o.orderStatus === filter);
    }

    // Only show active orders (not served or cancelled)
    if (filter === 'all') {
        filteredOrders = kitchenOrders.filter(o =>
            !['served', 'cancelled'].includes(o.orderStatus)
        );
    }

    if (filteredOrders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon"><i class="fas fa-clipboard-list"></i></div>
                <p>No orders to display</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredOrders.map(order => `
        <div class="kitchen-order-card ${order.orderStatus}" data-order-id="${order._id || order.orderNumber}">
            <div class="order-header">
                <div class="order-number-badge">#${order.orderNumber}</div>
                <div class="order-status-badge ${order.orderStatus}">${formatStatus(order.orderStatus)}</div>
            </div>

            <div class="order-customer">
                <i class="fas fa-user"></i>
                <span>${order.customerName}</span>
            </div>

            <div class="order-time">
                <i class="fas fa-clock"></i>
                <span>${formatTime(order.createdAt)}</span>
                ${order.orderStatus === 'received' ? `<span class="time-elapsed">${getTimeElapsed(order.createdAt)}</span>` : ''}
            </div>

            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span class="item-qty">${item.quantity}x</span>
                        <span class="item-name">${item.name}</span>
                        ${item.specialInstructions ? `<div class="item-notes"><i class="fas fa-sticky-note"></i> ${item.specialInstructions}</div>` : ''}
                    </div>
                `).join('')}
            </div>

            ${order.specialInstructions ? `
                <div class="order-notes">
                    <i class="fas fa-comment-alt"></i>
                    ${order.specialInstructions}
                </div>
            ` : ''}

            <div class="order-actions">
                ${getOrderActions(order)}
            </div>
        </div>
    `).join('');
}

// Get Order Actions based on status
function getOrderActions(order) {
    const id = order._id || order.orderNumber;

    switch (order.orderStatus) {
        case 'received':
            return `
                <button class="action-btn confirm" onclick="confirmOrderPayment('${id}')">
                    <i class="fas fa-check"></i> Confirm Payment
                </button>
                <button class="action-btn cancel" onclick="cancelKitchenOrder('${id}')">
                    <i class="fas fa-times"></i> Cancel
                </button>
            `;
        case 'preparing':
            return `
                <button class="action-btn ready" onclick="markKitchenOrderReady('${id}')">
                    <i class="fas fa-bell"></i> Mark Ready
                </button>
            `;
        case 'ready':
            return `
                <button class="action-btn served" onclick="markKitchenOrderServed('${id}')">
                    <i class="fas fa-utensils"></i> Mark Served
                </button>
            `;
        default:
            return '';
    }
}

// Confirm Payment (Kitchen)
async function confirmOrderPayment(orderId) {
    try {
        const response = await cafeAPI.confirmPayment(orderId);

        if (response.success) {
            showToast('Payment confirmed, order is preparing', 'success');
            loadKitchenOrders();
        }
    } catch (error) {
        console.error('Error confirming payment:', error);
        showToast(error.message || 'Error confirming payment', 'error');
    }
}

// Mark Order Ready (Kitchen)
async function markKitchenOrderReady(orderId) {
    try {
        const response = await cafeAPI.markOrderReady(orderId);

        if (response.success) {
            showToast('Order marked as ready', 'success');
            loadKitchenOrders();
        }
    } catch (error) {
        console.error('Error marking order ready:', error);
        showToast(error.message || 'Error updating order', 'error');
    }
}

// Mark Order Served (Kitchen)
async function markKitchenOrderServed(orderId) {
    try {
        const response = await cafeAPI.markOrderServed(orderId);

        if (response.success) {
            showToast('Order marked as served', 'success');
            loadKitchenOrders();
        }
    } catch (error) {
        console.error('Error marking order served:', error);
        showToast(error.message || 'Error updating order', 'error');
    }
}

// Cancel Order (Kitchen)
async function cancelKitchenOrder(orderId) {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
        const response = await cafeAPI.cancelOrder(orderId);

        if (response.success) {
            showToast('Order cancelled', 'success');
            loadKitchenOrders();
        }
    } catch (error) {
        console.error('Error cancelling order:', error);
        showToast(error.message || 'Cannot cancel this order', 'error');
    }
}

// Filter Kitchen Orders
function filterKitchenOrders(filter, element) {
    // Update active button
    document.querySelectorAll('.kitchen-filters .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    element.classList.add('active');

    renderKitchenOrders(filter);
}

// Toggle Kitchen Sound
function toggleKitchenSound() {
    kitchenSoundEnabled = !kitchenSoundEnabled;

    const soundBtn = document.querySelector('.sound-toggle');
    if (soundBtn) {
        soundBtn.classList.toggle('active', kitchenSoundEnabled);
        soundBtn.innerHTML = `<i class="fas fa-${kitchenSoundEnabled ? 'volume-up' : 'volume-mute'}"></i>`;
    }

    showToast(`Sound ${kitchenSoundEnabled ? 'enabled' : 'disabled'}`, 'success');
}

// Play Notification Sound
function playNotificationSound() {
    if (kitchenSoundEnabled && notificationSound) {
        notificationSound.currentTime = 0;
        notificationSound.play().catch(err => console.log('Audio play failed:', err));
    }
}

// Start Kitchen Polling (every 10 seconds)
function startKitchenPolling() {
    if (kitchenPollInterval) {
        clearInterval(kitchenPollInterval);
    }

    kitchenPollInterval = setInterval(async () => {
        try {
            // Check for new orders
            const response = await cafeAPI.getNewOrderCount(lastOrderCheck);

            if (response.success && response.count > 0) {
                playNotificationSound();
                showToast(`${response.count} new order${response.count > 1 ? 's' : ''}!`, 'success');
            }

            lastOrderCheck = new Date().toISOString();

            // Reload orders
            loadKitchenOrders();
        } catch (error) {
            console.error('Kitchen polling error:', error);
        }
    }, 10000); // 10 seconds
}

// Stop Kitchen Polling
function stopKitchenPolling() {
    if (kitchenPollInterval) {
        clearInterval(kitchenPollInterval);
        kitchenPollInterval = null;
    }
}

// Helper: Format Status
function formatStatus(status) {
    const statusMap = {
        'received': 'Pending Payment',
        'preparing': 'Preparing',
        'ready': 'Ready',
        'served': 'Served',
        'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
}

// Helper: Format Time
function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Helper: Get Time Elapsed
function getTimeElapsed(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 min ago';
    if (diffMins < 60) return `${diffMins} mins ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    return `${diffHours} hours ago`;
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showKitchenDashboard,
        loadKitchenOrders,
        confirmOrderPayment,
        markKitchenOrderReady,
        markKitchenOrderServed,
        cancelKitchenOrder,
        toggleKitchenSound,
        startKitchenPolling,
        stopKitchenPolling
    };
}
