# ☕ Cafe Menu UI Prototype

A mobile-first cafe menu application prototype designed for QR code access. Customers can browse menu items, add to cart, and place orders seamlessly from their mobile devices.

## 📱 Project Overview

This prototype is designed for cafe customers who scan a QR code to access the menu. The application is optimized for mobile devices and provides a smooth ordering experience.

## ✨ Features

### Core Functionality
- **Landing Page**: Welcoming screen when users scan the QR code
- **Menu Browsing**: Browse all menu items with category filtering
- **Category Filters**: Filter items by Coffee, Cold Drinks, Food, and Desserts
- **Item Details**: Click any item to view detailed information
- **Shopping Cart**: Add, remove, and adjust quantities of items
- **Checkout Process**: Complete order with customer information
- **Order Confirmation**: Receive order number and confirmation

### User Interface
- **Mobile-First Design**: Optimized for smartphone screens (max-width: 480px)
- **Responsive Layout**: Works on various screen sizes
- **Smooth Animations**: Engaging transitions and hover effects
- **Intuitive Navigation**: Easy-to-use back buttons and navigation
- **Visual Feedback**: Cart updates with animations

## 🎨 Design Elements

### Color Scheme
- **Primary Color**: Coffee Brown (#6B4423)
- **Secondary Color**: Light Brown (#A67C52)
- **Accent Color**: Cream (#D4A574)
- **Background**: Light Gray (#F5F5F5)

### UI Components
1. **Header**: Sticky header with logo and cart button
2. **Category Tabs**: Horizontal scrollable tabs for filtering
3. **Menu Cards**: Grid layout with item images, names, descriptions, and prices
4. **Cart Interface**: List view with quantity controls
5. **Checkout Form**: Customer information collection
6. **Modals**: Item details and order confirmation

## 📂 File Structure

```
Cafe UI Prototype/
│
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── script.js          # Application logic and functionality
└── README.md          # This documentation file
```

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with flexbox and grid
- **JavaScript (ES6+)**: Vanilla JS for interactivity
- **Font Awesome**: Icons for UI elements

### Browser Compatibility
- Chrome (recommended)
- Safari
- Firefox
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 How to Use

### For Development/Testing
1. Open `index.html` in a web browser
2. Navigate through the app using the interface
3. Test all features: browsing, cart, checkout

### For Client Demo
1. Open `index.html` in a browser
2. Press F11 for fullscreen mode (optional)
3. Use browser's device emulation (F12 → Device Toolbar) to simulate mobile
4. Demonstrate the user flow:
   - Landing page → Menu → Add items → Cart → Checkout → Confirmation

### For Deployment
1. Upload all files to a web server
2. Access via URL (e.g., `https://your-cafe.com/menu`)
3. Generate QR code linking to the URL
4. Print QR codes for table placement

## 📋 Menu Categories & Items

### ☕ Coffee & Hot Drinks (6 items)
- Espresso - $3.50
- Cappuccino - $4.50
- Latte - $4.75
- Americano - $3.75
- Mocha - $5.25
- Hot Chocolate - $4.00

### 🥤 Cold Drinks (6 items)
- Iced Coffee - $4.25
- Iced Latte - $4.95
- Frappe - $5.50
- Smoothie - $5.75
- Fresh Juice - $4.50
- Bubble Tea - $5.25

### 🥪 Food & Snacks (6 items)
- Croissant - $3.25
- Bagel - $3.50
- Sandwich - $7.50
- Muffin - $3.75
- Avocado Toast - $6.50
- Breakfast Burrito - $8.25

### 🍰 Desserts (6 items)
- Chocolate Cake - $5.50
- Cheesecake - $5.75
- Brownie - $4.25
- Cookie - $2.75
- Tiramisu - $6.50
- Ice Cream - $4.50

**Total: 24 menu items**

## 🎯 User Flow

```
1. Customer scans QR code
   ↓
2. Landing page loads
   ↓
3. Click "View Menu"
   ↓
4. Browse items (filter by category)
   ↓
5. Click item for details OR add directly to cart
   ↓
6. View cart (adjust quantities)
   ↓
7. Proceed to checkout
   ↓
8. Fill customer information
   ↓
9. Place order
   ↓
10. Receive confirmation with order number
```

## 🔧 Customization Guide

### Updating Menu Items
Edit the `menuItems` array in `script.js`:
```javascript
{
    id: 1,
    name: "Item Name",
    category: "coffee", // coffee, cold-drinks, food, desserts
    price: 4.50,
    description: "Item description",
    icon: "☕" // Emoji icon
}
```

### Changing Colors
Update CSS variables in `styles.css`:
```css
:root {
    --primary-color: #6B4423;
    --secondary-color: #A67C52;
    --accent-color: #D4A574;
}
```

### Modifying Tax Rate
Edit the tax calculation in `script.js`:
```javascript
const tax = subtotal * 0.1; // 10% tax - change 0.1 to desired rate
```

### Adding Categories
1. Add new category button in HTML
2. Add category filter in JavaScript
3. Tag menu items with new category

## 📱 Mobile Optimization

- **Touch-Friendly**: Large tap targets (44x44px minimum)
- **Viewport Optimized**: Proper meta viewport tag
- **Fast Loading**: Minimal dependencies
- **Smooth Scrolling**: Native scrolling behavior
- **No Horizontal Scroll**: Contained within viewport width

## 🎨 Features Showcase

### Interactive Elements
- ✅ Add to cart with visual feedback
- ✅ Quantity controls with +/- buttons
- ✅ Remove items from cart
- ✅ Category filtering
- ✅ Item detail modal
- ✅ Order confirmation modal

### Validation
- ✅ Required fields in checkout form
- ✅ Phone number format
- ✅ Empty cart prevention
- ✅ Minimum quantity enforcement

### User Experience
- ✅ Sticky header for easy cart access
- ✅ Back buttons for navigation
- ✅ Empty cart state message
- ✅ Order number generation
- ✅ Cart item counter badge

## 🚀 Future Enhancements

For production version, consider:
- [ ] Backend integration for order processing
- [ ] Payment gateway integration
- [ ] Real-time order status tracking
- [ ] Push notifications
- [ ] User accounts and order history
- [ ] Loyalty program integration
- [ ] Multi-language support
- [ ] Dietary filters (vegan, gluten-free, etc.)
- [ ] Item customization options
- [ ] Time-based menu availability
- [ ] Real product images
- [ ] Reviews and ratings
- [ ] Order scheduling/pre-ordering

## 📊 Performance

- **Load Time**: < 1 second
- **File Size**: 
  - HTML: ~8KB
  - CSS: ~10KB
  - JS: ~8KB
  - Total: ~26KB (excluding Font Awesome CDN)

## 🔒 Security Notes

For production deployment:
- Use HTTPS for secure connection
- Implement CSRF protection
- Sanitize user inputs
- Add rate limiting
- Secure payment processing
- Encrypt sensitive data

## 📞 Support & Maintenance

### Common Issues
1. **Cart not updating**: Check browser console for errors
2. **Styling issues**: Clear browser cache
3. **Mobile display**: Ensure viewport meta tag is present

### Testing Checklist
- [ ] Add items to cart
- [ ] Update quantities
- [ ] Remove items
- [ ] Filter categories
- [ ] View item details
- [ ] Complete checkout form
- [ ] Receive order confirmation
- [ ] Test on different screen sizes
- [ ] Test on different browsers
- [ ] Test touch interactions

## 📝 License

This is a prototype for client presentation. All rights reserved.

## 👥 Credits

**Developed for**: Cafe Delight
**Purpose**: Client Meeting Prototype
**Date**: March 2026

---

## 🎉 Demo Instructions for Client Meeting

1. **Setup**:
   - Open `index.html` in Chrome browser
   - Use device toolbar (F12 → Toggle Device Toolbar)
   - Select "iPhone 12 Pro" or similar mobile device
   - Zoom to fit screen

2. **Walkthrough**:
   - Start at landing page
   - Show menu browsing
   - Demonstrate category filtering
   - Add multiple items to cart
   - Show cart management
   - Complete checkout process
   - Display order confirmation

3. **Highlight Features**:
   - Mobile-optimized design
   - Easy navigation
   - Simple ordering process
   - Professional appearance
   - Fast and responsive

4. **Discussion Points**:
   - Menu customization options
   - Additional features needed
   - Backend integration requirements
   - Payment processing preferences
   - Timeline and budget

---

**Ready to present! 🚀**
