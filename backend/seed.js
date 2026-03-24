const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const MenuItem = require('./models/MenuItem');
const Combo = require('./models/Combo');
const Promo = require('./models/Promo');
const Settings = require('./models/Settings');
const Counter = require('./models/Counter');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cafe-coffeto';

// Menu Items Data - 50 items total
const menuItemsData = [
    // ==================== COFFEE (10 items) ====================
    {
        name: "Caffe Mocha",
        description: "Rich espresso with chocolate and steamed milk",
        category: "coffee",
        price: 349,
        image: "https://images.unsplash.com/photo-1607260550778-aa9d29444ce1?w=400&h=300&fit=crop",
        rating: 4.8,
        isVeg: true,
        preparationTime: 8
    },
    {
        name: "Flat White",
        description: "Smooth espresso with velvety microfoam",
        category: "coffee",
        price: 299,
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop",
        rating: 4.6,
        isVeg: true,
        preparationTime: 6
    },
    {
        name: "Cappuccino",
        description: "Perfect balance of espresso, steamed milk, and foam",
        category: "coffee",
        price: 329,
        image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&h=300&fit=crop",
        rating: 4.9,
        isVeg: true,
        preparationTime: 7
    },
    {
        name: "Caffe Latte",
        description: "Smooth espresso with creamy steamed milk",
        category: "coffee",
        price: 359,
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop",
        rating: 4.7,
        isVeg: true,
        preparationTime: 7
    },
    {
        name: "Americano",
        description: "Bold espresso with hot water",
        category: "coffee",
        price: 279,
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop",
        rating: 4.5,
        isVeg: true,
        preparationTime: 5
    },
    {
        name: "Espresso",
        description: "Pure, concentrated coffee perfection",
        category: "coffee",
        price: 259,
        image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop",
        rating: 4.8,
        isVeg: true,
        preparationTime: 4
    },
    {
        name: "Double Espresso",
        description: "Two shots of pure espresso intensity",
        category: "coffee",
        price: 329,
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop",
        rating: 4.7,
        isVeg: true,
        preparationTime: 5
    },
    {
        name: "Macchiato",
        description: "Espresso marked with a dash of foam",
        category: "coffee",
        price: 289,
        image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&h=300&fit=crop",
        rating: 4.6,
        isVeg: true,
        preparationTime: 5
    },
    {
        name: "Caramel Latte",
        description: "Latte sweetened with buttery caramel",
        category: "coffee",
        price: 389,
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop",
        rating: 4.8,
        isVeg: true,
        preparationTime: 8
    },
    {
        name: "Vanilla Latte",
        description: "Classic latte with smooth vanilla",
        category: "coffee",
        price: 379,
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop",
        rating: 4.7,
        isVeg: true,
        preparationTime: 8
    },

    // ==================== BEVERAGES (15 items including 5 Kombuchas) ====================
    // Kombuchas (5 at ₹150)
    {
        name: "Ginger Kombucha",
        description: "Probiotic tea with zesty ginger kick",
        category: "beverages",
        price: 150,
        image: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400&h=300&fit=crop",
        rating: 4.5,
        isVeg: true,
        preparationTime: 3
    },
    {
        name: "Lemon Kombucha",
        description: "Refreshing citrus probiotic tea",
        category: "beverages",
        price: 150,
        image: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400&h=300&fit=crop",
        rating: 4.6,
        isVeg: true,
        preparationTime: 3
    },
    {
        name: "Berry Kombucha",
        description: "Mixed berry fermented tea goodness",
        category: "beverages",
        price: 150,
        image: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400&h=300&fit=crop",
        rating: 4.7,
        isVeg: true,
        preparationTime: 3
    },
    {
        name: "Green Tea Kombucha",
        description: "Light and earthy probiotic blend",
        category: "beverages",
        price: 150,
        image: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400&h=300&fit=crop",
        rating: 4.4,
        isVeg: true,
        preparationTime: 3
    },
    {
        name: "Mango Kombucha",
        description: "Tropical mango probiotic delight",
        category: "beverages",
        price: 150,
        image: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400&h=300&fit=crop",
        rating: 4.8,
        isVeg: true,
        preparationTime: 3
    },
    // Other Beverages (10)
    {
        name: "Iced Coffee",
        description: "Chilled coffee over ice",
        category: "beverages",
        price: 329,
        image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop",
        rating: 4.6,
        isVeg: true,
        preparationTime: 5
    },
    {
        name: "Iced Latte",
        description: "Cold espresso with milk over ice",
        category: "beverages",
        price: 379,
        image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop",
        rating: 4.7,
        isVeg: true,
        preparationTime: 6
    },
    {
        name: "Frappe",
        description: "Blended iced coffee sensation",
        category: "beverages",
        price: 429,
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop",
        rating: 4.8,
        isVeg: true,
        preparationTime: 8
    },
    {
        name: "Cold Brew",
        description: "Slow-steeped cold coffee for 24 hours",
        category: "beverages",
        price: 399,
        image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop",
        rating: 4.9,
        isVeg: true,
        preparationTime: 3
    },
    {
        name: "Mint Mojito",
        description: "Fresh mint with lime and soda",
        category: "beverages",
        price: 199,
        image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop",
        rating: 4.7,
        isVeg: true,
        preparationTime: 5
    },
    {
        name: "Strawberry Mojito",
        description: "Sweet strawberry with mint freshness",
        category: "beverages",
        price: 219,
        image: "https://images.unsplash.com/photo-1622543925917-763c34f1f86a?w=400&h=300&fit=crop",
        rating: 4.8,
        isVeg: true,
        preparationTime: 5
    },
    {
        name: "Blue Lagoon",
        description: "Tropical blue curacao refresher",
        category: "beverages",
        price: 229,
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop",
        rating: 4.6,
        isVeg: true,
        preparationTime: 5
    },
    {
        name: "Mango Smoothie",
        description: "Creamy fresh mango blend",
        category: "beverages",
        price: 249,
        image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=300&fit=crop",
        rating: 4.7,
        isVeg: true,
        preparationTime: 6
    },
    {
        name: "Oreo Shake",
        description: "Creamy milkshake with crushed Oreos",
        category: "beverages",
        price: 299,
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop",
        rating: 4.9,
        isVeg: true,
        preparationTime: 7
    },
    {
        name: "Fresh Lime Soda",
        description: "Tangy lime with sparkling soda",
        category: "beverages",
        price: 129,
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop",
        rating: 4.5,
        isVeg: true,
        preparationTime: 3
    },

    // ==================== SNACKS / FOOD (15 items) ====================
    {
        name: "Croissant",
        description: "Buttery, flaky French pastry",
        category: "snacks",
        price: 249,
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop",
        rating: 4.5,
        isVeg: true,
        preparationTime: 5
    },
    {
        name: "Blueberry Muffin",
        description: "Fresh baked with juicy blueberries",
        category: "snacks",
        price: 279,
        image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=300&fit=crop",
        rating: 4.7,
        isVeg: true,
        preparationTime: 5
    },
    {
        name: "Classic Veg Burger",
        description: "Crispy patty with fresh veggies",
        category: "snacks",
        price: 179,
        image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=300&fit=crop",
        rating: 4.5,
        isVeg: true,
        preparationTime: 12
    },
    {
        name: "Paneer Tikka Burger",
        description: "Spicy grilled paneer delight",
        category: "snacks",
        price: 229,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
        rating: 4.7,
        isVeg: true,
        preparationTime: 15
    },
    {
        name: "Chicken Burger",
        description: "Juicy grilled chicken patty",
        category: "snacks",
        price: 249,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
        rating: 4.8,
        isVeg: false,
        preparationTime: 15
    },
    {
        name: "Chicken Tikka Burger",
        description: "Spicy tikka chicken sensation",
        category: "snacks",
        price: 279,
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop",
        rating: 4.9,
        isVeg: false,
        preparationTime: 15
    },
    {
        name: "Veg Club Sandwich",
        description: "Triple-layered veggie delight",
        category: "snacks",
        price: 199,
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop",
        rating: 4.6,
        isVeg: true,
        preparationTime: 10
    },
    {
        name: "Grilled Cheese Sandwich",
        description: "Melty cheese between toasted bread",
        category: "snacks",
        price: 149,
        image: "https://images.unsplash.com/photo-1528736235302-52922df5c122?w=400&h=300&fit=crop",
        rating: 4.5,
        isVeg: true,
        preparationTime: 8
    },
    {
        name: "Chicken Sandwich",
        description: "Grilled chicken breast sandwich",
        category: "snacks",
        price: 219,
        image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&h=300&fit=crop",
        rating: 4.7,
        isVeg: false,
        preparationTime: 10
    },
    {
        name: "Chicken Nuggets",
        description: "Crispy golden chicken bites",
        category: "snacks",
        price: 299,
        image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop",
        rating: 4.8,
        isVeg: false,
        preparationTime: 12
    },
    {
        name: "French Fries",
        description: "Crispy golden potato fries",
        category: "snacks",
        price: 149,
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop",
        rating: 4.6,
        isVeg: true,
        preparationTime: 8
    },
    {
        name: "Loaded Fries",
        description: "Fries with cheese and toppings",
        category: "snacks",
        price: 229,
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop",
        rating: 4.7,
        isVeg: true,
        preparationTime: 10
    },
    {
        name: "Veg Wrap",
        description: "Fresh veggies in a soft tortilla",
        category: "snacks",
        price: 169,
        image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop",
        rating: 4.5,
        isVeg: true,
        preparationTime: 8
    },
    {
        name: "Chicken Wrap",
        description: "Grilled chicken tortilla wrap",
        category: "snacks",
        price: 229,
        image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop",
        rating: 4.8,
        isVeg: false,
        preparationTime: 10
    },
    {
        name: "Garlic Bread",
        description: "Toasted bread with garlic butter",
        category: "snacks",
        price: 129,
        image: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=400&h=300&fit=crop",
        rating: 4.6,
        isVeg: true,
        preparationTime: 6
    },

    // ==================== DESSERTS (10 items) ====================
    {
        name: "Chocolate Cake",
        description: "Rich dark chocolate ganache cake",
        category: "desserts",
        price: 429,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
        rating: 4.9,
        isVeg: true,
        preparationTime: 5
    },
    {
        name: "Cheesecake",
        description: "Creamy New York style cheesecake",
        category: "desserts",
        price: 449,
        image: "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=400&h=300&fit=crop",
        rating: 4.8,
        isVeg: true,
        preparationTime: 5
    },
    {
        name: "Tiramisu",
        description: "Italian coffee-flavored dessert",
        category: "desserts",
        price: 479,
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
        rating: 4.9,
        isVeg: true,
        preparationTime: 5
    },
    {
        name: "Brownie",
        description: "Fudgy chocolate brownie square",
        category: "desserts",
        price: 249,
        image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&h=300&fit=crop",
        rating: 4.7,
        isVeg: true,
        preparationTime: 5
    },
    {
        name: "Brownie with Ice Cream",
        description: "Warm brownie with vanilla scoop",
        category: "desserts",
        price: 349,
        image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&h=300&fit=crop",
        rating: 4.9,
        isVeg: true,
        preparationTime: 7
    },
    {
        name: "Red Velvet Cake",
        description: "Classic red velvet with cream cheese",
        category: "desserts",
        price: 399,
        image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=400&h=300&fit=crop",
        rating: 4.8,
        isVeg: true,
        preparationTime: 5
    },
    {
        name: "Chocolate Mousse",
        description: "Light and airy chocolate delight",
        category: "desserts",
        price: 299,
        image: "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=400&h=300&fit=crop",
        rating: 4.7,
        isVeg: true,
        preparationTime: 5
    },
    {
        name: "Apple Pie",
        description: "Classic apple pie with cinnamon",
        category: "desserts",
        price: 329,
        image: "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=400&h=300&fit=crop",
        rating: 4.6,
        isVeg: true,
        preparationTime: 5
    },
    {
        name: "Ice Cream Sundae",
        description: "Triple scoop with toppings",
        category: "desserts",
        price: 279,
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop",
        rating: 4.8,
        isVeg: true,
        preparationTime: 5
    },
    {
        name: "Churros",
        description: "Crispy fried dough with chocolate",
        category: "desserts",
        price: 249,
        image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop",
        rating: 4.7,
        isVeg: true,
        preparationTime: 8
    }
];

// Combos Data (5 combos)
const combosData = [
    {
        name: "Morning Boost Combo",
        description: "Perfect breakfast combo to start your day",
        price: 499,
        originalPrice: 628,
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
        rating: 4.8,
        isVeg: true,
        items: [] // Will be populated with menu item references
    },
    {
        name: "Power Lunch Combo",
        description: "Hearty lunch combo with coffee and snacks",
        price: 699,
        originalPrice: 878,
        image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop",
        rating: 4.9,
        isVeg: false,
        items: []
    },
    {
        name: "Veg Delight Combo",
        description: "Delicious vegetarian combo for health-conscious foodies",
        price: 599,
        originalPrice: 758,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
        rating: 4.7,
        isVeg: true,
        items: []
    },
    {
        name: "Sweet Treat Combo",
        description: "Perfect dessert combo for your sweet cravings",
        price: 749,
        originalPrice: 907,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
        rating: 4.9,
        isVeg: true,
        items: []
    },
    {
        name: "Friends Special",
        description: "Share this amazing combo with your best friend",
        price: 899,
        originalPrice: 1178,
        image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop",
        rating: 4.8,
        isVeg: false,
        items: []
    }
];

// Promos Data (3 promos)
const promosData = [
    {
        title: "Fresh Arrivals!",
        description: "Try our new Kombucha collection - Probiotic goodness!",
        image: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=800&h=400&fit=crop",
        backgroundColor: "#D2042D",
        textColor: "#FFFFFF",
        linkTo: "beverages",
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    },
    {
        title: "20% OFF Combos",
        description: "Get amazing deals on all combo offers this week",
        image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=400&fit=crop",
        backgroundColor: "#1a1a1a",
        textColor: "#FFFFFF",
        linkTo: "combos",
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    },
    {
        title: "Happy Hours",
        description: "Buy 1 Get 1 Free on all coffees from 4-6 PM",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=400&fit=crop",
        backgroundColor: "#D2042D",
        textColor: "#FFFFFF",
        linkTo: "coffee",
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
    }
];

// Seed function
async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Clear existing data
        console.log('Clearing existing data...');
        await MenuItem.deleteMany({});
        await Combo.deleteMany({});
        await Promo.deleteMany({});
        await Counter.deleteMany({});

        // Seed Menu Items
        console.log('Seeding menu items...');
        const createdMenuItems = await MenuItem.insertMany(menuItemsData);
        console.log(`Created ${createdMenuItems.length} menu items`);

        // Get menu items by name for combo references
        const menuItemMap = {};
        createdMenuItems.forEach(item => {
            menuItemMap[item.name] = item._id;
        });

        // Define combo items
        combosData[0].items = [ // Morning Boost
            { menuItemId: menuItemMap["Caffe Mocha"], name: "Caffe Mocha", quantity: 1 },
            { menuItemId: menuItemMap["Croissant"], name: "Croissant", quantity: 1 },
            { menuItemId: menuItemMap["Blueberry Muffin"], name: "Blueberry Muffin", quantity: 1 }
        ];

        combosData[1].items = [ // Power Lunch
            { menuItemId: menuItemMap["Chicken Burger"], name: "Chicken Burger", quantity: 1 },
            { menuItemId: menuItemMap["Iced Coffee"], name: "Iced Coffee", quantity: 1 },
            { menuItemId: menuItemMap["Chicken Nuggets"], name: "Chicken Nuggets", quantity: 1 }
        ];

        combosData[2].items = [ // Veg Delight
            { menuItemId: menuItemMap["Classic Veg Burger"], name: "Classic Veg Burger", quantity: 1 },
            { menuItemId: menuItemMap["Mint Mojito"], name: "Mint Mojito", quantity: 1 },
            { menuItemId: menuItemMap["Grilled Cheese Sandwich"], name: "Grilled Cheese Sandwich", quantity: 1 }
        ];

        combosData[3].items = [ // Sweet Treat
            { menuItemId: menuItemMap["Chocolate Cake"], name: "Chocolate Cake", quantity: 1 },
            { menuItemId: menuItemMap["Caffe Latte"], name: "Caffe Latte", quantity: 1 },
            { menuItemId: menuItemMap["Cheesecake"], name: "Cheesecake", quantity: 1 }
        ];

        combosData[4].items = [ // Friends Special
            { menuItemId: menuItemMap["Cappuccino"], name: "Cappuccino", quantity: 2 },
            { menuItemId: menuItemMap["Chicken Tikka Burger"], name: "Chicken Tikka Burger", quantity: 1 },
            { menuItemId: menuItemMap["Paneer Tikka Burger"], name: "Paneer Tikka Burger", quantity: 1 },
            { menuItemId: menuItemMap["Frappe"], name: "Frappe", quantity: 1 }
        ];

        // Seed Combos
        console.log('Seeding combos...');
        const createdCombos = await Combo.insertMany(combosData);
        console.log(`Created ${createdCombos.length} combos`);

        // Seed Promos
        console.log('Seeding promos...');
        const createdPromos = await Promo.insertMany(promosData);
        console.log(`Created ${createdPromos.length} promos`);

        // Initialize Settings
        console.log('Initializing settings...');
        await Settings.getSettings(); // This creates default settings if not exists
        console.log('Settings initialized');

        // Summary
        console.log('\n========================================');
        console.log('Database seeding complete!');
        console.log('========================================');
        console.log(`Menu Items: ${createdMenuItems.length}`);
        console.log(`  - Coffee: ${createdMenuItems.filter(i => i.category === 'coffee').length}`);
        console.log(`  - Beverages: ${createdMenuItems.filter(i => i.category === 'beverages').length}`);
        console.log(`  - Snacks: ${createdMenuItems.filter(i => i.category === 'snacks').length}`);
        console.log(`  - Desserts: ${createdMenuItems.filter(i => i.category === 'desserts').length}`);
        console.log(`Combos: ${createdCombos.length}`);
        console.log(`Promos: ${createdPromos.length}`);
        console.log('========================================\n');

        // Close connection
        await mongoose.connection.close();
        console.log('Database connection closed');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

// Run seed
seedDatabase();
