// ============================================
// API.JS - CafeAPI Class for Backend Communication
// ============================================

class CafeAPI {
    constructor() {
        this.baseURL = API_BASE_URL || 'http://localhost:5000/api';
        this.useAPI = false; // Set to true to use backend API, false for localStorage
        this.token = localStorage.getItem('cafeToken') || null;
        this.userRole = localStorage.getItem('cafeUserRole') || null;
    }

    // Set API base URL
    setBaseURL(url) {
        this.baseURL = url;
    }

    // Toggle between API and localStorage mode
    setAPIMode(useAPI) {
        this.useAPI = useAPI;
    }

    // Set authentication token
    setToken(token, role = 'admin') {
        this.token = token;
        this.userRole = role;
        if (token) {
            localStorage.setItem('cafeToken', token);
            localStorage.setItem('cafeUserRole', role);
        } else {
            localStorage.removeItem('cafeToken');
            localStorage.removeItem('cafeUserRole');
        }
    }

    // Clear authentication
    clearToken() {
        this.token = null;
        this.userRole = null;
        localStorage.removeItem('cafeToken');
        localStorage.removeItem('cafeUserRole');
    }

    // Get request headers
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    // Generic API request method
    async makeRequest(endpoint, options = {}) {
        if (!this.useAPI) {
            throw new Error('API mode is disabled. Using localStorage mode.');
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                headers: {
                    ...this.getHeaders(),
                    ...options.headers,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    }

    // ==================== AUTH API METHODS ====================

    async login(credentials) {
        if (!this.useAPI) {
            return this.loginLocalStorage(credentials);
        }

        const response = await this.makeRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        if (response.success && response.token) {
            this.setToken(response.token, response.user?.role || 'admin');
        }

        return response;
    }

    loginLocalStorage(credentials) {
        const { username, password } = credentials;

        // Check admin credentials
        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            const token = 'local_admin_token_' + Date.now();
            this.setToken(token, 'admin');
            return Promise.resolve({
                success: true,
                token: token,
                user: { username, role: 'admin' }
            });
        }

        // Check kitchen credentials
        if (username === KITCHEN_CREDENTIALS.username && password === KITCHEN_CREDENTIALS.password) {
            const token = 'local_kitchen_token_' + Date.now();
            this.setToken(token, 'kitchen');
            return Promise.resolve({
                success: true,
                token: token,
                user: { username, role: 'kitchen' }
            });
        }

        return Promise.resolve({
            success: false,
            error: 'Invalid credentials'
        });
    }

    logout() {
        this.clearToken();
        return Promise.resolve({ success: true });
    }

    // ==================== MENU API METHODS ====================

    async getMenuItems(filters = {}) {
        if (!this.useAPI) {
            return this.getMenuItemsLocal(filters);
        }

        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = `/menu${queryParams ? `?${queryParams}` : ''}`;
        return await this.makeRequest(endpoint);
    }

    getMenuItemsLocal(filters = {}) {
        let filteredItems = [...menuItems];

        if (filters.category && filters.category !== 'all') {
            filteredItems = filteredItems.filter(item => item.category === filters.category);
        }

        if (filters.isVeg !== undefined) {
            filteredItems = filteredItems.filter(item => item.isVeg === (filters.isVeg === 'true' || filters.isVeg === true));
        }

        return Promise.resolve({
            success: true,
            data: filteredItems,
            count: filteredItems.length,
            total: filteredItems.length
        });
    }

    async createMenuItem(itemData) {
        if (!this.useAPI) {
            const newItem = {
                ...itemData,
                id: Math.max(...menuItems.map(i => i.id), 0) + 1
            };
            menuItems.push(newItem);
            return Promise.resolve({ success: true, data: newItem });
        }

        return await this.makeRequest('/menu', {
            method: 'POST',
            body: JSON.stringify(itemData),
        });
    }

    async updateMenuItem(id, itemData) {
        if (!this.useAPI) {
            const index = menuItems.findIndex(i => i.id == id);
            if (index !== -1) {
                menuItems[index] = { ...menuItems[index], ...itemData };
                return Promise.resolve({ success: true, data: menuItems[index] });
            }
            return Promise.reject(new Error('Item not found'));
        }

        return await this.makeRequest(`/menu/${id}`, {
            method: 'PUT',
            body: JSON.stringify(itemData),
        });
    }

    async deleteMenuItem(id) {
        if (!this.useAPI) {
            const index = menuItems.findIndex(i => i.id == id);
            if (index !== -1) {
                menuItems.splice(index, 1);
                return Promise.resolve({ success: true, message: 'Item deleted' });
            }
            return Promise.reject(new Error('Item not found'));
        }

        return await this.makeRequest(`/menu/${id}`, {
            method: 'DELETE',
        });
    }

    // ==================== COMBOS API METHODS ====================

    async getCombos(filters = {}) {
        if (!this.useAPI) {
            return Promise.resolve({
                success: true,
                data: combos,
                count: combos.length
            });
        }

        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = `/combos${queryParams ? `?${queryParams}` : ''}`;
        return await this.makeRequest(endpoint);
    }

    async createCombo(comboData) {
        if (!this.useAPI) {
            const newCombo = {
                ...comboData,
                id: `combo_${Date.now()}`
            };
            combos.push(newCombo);
            return Promise.resolve({ success: true, data: newCombo });
        }

        return await this.makeRequest('/combos', {
            method: 'POST',
            body: JSON.stringify(comboData),
        });
    }

    async updateCombo(id, comboData) {
        if (!this.useAPI) {
            const index = combos.findIndex(c => c.id === id);
            if (index !== -1) {
                combos[index] = { ...combos[index], ...comboData };
                return Promise.resolve({ success: true, data: combos[index] });
            }
            return Promise.reject(new Error('Combo not found'));
        }

        return await this.makeRequest(`/combos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(comboData),
        });
    }

    async deleteCombo(id) {
        if (!this.useAPI) {
            const index = combos.findIndex(c => c.id === id);
            if (index !== -1) {
                combos.splice(index, 1);
                return Promise.resolve({ success: true, message: 'Combo deleted' });
            }
            return Promise.reject(new Error('Combo not found'));
        }

        return await this.makeRequest(`/combos/${id}`, {
            method: 'DELETE',
        });
    }

    // ==================== ORDERS API METHODS ====================

    async createOrder(orderData) {
        if (!this.useAPI) {
            return this.createOrderLocal(orderData);
        }

        return await this.makeRequest('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    }

    createOrderLocal(orderData) {
        // Generate 4-digit order number
        const today = new Date().toISOString().split('T')[0];
        const todayOrders = orders.filter(o => o.createdAt && o.createdAt.startsWith(today));
        const nextNum = (todayOrders.length + 1).toString().padStart(4, '0');

        const newOrder = {
            ...orderData,
            _id: `order_${Date.now()}`,
            orderNumber: nextNum,
            createdAt: new Date().toISOString(),
            orderStatus: 'received',
            paymentStatus: 'pending'
        };

        orders.push(newOrder);
        localStorage.setItem('cafeOrders', JSON.stringify(orders));

        return Promise.resolve({
            success: true,
            data: newOrder
        });
    }

    async getOrders(filters = {}) {
        if (!this.useAPI) {
            return Promise.resolve({
                success: true,
                data: orders,
                count: orders.length
            });
        }

        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = `/orders${queryParams ? `?${queryParams}` : ''}`;
        return await this.makeRequest(endpoint);
    }

    async getOrder(orderNumber) {
        if (!this.useAPI) {
            const order = orders.find(o => o.orderNumber === orderNumber);
            if (order) {
                return Promise.resolve({ success: true, data: order });
            }
            return Promise.reject(new Error('Order not found'));
        }

        return await this.makeRequest(`/orders/${orderNumber}`);
    }

    async updateOrderStatus(id, status) {
        if (!this.useAPI) {
            const order = orders.find(o => o._id === id || o.orderNumber === id);
            if (order) {
                order.orderStatus = status;
                if (status === 'ready') {
                    order.actualReadyTime = new Date().toISOString();
                } else if (status === 'served') {
                    order.servedTime = new Date().toISOString();
                }
                localStorage.setItem('cafeOrders', JSON.stringify(orders));
                return Promise.resolve({ success: true, data: order });
            }
            return Promise.reject(new Error('Order not found'));
        }

        return await this.makeRequest(`/orders/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    }

    // ==================== KITCHEN API METHODS ====================

    async getKitchenOrders() {
        if (!this.useAPI) {
            const today = new Date().toISOString().split('T')[0];
            const todayOrders = orders.filter(o =>
                o.createdAt && o.createdAt.startsWith(today)
            ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            return Promise.resolve({
                success: true,
                data: todayOrders,
                count: todayOrders.length
            });
        }

        return await this.makeRequest('/kitchen/orders');
    }

    async confirmPayment(orderId) {
        if (!this.useAPI) {
            const order = orders.find(o => o._id === orderId || o.orderNumber === orderId);
            if (order) {
                if (order.orderStatus !== 'received') {
                    return Promise.reject(new Error('Can only confirm payment for received orders'));
                }
                order.paymentStatus = 'paid';
                order.orderStatus = 'preparing';
                localStorage.setItem('cafeOrders', JSON.stringify(orders));
                return Promise.resolve({ success: true, data: order });
            }
            return Promise.reject(new Error('Order not found'));
        }

        return await this.makeRequest(`/kitchen/orders/${orderId}/confirm`, {
            method: 'PUT',
        });
    }

    async markOrderReady(orderId) {
        if (!this.useAPI) {
            const order = orders.find(o => o._id === orderId || o.orderNumber === orderId);
            if (order) {
                order.orderStatus = 'ready';
                order.actualReadyTime = new Date().toISOString();
                localStorage.setItem('cafeOrders', JSON.stringify(orders));
                return Promise.resolve({ success: true, data: order });
            }
            return Promise.reject(new Error('Order not found'));
        }

        return await this.makeRequest(`/kitchen/orders/${orderId}/ready`, {
            method: 'PUT',
        });
    }

    async markOrderServed(orderId) {
        if (!this.useAPI) {
            const order = orders.find(o => o._id === orderId || o.orderNumber === orderId);
            if (order) {
                order.orderStatus = 'served';
                order.servedTime = new Date().toISOString();
                localStorage.setItem('cafeOrders', JSON.stringify(orders));
                return Promise.resolve({ success: true, data: order });
            }
            return Promise.reject(new Error('Order not found'));
        }

        return await this.makeRequest(`/kitchen/orders/${orderId}/served`, {
            method: 'PUT',
        });
    }

    async cancelOrder(orderId) {
        if (!this.useAPI) {
            const order = orders.find(o => o._id === orderId || o.orderNumber === orderId);
            if (order) {
                if (order.orderStatus !== 'received' || order.paymentStatus !== 'pending') {
                    return Promise.reject(new Error('Can only cancel unpaid received orders'));
                }
                order.orderStatus = 'cancelled';
                order.paymentStatus = 'cancelled';
                localStorage.setItem('cafeOrders', JSON.stringify(orders));
                return Promise.resolve({ success: true, data: order });
            }
            return Promise.reject(new Error('Order not found'));
        }

        return await this.makeRequest(`/kitchen/orders/${orderId}/cancel`, {
            method: 'PUT',
        });
    }

    async getNewOrderCount(since) {
        if (!this.useAPI) {
            const sinceDate = new Date(since);
            const newOrders = orders.filter(o => new Date(o.createdAt) > sinceDate);
            return Promise.resolve({
                success: true,
                count: newOrders.length
            });
        }

        return await this.makeRequest(`/kitchen/orders/new-count?since=${since}`);
    }

    // ==================== REVIEWS API METHODS ====================

    async getReviews(filters = {}) {
        if (!this.useAPI) {
            return Promise.resolve({
                success: true,
                data: reviews,
                count: reviews.length
            });
        }

        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = `/reviews${queryParams ? `?${queryParams}` : ''}`;
        return await this.makeRequest(endpoint);
    }

    async createReview(reviewData) {
        if (!this.useAPI) {
            const newReview = {
                ...reviewData,
                id: Date.now(),
                createdAt: new Date().toISOString(),
                isFeatured: false
            };
            reviews.unshift(newReview);
            if (reviews.length > 50) reviews.splice(50);
            localStorage.setItem('cafeReviews', JSON.stringify(reviews));
            return Promise.resolve({ success: true, data: newReview });
        }

        return await this.makeRequest('/reviews', {
            method: 'POST',
            body: JSON.stringify(reviewData),
        });
    }

    async getFeaturedReviews(limit = 6) {
        if (!this.useAPI) {
            const featured = reviews.filter(r => r.isFeatured || r.rating >= 4).slice(0, limit);
            return Promise.resolve({
                success: true,
                data: featured,
                count: featured.length
            });
        }

        return await this.makeRequest(`/reviews/featured?limit=${limit}`);
    }

    async toggleFeaturedReview(reviewId) {
        if (!this.useAPI) {
            const review = reviews.find(r => r.id === reviewId);
            if (review) {
                review.isFeatured = !review.isFeatured;
                localStorage.setItem('cafeReviews', JSON.stringify(reviews));
                return Promise.resolve({ success: true, data: review });
            }
            return Promise.reject(new Error('Review not found'));
        }

        return await this.makeRequest(`/reviews/${reviewId}/feature`, {
            method: 'PUT',
        });
    }

    // ==================== PROMOS API METHODS ====================

    async getPromos() {
        if (!this.useAPI) {
            return Promise.resolve({
                success: true,
                data: promos,
                count: promos.length
            });
        }

        return await this.makeRequest('/promos');
    }

    async trackPromoImpression(promoId) {
        if (!this.useAPI) {
            return Promise.resolve({ success: true });
        }

        return await this.makeRequest(`/promos/${promoId}/impression`, {
            method: 'PUT',
        });
    }

    async trackPromoClick(promoId) {
        if (!this.useAPI) {
            return Promise.resolve({ success: true });
        }

        return await this.makeRequest(`/promos/${promoId}/click`, {
            method: 'PUT',
        });
    }

    // ==================== SETTINGS API METHODS ====================

    async getSettings() {
        if (!this.useAPI) {
            return Promise.resolve({
                success: true,
                data: {
                    cafeName: 'Cafe Coffeto',
                    taxPercentage: 0,
                    operatingHours: 'Mon-Sun: 8:00 AM - 10:00 PM'
                }
            });
        }

        return await this.makeRequest('/settings');
    }

    async getTaxRate() {
        if (!this.useAPI) {
            return Promise.resolve({
                success: true,
                taxPercentage: 0
            });
        }

        return await this.makeRequest('/settings/tax');
    }
}

// Create global API instance
const cafeAPI = new CafeAPI();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CafeAPI, cafeAPI };
}
