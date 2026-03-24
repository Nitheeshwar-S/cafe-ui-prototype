// ============================================
// UI-ADMIN.JS - Admin Dashboard UI
// ============================================

// Admin State (using globals from auth.js: isLoggedIn, userRole)

// ==================== ADMIN DASHBOARD ====================

function showAdminDashboard() {
    hideAllPages();
    document.getElementById('adminPage').classList.remove('hidden');
    document.querySelector('.header').classList.add('hidden');

    // Hide bottom nav for admin
    hideBottomNav();

    // Update stats
    setTimeout(updateAdminStats, 100);
}

function updateAdminStats() {
    // Calculate stats
    const totalOrdersEl = document.getElementById('totalOrders');
    const totalRevenueEl = document.getElementById('totalRevenue');
    const totalMenuItemsEl = document.getElementById('totalMenuItems');

    if (totalOrdersEl) {
        animateCounter(totalOrdersEl, orders.length);
    }

    if (totalRevenueEl) {
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        animateCounter(totalRevenueEl, Math.round(totalRevenue), '₹');
    }

    if (totalMenuItemsEl) {
        animateCounter(totalMenuItemsEl, menuItems.length);
    }

    // Render components
    renderAdminOrders();
    renderAdminCombos();
    renderAdminMenuItems();

    // Update nav card counts
    const menuItemsCount = document.getElementById('menuItemsCount');
    const combosCount = document.getElementById('combosCount');
    const ordersCount = document.getElementById('ordersCount');

    if (menuItemsCount) menuItemsCount.textContent = `${menuItems.length} items`;
    if (combosCount) combosCount.textContent = `${combos.length} combos`;
    if (ordersCount) ordersCount.textContent = `${orders.length} orders`;
}

// ==================== ADMIN ORDERS ====================

function renderAdminOrders() {
    const container = document.getElementById('adminOrders');
    if (!container) return;

    if (orders.length === 0) {
        container.innerHTML = '<p class="no-data">No orders yet</p>';
        return;
    }

    const recentOrders = orders.slice(-10).reverse();

    container.innerHTML = recentOrders.map(order => `
        <div class="admin-order-card">
            <div class="admin-order-header">
                <div class="order-info">
                    <span class="order-number">#${order.orderNumber}</span>
                    <span class="order-customer">${order.customerName}</span>
                </div>
                <div class="order-amount">₹${Math.round(order.total || 0)}</div>
            </div>
            <div class="admin-order-details">
                <div class="order-detail">
                    <i class="fas fa-credit-card"></i>
                    <span>${order.paymentMethod || 'counter'}</span>
                </div>
                <div class="order-detail">
                    <i class="fas fa-clock"></i>
                    <span>${new Date(order.createdAt || order.timestamp).toLocaleTimeString()}</span>
                </div>
                <div class="order-detail status-${order.orderStatus || 'received'}">
                    <i class="fas fa-circle"></i>
                    <span>${order.orderStatus || 'received'}</span>
                </div>
            </div>
            <div class="order-items">
                ${(order.items || []).map(item => `
                    <span class="order-item-tag">${item.quantity}x ${item.name}</span>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// ==================== ADMIN COMBOS ====================

function renderAdminCombos() {
    const container = document.getElementById('adminComboList');
    if (!container) return;

    if (combos.length === 0) {
        container.innerHTML = '<p class="no-data">No combos created yet</p>';
        return;
    }

    container.innerHTML = combos.map(combo => `
        <div class="admin-combo-item">
            <div class="combo-info">
                <img src="${combo.image}" alt="${combo.name}" class="combo-thumbnail" onerror="this.src='https://via.placeholder.com/80x80/D2042D/ffffff?text=Combo'">
                <div class="combo-details">
                    <h4>${combo.name}</h4>
                    <p>${combo.description}</p>
                    <div class="combo-meta">
                        <span class="combo-price">₹${combo.price}</span>
                        <span class="combo-original">₹${combo.originalPrice}</span>
                        <span class="combo-savings">Save ₹${combo.savings}</span>
                        <span class="combo-type ${combo.isVeg ? 'veg' : 'non-veg'}">${combo.isVeg ? 'Veg' : 'Non-Veg'}</span>
                    </div>
                </div>
            </div>
            <div class="combo-actions">
                <button class="admin-btn edit" onclick="showAdminComboModal(combos.find(c => c.id === '${combo.id}'))">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="admin-btn delete" onclick="deleteComboAdmin('${combo.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// ==================== ADMIN MENU ITEMS ====================

let currentAdminMenuCategory = 'all';

function filterAdminMenu(category, element) {
    currentAdminMenuCategory = category;

    document.querySelectorAll('.category-filter-btn').forEach(btn => btn.classList.remove('active'));
    if (element) element.classList.add('active');

    renderAdminMenuItems();
}

function renderAdminMenuItems() {
    const container = document.getElementById('adminMenuList');
    if (!container) return;

    let filteredItems = currentAdminMenuCategory === 'all'
        ? menuItems
        : menuItems.filter(item => item.category === currentAdminMenuCategory);

    if (filteredItems.length === 0) {
        container.innerHTML = '<p class="no-data">No menu items in this category</p>';
        return;
    }

    container.innerHTML = filteredItems.map(item => `
        <div class="admin-menu-item">
            <div class="menu-item-info">
                <img src="${item.image}" alt="${item.name}" class="menu-thumbnail" onerror="this.src='https://via.placeholder.com/80x80/D2042D/ffffff?text=Item'">
                <div class="menu-item-details">
                    <h4>${item.name}</h4>
                    <p>${item.description}</p>
                    <div class="menu-item-meta">
                        <span class="item-price">₹${item.price}</span>
                        <span class="item-category">${item.category}</span>
                        <span class="item-type ${item.isVeg ? 'veg' : 'non-veg'}">${item.isVeg ? 'Veg' : 'Non-Veg'}</span>
                        <span class="item-rating"><i class="fas fa-star"></i> ${item.rating}</span>
                    </div>
                </div>
            </div>
            <div class="menu-item-actions">
                <button class="admin-btn edit" onclick="showAdminMenuModal(menuItems.find(i => i.id === ${item.id}))">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="admin-btn delete" onclick="deleteMenuItemAdmin(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// ==================== ADMIN COMBO MODAL ====================

function showAdminComboModal(combo = null) {
    if (!isLoggedIn) return;

    const isEdit = combo !== null;
    const modal = document.createElement('div');
    modal.id = 'adminComboModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content admin-combo-modal">
            <button class="close-btn" onclick="closeAdminComboModal()">
                <i class="fas fa-times"></i>
            </button>
            <div class="admin-combo-header">
                <h2>${isEdit ? 'Edit Combo' : 'Create New Combo'}</h2>
            </div>
            <form id="comboForm" onsubmit="saveComboAdmin(event)">
                <div class="form-group">
                    <label for="comboName">Combo Name</label>
                    <input type="text" id="comboName" value="${combo?.name || ''}" required>
                </div>

                <div class="form-group">
                    <label for="comboDescription">Description</label>
                    <textarea id="comboDescription" rows="3">${combo?.description || ''}</textarea>
                </div>

                <div class="form-group">
                    <label for="comboImage">Image URL</label>
                    <input type="url" id="comboImage" value="${combo?.image || ''}" required>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="comboPrice">Combo Price</label>
                        <input type="number" id="comboPrice" value="${combo?.price || ''}" min="0" required>
                    </div>

                    <div class="form-group">
                        <label for="comboOriginalPrice">Original Price</label>
                        <input type="number" id="comboOriginalPrice" value="${combo?.originalPrice || ''}" min="0" required>
                    </div>
                </div>

                <div class="form-group">
                    <label>Diet Type</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="comboType" value="true" ${combo?.isVeg !== false ? 'checked' : ''}>
                            <span>Vegetarian</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="comboType" value="false" ${combo?.isVeg === false ? 'checked' : ''}>
                            <span>Non-Vegetarian</span>
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label>Combo Items</label>
                    <div id="comboItemsList">
                        ${combo ? combo.items.map((item, index) => `
                            <div class="combo-item-input">
                                <select class="item-select">
                                    ${menuItems.map(menuItem => `
                                        <option value="${menuItem.id}" ${menuItem.id == item.id ? 'selected' : ''}>
                                            ${menuItem.name}
                                        </option>
                                    `).join('')}
                                </select>
                                <input type="number" placeholder="Qty" value="${item.quantity || 1}" min="1" class="qty-input">
                                <button type="button" onclick="this.parentElement.remove()" class="remove-item-btn">×</button>
                            </div>
                        `).join('') : ''}
                    </div>
                    <button type="button" onclick="addComboItemInput()" class="btn-secondary">Add Item</button>
                </div>

                <input type="hidden" id="comboId" value="${combo?.id || ''}">

                <div class="form-actions">
                    <button type="submit" class="btn-primary">
                        ${isEdit ? 'Update Combo' : 'Create Combo'}
                    </button>
                    ${isEdit ? `
                        <button type="button" onclick="deleteComboAdmin('${combo.id}')" class="btn-danger">
                            Delete Combo
                        </button>
                    ` : ''}
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
}

function closeAdminComboModal() {
    const modal = document.getElementById('adminComboModal');
    if (modal) modal.remove();
}

function addComboItemInput() {
    const container = document.getElementById('comboItemsList');
    const itemDiv = document.createElement('div');
    itemDiv.className = 'combo-item-input';
    itemDiv.innerHTML = `
        <select class="item-select">
            ${menuItems.map(item => `<option value="${item.id}">${item.name}</option>`).join('')}
        </select>
        <input type="number" placeholder="Qty" value="1" min="1" class="qty-input">
        <button type="button" onclick="this.parentElement.remove()" class="remove-item-btn">×</button>
    `;
    container.appendChild(itemDiv);
}

async function saveComboAdmin(event) {
    event.preventDefault();

    const comboId = document.getElementById('comboId').value;
    const isEdit = comboId !== '';

    const comboData = {
        name: document.getElementById('comboName').value,
        description: document.getElementById('comboDescription').value,
        image: document.getElementById('comboImage').value,
        price: parseInt(document.getElementById('comboPrice').value),
        originalPrice: parseInt(document.getElementById('comboOriginalPrice').value),
        isVeg: document.querySelector('input[name="comboType"]:checked').value === 'true',
        rating: 4.5,
        items: []
    };

    comboData.savings = comboData.originalPrice - comboData.price;

    const itemInputs = document.querySelectorAll('.combo-item-input');
    itemInputs.forEach(input => {
        const itemId = parseInt(input.querySelector('.item-select').value);
        const quantity = parseInt(input.querySelector('.qty-input').value) || 1;

        const menuItem = menuItems.find(item => item.id === itemId);
        if (menuItem) {
            comboData.items.push({
                id: itemId,
                name: menuItem.name,
                quantity: quantity
            });
        }
    });

    try {
        if (isEdit) {
            await cafeAPI.updateCombo(comboId, comboData);
            const comboIndex = combos.findIndex(c => c.id === comboId);
            if (comboIndex !== -1) {
                combos[comboIndex] = { ...combos[comboIndex], ...comboData, id: comboId };
            }
        } else {
            const response = await cafeAPI.createCombo(comboData);
            if (response.success && response.data) {
                combos.push(response.data);
            }
        }

        renderAdminCombos();
        if (currentCategory === 'combos') renderCombos();
        closeAdminComboModal();
        showToast(`Combo ${isEdit ? 'updated' : 'created'} successfully!`, 'success');
    } catch (error) {
        console.error('Error saving combo:', error);
        showToast(`Error ${isEdit ? 'updating' : 'creating'} combo`, 'error');
    }
}

async function deleteComboAdmin(comboId) {
    if (!confirm('Are you sure you want to delete this combo?')) return;

    try {
        await cafeAPI.deleteCombo(comboId);
        combos = combos.filter(c => c.id !== comboId);

        renderAdminCombos();
        if (currentCategory === 'combos') renderCombos();
        closeAdminComboModal();
        showToast('Combo deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting combo:', error);
        showToast('Error deleting combo', 'error');
    }
}

// ==================== ADMIN MENU ITEM MODAL ====================

function showAdminMenuModal(item = null) {
    if (!isLoggedIn) return;

    const isEdit = item !== null;
    const modal = document.createElement('div');
    modal.id = 'adminMenuModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content admin-menu-modal">
            <button class="close-btn" onclick="closeAdminMenuModal()">
                <i class="fas fa-times"></i>
            </button>
            <div class="admin-menu-header">
                <h2>${isEdit ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
            </div>
            <form id="menuForm" onsubmit="saveMenuItemAdmin(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label for="menuItemName">Item Name</label>
                        <input type="text" id="menuItemName" value="${item?.name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="menuItemCategory">Category</label>
                        <select id="menuItemCategory" required>
                            <option value="coffee" ${item?.category === 'coffee' ? 'selected' : ''}>Coffee</option>
                            <option value="beverages" ${item?.category === 'beverages' ? 'selected' : ''}>Beverages</option>
                            <option value="snacks" ${item?.category === 'snacks' ? 'selected' : ''}>Snacks</option>
                            <option value="desserts" ${item?.category === 'desserts' ? 'selected' : ''}>Desserts</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="menuItemDescription">Description</label>
                    <textarea id="menuItemDescription" rows="2">${item?.description || ''}</textarea>
                </div>

                <div class="form-group">
                    <label for="menuItemImage">Image URL</label>
                    <input type="url" id="menuItemImage" value="${item?.image || ''}" required>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="menuItemPrice">Price (₹)</label>
                        <input type="number" id="menuItemPrice" value="${item?.price || ''}" min="0" required>
                    </div>
                    <div class="form-group">
                        <label for="menuItemRating">Rating</label>
                        <input type="number" id="menuItemRating" value="${item?.rating || 4.5}" min="0" max="5" step="0.1">
                    </div>
                </div>

                <div class="form-group">
                    <label>Diet Type</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="menuItemType" value="true" ${item?.isVeg !== false ? 'checked' : ''}>
                            <span>Vegetarian</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="menuItemType" value="false" ${item?.isVeg === false ? 'checked' : ''}>
                            <span>Non-Vegetarian</span>
                        </label>
                    </div>
                </div>

                <input type="hidden" id="menuItemId" value="${item?.id || ''}">

                <div class="form-actions">
                    <button type="submit" class="btn-primary">
                        ${isEdit ? 'Update Item' : 'Add Item'}
                    </button>
                    ${isEdit ? `
                        <button type="button" onclick="deleteMenuItemAdmin(${item.id})" class="btn-danger">
                            Delete Item
                        </button>
                    ` : ''}
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
}

function closeAdminMenuModal() {
    const modal = document.getElementById('adminMenuModal');
    if (modal) modal.remove();
}

async function saveMenuItemAdmin(event) {
    event.preventDefault();

    const itemId = document.getElementById('menuItemId').value;
    const isEdit = itemId !== '';

    const itemData = {
        name: document.getElementById('menuItemName').value,
        category: document.getElementById('menuItemCategory').value,
        description: document.getElementById('menuItemDescription').value,
        image: document.getElementById('menuItemImage').value,
        price: parseInt(document.getElementById('menuItemPrice').value),
        rating: parseFloat(document.getElementById('menuItemRating').value),
        isVeg: document.querySelector('input[name="menuItemType"]:checked').value === 'true'
    };

    try {
        if (isEdit) {
            await cafeAPI.updateMenuItem(itemId, itemData);
            const itemIndex = menuItems.findIndex(i => i.id == itemId);
            if (itemIndex !== -1) {
                menuItems[itemIndex] = { ...menuItems[itemIndex], ...itemData, id: parseInt(itemId) };
            }
        } else {
            const response = await cafeAPI.createMenuItem(itemData);
            if (response.success && response.data) {
                menuItems.push(response.data);
            }
        }

        renderAdminMenuItems();
        if (currentCategory === itemData.category || currentCategory === 'all') {
            renderMenuItems(currentCategory);
        }

        closeAdminMenuModal();
        showToast(`Menu item ${isEdit ? 'updated' : 'created'} successfully!`, 'success');
    } catch (error) {
        console.error('Error saving menu item:', error);
        showToast(`Error ${isEdit ? 'updating' : 'creating'} menu item`, 'error');
    }
}

async function deleteMenuItemAdmin(itemId) {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
        await cafeAPI.deleteMenuItem(itemId);

        const itemIndex = menuItems.findIndex(i => i.id == itemId);
        if (itemIndex !== -1) {
            menuItems.splice(itemIndex, 1);
        }

        renderAdminMenuItems();
        renderMenuItems(currentCategory);
        closeAdminMenuModal();
        showToast('Menu item deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting menu item:', error);
        showToast('Error deleting menu item', 'error');
    }
}

// ==================== MANAGEMENT PAGES ====================

function showMenuManagement() {
    hideAllPages();

    let page = document.getElementById('menuManagementPage');
    if (!page) {
        page = createMenuManagementPage();
        document.body.appendChild(page);
    }

    page.classList.remove('hidden');
    renderMenuItemsGrid();
}

function showComboManagement() {
    hideAllPages();

    let page = document.getElementById('comboManagementPage');
    if (!page) {
        page = createComboManagementPage();
        document.body.appendChild(page);
    }

    page.classList.remove('hidden');
    renderCombosGrid();
}

function showOrdersManagement() {
    hideAllPages();

    let page = document.getElementById('ordersManagementPage');
    if (!page) {
        page = createOrdersManagementPage();
        document.body.appendChild(page);
    }

    page.classList.remove('hidden');
    renderAllOrders();
}

function createMenuManagementPage() {
    const page = document.createElement('div');
    page.id = 'menuManagementPage';
    page.className = 'management-page hidden';
    page.innerHTML = `
        <div class="management-header">
            <button class="back-btn" onclick="showAdminDashboard()">
                <i class="fas fa-arrow-left"></i>
            </button>
            <h2>Menu Management</h2>
            <button class="add-btn" onclick="showAdminMenuModal()">
                <i class="fas fa-plus"></i>
            </button>
        </div>
        <div class="search-bar">
            <input type="text" id="menuSearchInput" placeholder="Search items..." oninput="filterMenuItems(this.value)">
        </div>
        <div class="category-pills">
            <button class="category-pill active btn-primary" data-category="all" onclick="filterMenuByCategory('all', this)">All</button>
            <button class="category-pill btn-secondary" data-category="coffee" onclick="filterMenuByCategory('coffee', this)">Coffee</button>
            <button class="category-pill btn-secondary" data-category="beverages" onclick="filterMenuByCategory('beverages', this)">Beverages</button>
            <button class="category-pill btn-secondary" data-category="snacks" onclick="filterMenuByCategory('snacks', this)">Snacks</button>
            <button class="category-pill btn-secondary" data-category="desserts" onclick="filterMenuByCategory('desserts', this)">Desserts</button>
        </div>
        <div class="items-grid" id="menuItemsGrid"></div>
    `;
    return page;
}

function createComboManagementPage() {
    const page = document.createElement('div');
    page.id = 'comboManagementPage';
    page.className = 'management-page hidden';
    page.innerHTML = `
        <div class="management-header">
            <button class="back-btn" onclick="showAdminDashboard()">
                <i class="fas fa-arrow-left"></i>
            </button>
            <h2>Combo Management</h2>
            <button class="add-btn" onclick="showAdminComboModal()">
                <i class="fas fa-plus"></i>
            </button>
        </div>
        <div class="search-bar">
            <input type="text" placeholder="Search combos..." oninput="filterCombosGrid(this.value)">
        </div>
        <div class="items-grid" id="combosGrid"></div>
    `;
    return page;
}

function createOrdersManagementPage() {
    const page = document.createElement('div');
    page.id = 'ordersManagementPage';
    page.className = 'management-page hidden';
    page.innerHTML = `
        <div class="management-header">
            <button class="back-btn" onclick="showAdminDashboard()">
                <i class="fas fa-arrow-left"></i>
            </button>
            <h2>Orders</h2>
        </div>
        <div class="orders-list" id="allOrdersList"></div>
    `;
    return page;
}

function renderMenuItemsGrid(searchTerm = '', category = 'all') {
    const grid = document.getElementById('menuItemsGrid');
    if (!grid) return;

    let filteredItems = menuItems;

    if (category !== 'all') {
        filteredItems = filteredItems.filter(item => item.category === category);
    }

    if (searchTerm) {
        const search = searchTerm.toLowerCase();
        filteredItems = filteredItems.filter(item =>
            item.name.toLowerCase().includes(search) ||
            item.description.toLowerCase().includes(search)
        );
    }

    if (filteredItems.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <p>No items found</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredItems.map(item => `
        <div class="admin-item-card" onclick="showAdminMenuModal(menuItems.find(i => i.id === ${item.id}))">
            <div class="item-image-container">
                <img src="${item.image}" alt="${item.name}" class="item-image" onerror="this.src='https://via.placeholder.com/200x200/D2042D/ffffff?text=Item'">
                <span class="item-badge ${item.isVeg ? 'veg' : 'non-veg'}">${item.isVeg ? 'VEG' : 'NON-VEG'}</span>
            </div>
            <div class="item-info">
                <p class="item-name">${item.name}</p>
                <p class="item-price">₹${item.price}</p>
            </div>
        </div>
    `).join('');
}

function renderCombosGrid(searchTerm = '') {
    const grid = document.getElementById('combosGrid');
    if (!grid) return;

    let filteredCombos = combos;

    if (searchTerm) {
        const search = searchTerm.toLowerCase();
        filteredCombos = filteredCombos.filter(combo =>
            combo.name.toLowerCase().includes(search) ||
            combo.description.toLowerCase().includes(search)
        );
    }

    if (filteredCombos.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-layer-group"></i>
                <p>No combos found</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredCombos.map(combo => `
        <div class="admin-item-card" onclick="showAdminComboModal(combos.find(c => c.id === '${combo.id}'))">
            <div class="item-image-container">
                <img src="${combo.image}" alt="${combo.name}" class="item-image" onerror="this.src='https://via.placeholder.com/200x200/D2042D/ffffff?text=Combo'">
                <span class="item-badge combo">COMBO</span>
            </div>
            <div class="item-info">
                <p class="item-name">${combo.name}</p>
                <p class="item-price">₹${combo.price}</p>
            </div>
        </div>
    `).join('');
}

function renderAllOrders() {
    const container = document.getElementById('allOrdersList');
    if (!container) return;

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-receipt"></i>
                <p>No orders yet</p>
            </div>
        `;
        return;
    }

    container.innerHTML = orders.slice().reverse().map(order => `
        <div class="order-card">
            <div class="order-card-header">
                <span class="order-number">#${order.orderNumber}</span>
                <span class="order-status ${order.orderStatus || 'received'}">${order.orderStatus || 'received'}</span>
            </div>
            <div class="order-card-body">
                <p><strong>${order.customerName}</strong></p>
                <p>${(order.items || []).length} items - ₹${order.total}</p>
                <p class="order-time">${new Date(order.createdAt || order.timestamp).toLocaleString()}</p>
            </div>
        </div>
    `).join('');
}

function filterMenuItems(searchTerm) {
    const activeCategory = document.querySelector('.category-pill.active');
    const category = activeCategory?.dataset.category || 'all';
    renderMenuItemsGrid(searchTerm, category);
}

function filterMenuByCategory(category, element) {
    document.querySelectorAll('.category-pill').forEach(btn => {
        btn.classList.remove('active', 'btn-primary');
        btn.classList.add('btn-secondary');
    });
    element.classList.remove('btn-secondary');
    element.classList.add('active', 'btn-primary');

    const searchTerm = document.getElementById('menuSearchInput')?.value || '';
    renderMenuItemsGrid(searchTerm, category);
}

function filterCombosGrid(searchTerm) {
    renderCombosGrid(searchTerm);
}

// ==================== UTILITY ====================

function animateCounter(element, targetValue, prefix = '', suffix = '') {
    const duration = 1000;
    const startValue = 0;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        const currentValue = Math.round(startValue + (targetValue - startValue) * easeProgress);
        element.textContent = prefix + currentValue + suffix;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showAdminDashboard,
        updateAdminStats,
        renderAdminOrders,
        renderAdminCombos,
        renderAdminMenuItems,
        showAdminComboModal,
        showAdminMenuModal,
        showMenuManagement,
        showComboManagement,
        showOrdersManagement
    };
}
