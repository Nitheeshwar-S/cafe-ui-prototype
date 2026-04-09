// ===== AUTHENTICATION SYSTEM =====
let isLoggedIn = false;
let currentUser = null;
let isAuthenticating = false;

// Demo users (for authentication)
const demoUsers = [
  { email: "admin@cafeeto.com", password: "admin123" },
  { email: "user@cafeeto.com", password: "user123" },
  { email: "test@test.com", password: "test123" },
];

// Initialize auth on page load
document.addEventListener("DOMContentLoaded", () => {
  initializeAuth();
  setupUserProfileMenu();
});

function initializeAuth() {
  // Check if user is already logged in
  const savedUser = localStorage.getItem("cafeUser");

  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
      isLoggedIn = true;
      setAuthenticatedState();
    } catch (e) {
      resetAuthState();
    }
  } else {
    resetAuthState();
  }
}

function setAuthenticatedState() {
  isLoggedIn = true;
  document.body.classList.remove("login-active");
  document.getElementById("loginPage").classList.add("hidden");
  updateUserDisplay();
}

function setupUserProfileMenu() {
  const userProfileBtn = document.getElementById("userProfileBtn");
  const userDropdown = document.getElementById("userDropdown");

  if (userProfileBtn) {
    userProfileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle("show");
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (userDropdown && !e.target.closest(".header-user-menu")) {
      userDropdown.classList.remove("show");
    }
  });
}

function updateUserDisplay() {
  if (!currentUser) return;

  const userNameDisplay = document.getElementById("userNameDisplay");
  const userEmailDisplay = document.getElementById("userEmailDisplay");

  if (userNameDisplay) {
    userNameDisplay.textContent =
      currentUser.name || currentUser.email.split("@")[0];
  }

  if (userEmailDisplay) {
    userEmailDisplay.textContent = currentUser.email;
  }
}

function resetAuthState() {
  isLoggedIn = false;
  currentUser = null;
  document.body.classList.add("login-active");
  document.getElementById("loginPage").classList.remove("hidden");

  // Hide all other pages
  document.getElementById("landingPage")?.classList.add("hidden");
  document.getElementById("menuPage")?.classList.add("hidden");
  document.getElementById("cartPage")?.classList.add("hidden");
  document.getElementById("adminPanel")?.classList.add("hidden");
  document.getElementById("kitchenPanel")?.classList.add("hidden");
  document.querySelector("header")?.classList.add("hidden");
}

function handleLogin(event) {
  event.preventDefault();

  if (isAuthenticating) return;

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorDiv = document.getElementById("loginError");
  const successDiv = document.getElementById("loginSuccess");
  const loginBtn = document.getElementById("loginBtn");

  // Clear previous messages
  errorDiv.classList.remove("show");
  successDiv.classList.remove("show");

  // Validation
  if (!email || !password) {
    showLoginError("Please fill in all fields");
    return;
  }

  if (!isValidEmail(email)) {
    showLoginError("Please enter a valid email address");
    return;
  }

  if (password.length < 3) {
    showLoginError("Password must be at least 3 characters");
    return;
  }

  // Start authentication
  isAuthenticating = true;
  loginBtn.disabled = true;
  loginBtn.classList.add("loading");

  // Simulate authentication delay
  setTimeout(() => {
    // Check against demo users (or accept any valid email/password in demo mode)
    const isValid = email && password.length >= 3;

    if (isValid) {
      // Authentication successful
      currentUser = {
        email: email,
        name: email.split("@")[0],
        loginTime: new Date().toISOString(),
      };

      // Save to localStorage
      localStorage.setItem("cafeUser", JSON.stringify(currentUser));

      showLoginSuccess("✓ Login successful! Redirecting...");

      // Redirect after showing success message
      setTimeout(() => {
        isAuthenticating = false;
        loginBtn.disabled = false;
        loginBtn.classList.remove("loading");
        setAuthenticatedState();

        // Clear form
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";

        // Show menu
        showMenu();
      }, 1500);
    } else {
      // Authentication failed
      isAuthenticating = false;
      loginBtn.disabled = false;
      loginBtn.classList.remove("loading");
      showLoginError("Invalid email or password");
    }
  }, 1200);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showLoginError(message) {
  const errorDiv = document.getElementById("loginError");
  errorDiv.textContent = "⚠ " + message;
  errorDiv.classList.add("show");
}

function showLoginSuccess(message) {
  const successDiv = document.getElementById("loginSuccess");
  successDiv.textContent = message;
  successDiv.classList.add("show");
}

function toggleGuestMode() {
  const loginBtn = document.getElementById("loginBtn");
  loginBtn.disabled = true;
  loginBtn.classList.add("loading");

  setTimeout(() => {
    isLoggedIn = true;
    currentUser = {
      email: "guest@cafeeto.com",
      name: "Guest User",
      isGuest: true,
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem("cafeUser", JSON.stringify(currentUser));
    setAuthenticatedState();
    showMenu();

    loginBtn.disabled = false;
    loginBtn.classList.remove("loading");
  }, 800);
}

function logout() {
  // Close dropdown first
  const userDropdown = document.getElementById("userDropdown");
  if (userDropdown) {
    userDropdown.classList.remove("show");
  }

  // Clear auth data
  isLoggedIn = false;
  currentUser = null;
  localStorage.removeItem("cafeUser");

  // Reset auth UI
  resetAuthState();

  // Clear login form
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("loginError").classList.remove("show");
  document.getElementById("loginSuccess").classList.remove("show");

  // Hide all pages and show login
  document.getElementById("landingPage")?.classList.add("hidden");
  document.getElementById("menuPage")?.classList.add("hidden");
  document.getElementById("cartPage")?.classList.add("hidden");
  document.getElementById("adminPanel")?.classList.add("hidden");
  document.getElementById("kitchenPanel")?.classList.add("hidden");
  document.querySelector("header")?.classList.add("hidden");
}

function getCurrentUser() {
  return currentUser;
}

function isUserLoggedIn() {
  return isLoggedIn && currentUser !== null;
}

// ===== END AUTHENTICATION SYSTEM =====

// Menu Data
const menuItems = [
  // Coffee & Hot Drinks
  {
    id: 1,
    name: "Caffe Mocha",
    category: "coffee",
    price: 349,
    description: "Deep Foam",
    image:
      "https://images.unsplash.com/photo-1607260550778-aa9d29444ce1?w=400&h=300&fit=crop",
    rating: 4.8,
    sizes: ["S", "M", "L"],
    isVeg: true,
  },
  {
    id: 2,
    name: "Flat White",
    category: "coffee",
    price: 299,
    description: "Espresso",
    image:
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop",
    rating: 4.6,
    sizes: ["S", "M", "L"],
    isVeg: true,
  },
  {
    id: 3,
    name: "Cappuccino",
    category: "coffee",
    price: 329,
    description: "With Steamed Milk",
    image:
      "https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&h=300&fit=crop",
    rating: 4.9,
    sizes: ["S", "M", "L"],
    isVeg: true,
  },
  {
    id: 4,
    name: "Caffe Latte",
    category: "coffee",
    price: 359,
    description: "With Milk",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop",
    rating: 4.7,
    sizes: ["S", "M", "L"],
    isVeg: true,
  },
  {
    id: 5,
    name: "Americano",
    category: "coffee",
    price: 279,
    description: "With Water",
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop",
    rating: 4.5,
    sizes: ["S", "M", "L"],
    isVeg: true,
  },
  {
    id: 6,
    name: "Espresso",
    category: "coffee",
    price: 259,
    description: "Pure Coffee",
    image:
      "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop",
    rating: 4.8,
    sizes: ["S", "M"],
    isVeg: true,
  },

  // Cold Drinks
  {
    id: 7,
    name: "Iced Coffee",
    category: "beverages",
    price: 329,
    description: "With Ice",
    image:
      "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop",
    rating: 4.6,
    sizes: ["M", "L"],
    isVeg: true,
  },
  {
    id: 8,
    name: "Iced Latte",
    category: "beverages",
    price: 379,
    description: "With Milk",
    image:
      "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop",
    rating: 4.7,
    sizes: ["M", "L"],
    isVeg: true,
  },
  {
    id: 9,
    name: "Frappe",
    category: "beverages",
    price: 429,
    description: "Blended",
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop",
    rating: 4.8,
    sizes: ["M", "L"],
    isVeg: true,
  },
  {
    id: 10,
    name: "Cold Brew",
    category: "beverages",
    price: 399,
    description: "Slow Steeped",
    image:
      "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop",
    rating: 4.9,
    sizes: ["M", "L"],
    isVeg: true,
  },
  {
    id: 15,
    name: "Mint Mojito",
    category: "beverages",
    price: 199,
    description: "Fresh & Refreshing",
    image:
      "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop",
    rating: 4.7,
    sizes: ["M", "L"],
    isVeg: true,
  },
  {
    id: 16,
    name: "Strawberry Mojito",
    category: "beverages",
    price: 219,
    description: "Sweet & Tangy",
    image:
      "https://images.unsplash.com/photo-1622543925917-763c34f1f86a?w=400&h=300&fit=crop",
    rating: 4.8,
    sizes: ["M", "L"],
    isVeg: true,
  },
  {
    id: 17,
    name: "Blue Lagoon Mojito",
    category: "beverages",
    price: 229,
    description: "Tropical Twist",
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop",
    rating: 4.6,
    sizes: ["M", "L"],
    isVeg: true,
  },

  // Food & Snacks
  {
    id: 11,
    name: "Croissant",
    category: "snacks",
    price: 249,
    description: "French Pastry",
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop",
    rating: 4.5,
    sizes: [],
    isVeg: true,
  },
  {
    id: 12,
    name: "Blueberry Muffin",
    category: "snacks",
    price: 279,
    description: "Fresh Baked",
    image:
      "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=300&fit=crop",
    rating: 4.7,
    sizes: [],
    isVeg: true,
  },
  {
    id: 18,
    name: "Chicken Nuggets",
    category: "snacks",
    price: 299,
    description: "Crispy & Golden",
    image:
      "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop",
    rating: 4.8,
    sizes: [],
    isVeg: false,
  },

  // Burgers
  {
    id: 19,
    name: "Classic Veg Burger",
    category: "snacks",
    price: 179,
    description: "Lettuce, Tomato & Cheese",
    image:
      "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=300&fit=crop",
    rating: 4.5,
    sizes: [],
    isVeg: true,
  },
  {
    id: 20,
    name: "Paneer Tikka Burger",
    category: "snacks",
    price: 229,
    description: "Spicy Grilled Paneer",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    rating: 4.7,
    sizes: [],
    isVeg: true,
  },
  {
    id: 21,
    name: "Mushroom Swiss Burger",
    category: "snacks",
    price: 249,
    description: "Sautéed Mushrooms",
    image:
      "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop",
    rating: 4.6,
    sizes: [],
    isVeg: true,
  },
  {
    id: 22,
    name: "Chicken Burger",
    category: "snacks",
    price: 249,
    description: "Grilled Chicken Patty",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    rating: 4.8,
    sizes: [],
    isVeg: false,
  },
  {
    id: 23,
    name: "Chicken Tikka Burger",
    category: "snacks",
    price: 279,
    description: "Spicy Tikka Chicken",
    image:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop",
    rating: 4.9,
    sizes: [],
    isVeg: false,
  },
  {
    id: 24,
    name: "BBQ Chicken Burger",
    category: "snacks",
    price: 299,
    description: "Smoky BBQ Sauce",
    image:
      "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop",
    rating: 4.8,
    sizes: [],
    isVeg: false,
  },

  // Sandwiches
  {
    id: 25,
    name: "Veg Club Sandwich",
    category: "snacks",
    price: 199,
    description: "Triple Layer Delight",
    image:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop",
    rating: 4.6,
    sizes: [],
    isVeg: true,
  },
  {
    id: 26,
    name: "Grilled Cheese Sandwich",
    category: "snacks",
    price: 149,
    description: "Classic Comfort",
    image:
      "https://images.unsplash.com/photo-1528736235302-52922df5c122?w=400&h=300&fit=crop",
    rating: 4.5,
    sizes: [],
    isVeg: true,
  },
  {
    id: 27,
    name: "Paneer Bhurji Sandwich",
    category: "snacks",
    price: 189,
    description: "Spicy Indian Style",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
    rating: 4.7,
    sizes: [],
    isVeg: true,
  },
  {
    id: 28,
    name: "Chicken Sandwich",
    category: "snacks",
    price: 219,
    description: "Grilled Chicken Breast",
    image:
      "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&h=300&fit=crop",
    rating: 4.7,
    sizes: [],
    isVeg: false,
  },
  {
    id: 29,
    name: "Chicken Mayo Sandwich",
    category: "snacks",
    price: 199,
    description: "Creamy & Delicious",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop",
    rating: 4.8,
    sizes: [],
    isVeg: false,
  },
  {
    id: 30,
    name: "BBQ Chicken Sandwich",
    category: "snacks",
    price: 239,
    description: "Tangy BBQ Flavor",
    image:
      "https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=400&h=300&fit=crop",
    rating: 4.9,
    sizes: [],
    isVeg: false,
  },

  // Desserts
  {
    id: 13,
    name: "Chocolate Cake",
    category: "desserts",
    price: 429,
    description: "With Ganache",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
    rating: 4.9,
    sizes: [],
    isVeg: true,
  },
  {
    id: 14,
    name: "Cheesecake",
    category: "desserts",
    price: 449,
    description: "New York Style",
    image:
      "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=400&h=300&fit=crop",
    rating: 4.8,
    sizes: [],
    isVeg: true,
  },
];

// Combos Data
const defaultCombos = [
  {
    id: "combo1",
    name: "Morning Boost Combo",
    description: "Perfect breakfast combo to start your day",
    price: 499,
    originalPrice: 628,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    rating: 4.8,
    isVeg: true,
    items: [
      { id: 1, name: "Caffe Mocha", size: "M" },
      { id: 11, name: "Croissant", quantity: 1 },
      { id: 12, name: "Blueberry Muffin", quantity: 1 },
    ],
    savings: 129,
  },
  {
    id: "combo2",
    name: "Power Lunch Combo",
    description: "Hearty lunch combo with coffee and snacks",
    price: 699,
    originalPrice: 878,
    image:
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop",
    rating: 4.9,
    isVeg: false,
    items: [
      { id: 22, name: "Chicken Burger", quantity: 1 },
      { id: 7, name: "Iced Coffee", size: "L" },
      { id: 18, name: "Chicken Nuggets", size: "6 pcs" },
    ],
    savings: 179,
  },
  {
    id: "combo3",
    name: "Veg Delight Combo",
    description: "Delicious vegetarian combo for health-conscious foodies",
    price: 599,
    originalPrice: 758,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    rating: 4.7,
    isVeg: true,
    items: [
      { id: 19, name: "Veg Burger", quantity: 1 },
      { id: 15, name: "Mint Mojito", size: "M" },
      { id: 26, name: "Grilled Cheese Sandwich", quantity: 1 },
    ],
    savings: 159,
  },
  {
    id: "combo4",
    name: "Sweet Treat Combo",
    description: "Perfect dessert combo for your sweet cravings",
    price: 749,
    originalPrice: 907,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
    rating: 4.9,
    isVeg: true,
    items: [
      { id: 13, name: "Chocolate Cake", quantity: 1 },
      { id: 4, name: "Caffe Latte", size: "M" },
      { id: 14, name: "Cheesecake", quantity: 1 },
    ],
    savings: 158,
  },
  {
    id: "combo5",
    name: "Friends Special",
    description: "Share this amazing combo with your best friend",
    price: 899,
    originalPrice: 1178,
    image:
      "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop",
    rating: 4.8,
    isVeg: false,
    items: [
      { id: 3, name: "Cappuccino", size: "L", quantity: 2 },
      { id: 24, name: "BBQ Chicken Burger", quantity: 1 },
      { id: 20, name: "Paneer Tikka Burger", quantity: 1 },
      { id: 9, name: "Frappe", size: "M" },
    ],
    savings: 279,
  },
];

// Initialize combos - will be loaded from API or localStorage
let combos = [...defaultCombos];

// Load combos from API or localStorage on startup
async function loadCombos() {
  try {
    const response = await cafeAPI.getCombos();
    if (response.success && response.data && response.data.length > 0) {
      combos = response.data;
    }
  } catch (error) {
    console.warn("Using default combos due to API error:", error.message);
    combos = [...defaultCombos];
  }
}

// Cart State
let cart = [];
let currentCategory = "all";
let selectedItem = null;
let modalQuantity = 1;
let selectedPaymentMethod = "cash";
let currentDietFilter = "all"; // 'all', 'veg', 'non-veg'

// Review State
let reviews = [];
let currentReviewRating = 0;
let currentOrderNumber = "";

// Combo State
let selectedCombo = null;

// Admin State
let logoClickCount = 0;
let logoClickTimer = null;
let isAdminLoggedIn = false;
let orders = []; // Store completed orders

// Admin Credentials (In production, this should be stored securely on server)
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
};

// Initialize the app
// Main initialization - consolidated DOMContentLoaded listener
document.addEventListener("DOMContentLoaded", async () => {
  // Load data from API
  await loadCombos();

  // Initialize menu and cart
  renderMenuItems();
  updateCartCount();
  createFloatingParticles();

  // Initialize reviews
  await renderReviews();

  // Initialize special instructions character counter
  const textarea = document.getElementById("itemSpecialInstructions");
  if (textarea) {
    textarea.addEventListener("input", updateCharCount);
  }

  // Initialize keyboard navigation support
  const focusableElements = document.querySelectorAll(
    "button, a, input, textarea, select",
  );
  focusableElements.forEach((el) => {
    el.addEventListener("focus", () => {
      el.style.outline = "2px solid var(--primary-color)";
      el.style.outlineOffset = "2px";
    });

    el.addEventListener("blur", () => {
      el.style.outline = "none";
    });
  });

  // Initialize promo carousel
  showPromoSlide(0);
  startPromoAutoSlide();

  // Add promo carousel hover pause functionality
  const promoCarousel = document.querySelector(".promo-carousel");
  if (promoCarousel) {
    promoCarousel.addEventListener("mouseenter", () => {
      clearInterval(promoSlideInterval);
    });

    promoCarousel.addEventListener("mouseleave", () => {
      startPromoAutoSlide();
    });
  }

  // Initialize admin logo triple-click listener
  initAdminAccess();
});

// Create floating coffee particles in background
function createFloatingParticles() {
  const particles = ["☕", "🥐", "🍰", "☕", "🥤"];
  const body = document.body;

  for (let i = 0; i < 8; i++) {
    const particle = document.createElement("div");
    particle.style.position = "fixed";
    particle.style.fontSize = "2rem";
    particle.style.opacity = "0.1";
    particle.style.pointerEvents = "none";
    particle.style.zIndex = "0";
    particle.textContent =
      particles[Math.floor(Math.random() * particles.length)];
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";
    particle.style.animation = `float ${5 + Math.random() * 5}s ease-in-out infinite`;
    particle.style.animationDelay = Math.random() * 5 + "s";
    body.appendChild(particle);
  }
}

// Navigation Functions
function showMenu() {
  // Check if user is authenticated
  if (!isUserLoggedIn()) {
    resetAuthState();
    return;
  }

  hideAllPages();
  document.getElementById("menuPage").classList.remove("hidden");
  document.querySelector(".header").classList.remove("hidden");

  // Add stagger animation to menu items
  setTimeout(() => {
    const items = document.querySelectorAll(".menu-item");
    items.forEach((item, index) => {
      item.style.animation = `fadeInUp 0.5s ease ${index * 0.05}s backwards`;
    });
  }, 50);

  // Animate trending stats
  animateTrendingStats();
}

// Animate Trending Stats on Menu Page
function animateTrendingStats() {
  const trendingOrders = document.getElementById("trendingOrders");
  const trendingItems = document.getElementById("trendingItems");
  const trendingRating = document.getElementById("trendingRating");

  if (trendingOrders) {
    animateCounterValue(
      trendingOrders,
      orders.length || Math.floor(Math.random() * 50) + 20,
    );
  }
  if (trendingItems) {
    animateCounterValue(trendingItems, menuItems.length);
  }
  if (trendingRating) {
    animateCounterValue(trendingRating, 4.7, true);
  }
}

// Generic counter animation with decimal support
function animateCounterValue(element, targetValue, isDecimal = false) {
  const duration = 800;
  const startValue = 0;
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);

    let currentValue;
    if (isDecimal) {
      currentValue = (
        startValue +
        (targetValue - startValue) * easeProgress
      ).toFixed(1);
    } else {
      currentValue = Math.round(
        startValue + (targetValue - startValue) * easeProgress,
      );
    }

    element.textContent = currentValue;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.classList.add("pulse");
      setTimeout(() => element.classList.remove("pulse"), 600);
    }
  }

  requestAnimationFrame(updateCounter);
}

function showCart() {
  hideAllPages();
  document.getElementById("cartPage").classList.remove("hidden");
  document.querySelector(".header").classList.remove("hidden");
  renderCartItems();
}

function showCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  hideAllPages();
  document.getElementById("checkoutPage").classList.remove("hidden");
  document.querySelector(".header").classList.remove("hidden");
  renderCheckoutSummary();
}

function hideAllPages() {
  document.getElementById("landingPage").classList.add("hidden");
  document.getElementById("menuPage").classList.add("hidden");
  document.getElementById("cartPage").classList.add("hidden");
  document.getElementById("checkoutPage").classList.add("hidden");
  document.getElementById("adminPage").classList.add("hidden");
}

// Menu Functions
function renderMenuItems(category = "all") {
  const container = document.getElementById("menuContainer");

  // Handle combo category specially
  if (category === "combos") {
    renderCombos();
    return;
  }

  let filteredItems =
    category === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === category);

  // Apply diet filter
  if (currentDietFilter === "veg") {
    // Only show veg food items (exclude coffee and beverages)
    filteredItems = filteredItems.filter(
      (item) =>
        item.isVeg === true && !["coffee", "beverages"].includes(item.category),
    );
  } else if (currentDietFilter === "non-veg") {
    // Only show non-veg food items (exclude coffee and beverages)
    filteredItems = filteredItems.filter(
      (item) =>
        item.isVeg === false &&
        !["coffee", "beverages"].includes(item.category),
    );
  }

  container.innerHTML = filteredItems
    .map(
      (item, index) => `
        <div class="menu-item fade-in-up" style="animation-delay: ${index * 0.05}s" onclick="showItemDetail(${item.id})">
            <div class="menu-item-image skeleton-box">
                <img src="${item.image}" alt="${item.name}"
                     onload="this.parentElement.classList.remove('skeleton-box'); this.classList.add('loaded')"
                     onerror="this.parentElement.classList.remove('skeleton-box'); this.src='https://via.placeholder.com/400x300/D2042D/ffffff?text=Item'">
                <div class="rating-badge">
                    <i class="fas fa-star"></i>
                    <span class="rating-value">${item.rating || "4.5"}</span>
                </div>
                <div class="diet-badge ${item.isVeg ? "veg" : "non-veg"}">
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
    `,
    )
    .join("");
}

// Render combos function
function renderCombos() {
  const container = document.getElementById("menuContainer");

  // Apply diet filter to combos
  let filteredCombos = combos;
  if (currentDietFilter === "veg") {
    filteredCombos = combos.filter((combo) => combo.isVeg === true);
  } else if (currentDietFilter === "non-veg") {
    filteredCombos = combos.filter((combo) => combo.isVeg === false);
  }

  container.innerHTML = filteredCombos
    .map(
      (combo) => `
        <div class="combo-card" onclick="showComboDetail('${combo.id}')">
            <div class="combo-image skeleton-box">
                <img src="${combo.image}" alt="${combo.name}"
                     onload="this.parentElement.classList.remove('skeleton-box'); this.classList.add('loaded')"
                     onerror="this.parentElement.classList.remove('skeleton-box'); this.src='https://via.placeholder.com/400x300/C67C4E/ffffff?text=Combo'">
                <div class="combo-badge">COMBO</div>
                <div class="savings-badge">Save ₹${combo.savings}</div>
                <div class="rating-badge">
                    <i class="fas fa-star"></i>
                    <span class="rating-value">${combo.rating || "4.5"}</span>
                </div>
                <div class="diet-badge ${combo.isVeg ? "veg" : "non-veg"}">
                    <span class="diet-indicator"></span>
                </div>
            </div>
            <div class="combo-content">
                <div class="combo-name">${combo.name}</div>
                <div class="combo-description">${combo.description}</div>
                <div class="combo-items-preview">
                    ${combo.items
                      .slice(0, 2)
                      .map((item) => item.name)
                      .join(" + ")}
                    ${combo.items.length > 2 ? ` + ${combo.items.length - 2} more` : ""}
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
    `,
    )
    .join("");
}

// Search functionality
function searchMenu() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  let filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm),
  );

  // Apply diet filter
  if (currentDietFilter === "veg") {
    // Only show veg food items (exclude coffee and beverages)
    filteredItems = filteredItems.filter(
      (item) =>
        item.isVeg === true && !["coffee", "beverages"].includes(item.category),
    );
  } else if (currentDietFilter === "non-veg") {
    // Only show non-veg food items (exclude coffee and beverages)
    filteredItems = filteredItems.filter(
      (item) =>
        item.isVeg === false &&
        !["coffee", "beverages"].includes(item.category),
    );
  }

  const container = document.getElementById("menuContainer");
  if (filteredItems.length === 0) {
    container.innerHTML = '<p class="no-results">No items found</p>';
    return;
  }

  container.innerHTML = filteredItems
    .map(
      (item) => `
        <div class="menu-item" onclick="showItemDetail(${item.id})">
            <div class="menu-item-image skeleton-box">
                <img src="${item.image}" alt="${item.name}"
                     onload="this.parentElement.classList.remove('skeleton-box'); this.classList.add('loaded')"
                     onerror="this.parentElement.classList.remove('skeleton-box'); this.src='https://via.placeholder.com/400x300/C67C4E/ffffff?text=Coffee'">
                <div class="rating-badge">
                    <i class="fas fa-star"></i>
                    <span class="rating-value">${item.rating || "4.5"}</span>
                </div>
                <div class="diet-badge ${item.isVeg ? "veg" : "non-veg"}">
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
    `,
    )
    .join("");
}

// Diet filter function
function toggleDietFilter(filter, element) {
  currentDietFilter = filter;

  // Update active button states
  document.querySelectorAll(".diet-filter-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Make the clicked button active
  if (element) {
    element.classList.add("active");
  }

  // Re-render menu with current category and new diet filter
  renderMenuItems(currentCategory);
}

function filterCategory(category, element) {
  currentCategory = category;
  renderMenuItems(category);

  // Update active tab
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  // If element is passed, make it active, otherwise find it by category
  if (element) {
    element.classList.add("active");
  } else {
    const categoryButtons = {
      all: "All",
      coffee: "Coffee",
      beverages: "Beverages",
      snacks: "Snacks",
      combos: "Combos",
      desserts: "Desserts",
    };

    const targetBtn = Array.from(document.querySelectorAll(".tab-btn")).find(
      (btn) => btn.textContent.trim() === categoryButtons[category],
    );
    if (targetBtn) {
      targetBtn.classList.add("active");
    }
  }
}

// Item Detail Modal
let selectedSize = "M";

function showItemDetail(itemId) {
  const item = menuItems.find((i) => i.id === itemId);
  if (!item) return;

  selectedItem = item;
  modalQuantity = 1;
  selectedSize = item.sizes && item.sizes.length > 0 ? item.sizes[0] : "M";

  const modalImageContainer = document.getElementById("modalItemImage");
  modalImageContainer.className = "item-detail-image skeleton-box";
  modalImageContainer.innerHTML = `<img src="${item.image}" alt="${item.name}"
         onload="this.parentElement.classList.remove('skeleton-box'); this.classList.add('loaded')"
         onerror="this.parentElement.classList.remove('skeleton-box'); this.src='https://via.placeholder.com/400x300/C67C4E/ffffff?text=Coffee'">
         <div class="diet-badge ${item.isVeg ? "veg" : "non-veg"}">
             <span class="diet-indicator"></span>
         </div>`;
  document.getElementById("modalItemName").textContent = item.name;
  document.getElementById("modalItemRating").textContent = item.rating || "4.5";
  document.getElementById("modalItemDescription").textContent =
    item.description;
  document.getElementById("modalItemPrice").textContent = `₹${item.price}`;
  document.getElementById("itemQuantity").value = modalQuantity;
  // Reset special instructions field
  const specialInstructionsField = document.getElementById(
    "itemSpecialInstructions",
  );
  if (specialInstructionsField) {
    specialInstructionsField.value = "";
    updateCharCount();
  }
  // Render size options
  const sizeSection = document.getElementById("sizeSection");
  const sizeOptions = document.getElementById("sizeOptions");

  if (item.sizes && item.sizes.length > 0) {
    sizeSection.style.display = "block";
    sizeOptions.innerHTML = item.sizes
      .map(
        (size) => `
            <button class="size-btn ${size === selectedSize ? "active" : ""}" 
                    onclick="selectSize('${size}')">
                ${size}
            </button>
        `,
      )
      .join("");
  } else {
    sizeSection.style.display = "none";
  }

  document.getElementById("itemModal").classList.remove("hidden");
}

function selectSize(size) {
  selectedSize = size;
  const buttons = document.querySelectorAll(".size-btn");
  buttons.forEach((btn) => {
    if (btn.textContent.trim() === size) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function closeItemModal() {
  document.getElementById("itemModal").classList.add("hidden");
  selectedItem = null;
  modalQuantity = 1;
}

// Character counter for special instructions
function updateCharCount() {
  const textarea = document.getElementById("itemSpecialInstructions");
  const charCount = document.getElementById("charCount");
  if (textarea && charCount) {
    charCount.textContent = textarea.value.length;
  }
}

// Add event listener for character counter
function increaseQuantity() {
  modalQuantity++;
  document.getElementById("itemQuantity").value = modalQuantity;
}

function decreaseQuantity() {
  if (modalQuantity > 1) {
    modalQuantity--;
    document.getElementById("itemQuantity").value = modalQuantity;
  }
}

function addToCartFromModal() {
  if (selectedItem) {
    const specialInstructions = document
      .getElementById("itemSpecialInstructions")
      .value.trim();
    addToCart(selectedItem.id, modalQuantity, specialInstructions);
    closeItemModal();
  }
}

// Cart Functions
function addToCart(itemId, quantity = 1, specialInstructions = "") {
  const item = menuItems.find((i) => i.id === itemId);
  if (!item) return;

  // Find existing item with same ID and same special instructions
  const existingItem = cart.find(
    (i) =>
      i.id === itemId && (i.specialInstructions || "") === specialInstructions,
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ ...item, quantity, specialInstructions });
  }

  updateCartCount();
  showCartNotification();

  // Add cart bounce animation
  animateCartBounce();
}

function removeFromCart(itemId) {
  cart = cart.filter((item) => item.id !== itemId);
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
  const item = cart.find((i) => i.id === itemId);
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
  document.getElementById("cartCount").textContent = totalItems;
}

// Combo Functions
function showComboDetail(comboId) {
  selectedCombo = combos.find((c) => c.id === comboId);
  if (!selectedCombo) return;

  // Show combo modal (we'll add this to HTML later)
  const modal = document.createElement("div");
  modal.id = "comboModal";
  modal.className = "modal";
  modal.innerHTML = `
        <div class="modal-content combo-modal">
            <button class="close-btn" onclick="closeComboModal()">
                <i class="fas fa-times"></i>
            </button>
            <div class="combo-detail-content">
                <div class="combo-detail-image skeleton-box">
                    <img src="${selectedCombo.image}" alt="${selectedCombo.name}"
                         onload="this.parentElement.classList.remove('skeleton-box'); this.classList.add('loaded')"
                         onerror="this.parentElement.classList.remove('skeleton-box'); this.src='https://via.placeholder.com/400x300/C67C4E/ffffff?text=Combo'">
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
                            ${selectedCombo.items
                              .map(
                                (item) => `
                                <div class="combo-item">
                                    <span class="combo-item-name">${item.name}</span>
                                    ${item.size ? `<span class="combo-item-size">(${item.size})</span>` : ""}
                                    ${item.quantity > 1 ? `<span class="combo-item-qty">x${item.quantity}</span>` : ""}
                                </div>
                            `,
                              )
                              .join("")}
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
  const modal = document.getElementById("comboModal");
  if (modal) {
    modal.remove();
  }
  selectedCombo = null;
  modalQuantity = 1;
}

function increaseComboQuantity() {
  modalQuantity++;
  document.getElementById("comboQuantity").value = modalQuantity;
}

function decreaseComboQuantity() {
  if (modalQuantity > 1) {
    modalQuantity--;
    document.getElementById("comboQuantity").value = modalQuantity;
  }
}

function addComboToCart(comboId, quantity = 1) {
  const combo = combos.find((c) => c.id === comboId);
  if (!combo) return;

  // Find existing combo in cart
  const existingCombo = cart.find(
    (item) => item.id === comboId && item.isCombo,
  );

  if (existingCombo) {
    existingCombo.quantity += quantity;
  } else {
    // Add combo to cart with special flag
    cart.push({
      ...combo,
      quantity: quantity,
      isCombo: true,
      comboItems: combo.items,
    });
  }

  updateCartCount();
  showCartNotification();
}

function addComboToCartFromModal() {
  if (selectedCombo) {
    addComboToCart(selectedCombo.id, modalQuantity);
    closeComboModal();
  }
}

// Admin Combo Management Functions
function showAdminComboModal(combo = null) {
  if (!isAdminLoggedIn) return;

  const isEdit = combo !== null;
  const modal = document.createElement("div");
  modal.id = "adminComboModal";
  modal.className = "modal";
  modal.innerHTML = `
        <div class="modal-content admin-combo-modal">
            <button class="close-btn" onclick="closeAdminComboModal()">
                <i class="fas fa-times"></i>
            </button>
            <div class="admin-combo-header">
                <h2>${isEdit ? "Edit Combo" : "Create New Combo"}</h2>
            </div>
            <form id="comboForm" onsubmit="saveCombo(event)">
                <div class="form-group">
                    <label for="comboName">Combo Name</label>
                    <input type="text" id="comboName" value="${combo?.name || ""}" required>
                </div>

                <div class="form-group">
                    <label for="comboDescription">Description</label>
                    <textarea id="comboDescription" rows="3">${combo?.description || ""}</textarea>
                </div>

                <div class="form-group">
                    <label for="comboImage">Image URL</label>
                    <input type="url" id="comboImage" value="${combo?.image || ""}" required>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="comboPrice">Combo Price</label>
                        <input type="number" id="comboPrice" value="${combo?.price || ""}" min="0" required>
                    </div>

                    <div class="form-group">
                        <label for="comboOriginalPrice">Original Price</label>
                        <input type="number" id="comboOriginalPrice" value="${combo?.originalPrice || ""}" min="0" required>
                    </div>
                </div>

                <div class="form-group">
                    <label>Diet Type</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="comboType" value="true" ${combo?.isVeg !== false ? "checked" : ""}>
                            <span>Vegetarian</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="comboType" value="false" ${combo?.isVeg === false ? "checked" : ""}>
                            <span>Non-Vegetarian</span>
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label>Combo Items</label>
                    <div id="comboItemsList">
                        ${
                          combo
                            ? combo.items
                                .map(
                                  (item, index) => `
                            <div class="combo-item-input">
                                <select class="item-select">
                                    ${menuItems
                                      .map(
                                        (menuItem) => `
                                        <option value="${menuItem.id}" ${menuItem.id == item.id ? "selected" : ""}>
                                            ${menuItem.name}
                                        </option>
                                    `,
                                      )
                                      .join("")}
                                </select>
                                <input type="text" placeholder="Size (optional)" value="${item.size || ""}" class="size-input">
                                <input type="number" placeholder="Qty" value="${item.quantity || 1}" min="1" class="qty-input">
                                <button type="button" onclick="removeComboItem(${index})" class="remove-item-btn">×</button>
                            </div>
                        `,
                                )
                                .join("")
                            : ""
                        }
                    </div>
                    <button type="button" onclick="addComboItem()" class="btn-secondary">Add Item</button>
                </div>

                <input type="hidden" id="comboId" value="${combo?.id || ""}">

                <div class="form-actions">
                    <button type="submit" class="btn-primary">
                        ${isEdit ? "Update Combo" : "Create Combo"}
                    </button>
                    ${
                      isEdit
                        ? `
                        <button type="button" onclick="deleteCombo('${combo.id}')" class="btn-danger">
                            Delete Combo
                        </button>
                    `
                        : ""
                    }
                </div>
            </form>
        </div>
    `;

  document.body.appendChild(modal);
}

function closeAdminComboModal() {
  const modal = document.getElementById("adminComboModal");
  if (modal) {
    modal.remove();
  }
}

function addComboItem() {
  const container = document.getElementById("comboItemsList");
  const itemDiv = document.createElement("div");
  itemDiv.className = "combo-item-input";
  itemDiv.innerHTML = `
        <select class="item-select">
            ${menuItems.map((item) => `<option value="${item.id}">${item.name}</option>`).join("")}
        </select>
        <input type="text" placeholder="Size (optional)" class="size-input">
        <input type="number" placeholder="Qty" value="1" min="1" class="qty-input">
        <button type="button" onclick="this.parentElement.remove()" class="remove-item-btn">×</button>
    `;
  container.appendChild(itemDiv);
}

function removeComboItem(index) {
  const items = document.querySelectorAll(".combo-item-input");
  if (items[index]) {
    items[index].remove();
  }
}

async function saveCombo(event) {
  event.preventDefault();

  const comboId = document.getElementById("comboId").value;
  const isEdit = comboId !== "";

  // Collect form data
  const comboData = {
    name: document.getElementById("comboName").value,
    description: document.getElementById("comboDescription").value,
    image: document.getElementById("comboImage").value,
    price: parseInt(document.getElementById("comboPrice").value),
    originalPrice: parseInt(
      document.getElementById("comboOriginalPrice").value,
    ),
    isVeg:
      document.querySelector('input[name="comboType"]:checked').value ===
      "true",
    rating: 4.5, // Default rating
    items: [],
  };

  // Calculate savings
  comboData.savings = comboData.originalPrice - comboData.price;

  // Collect combo items
  const itemInputs = document.querySelectorAll(".combo-item-input");
  itemInputs.forEach((input) => {
    const itemId = parseInt(input.querySelector(".item-select").value);
    const size = input.querySelector(".size-input").value;
    const quantity = parseInt(input.querySelector(".qty-input").value) || 1;

    const menuItem = menuItems.find((item) => item.id === itemId);
    if (menuItem) {
      comboData.items.push({
        menuItemId: itemId, // Use menuItemId for backend compatibility
        name: menuItem.name,
        size: size,
        quantity: quantity,
      });
    }
  });

  try {
    let response;
    if (isEdit) {
      // Update existing combo
      response = await cafeAPI.updateCombo(comboId, comboData);
      const comboIndex = combos.findIndex((c) => c.id === comboId);
      if (comboIndex !== -1) {
        combos[comboIndex] = {
          ...combos[comboIndex],
          ...comboData,
          id: comboId,
        };
      }
    } else {
      // Create new combo
      response = await cafeAPI.createCombo(comboData);
      if (response.success && response.data) {
        combos.push(response.data);
      }
    }

    // Refresh display if on combos page
    if (currentCategory === "combos") {
      renderCombos();
    }

    closeAdminComboModal();
    alert(`Combo ${isEdit ? "updated" : "created"} successfully!`);
  } catch (error) {
    console.error("Error saving combo:", error);
    alert(`Error ${isEdit ? "updating" : "creating"} combo: ${error.message}`);
  }
}

async function deleteCombo(comboId) {
  if (confirm("Are you sure you want to delete this combo?")) {
    try {
      await cafeAPI.deleteCombo(comboId);
      combos = combos.filter((c) => c.id !== comboId);

      if (currentCategory === "combos") {
        renderCombos();
      }

      closeAdminComboModal();
      alert("Combo deleted successfully!");
    } catch (error) {
      console.error("Error deleting combo:", error);
      alert(`Error deleting combo: ${error.message}`);
    }
  }
}

function showCartNotification() {
  // Enhanced feedback animation on cart button
  const cartBtn = document.querySelector(".cart-button");
  cartBtn.style.animation = "heartbeat 0.5s ease";

  // Create floating particles effect
  createAddToCartParticles(cartBtn);

  setTimeout(() => {
    cartBtn.style.animation = "";
  }, 500);
}

// Create particles when adding to cart
function createAddToCartParticles(element) {
  const rect = element.getBoundingClientRect();
  const particles = ["✨", "⭐", "💫", "🌟"];

  for (let i = 0; i < 6; i++) {
    const particle = document.createElement("div");
    particle.style.position = "fixed";
    particle.style.left = rect.left + rect.width / 2 + "px";
    particle.style.top = rect.top + rect.height / 2 + "px";
    particle.style.fontSize = "1.5rem";
    particle.style.pointerEvents = "none";
    particle.style.zIndex = "1000";
    particle.textContent =
      particles[Math.floor(Math.random() * particles.length)];
    particle.style.transition = "all 1s ease-out";
    document.body.appendChild(particle);

    // Animate particle
    setTimeout(() => {
      const angle = (Math.PI * 2 * i) / 6;
      const distance = 50 + Math.random() * 30;
      particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
      particle.style.opacity = "0";
    }, 10);

    // Remove particle
    setTimeout(() => {
      particle.remove();
    }, 1000);
  }
}

function renderCartItems() {
  const container = document.getElementById("cartItems");
  const emptyState = document.getElementById("cartEmpty");
  const summary = document.getElementById("cartSummary");

  if (cart.length === 0) {
    container.innerHTML = "";
    emptyState.classList.remove("hidden");
    summary.classList.add("hidden");
    return;
  }

  emptyState.classList.add("hidden");
  summary.classList.remove("hidden");

  container.innerHTML = cart
    .map(
      (item, index) => `
        <div class="cart-item">
            <div class="cart-item-image skeleton-box">
                <img src="${item.image}" alt="${item.name}" 
                     onload="this.parentElement.classList.remove('skeleton-box'); this.classList.add('loaded')" 
                     onerror="this.parentElement.classList.remove('skeleton-box'); this.src='https://via.placeholder.com/100x100/C67C4E/ffffff?text=Item'">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                ${
                  item.specialInstructions
                    ? `
                    <div class="cart-item-instructions">
                        <i class="fas fa-sticky-note"></i>
                        <span>${item.specialInstructions}</span>
                    </div>
                `
                    : ""
                }
                <div class="cart-item-price">₹${item.price * item.quantity}</div> <!-- Fixed: Now shows total price (price × quantity) instead of unit price -->
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
    `,
    )
    .join("");

  updateCartSummary();
}

function updateCartSummary() {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.05; // GST in India
  const total = subtotal + tax;

  document.getElementById("subtotal").textContent = `₹${Math.round(subtotal)}`;
  document.getElementById("tax").textContent = `₹${Math.round(tax)}`;
  document.getElementById("total").textContent = `₹${Math.round(total)}`;
}

// Checkout Functions
function renderCheckoutSummary() {
  const container = document.getElementById("checkoutSummary");

  container.innerHTML = cart
    .map(
      (item) => `
        <div class="summary-item">
            <div class="summary-item-details">
                <span class="summary-item-name">${item.name}</span>
                ${
                  item.specialInstructions
                    ? `
                    <div class="summary-item-instructions">
                        <i class="fas fa-sticky-note"></i>
                        <span>${item.specialInstructions}</span>
                    </div>
                `
                    : ""
                }
            </div>
            <span class="summary-item-qty">x${item.quantity}</span>
            <span class="summary-item-price">₹${item.price * item.quantity}</span>
        </div>
    `,
    )
    .join("");

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.05; // GST
  const total = subtotal + tax;

  document.getElementById("checkoutSubtotal").textContent =
    `₹${Math.round(subtotal)}`;
  document.getElementById("checkoutTax").textContent = `₹${Math.round(tax)}`;
  document.getElementById("checkoutTotal").textContent =
    `₹${Math.round(total)}`;
}

// Payment Selection
function selectPayment(method, element) {
  selectedPaymentMethod = method;

  // Update button states
  document.querySelectorAll(".payment-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Make the clicked button active
  if (element) {
    const paymentBtn = element.closest(".payment-btn");
    if (paymentBtn) {
      paymentBtn.classList.add("active");
    }
  }
}

async function handleCheckout(event) {
  event.preventDefault();

  const name = document.getElementById("customerName").value;
  const table = document.getElementById("tableNumber").value;
  const instructions = document.getElementById("specialInstructions").value;

  // Calculate total
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  // Prepare order data for API
  const orderData = {
    customerName: name,
    tableNumber: table,
    items: cart.map((item) => ({
      itemId: item.id.toString(),
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size || "",
      specialInstructions: item.specialInstructions || "",
      isCombo: item.isCombo || false,
      comboItems: item.comboItems || [],
    })),
    subtotal: subtotal,
    tax: tax,
    total: total,
    paymentMethod: selectedPaymentMethod || "cash",
    specialInstructions: instructions,
  };

  try {
    const response = await cafeAPI.createOrder(orderData);

    if (response.success && response.data) {
      const order = response.data;
      currentOrderNumber = order.orderNumber;

      // Add to local orders array for admin dashboard
      orders.push({
        orderNumber: order.orderNumber,
        customerName: name,
        tableNumber: table,
        specialInstructions: instructions,
        paymentMethod: selectedPaymentMethod || "cash",
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions || "",
        })),
        subtotal: subtotal,
        tax: tax,
        total: total,
        timestamp: new Date().toISOString(),
      });

      // Show confirmation modal with confetti
      document.getElementById("orderNumber").textContent = order.orderNumber;
      document.getElementById("confirmationModal").classList.remove("hidden");

      // Launch confetti!
      launchConfetti();
    }
  } catch (error) {
    console.error("Error creating order:", error);

    // Fallback to localStorage behavior
    const orderNumber = Math.floor(1000 + Math.random() * 9000);
    currentOrderNumber = orderNumber;

    const order = {
      orderNumber: orderNumber,
      customerName: name,
      tableNumber: table,
      specialInstructions: instructions,
      paymentMethod: selectedPaymentMethod || "cash",
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions || "",
      })),
      subtotal: subtotal,
      tax: tax,
      total: total,
      timestamp: new Date().toISOString(),
    };

    orders.push(order);

    // Show confirmation modal
    document.getElementById("orderNumber").textContent = orderNumber;
    document.getElementById("confirmationModal").classList.remove("hidden");
    launchConfetti();

    console.warn("Order created locally due to API error:", error.message);
  }
}

// Confetti celebration effect
function launchConfetti() {
  const confettiColors = [
    "#6B4423",
    "#A67C52",
    "#D4A574",
    "#FF5733",
    "#FFD700",
    "#4CAF50",
  ];
  const confettiShapes = ["🎉", "🎊", "✨", "⭐", "🌟", "💫"];

  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.style.position = "fixed";
      confetti.style.left = Math.random() * window.innerWidth + "px";
      confetti.style.top = "-50px";
      confetti.style.fontSize = "1.5rem";
      confetti.style.pointerEvents = "none";
      confetti.style.zIndex = "1001";
      confetti.textContent =
        confettiShapes[Math.floor(Math.random() * confettiShapes.length)];
      confetti.style.transition = `all ${2 + Math.random() * 2}s ease-in`;
      document.body.appendChild(confetti);

      // Animate falling
      setTimeout(() => {
        confetti.style.top = window.innerHeight + "px";
        confetti.style.transform = `rotate(${Math.random() * 720 - 360}deg)`;
        confetti.style.opacity = "0";
      }, 10);

      // Remove
      setTimeout(() => {
        confetti.remove();
      }, 4000);
    }, i * 30);
  }
}

// Review Modal Functions
function showReviewModal() {
  document.getElementById("confirmationModal").classList.add("hidden");
  document.getElementById("reviewModal").classList.remove("hidden");
}

function closeReviewModal() {
  document.getElementById("reviewModal").classList.add("hidden");
  resetApp();
}

function skipReview() {
  closeReviewModal();
}

function setRating(rating) {
  currentReviewRating = rating;
  document.getElementById("reviewRating").value = rating;

  // Update star display
  const stars = document.querySelectorAll("#starRating i");
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.remove("far");
      star.classList.add("fas");
    } else {
      star.classList.remove("fas");
      star.classList.add("far");
    }
  });
}

async function submitReview(event) {
  event.preventDefault();

  const name = document.getElementById("reviewName").value.trim();
  const rating = parseInt(document.getElementById("reviewRating").value);
  const comment = document.getElementById("reviewComment").value.trim();
  const instagram = document.getElementById("reviewInstagram").value.trim();

  if (!rating) {
    alert("Please select a rating!");
    return;
  }

  // Create review object
  const reviewData = {
    customerName: name,
    rating: rating,
    comment: comment,
    instagram: instagram ? `@${instagram}` : "",
    orderNumber: currentOrderNumber,
  };

  try {
    const response = await cafeAPI.createReview(reviewData);

    if (response.success && response.data) {
      // Add to local reviews array for immediate display
      reviews.unshift({
        id: response.data.id,
        name: name,
        rating: rating,
        comment: comment,
        instagram: instagram ? `@${instagram}` : "",
        date: new Date().toLocaleDateString(),
        orderNumber: currentOrderNumber,
      });

      // Keep only last 20 reviews locally
      if (reviews.length > 20) {
        reviews = reviews.slice(0, 20);
      }

      // Update review display
      renderReviews();

      // Show success message
      alert("Thank you for your feedback! 🌟");

      // Close modal and return to menu
      closeReviewModal();
    }
  } catch (error) {
    console.error("Error submitting review:", error);

    // Fallback to localStorage behavior
    const review = {
      id: Date.now(),
      name: name,
      rating: rating,
      comment: comment,
      instagram: instagram ? `@${instagram}` : "",
      date: new Date().toLocaleDateString(),
      orderNumber: currentOrderNumber,
    };

    // Load existing reviews from localStorage
    const storedReviews = localStorage.getItem("cafeReviews");
    reviews = storedReviews ? JSON.parse(storedReviews) : [];

    // Add new review
    reviews.unshift(review);

    // Keep only last 20 reviews
    if (reviews.length > 20) {
      reviews = reviews.slice(0, 20);
    }

    // Save to localStorage
    localStorage.setItem("cafeReviews", JSON.stringify(reviews));

    // Update review display
    renderReviews();

    // Show success message
    alert("Thank you for your feedback! 🌟");

    // Close modal and return to menu
    closeReviewModal();

    console.warn("Review saved locally due to API error:", error.message);
  }

  // Reset form
  document.getElementById("reviewForm").reset();
  currentReviewRating = 0;
}

async function renderReviews() {
  const reviewsContainer = document.getElementById("reviewsCarousel");

  try {
    // Try to load reviews from API first
    const response = await cafeAPI.getFeaturedReviews(10);

    if (response.success && response.data && response.data.length > 0) {
      reviews = response.data.map((review) => ({
        id: review.id,
        name: review.customerName,
        rating: review.rating,
        comment: review.comment,
        instagram: review.instagram || "",
        date: new Date(review.createdAt).toLocaleDateString(),
        orderNumber: review.orderNumber || "",
      }));
    } else {
      // Fallback to localStorage
      const storedReviews = localStorage.getItem("cafeReviews");
      reviews = storedReviews ? JSON.parse(storedReviews) : [];
    }
  } catch (error) {
    console.warn(
      "Loading reviews from localStorage due to API error:",
      error.message,
    );
    // Fallback to localStorage
    const storedReviews = localStorage.getItem("cafeReviews");
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

  // Display reviews (show max 10)
  const displayReviews = reviews.slice(0, 10);
  reviewsContainer.innerHTML = displayReviews
    .map(
      (review) => `
        <div class="review-card">
            <div class="review-header">
                <div class="review-author">
                    <div class="review-avatar">${review.name.charAt(0).toUpperCase()}</div>
                    <div class="review-author-info">
                        <h4>${review.name}</h4>
                        ${review.instagram ? `<a href="https://instagram.com/${review.instagram.replace("@", "")}" target="_blank" class="review-instagram"><i class="fab fa-instagram"></i> ${review.instagram}</a>` : ""}
                    </div>
                </div>
                <div class="review-rating">
                    ${generateStars(review.rating)}
                </div>
            </div>
            <p class="review-comment">${review.comment}</p>
            <span class="review-date">${review.date}</span>
        </div>
    `,
    )
    .join("");
}

function generateStars(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += `<i class="fas fa-star${i <= rating ? " active" : ""}"></i>`;
  }
  return stars;
}

function resetApp() {
  // Clear cart
  cart = [];
  updateCartCount();

  // Reset form
  document.getElementById("checkoutForm").reset();

  // Hide modal and show menu
  document.getElementById("confirmationModal").classList.add("hidden");
  showMenu();

  // Reset to all categories
  currentCategory = "all";
  renderMenuItems("all");
  document.querySelector(".tab-btn").classList.add("active");
}

// Close modals when clicking outside
document.getElementById("itemModal").addEventListener("click", (e) => {
  if (e.target.id === "itemModal") {
    closeItemModal();
  }
});

document.getElementById("confirmationModal").addEventListener("click", (e) => {
  if (e.target.id === "confirmationModal") {
    resetApp();
  }
});

// Add hover sound effects (visual feedback)
function addHoverEffects() {
  const buttons = document.querySelectorAll("button, .menu-item, .tab-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      btn.style.transition = "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    });
  });
}

// Call this on page load
setTimeout(addHoverEffects, 500);

// Add ripple effect on click
document.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON" || e.target.closest("button")) {
    const btn =
      e.target.tagName === "BUTTON" ? e.target : e.target.closest("button");
    createRipple(btn, e);
  }
});

function createRipple(element, event) {
  const ripple = document.createElement("span");
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = size + "px";
  ripple.style.left = x + "px";
  ripple.style.top = y + "px";
  ripple.style.position = "absolute";
  ripple.style.borderRadius = "50%";
  ripple.style.background = "rgba(255, 255, 255, 0.6)";
  ripple.style.transform = "scale(0)";
  ripple.style.animation = "ripple 0.6s ease-out";
  ripple.style.pointerEvents = "none";

  element.style.position = "relative";
  element.style.overflow = "hidden";
  element.appendChild(ripple);

  setTimeout(() => ripple.remove(), 600);
}

// Add ripple animation to CSS dynamically
const style = document.createElement("style");
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
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    if (img.complete) {
      img.classList.add("loaded");
    } else {
      img.addEventListener("load", () => {
        img.classList.add("loaded");
      });
      img.addEventListener("error", () => {
        img.classList.add("loaded");
        // Fallback to a default image or show error state
        console.warn("Image failed to load:", img.src);
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
  subtree: true,
});

// Toast Notification System
function showToast(message, type = "success") {
  // Remove existing toast if any
  const existingToast = document.querySelector(".toast-notification");
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.className = `toast-notification toast-${type}`;
  toast.innerHTML = `
        <i class="fas fa-${type === "success" ? "check-circle" : "exclamation-circle"}"></i>
        <span>${message}</span>
    `;

  document.body.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add("show"), 10);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add toast styles
const toastStyle = document.createElement("style");
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
window.addToCart = function (itemId) {
  originalAddToCart(itemId);
  const item = menuItems.find((i) => i.id === itemId);
  showToast(`${item.name} added to cart!`, "success");
};

const originalAddToCartFromModal = window.addToCartFromModal;
window.addToCartFromModal = function () {
  originalAddToCartFromModal();
  const itemName = document.getElementById("modalItemName").textContent;
  showToast(`${itemName} added to cart!`, "success");
};

// Smooth Page Transitions
function smoothPageTransition(showFunc) {
  const pages = document.querySelectorAll(
    ".landing-page, .menu-page, .cart-page, .checkout-page",
  );
  pages.forEach((page) => {
    if (!page.classList.contains("hidden")) {
      page.style.opacity = "0";
      page.style.transform = "translateY(20px)";
    }
  });

  setTimeout(() => {
    showFunc();
    setTimeout(() => {
      const newPage = document.querySelector(
        ".landing-page:not(.hidden), .menu-page:not(.hidden), .cart-page:not(.hidden), .checkout-page:not(.hidden)",
      );
      if (newPage) {
        newPage.style.opacity = "1";
        newPage.style.transform = "translateY(0)";
      }
    }, 50);
  }, 300);
}

// Scroll to Top on Page Change
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Enhanced Navigation Functions
const originalShowMenu = window.showMenu;
window.showMenu = function () {
  scrollToTop();
  originalShowMenu();
  handleImageLoad();
};

const originalShowCart = window.showCart;
window.showCart = function () {
  scrollToTop();
  originalShowCart();
};

const originalShowCheckout = window.showCheckout;
window.showCheckout = function () {
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
window.handleCheckout = async function (event) {
  event.preventDefault();
  const submitButton = event.target.querySelector('button[type="submit"]');

  // Add loading state
  addButtonLoadingState(submitButton, 1500);

  setTimeout(async () => {
    await originalHandleCheckout(event);
    showToast("Order placed successfully!", "success");
  }, 1500);
};

// Preload critical images
function preloadImages() {
  const imagesToPreload = [
    "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
  ];

  imagesToPreload.forEach((src) => {
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
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", debounce(searchMenu, 300));
}

// ============================================
// PROMO CAROUSEL AUTO-SLIDER
// ============================================
let currentPromoSlide = 0;
let promoSlideInterval;

function showPromoSlide(index) {
  const slides = document.querySelectorAll(".promo-slide");
  const dots = document.querySelectorAll(".promo-dots .dot");

  if (!slides.length || !dots.length) return;

  // Remove active class from all
  slides.forEach((slide) => {
    slide.classList.remove("active", "prev");
  });
  dots.forEach((dot) => {
    dot.classList.remove("active");
  });

  // Add prev class to current slide for animation
  if (slides[currentPromoSlide]) {
    slides[currentPromoSlide].classList.add("prev");
  }

  // Update current slide
  currentPromoSlide = index;
  if (currentPromoSlide >= slides.length) currentPromoSlide = 0;
  if (currentPromoSlide < 0) currentPromoSlide = slides.length - 1;

  // Activate new slide
  slides[currentPromoSlide].classList.add("active");
  dots[currentPromoSlide].classList.add("active");
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

// ============================================
// ADMIN FUNCTIONALITY
// ============================================

// Initialize admin access via logo triple-click
function initAdminAccess() {
  const brandLogo = document.getElementById("brandLogo");
  if (!brandLogo) return;

  brandLogo.addEventListener("click", () => {
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
      showAdminModal();
      // Add subtle feedback
      brandLogo.style.animation = "shake 0.5s ease";
      setTimeout(() => {
        brandLogo.style.animation = "";
      }, 500);
    }
  });

  // Add shake animation
  const shakeStyle = document.createElement("style");
  shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px) rotate(-5deg); }
            75% { transform: translateX(10px) rotate(5deg); }
        }
    `;
  document.head.appendChild(shakeStyle);
}

// Show/Hide Admin Modal
function showAdminModal() {
  document.getElementById("adminModal").classList.remove("hidden");
  document.getElementById("adminUsername").focus();
  // Reset form
  document.getElementById("adminLoginForm").reset();
  document.getElementById("adminError").classList.add("hidden");
}

function closeAdminModal() {
  document.getElementById("adminModal").classList.add("hidden");
  document.getElementById("adminLoginForm").reset();
  document.getElementById("adminError").classList.add("hidden");
}

// Handle Admin Login
function handleAdminLogin(event) {
  event.preventDefault();

  const username = document.getElementById("adminUsername").value;
  const password = document.getElementById("adminPassword").value;

  // Simple validation (In production, use proper authentication)
  if (
    username === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password
  ) {
    isAdminLoggedIn = true;
    closeAdminModal();
    showAdminDashboard();
    showToast("Login successful!", "success");
  } else {
    // Show error
    document.getElementById("adminError").classList.remove("hidden");
    document.getElementById("adminPassword").value = "";
    document.getElementById("adminPassword").focus();

    // Shake the form
    const form = document.getElementById("adminLoginForm");
    form.style.animation = "shake 0.5s ease";
    setTimeout(() => {
      form.style.animation = "";
    }, 500);
  }
}

// Show Admin Dashboard
function showAdminDashboard() {
  hideAllPages();
  document.getElementById("adminPage").classList.remove("hidden");
  document.querySelector(".header").classList.add("hidden");
  updateAdminStats();
}

// Logout Admin
function logoutAdmin() {
  isAdminLoggedIn = false;
  hideAllPages();
  document.getElementById("landingPage").classList.remove("hidden");
  document.querySelector(".header").classList.add("hidden");
  showToast("Logged out successfully", "success");
}

// Update Admin Statistics
function updateAdminStats() {
  // Calculate total orders
  document.getElementById("totalOrders").textContent = orders.length;

  // Calculate total revenue
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  document.getElementById("totalRevenue").textContent =
    `₹${Math.round(totalRevenue)}`;

  // Update menu items count
  document.getElementById("totalMenuItems").textContent = menuItems.length;

  // Render recent orders
  renderAdminOrders();

  // Render admin combos
  renderAdminCombos();

  // Render admin menu items
  renderAdminMenuItems();
}

// Render Admin Orders
function renderAdminOrders() {
  const container = document.getElementById("adminOrders");

  if (orders.length === 0) {
    container.innerHTML = '<p class="no-data">No orders yet</p>';
    return;
  }

  // Show last 10 orders
  const recentOrders = orders.slice(-10).reverse();

  container.innerHTML = recentOrders
    .map(
      (order) => `
        <div class="admin-order-card">
            <div class="admin-order-header">
                <div class="order-info">
                    <span class="order-number">#${order.orderNumber}</span>
                    <span class="order-customer">${order.customerName}</span>
                </div>
                <div class="order-amount">₹${Math.round(order.total)}</div>
            </div>
            <div class="admin-order-details">
                <div class="order-detail">
                    <i class="fas fa-chair"></i>
                    <span>Table ${order.tableNumber}</span>
                </div>
                <div class="order-detail">
                    <i class="fas fa-credit-card"></i>
                    <span>${order.paymentMethod}</span>
                </div>
                <div class="order-detail">
                    <i class="fas fa-clock"></i>
                    <span>${new Date(order.timestamp).toLocaleTimeString()}</span>
                </div>
            </div>
            <div class="order-items">
                ${order.items
                  .map(
                    (item) => `
                    <span class="order-item-tag">${item.quantity}x ${item.name}</span>
                `,
                  )
                  .join("")}
            </div>
        </div>
    `,
    )
    .join("");
}

// Close admin modal when clicking outside
document.addEventListener("click", (e) => {
  const adminModal = document.getElementById("adminModal");
  if (e.target === adminModal) {
    closeAdminModal();
  }
});

// ============================================
// ADMIN COMBO & MENU MANAGEMENT
// ============================================

// Render Admin Combos List
function renderAdminCombos() {
  const container = document.getElementById("adminComboList");

  if (combos.length === 0) {
    container.innerHTML = '<p class="no-data">No combos created yet</p>';
    return;
  }

  container.innerHTML = combos
    .map(
      (combo) => `
        <div class="admin-combo-item">
            <div class="combo-info">
                <img src="${combo.image}" alt="${combo.name}" class="combo-thumbnail" onerror="this.src='https://via.placeholder.com/80x80/C67C4E/ffffff?text=Combo'">
                <div class="combo-details">
                    <h4>${combo.name}</h4>
                    <p>${combo.description}</p>
                    <div class="combo-meta">
                        <span class="combo-price">₹${combo.price}</span>
                        <span class="combo-original">₹${combo.originalPrice}</span>
                        <span class="combo-savings">Save ₹${combo.savings}</span>
                        <span class="combo-type ${combo.isVeg ? "veg" : "non-veg"}">${combo.isVeg ? "Veg" : "Non-Veg"}</span>
                    </div>
                </div>
            </div>
            <div class="combo-actions">
                <button class="admin-btn edit" onclick="showAdminComboModal(${JSON.stringify(combo).replace(/"/g, "&quot;")})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="admin-btn delete" onclick="deleteCombo('${combo.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `,
    )
    .join("");
}

// Admin Menu Management Variables
let currentAdminMenuCategory = "all";

// Filter Admin Menu Items
function filterAdminMenu(category, element) {
  currentAdminMenuCategory = category;

  // Update active button
  document.querySelectorAll(".category-filter-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  if (element) {
    element.classList.add("active");
  }

  renderAdminMenuItems();
}

// Render Admin Menu Items List
function renderAdminMenuItems() {
  const container = document.getElementById("adminMenuList");

  let filteredItems =
    currentAdminMenuCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === currentAdminMenuCategory);

  if (filteredItems.length === 0) {
    container.innerHTML =
      '<p class="no-data">No menu items in this category</p>';
    return;
  }

  container.innerHTML = filteredItems
    .map(
      (item) => `
        <div class="admin-menu-item">
            <div class="menu-item-info">
                <img src="${item.image}" alt="${item.name}" class="menu-thumbnail" onerror="this.src='https://via.placeholder.com/80x80/C67C4E/ffffff?text=Item'">
                <div class="menu-item-details">
                    <h4>${item.name}</h4>
                    <p>${item.description}</p>
                    <div class="menu-item-meta">
                        <span class="item-price">₹${item.price}</span>
                        <span class="item-category">${item.category}</span>
                        <span class="item-type ${item.isVeg ? "veg" : "non-veg"}">${item.isVeg ? "Veg" : "Non-Veg"}</span>
                        <span class="item-rating">⭐ ${item.rating}</span>
                    </div>
                </div>
            </div>
            <div class="menu-item-actions">
                <button class="admin-btn edit" onclick="showAdminMenuModal(${JSON.stringify(item).replace(/"/g, "&quot;")})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="admin-btn delete" onclick="deleteMenuItem(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `,
    )
    .join("");
}

// Show Admin Menu Item Modal
function showAdminMenuModal(item = null) {
  if (!isAdminLoggedIn) return;

  const isEdit = item !== null;
  const modal = document.createElement("div");
  modal.id = "adminMenuModal";
  modal.className = "modal";
  modal.innerHTML = `
        <div class="modal-content admin-menu-modal">
            <button class="close-btn" onclick="closeAdminMenuModal()">
                <i class="fas fa-times"></i>
            </button>
            <div class="admin-menu-header">
                <h2>${isEdit ? "Edit Menu Item" : "Add New Menu Item"}</h2>
            </div>
            <form id="menuForm" onsubmit="saveMenuItem(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label for="menuItemName">Item Name</label>
                        <input type="text" id="menuItemName" value="${item?.name || ""}" required>
                    </div>
                    <div class="form-group">
                        <label for="menuItemCategory">Category</label>
                        <select id="menuItemCategory" required>
                            <option value="coffee" ${item?.category === "coffee" ? "selected" : ""}>Coffee</option>
                            <option value="beverages" ${item?.category === "beverages" ? "selected" : ""}>Beverages</option>
                            <option value="snacks" ${item?.category === "snacks" ? "selected" : ""}>Snacks</option>
                            <option value="desserts" ${item?.category === "desserts" ? "selected" : ""}>Desserts</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="menuItemDescription">Description</label>
                    <textarea id="menuItemDescription" rows="2">${item?.description || ""}</textarea>
                </div>

                <div class="form-group">
                    <label for="menuItemImage">Image URL</label>
                    <input type="url" id="menuItemImage" value="${item?.image || ""}" required>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="menuItemPrice">Price (₹)</label>
                        <input type="number" id="menuItemPrice" value="${item?.price || ""}" min="0" required>
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
                            <input type="radio" name="menuItemType" value="true" ${item?.isVeg !== false ? "checked" : ""}>
                            <span>Vegetarian</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="menuItemType" value="false" ${item?.isVeg === false ? "checked" : ""}>
                            <span>Non-Vegetarian</span>
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label for="menuItemSizes">Available Sizes (comma-separated, optional)</label>
                    <input type="text" id="menuItemSizes" value="${item?.sizes?.join(", ") || ""}" placeholder="S, M, L">
                    <small>Leave empty for no size options</small>
                </div>

                <input type="hidden" id="menuItemId" value="${item?.id || ""}">

                <div class="form-actions">
                    <button type="submit" class="btn-primary">
                        ${isEdit ? "Update Item" : "Add Item"}
                    </button>
                    ${
                      isEdit
                        ? `
                        <button type="button" onclick="deleteMenuItem(${item.id})" class="btn-danger">
                            Delete Item
                        </button>
                    `
                        : ""
                    }
                </div>
            </form>
        </div>
    `;

  document.body.appendChild(modal);
}

// Close Admin Menu Modal
function closeAdminMenuModal() {
  const modal = document.getElementById("adminMenuModal");
  if (modal) {
    modal.remove();
  }
}

// Save Menu Item
async function saveMenuItem(event) {
  event.preventDefault();

  const itemId = document.getElementById("menuItemId").value;
  const isEdit = itemId !== "";

  // Collect form data
  const itemData = {
    name: document.getElementById("menuItemName").value,
    category: document.getElementById("menuItemCategory").value,
    description: document.getElementById("menuItemDescription").value,
    image: document.getElementById("menuItemImage").value,
    price: parseInt(document.getElementById("menuItemPrice").value),
    rating: parseFloat(document.getElementById("menuItemRating").value),
    isVeg:
      document.querySelector('input[name="menuItemType"]:checked').value ===
      "true",
    sizes: document
      .getElementById("menuItemSizes")
      .value.split(",")
      .map((s) => s.trim())
      .filter((s) => s),
  };

  try {
    let response;
    if (isEdit) {
      // Update existing item
      response = await cafeAPI.updateMenuItem(itemId, itemData);
      const itemIndex = menuItems.findIndex((i) => i.id == itemId);
      if (itemIndex !== -1) {
        menuItems[itemIndex] = {
          ...menuItems[itemIndex],
          ...itemData,
          id: parseInt(itemId),
        };
      }
    } else {
      // Create new item
      const newItem = {
        ...itemData,
        id: Math.max(...menuItems.map((i) => i.id)) + 1,
      };
      response = await cafeAPI.createMenuItem(newItem);
      menuItems.push(newItem);
    }

    // Refresh displays
    renderAdminMenuItems();
    if (currentCategory === itemData.category || currentCategory === "all") {
      renderMenuItems(currentCategory);
    }

    closeAdminMenuModal();
    alert(`Menu item ${isEdit ? "updated" : "created"} successfully!`);
  } catch (error) {
    console.error("Error saving menu item:", error);

    // Fallback to local update
    if (isEdit) {
      const itemIndex = menuItems.findIndex((i) => i.id == itemId);
      if (itemIndex !== -1) {
        menuItems[itemIndex] = {
          ...menuItems[itemIndex],
          ...itemData,
          id: parseInt(itemId),
        };
      }
    } else {
      const newItem = {
        ...itemData,
        id: Math.max(...menuItems.map((i) => i.id)) + 1,
      };
      menuItems.push(newItem);
    }

    // Refresh displays
    renderAdminMenuItems();
    if (currentCategory === itemData.category || currentCategory === "all") {
      renderMenuItems(currentCategory);
    }

    closeAdminMenuModal();
    alert(`Menu item ${isEdit ? "updated" : "created"} successfully!`);
    console.warn("Menu item saved locally due to API error:", error.message);
  }
}

// Delete Menu Item
async function deleteMenuItem(itemId) {
  if (confirm("Are you sure you want to delete this menu item?")) {
    try {
      await cafeAPI.deleteMenuItem(itemId);

      // Remove from local array
      const itemIndex = menuItems.findIndex((i) => i.id == itemId);
      if (itemIndex !== -1) {
        menuItems.splice(itemIndex, 1);
      }

      // Refresh displays
      renderAdminMenuItems();
      renderMenuItems(currentCategory);

      alert("Menu item deleted successfully!");
    } catch (error) {
      console.error("Error deleting menu item:", error);

      // Fallback to local deletion
      const itemIndex = menuItems.findIndex((i) => i.id == itemId);
      if (itemIndex !== -1) {
        menuItems.splice(itemIndex, 1);
      }

      // Refresh displays
      renderAdminMenuItems();
      renderMenuItems(currentCategory);

      alert("Menu item deleted successfully!");
      console.warn(
        "Menu item deleted locally due to API error:",
        error.message,
      );
    }
  }
}

// ============================================
// MOBILE-FIRST ADMIN MANAGEMENT FUNCTIONS
// ============================================

// Navigation to Management Pages
function showMenuManagement() {
  hideAllPages();
  document.getElementById("menuManagementPage").classList.remove("hidden");
  renderMenuItemsGrid();
}

function showComboManagement() {
  hideAllPages();
  document.getElementById("comboManagementPage").classList.remove("hidden");
  renderCombosGrid();
}

function showOrdersManagement() {
  hideAllPages();
  document.getElementById("ordersManagementPage").classList.remove("hidden");
  renderAllOrders();
}

function showAnalytics() {
  showToast("Analytics coming soon!", "info");
}

// Render Menu Items in Grid Layout
function renderMenuItemsGrid(searchTerm = "", category = "all") {
  const grid = document.getElementById("menuItemsGrid");
  if (!grid) return;

  let filteredItems = menuItems;

  // Apply category filter
  if (category !== "all") {
    filteredItems = filteredItems.filter((item) => item.category === category);
  }

  // Apply search filter
  if (searchTerm) {
    const search = searchTerm.toLowerCase();
    filteredItems = filteredItems.filter(
      (item) =>
        item.name.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search),
    );
  }

  if (filteredItems.length === 0) {
    grid.innerHTML = `
            <div class="empty-state" style="grid-column: span 2;">
                <div class="empty-state-icon">
                    <i class="fas fa-search"></i>
                </div>
                <p class="empty-state-title">No items found</p>
                <p class="empty-state-text">Try adjusting your search or filters</p>
            </div>
        `;
    return;
  }

  grid.innerHTML = filteredItems
    .map(
      (item) => `
        <div class="admin-item-card fade-in-up" onclick="showEditMenuItemSheet(${item.id})">
            <div class="item-image-container">
                <img src="${item.image}" alt="${item.name}" class="item-image"
                     onerror="this.src='https://via.placeholder.com/200x200/D2042D/ffffff?text=Item'">
                <span class="item-badge ${item.isVeg ? "veg" : "non-veg"}">${item.isVeg ? "VEG" : "NON-VEG"}</span>
                <button class="quick-edit-btn" onclick="event.stopPropagation(); showEditMenuItemSheet(${item.id})">
                    <i class="fas fa-pen"></i>
                </button>
            </div>
            <div class="item-info">
                <p class="item-name">${item.name}</p>
                <p class="item-price">₹${item.price}</p>
                <p class="item-category">${item.category}</p>
            </div>
        </div>
    `,
    )
    .join("");
}

// Render Combos in Grid Layout
function renderCombosGrid(searchTerm = "") {
  const grid = document.getElementById("combosGrid");
  if (!grid) return;

  let filteredCombos = combos;

  // Apply search filter
  if (searchTerm) {
    const search = searchTerm.toLowerCase();
    filteredCombos = filteredCombos.filter(
      (combo) =>
        combo.name.toLowerCase().includes(search) ||
        combo.description.toLowerCase().includes(search),
    );
  }

  if (filteredCombos.length === 0) {
    grid.innerHTML = `
            <div class="empty-state" style="grid-column: span 2;">
                <div class="empty-state-icon">
                    <i class="fas fa-layer-group"></i>
                </div>
                <p class="empty-state-title">No combos found</p>
                <p class="empty-state-text">Create your first combo offer</p>
            </div>
        `;
    return;
  }

  grid.innerHTML = filteredCombos
    .map(
      (combo) => `
        <div class="admin-item-card fade-in-up" onclick="showEditComboSheet('${combo.id}')">
            <div class="item-image-container">
                <img src="${combo.image}" alt="${combo.name}" class="item-image"
                     onerror="this.src='https://via.placeholder.com/200x200/D2042D/ffffff?text=Combo'">
                <span class="item-badge" style="background: var(--primary-color); color: white;">Combo</span>
                <button class="quick-edit-btn" onclick="event.stopPropagation(); showEditComboSheet('${combo.id}')">
                    <i class="fas fa-pen"></i>
                </button>
            </div>
            <div class="item-info">
                <p class="item-name">${combo.name}</p>
                <p class="item-price">₹${combo.price} <span style="text-decoration: line-through; color: var(--text-muted); font-size: 0.8rem;">₹${combo.originalPrice}</span></p>
            </div>
        </div>
    `,
    )
    .join("");
}

// Render All Orders
function renderAllOrders() {
  const container = document.getElementById("allOrdersList");
  if (!container) return;

  if (orders.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <i class="fas fa-receipt"></i>
                </div>
                <p class="empty-state-title">No orders yet</p>
                <p class="empty-state-text">Orders will appear here when customers place them</p>
            </div>
        `;
    return;
  }

  container.innerHTML = orders
    .map(
      (order) => `
        <div class="admin-item-card" style="display: block; margin-bottom: var(--spacing-sm);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-sm);">
                <span style="font-weight: 600; color: var(--text-dark);">Order #${order.orderNumber}</span>
                <span style="font-size: 0.8rem; color: var(--text-muted);">${new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div style="font-size: 0.9rem; color: var(--text-light); margin-bottom: var(--spacing-xs);">
                ${order.items.length} items
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 700; color: var(--primary-color);">₹${order.total}</span>
                <span style="padding: 4px 12px; border-radius: var(--border-radius-full); font-size: 0.75rem; font-weight: 600; background: var(--success-light); color: var(--success);">${order.status}</span>
            </div>
        </div>
    `,
    )
    .join("");
}

// Search and Filter Functions
function filterMenuItems(searchTerm) {
  const activeCategory = document.querySelector(".category-pill.active");
  const category = activeCategory ? activeCategory.dataset.category : "all";
  renderMenuItemsGrid(searchTerm, category);
}

function filterMenuByCategory(category, element) {
  // Update active state
  document.querySelectorAll(".category-pill").forEach((btn) => {
    btn.classList.remove("active", "btn-primary");
    btn.classList.add("btn-secondary");
  });
  element.classList.remove("btn-secondary");
  element.classList.add("active", "btn-primary");

  // Apply filter
  const searchTerm = document.getElementById("menuSearchInput")?.value || "";
  renderMenuItemsGrid(searchTerm, category);
}

function filterCombos(searchTerm) {
  renderCombosGrid(searchTerm);
}

// Bottom Sheet Functions
function showAddMenuItemSheet() {
  document.getElementById("menuItemSheetTitle").textContent = "Add Menu Item";
  document.getElementById("editMenuItemId").value = "";
  document.getElementById("menuItemForm").reset();
  openBottomSheet("menuItemSheet", "menuItemSheetOverlay");
}

function showEditMenuItemSheet(itemId) {
  const item = menuItems.find((i) => i.id === itemId);
  if (!item) return;

  document.getElementById("menuItemSheetTitle").textContent = "Edit Menu Item";
  document.getElementById("editMenuItemId").value = itemId;
  document.getElementById("sheetItemName").value = item.name;
  document.getElementById("sheetItemDescription").value =
    item.description || "";
  document.getElementById("sheetItemPrice").value = item.price;
  document.getElementById("sheetItemCategory").value = item.category;
  document.getElementById("sheetItemImage").value = item.image || "";

  if (item.isVeg) {
    document.getElementById("sheetItemVeg").checked = true;
  } else {
    document.getElementById("sheetItemNonVeg").checked = true;
  }

  openBottomSheet("menuItemSheet", "menuItemSheetOverlay");
}

function closeMenuItemSheet() {
  closeBottomSheet("menuItemSheet", "menuItemSheetOverlay");
}

function showAddComboSheet() {
  document.getElementById("comboSheetTitle").textContent = "Add Combo";
  document.getElementById("editComboId").value = "";
  document.getElementById("comboForm").reset();
  openBottomSheet("comboSheet", "comboSheetOverlay");
}

function showEditComboSheet(comboId) {
  const combo = combos.find((c) => c.id === comboId);
  if (!combo) return;

  document.getElementById("comboSheetTitle").textContent = "Edit Combo";
  document.getElementById("editComboId").value = comboId;
  document.getElementById("sheetComboName").value = combo.name;
  document.getElementById("sheetComboDescription").value =
    combo.description || "";
  document.getElementById("sheetComboOriginalPrice").value =
    combo.originalPrice;
  document.getElementById("sheetComboPrice").value = combo.price;
  document.getElementById("sheetComboImage").value = combo.image || "";

  openBottomSheet("comboSheet", "comboSheetOverlay");
}

function closeComboSheet() {
  closeBottomSheet("comboSheet", "comboSheetOverlay");
}

function openBottomSheet(sheetId, overlayId) {
  document.getElementById(overlayId).classList.add("active");
  document.getElementById(sheetId).classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeBottomSheet(sheetId, overlayId) {
  document.getElementById(overlayId).classList.remove("active");
  document.getElementById(sheetId).classList.remove("active");
  document.body.style.overflow = "";
}

// Save Menu Item from Bottom Sheet
async function saveMenuItemFromSheet(event) {
  event.preventDefault();

  const itemId = document.getElementById("editMenuItemId").value;
  const isEdit = itemId !== "";

  const itemData = {
    name: document.getElementById("sheetItemName").value,
    description: document.getElementById("sheetItemDescription").value,
    price: Number(document.getElementById("sheetItemPrice").value),
    category: document.getElementById("sheetItemCategory").value,
    image:
      document.getElementById("sheetItemImage").value ||
      "https://via.placeholder.com/400x300/D2042D/ffffff?text=Item",
    isVeg: document.getElementById("sheetItemVeg").checked,
    rating: 4.5,
    isAvailable: true,
  };

  if (isEdit) {
    // Update existing item
    const index = menuItems.findIndex((i) => i.id == itemId);
    if (index !== -1) {
      menuItems[index] = { ...menuItems[index], ...itemData };
    }
    showToast("Item updated successfully!", "success");
  } else {
    // Create new item
    const newItem = {
      id: Date.now(),
      ...itemData,
    };
    menuItems.push(newItem);
    showToast("Item added successfully!", "success");
  }

  closeMenuItemSheet();
  renderMenuItemsGrid();
  updateAdminStats();
}

// Save Combo from Bottom Sheet
async function saveComboFromSheet(event) {
  event.preventDefault();

  const comboId = document.getElementById("editComboId").value;
  const isEdit = comboId !== "";

  const comboData = {
    name: document.getElementById("sheetComboName").value,
    description: document.getElementById("sheetComboDescription").value,
    originalPrice: Number(
      document.getElementById("sheetComboOriginalPrice").value,
    ),
    price: Number(document.getElementById("sheetComboPrice").value),
    image:
      document.getElementById("sheetComboImage").value ||
      "https://via.placeholder.com/400x300/D2042D/ffffff?text=Combo",
    savings:
      Number(document.getElementById("sheetComboOriginalPrice").value) -
      Number(document.getElementById("sheetComboPrice").value),
  };

  if (isEdit) {
    // Update existing combo
    const index = combos.findIndex((c) => c.id === comboId);
    if (index !== -1) {
      combos[index] = { ...combos[index], ...comboData };
    }
    showToast("Combo updated successfully!", "success");
  } else {
    // Create new combo
    const newCombo = {
      id: `combo_${Date.now()}`,
      ...comboData,
      items: [],
      isVeg: true,
      rating: 4.5,
    };
    combos.push(newCombo);
    showToast("Combo added successfully!", "success");
  }

  closeComboSheet();
  renderCombosGrid();
  updateAdminStats();
}

// Toast Notification
function showToast(message, type = "info") {
  // Remove existing toast
  const existingToast = document.querySelector(".toast");
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
        <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : "info-circle"}"></i>
        <span>${message}</span>
    `;
  document.body.appendChild(toast);

  // Show toast
  setTimeout(() => toast.classList.add("show"), 10);

  // Hide after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Counting Animation for Stats
function animateCounter(element, targetValue, prefix = "", suffix = "") {
  const duration = 1000;
  const startValue = 0;
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

    const currentValue = Math.round(
      startValue + (targetValue - startValue) * easeProgress,
    );
    element.textContent = prefix + currentValue + suffix;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.classList.add("counting");
      setTimeout(() => element.classList.remove("counting"), 500);
    }
  }

  requestAnimationFrame(updateCounter);
}

// Enhanced Cart Animation
function animateCartBounce() {
  const cartButton = document.querySelector(".cart-button");
  if (cartButton) {
    cartButton.classList.add("cart-bounce");
    setTimeout(() => cartButton.classList.remove("cart-bounce"), 500);
  }
}

// Update Admin Stats with Animation
function updateAdminStatsAnimated() {
  const totalOrdersEl = document.getElementById("totalOrders");
  const totalRevenueEl = document.getElementById("totalRevenue");
  const totalMenuItemsEl = document.getElementById("totalMenuItems");

  if (totalOrdersEl) {
    animateCounter(totalOrdersEl, orders.length);
  }

  if (totalRevenueEl) {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    animateCounter(totalRevenueEl, Math.round(totalRevenue), "₹");
  }

  if (totalMenuItemsEl) {
    animateCounter(totalMenuItemsEl, menuItems.length);
  }

  // Update counts in nav cards
  const menuItemsCount = document.getElementById("menuItemsCount");
  const combosCount = document.getElementById("combosCount");
  const ordersCount = document.getElementById("ordersCount");

  if (menuItemsCount) menuItemsCount.textContent = `${menuItems.length} items`;
  if (combosCount) combosCount.textContent = `${combos.length} combos`;
  if (ordersCount) ordersCount.textContent = `${orders.length} orders`;
}

// Override showAdminDashboard to include animated stats
const originalShowAdminDashboard = showAdminDashboard;
showAdminDashboard = function () {
  hideAllPages();
  document.getElementById("adminPage").classList.remove("hidden");
  document.querySelector(".header").classList.add("hidden");
  setTimeout(updateAdminStatsAnimated, 100);
};
