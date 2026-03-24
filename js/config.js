// ============================================
// CONFIG.JS - Constants, Menu Data, Settings
// ============================================

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Admin Credentials (In production, use JWT from backend)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Kitchen Credentials
const KITCHEN_CREDENTIALS = {
    username: 'kitchen',
    password: 'kitchen123'
};

// App Theme Colors
const THEME = {
    primary: '#D2042D',       // Cherry Red
    primaryDark: '#A50324',
    white: '#FFFFFF',
    textDark: '#1a1a1a',
    textLight: '#666666',
    textMuted: '#999999',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#f44336'
};

// Menu Categories
const CATEGORIES = ['coffee', 'beverages', 'snacks', 'desserts'];

// Order Status Flow
const ORDER_STATUS = {
    RECEIVED: 'received',
    PREPARING: 'preparing',
    READY: 'ready',
    SERVED: 'served',
    CANCELLED: 'cancelled'
};

// Payment Status
const PAYMENT_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
    CANCELLED: 'cancelled'
};

// User Roles
const USER_ROLES = {
    CUSTOMER: 'customer',
    ADMIN: 'admin',
    KITCHEN: 'kitchen'
};

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
        isVeg: true
    },
    {
        id: 2,
        name: "Flat White",
        category: "coffee",
        price: 299,
        description: "Espresso",
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop",
        rating: 4.6,
        isVeg: true
    },
    {
        id: 3,
        name: "Cappuccino",
        category: "coffee",
        price: 329,
        description: "With Steamed Milk",
        image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&h=300&fit=crop",
        rating: 4.9,
        isVeg: true
    },
    {
        id: 4,
        name: "Caffe Latte",
        category: "coffee",
        price: 359,
        description: "With Milk",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop",
        rating: 4.7,
        isVeg: true
    },
    {
        id: 5,
        name: "Americano",
        category: "coffee",
        price: 279,
        description: "With Water",
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop",
        rating: 4.5,
        isVeg: true
    },
    {
        id: 6,
        name: "Espresso",
        category: "coffee",
        price: 259,
        description: "Pure Coffee",
        image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop",
        rating: 4.8,
        isVeg: true
    },

    // Cold Drinks
    {
        id: 7,
        name: "Iced Coffee",
        category: "beverages",
        price: 329,
        description: "With Ice",
        image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop",
        rating: 4.6,
        isVeg: true
    },
    {
        id: 8,
        name: "Iced Latte",
        category: "beverages",
        price: 379,
        description: "With Milk",
        image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop",
        rating: 4.7,
        isVeg: true
    },
    {
        id: 9,
        name: "Frappe",
        category: "beverages",
        price: 429,
        description: "Blended",
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop",
        rating: 4.8,
        isVeg: true
    },
    {
        id: 10,
        name: "Cold Brew",
        category: "beverages",
        price: 399,
        description: "Slow Steeped",
        image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop",
        rating: 4.9,
        isVeg: true
    },
    {
        id: 15,
        name: "Mint Mojito",
        category: "beverages",
        price: 199,
        description: "Fresh & Refreshing",
        image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop",
        rating: 4.7,
        isVeg: true
    },
    {
        id: 16,
        name: "Strawberry Mojito",
        category: "beverages",
        price: 219,
        description: "Sweet & Tangy",
        image: "https://images.unsplash.com/photo-1622543925917-763c34f1f86a?w=400&h=300&fit=crop",
        rating: 4.8,
        isVeg: true
    },
    {
        id: 17,
        name: "Blue Lagoon Mojito",
        category: "beverages",
        price: 229,
        description: "Tropical Twist",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop",
        rating: 4.6,
        isVeg: true
    },

    // Food & Snacks
    {
        id: 11,
        name: "Croissant",
        category: "snacks",
        price: 249,
        description: "French Pastry",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop",
        rating: 4.5,
        isVeg: true
    },
    {
        id: 12,
        name: "Blueberry Muffin",
        category: "snacks",
        price: 279,
        description: "Fresh Baked",
        image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=300&fit=crop",
        rating: 4.7,
        isVeg: true
    },
    {
        id: 18,
        name: "Chicken Nuggets",
        category: "snacks",
        price: 299,
        description: "Crispy & Golden",
        image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop",
        rating: 4.8,
        isVeg: false
    },
    {
        id: 19,
        name: "Classic Veg Burger",
        category: "snacks",
        price: 179,
        description: "Lettuce, Tomato & Cheese",
        image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=300&fit=crop",
        rating: 4.5,
        isVeg: true
    },
    {
        id: 20,
        name: "Paneer Tikka Burger",
        category: "snacks",
        price: 229,
        description: "Spicy Grilled Paneer",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
        rating: 4.7,
        isVeg: true
    },
    {
        id: 21,
        name: "Mushroom Swiss Burger",
        category: "snacks",
        price: 249,
        description: "Sauteed Mushrooms",
        image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop",
        rating: 4.6,
        isVeg: true
    },
    {
        id: 22,
        name: "Chicken Burger",
        category: "snacks",
        price: 249,
        description: "Grilled Chicken Patty",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
        rating: 4.8,
        isVeg: false
    },
    {
        id: 23,
        name: "Chicken Tikka Burger",
        category: "snacks",
        price: 279,
        description: "Spicy Tikka Chicken",
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop",
        rating: 4.9,
        isVeg: false
    },
    {
        id: 24,
        name: "BBQ Chicken Burger",
        category: "snacks",
        price: 299,
        description: "Smoky BBQ Sauce",
        image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop",
        rating: 4.8,
        isVeg: false
    },
    {
        id: 25,
        name: "Veg Club Sandwich",
        category: "snacks",
        price: 199,
        description: "Triple Layer Delight",
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop",
        rating: 4.6,
        isVeg: true
    },
    {
        id: 26,
        name: "Grilled Cheese Sandwich",
        category: "snacks",
        price: 149,
        description: "Classic Comfort",
        image: "https://images.unsplash.com/photo-1528736235302-52922df5c122?w=400&h=300&fit=crop",
        rating: 4.5,
        isVeg: true
    },
    {
        id: 27,
        name: "Paneer Bhurji Sandwich",
        category: "snacks",
        price: 189,
        description: "Spicy Indian Style",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
        rating: 4.7,
        isVeg: true
    },
    {
        id: 28,
        name: "Chicken Sandwich",
        category: "snacks",
        price: 219,
        description: "Grilled Chicken Breast",
        image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&h=300&fit=crop",
        rating: 4.7,
        isVeg: false
    },
    {
        id: 29,
        name: "Chicken Mayo Sandwich",
        category: "snacks",
        price: 199,
        description: "Creamy & Delicious",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop",
        rating: 4.8,
        isVeg: false
    },
    {
        id: 30,
        name: "BBQ Chicken Sandwich",
        category: "snacks",
        price: 239,
        description: "Tangy BBQ Flavor",
        image: "https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=400&h=300&fit=crop",
        rating: 4.9,
        isVeg: false
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
        isVeg: true
    },
    {
        id: 14,
        name: "Cheesecake",
        category: "desserts",
        price: 449,
        description: "New York Style",
        image: "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=400&h=300&fit=crop",
        rating: 4.8,
        isVeg: true
    }
];

// Default Combos
const defaultCombos = [
    {
        id: 'combo1',
        name: 'Morning Boost Combo',
        description: 'Perfect breakfast combo to start your day',
        price: 499,
        originalPrice: 628,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
        rating: 4.8,
        isVeg: true,
        items: [
            { id: 1, name: 'Caffe Mocha', quantity: 1 },
            { id: 11, name: 'Croissant', quantity: 1 },
            { id: 12, name: 'Blueberry Muffin', quantity: 1 }
        ],
        savings: 129
    },
    {
        id: 'combo2',
        name: 'Power Lunch Combo',
        description: 'Hearty lunch combo with coffee and snacks',
        price: 699,
        originalPrice: 878,
        image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
        rating: 4.9,
        isVeg: false,
        items: [
            { id: 22, name: 'Chicken Burger', quantity: 1 },
            { id: 7, name: 'Iced Coffee', quantity: 1 },
            { id: 18, name: 'Chicken Nuggets', quantity: 1 }
        ],
        savings: 179
    },
    {
        id: 'combo3',
        name: 'Veg Delight Combo',
        description: 'Delicious vegetarian combo for health-conscious foodies',
        price: 599,
        originalPrice: 758,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
        rating: 4.7,
        isVeg: true,
        items: [
            { id: 19, name: 'Veg Burger', quantity: 1 },
            { id: 15, name: 'Mint Mojito', quantity: 1 },
            { id: 26, name: 'Grilled Cheese Sandwich', quantity: 1 }
        ],
        savings: 159
    },
    {
        id: 'combo4',
        name: 'Sweet Treat Combo',
        description: 'Perfect dessert combo for your sweet cravings',
        price: 749,
        originalPrice: 907,
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
        rating: 4.9,
        isVeg: true,
        items: [
            { id: 13, name: 'Chocolate Cake', quantity: 1 },
            { id: 4, name: 'Caffe Latte', quantity: 1 },
            { id: 14, name: 'Cheesecake', quantity: 1 }
        ],
        savings: 158
    },
    {
        id: 'combo5',
        name: 'Friends Special',
        description: 'Share this amazing combo with your best friend',
        price: 899,
        originalPrice: 1178,
        image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop',
        rating: 4.8,
        isVeg: false,
        items: [
            { id: 3, name: 'Cappuccino', quantity: 2 },
            { id: 24, name: 'BBQ Chicken Burger', quantity: 1 },
            { id: 20, name: 'Paneer Tikka Burger', quantity: 1 },
            { id: 9, name: 'Frappe', quantity: 1 }
        ],
        savings: 279
    }
];

// Default Promos
const defaultPromos = [
    {
        id: 'promo1',
        title: 'Fresh Arrivals!',
        description: 'Try our new summer beverages collection',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=400&fit=crop',
        backgroundColor: '#D2042D',
        textColor: '#FFFFFF',
        linkTo: 'beverages',
        isActive: true
    },
    {
        id: 'promo2',
        title: '20% OFF Combos',
        description: 'Get amazing deals on all combo offers',
        image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=400&fit=crop',
        backgroundColor: '#1a1a1a',
        textColor: '#FFFFFF',
        linkTo: 'combos',
        isActive: true
    },
    {
        id: 'promo3',
        title: 'Happy Hours',
        description: 'Buy 1 Get 1 Free on all coffees from 4-6 PM',
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=400&fit=crop',
        backgroundColor: '#D2042D',
        textColor: '#FFFFFF',
        linkTo: 'coffee',
        isActive: true
    }
];

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_BASE_URL,
        ADMIN_CREDENTIALS,
        KITCHEN_CREDENTIALS,
        THEME,
        CATEGORIES,
        ORDER_STATUS,
        PAYMENT_STATUS,
        USER_ROLES,
        menuItems,
        defaultCombos,
        defaultPromos
    };
}
