// API Configuration for Cafe Coffeeto Frontend
class CafeAPI {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
        this.useAPI = false; // Set to true to use backend API, false for localStorage
        this.token = localStorage.getItem('adminToken') || null;
    }

    // Set API base URL
    setBaseURL(url) {
        this.baseURL = url;
    }

    // Toggle between API and localStorage mode
    setAPIMode(useAPI) {
        this.useAPI = useAPI;
    }

    // Set admin token for authenticated requests
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('adminToken', token);
        } else {
            localStorage.removeItem('adminToken');
        }
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

    // ==================== MENU API METHODS ====================

    async getMenuItems(filters = {}) {
        if (!this.useAPI) {
            return this.getMenuItemsFromLocalStorage(filters);
        }

        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = `/menu${queryParams ? `?${queryParams}` : ''}`;

        return await this.makeRequest(endpoint);
    }

    async getMenuItem(id) {
        if (!this.useAPI) {
            return this.getMenuItemFromLocalStorage(id);
        }

        return await this.makeRequest(`/menu/${id}`);
    }

    async createMenuItem(itemData) {
        if (!this.useAPI) {
            return this.createMenuItemInLocalStorage(itemData);
        }

        return await this.makeRequest('/menu', {
            method: 'POST',
            body: JSON.stringify(itemData),
        });
    }

    async updateMenuItem(id, itemData) {
        if (!this.useAPI) {
            return this.updateMenuItemInLocalStorage(id, itemData);
        }

        return await this.makeRequest(`/menu/${id}`, {
            method: 'PUT',
            body: JSON.stringify(itemData),
        });
    }

    // ==================== COMBOS API METHODS ====================

    async getCombos(filters = {}) {
        if (!this.useAPI) {
            return this.getCombosFromLocalStorage(filters);
        }

        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = `/combos${queryParams ? `?${queryParams}` : ''}`;

        return await this.makeRequest(endpoint);
    }

    async getCombo(id) {
        if (!this.useAPI) {
            return this.getComboFromLocalStorage(id);
        }

        return await this.makeRequest(`/combos/${id}`);
    }

    async createCombo(comboData) {
        if (!this.useAPI) {
            return this.createComboInLocalStorage(comboData);
        }

        return await this.makeRequest('/combos', {
            method: 'POST',
            body: JSON.stringify(comboData),
        });
    }

    async updateCombo(id, comboData) {
        if (!this.useAPI) {
            return this.updateComboInLocalStorage(id, comboData);
        }

        return await this.makeRequest(`/combos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(comboData),
        });
    }

    async deleteCombo(id) {
        if (!this.useAPI) {
            return this.deleteComboFromLocalStorage(id);
        }

        return await this.makeRequest(`/combos/${id}`, {
            method: 'DELETE',
        });
    }

    // ==================== ORDERS API METHODS ====================

    async createOrder(orderData) {
        if (!this.useAPI) {
            return this.createOrderInLocalStorage(orderData);
        }

        return await this.makeRequest('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    }

    async getOrders(filters = {}) {
        if (!this.useAPI) {
            return this.getOrdersFromLocalStorage(filters);
        }

        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = `/orders${queryParams ? `?${queryParams}` : ''}`;

        return await this.makeRequest(endpoint);
    }

    async getOrder(orderNumber) {
        if (!this.useAPI) {
            return this.getOrderFromLocalStorage(orderNumber);
        }

        return await this.makeRequest(`/orders/${orderNumber}`);
    }

    async updateOrderStatus(id, status) {
        if (!this.useAPI) {
            return this.updateOrderStatusInLocalStorage(id, status);
        }

        return await this.makeRequest(`/orders/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    }

    // ==================== REVIEWS API METHODS ====================

    async getReviews(filters = {}) {
        if (!this.useAPI) {
            return this.getReviewsFromLocalStorage(filters);
        }

        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = `/reviews${queryParams ? `?${queryParams}` : ''}`;

        return await this.makeRequest(endpoint);
    }

    async createReview(reviewData) {
        if (!this.useAPI) {
            return this.createReviewInLocalStorage(reviewData);
        }

        return await this.makeRequest('/reviews', {
            method: 'POST',
            body: JSON.stringify(reviewData),
        });
    }

    async getFeaturedReviews(limit = 6) {
        if (!this.useAPI) {
            return this.getFeaturedReviewsFromLocalStorage(limit);
        }

        return await this.makeRequest(`/reviews/featured?limit=${limit}`);
    }

    // ==================== ADMIN API METHODS ====================

    async adminLogin(credentials) {
        const response = await this.makeRequest('/admin/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        if (response.success && response.token) {
            this.setToken(response.token);
        }

        return response;
    }

    async getDashboardData() {
        if (!this.useAPI) {
            return this.getDashboardDataFromLocalStorage();
        }

        return await this.makeRequest('/admin/dashboard');
    }

    async getAnalytics(period = 'week') {
        if (!this.useAPI) {
            return this.getAnalyticsFromLocalStorage(period);
        }

        return await this.makeRequest(`/admin/analytics?period=${period}`);
    }

    // ==================== LOCALSTORAGE FALLBACK METHODS ====================
    // These methods provide fallback functionality when API mode is disabled

    getMenuItemsFromLocalStorage(filters = {}) {
        const items = JSON.parse(localStorage.getItem('cafeMenuItems') || '[]');
        let filteredItems = items;

        if (filters.category && filters.category !== 'all') {
            filteredItems = filteredItems.filter(item => item.category === filters.category);
        }

        if (filters.isVeg !== undefined) {
            filteredItems = filteredItems.filter(item => item.isVeg === (filters.isVeg === 'true'));
        }

        return Promise.resolve({
            success: true,
            data: filteredItems,
            count: filteredItems.length,
            total: filteredItems.length
        });
    }

    getCombosFromLocalStorage(filters = {}) {
        const combos = JSON.parse(localStorage.getItem('cafeCombos') || '[]');
        let filteredCombos = combos;

        if (filters.isVeg !== undefined) {
            filteredCombos = filteredCombos.filter(combo => combo.isVeg === (filters.isVeg === 'true'));
        }

        return Promise.resolve({
            success: true,
            data: filteredCombos,
            count: filteredCombos.length,
            total: filteredCombos.length
        });
    }

    createComboInLocalStorage(comboData) {
        const combos = JSON.parse(localStorage.getItem('cafeCombos') || '[]');
        const newCombo = {
            ...comboData,
            id: `combo_${Date.now()}`,
            createdAt: new Date().toISOString()
        };

        combos.push(newCombo);
        localStorage.setItem('cafeCombos', JSON.stringify(combos));

        return Promise.resolve({
            success: true,
            data: newCombo
        });
    }

    updateComboInLocalStorage(id, comboData) {
        const combos = JSON.parse(localStorage.getItem('cafeCombos') || '[]');
        const comboIndex = combos.findIndex(combo => combo.id === id);

        if (comboIndex === -1) {
            return Promise.reject(new Error('Combo not found'));
        }

        combos[comboIndex] = { ...combos[comboIndex], ...comboData };
        localStorage.setItem('cafeCombos', JSON.stringify(combos));

        return Promise.resolve({
            success: true,
            data: combos[comboIndex]
        });
    }

    deleteComboFromLocalStorage(id) {
        const combos = JSON.parse(localStorage.getItem('cafeCombos') || '[]');
        const filteredCombos = combos.filter(combo => combo.id !== id);

        localStorage.setItem('cafeCombos', JSON.stringify(filteredCombos));

        return Promise.resolve({
            success: true,
            message: 'Combo deleted successfully'
        });
    }

    createOrderInLocalStorage(orderData) {
        const orders = JSON.parse(localStorage.getItem('cafeOrders') || '[]');
        const orderNumber = `CF${Date.now()}`;

        const newOrder = {
            ...orderData,
            id: orderNumber,
            orderNumber: orderNumber,
            createdAt: new Date().toISOString(),
            orderStatus: 'received',
            paymentStatus: orderData.paymentMethod === 'cash' ? 'pending' : 'paid'
        };

        orders.push(newOrder);
        localStorage.setItem('cafeOrders', JSON.stringify(orders));

        return Promise.resolve({
            success: true,
            data: newOrder
        });
    }

    createReviewInLocalStorage(reviewData) {
        const reviews = JSON.parse(localStorage.getItem('cafeReviews') || '[]');

        const newReview = {
            ...reviewData,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            isApproved: reviewData.rating >= 4, // Auto-approve high ratings
            isVisible: true
        };

        reviews.unshift(newReview);
        if (reviews.length > 20) {
            reviews.splice(20);
        }

        localStorage.setItem('cafeReviews', JSON.stringify(reviews));

        return Promise.resolve({
            success: true,
            data: newReview
        });
    }

    getFeaturedReviewsFromLocalStorage(limit = 6) {
        const reviews = JSON.parse(localStorage.getItem('cafeReviews') || '[]');
        const featuredReviews = reviews
            .filter(review => review.isApproved && review.isVisible)
            .slice(0, limit);

        return Promise.resolve({
            success: true,
            data: featuredReviews,
            count: featuredReviews.length
        });
    }

    getDashboardDataFromLocalStorage() {
        const orders = JSON.parse(localStorage.getItem('cafeOrders') || '[]');
        const reviews = JSON.parse(localStorage.getItem('cafeReviews') || '[]');

        const today = new Date().toDateString();
        const todayOrders = orders.filter(order =>
            new Date(order.createdAt).toDateString() === today
        );

        const totalRevenue = todayOrders.reduce((sum, order) => sum + (order.total || 0), 0);

        return Promise.resolve({
            success: true,
            data: {
                orders: {
                    today: todayOrders.length,
                    total: orders.length,
                    pending: orders.filter(o => ['received', 'preparing'].includes(o.orderStatus)).length
                },
                revenue: {
                    today: totalRevenue,
                    averageOrderValue: todayOrders.length ? totalRevenue / todayOrders.length : 0
                },
                reviews: {
                    totalReviews: reviews.length,
                    averageRating: reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0,
                    pending: reviews.filter(r => !r.isApproved).length
                }
            }
        });
    }
}

// Create global API instance
const cafeAPI = new CafeAPI();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = cafeAPI;
}