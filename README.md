# Cafe Coffeeto - Digital Menu & Order Management System

A mobile-first digital menu and order management system for Cafe Coffeeto. Features QR code access for customers, a real-time kitchen dashboard, and a comprehensive admin panel. Built with Node.js/Express backend and MongoDB database.

**MVP Deadline: March 29, 2026**

## About Cafe Coffeeto

Cafe Coffeeto is a premium coffee destination offering exceptional coffee experiences. This digital ordering system allows customers to browse the menu, place orders, and track their order status in real-time. Kitchen staff can manage orders efficiently, and administrators can control menu items, combos, promotions, and reviews.

## Features

### Customer Features (No Authentication Required)
- **Landing Page**: Welcome screen with promotional carousel
- **Menu Browsing**: Browse all menu items with category filtering
- **Category Filters**: Coffee, Cold Drinks, Food, Desserts, and Combos
- **Item Details Modal**: View detailed information with customization options
- **Special Instructions**: Add notes to individual items (150 char limit)
- **Shopping Cart**: Add, remove, and adjust quantities
- **Checkout Process**: Simple order placement with customer name
- **Order Confirmation**: Receive sequential 4-digit order number (0001-9999)
- **Order Tracking**: Real-time status updates with 5-second polling
- **Pay at Counter**: All payments handled at pickup

### Kitchen Dashboard (Login Required)
- **Real-Time Orders**: Orders appear automatically with 10-second polling
- **Order Workflow**: RECEIVED → PREPARING → READY → SERVED
- **Sound Notifications**: Audio alerts for new orders (toggleable)
- **Status Filters**: Filter by All, Pending, Preparing, Ready, or Served
- **Order Statistics**: Live count of orders by status
- **Time Tracking**: Elapsed time display for each order
- **Cancel Orders**: Can cancel orders only in RECEIVED status

### Admin Panel (Login Required)
- **Dashboard Statistics**: Orders today, total revenue, menu items count
- **Menu Management**: Full CRUD for menu items with WEBP image upload
- **Combo Management**: Create/edit combo deals with item combinations
- **Promo Management**: Banner promotions with tracking (impressions/clicks)
- **Review Management**: Curate featured reviews (max 10, display 6)
- **Order History**: View and manage all orders

### User Interface
- **Mobile-First Design**: Optimized for smartphone screens
- **Cherry Red Theme**: Primary color #D2042D with white background
- **Bottom Navigation Bar**: Easy access to Home, Menu, Cart, Orders
- **Responsive Layout**: Works on various screen sizes
- **Smooth Animations**: Engaging transitions and hover effects
- **Triple-Click Login**: Access staff panels by triple-clicking the logo

## Design Elements

### Color Scheme
- **Primary Color**: Cherry Red (#D2042D)
- **Background**: White (#FFFFFF)
- **Text**: Dark Gray (#1a1a1a)
- **Accent**: Light Gray (#F5F5F5)
- **Success**: Green (#4CAF50)
- **Warning**: Orange (#FF9800)

### UI Components
1. **Bottom Navigation**: Fixed nav with Home, Menu, Cart, Orders
2. **Category Tabs**: Horizontal scrollable tabs for filtering
3. **Menu Cards**: Grid layout with images, names, descriptions, prices
4. **Cart Interface**: List view with quantity controls
5. **Modals**: Item details, login, confirmation, reviews
6. **Kitchen Cards**: Order cards with status indicators
7. **Promo Carousel**: Auto-rotating banner (5 seconds)

## File Structure

```
Cafe-Coffeto/
├── index.html                  # Main HTML structure
├── styles.css                  # Core styling
├── README.md                   # Project documentation
│
├── css/
│   └── new-components.css      # Additional component styles
│
├── js/
│   ├── config.js               # Constants, credentials, menu data
│   ├── api.js                  # CafeAPI class for backend calls
│   ├── auth.js                 # Authentication & role management
│   ├── ui-customer.js          # Customer UI (menu, cart, checkout)
│   ├── ui-admin.js             # Admin dashboard functionality
│   ├── ui-kitchen.js           # Kitchen dashboard with sound
│   └── main.js                 # App initialization
│
├── backend/
│   ├── server.js               # Express server entry point
│   ├── package.json            # Backend dependencies
│   ├── seed.js                 # Database seeding script
│   ├── .env.example            # Environment variables template
│   │
│   ├── models/
│   │   ├── User.js             # User model (admin/kitchen)
│   │   ├── MenuItem.js         # Menu item model
│   │   ├── Order.js            # Order model with status
│   │   ├── Combo.js            # Combo deals model
│   │   ├── Review.js           # Customer reviews model
│   │   ├── Promo.js            # Promotional banners model
│   │   ├── Counter.js          # Sequential order numbers
│   │   └── Settings.js         # Cafe settings (singleton)
│   │
│   ├── routes/
│   │   ├── auth.js             # Login/logout endpoints
│   │   ├── menu.js             # Menu CRUD endpoints
│   │   ├── orders.js           # Order management
│   │   ├── combos.js           # Combo CRUD endpoints
│   │   ├── reviews.js          # Review management
│   │   ├── promos.js           # Promo management + tracking
│   │   ├── kitchen.js          # Kitchen-specific endpoints
│   │   └── settings.js         # Settings CRUD
│   │
│   └── middleware/
│       ├── auth.js             # JWT verification
│       ├── roleCheck.js        # Role-based access control
│       └── upload.js           # Multer WEBP upload config
│
└── uploads/                    # Uploaded images directory
```

## Technical Details

### Technologies Used

**Frontend:**
- HTML5 semantic markup
- CSS3 with flexbox and grid
- Vanilla JavaScript (ES6+)
- Font Awesome icons
- Modular architecture (7 JS files)

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Multer for file uploads (WEBP only)
- bcryptjs for password hashing
- CORS, Helmet, Morgan, Compression

### API Endpoints

**Authentication:**
- `POST /api/auth/login` - Staff login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

**Menu:**
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get single item
- `POST /api/menu` - Create item (admin)
- `PUT /api/menu/:id` - Update item (admin)
- `DELETE /api/menu/:id` - Delete item (admin)

**Orders:**
- `GET /api/orders` - Get orders (with filters)
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status
- `PATCH /api/orders/:id/payment` - Update payment status

**Kitchen:**
- `GET /api/kitchen/orders` - Get active orders
- `PATCH /api/kitchen/orders/:id/status` - Update status
- `PATCH /api/kitchen/orders/:id/cancel` - Cancel order (RECEIVED only)

**Combos:**
- `GET /api/combos` - Get all combos
- `POST /api/combos` - Create combo (admin)
- `PUT /api/combos/:id` - Update combo (admin)
- `DELETE /api/combos/:id` - Delete combo (admin)

**Reviews:**
- `GET /api/reviews` - Get featured reviews
- `POST /api/reviews` - Submit review
- `PATCH /api/reviews/:id/feature` - Toggle featured (admin)
- `DELETE /api/reviews/:id` - Delete review (admin)

**Promos:**
- `GET /api/promos` - Get active promos
- `POST /api/promos` - Create promo (admin)
- `PUT /api/promos/:id` - Update promo (admin)
- `DELETE /api/promos/:id` - Delete promo (admin)
- `POST /api/promos/:id/track` - Track click/impression

**Settings:**
- `GET /api/settings` - Get cafe settings
- `PUT /api/settings` - Update settings (admin)

## Getting Started

### Prerequisites
- Node.js >= 16.0.0
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from template:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cafe-coffeeto
JWT_SECRET=your-secure-secret-key
NODE_ENV=development
```

5. Seed the database with sample data:
```bash
npm run seed
```

6. Start the server:
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

### Frontend Setup

1. Open `index.html` in a web browser
2. Or serve with a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

### Default Credentials

After seeding, use these credentials:

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Kitchen Account:**
- Username: `kitchen`
- Password: `kitchen123`

**How to Login:**
Triple-click on the Cafe Coffeeto logo to open the login modal.

## Order Workflow

### Order Number System
- Sequential 4-digit numbers: 0001 → 9999
- Resets daily at midnight
- Stored in Counter collection

### Order Status Flow
```
Customer places order
        ↓
   RECEIVED (Orange)
        ↓
   Kitchen confirms
        ↓
   PREPARING (Red)
        ↓
   Kitchen marks ready
        ↓
     READY (Green)
        ↓
   Customer picks up
        ↓
    SERVED (Blue)
```

### Payment Flow
- All orders start with `pending` payment
- Kitchen/Admin marks as `paid` at pickup
- Orders can be `cancelled` only in RECEIVED status

## User Roles

### Customer (No Login)
- Browse menu and combos
- Add items to cart with special instructions
- Place orders
- Track order status
- Submit reviews

### Kitchen Staff
- View incoming orders
- Update order status (excluding cancel for non-RECEIVED)
- Toggle sound notifications
- Filter orders by status

### Admin
- All kitchen permissions
- Manage menu items (CRUD)
- Manage combos (CRUD)
- Manage promos with tracking
- Curate featured reviews
- View analytics and settings

## Customization

### Changing Theme Colors
Edit `js/config.js`:
```javascript
const THEME = {
    primary: '#D2042D',     // Cherry red
    secondary: '#8B0000',   // Darker red
    background: '#FFFFFF',
    surface: '#f5f5f5',
    text: '#1a1a1a'
};
```

### Adding Menu Categories
1. Add category to `menuCategories` array in `js/config.js`
2. Update category filter buttons in `index.html`
3. Tag menu items with new category

### Modifying Tax Rate
Tax is currently set to 0% (defined in Settings model). To change:
1. Update via Admin panel settings
2. Or modify `backend/seed.js` default value

## Browser Compatibility

- Chrome (recommended)
- Safari
- Firefox
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Mobile Optimization

- Touch-friendly targets (44x44px minimum)
- Bottom navigation for thumb reach
- Viewport optimized with meta tag
- Fast loading with minimal dependencies
- Smooth native scrolling
- No horizontal scroll

## Completed Features

- [x] Mobile-first responsive design
- [x] Cherry red theme implementation
- [x] Bottom navigation bar
- [x] Menu browsing with categories
- [x] Shopping cart functionality
- [x] Order placement with sequential numbers
- [x] Order status tracking with polling
- [x] Kitchen dashboard with real-time updates
- [x] Sound notifications for kitchen
- [x] Admin panel for menu management
- [x] Combo deals system
- [x] Promotional banner carousel
- [x] Featured reviews system
- [x] Triple-click staff login
- [x] JWT authentication
- [x] Role-based access control
- [x] WEBP image uploads
- [x] Database seeding script
- [x] Modular JavaScript architecture

## Future Enhancements

- [ ] Push notifications for order ready
- [ ] Order history for customers (local storage)
- [ ] Multi-language support
- [ ] Dietary filters (vegan, gluten-free)
- [ ] Item customization options (size, milk type)
- [ ] Time-based menu availability
- [ ] Loyalty program integration
- [ ] Analytics dashboard expansion
- [ ] Email/SMS notifications
- [ ] Print receipts integration
- [ ] Inventory management
- [ ] Staff performance metrics

## Security Notes

For production deployment:
- Use HTTPS for secure connection
- Set strong JWT_SECRET
- Enable Helmet security headers
- Implement rate limiting (already configured)
- Sanitize user inputs (implemented)
- Validate file uploads (WEBP only, 5MB max)

## Testing Checklist

**Customer Flow:**
- [ ] Browse menu items
- [ ] Filter by categories
- [ ] View item details
- [ ] Add items to cart
- [ ] Add special instructions
- [ ] Update quantities
- [ ] Remove items
- [ ] Complete checkout
- [ ] Receive order number
- [ ] Track order status

**Kitchen Flow:**
- [ ] Login as kitchen staff
- [ ] View incoming orders
- [ ] Confirm order (PREPARING)
- [ ] Mark order ready
- [ ] Mark order served
- [ ] Cancel order (RECEIVED only)
- [ ] Toggle sound notifications
- [ ] Filter by status

**Admin Flow:**
- [ ] Login as admin
- [ ] View dashboard stats
- [ ] Add/edit/delete menu items
- [ ] Upload WEBP images
- [ ] Manage combos
- [ ] Manage promos
- [ ] Feature/unfeature reviews

## License

This digital menu application is developed for Cafe Coffeeto. All rights reserved.

## Credits

**Developed for**: Cafe Coffeeto
**Purpose**: Digital Menu & Order Management System
**Version**: 2.0.0 (MVP)
**Date**: March 2026

---

**Welcome to Cafe Coffeeto's Digital Experience!**
