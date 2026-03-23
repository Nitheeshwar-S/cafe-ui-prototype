// Quick debug script to test functionality
console.log("=== Cafe Coffeeto Debug ===");

// Test 1: Check if variables are defined
setTimeout(() => {
    console.log("1. Variables check:");
    console.log("- menuItems:", typeof menuItems !== 'undefined' ? `${menuItems.length} items` : 'UNDEFINED');
    console.log("- combos:", typeof combos !== 'undefined' ? `${combos.length} combos` : 'UNDEFINED');
    console.log("- cafeAPI:", typeof cafeAPI !== 'undefined' ? 'LOADED' : 'UNDEFINED');
}, 1000);

// Test 2: Check function availability
setTimeout(() => {
    console.log("2. Functions check:");
    console.log("- renderMenuItems:", typeof renderMenuItems);
    console.log("- filterCategory:", typeof filterCategory);
    console.log("- initAdminAccess:", typeof initAdminAccess);
    console.log("- showAdminModal:", typeof showAdminModal);
}, 1500);

// Test 3: Check DOM elements
setTimeout(() => {
    console.log("3. DOM elements check:");
    console.log("- brandLogo:", document.getElementById('brandLogo') ? 'FOUND' : 'NOT FOUND');
    console.log("- adminModal:", document.getElementById('adminModal') ? 'FOUND' : 'NOT FOUND');
    console.log("- menuContainer:", document.getElementById('menuContainer') ? 'FOUND' : 'NOT FOUND');
}, 2000);

// Test 4: Manual triple-click test
setTimeout(() => {
    console.log("4. Testing admin access manually...");
    const brandLogo = document.getElementById('brandLogo');
    if (brandLogo) {
        console.log("Brand logo found, testing click events...");
        // Simulate triple click
        brandLogo.click();
        brandLogo.click();
        brandLogo.click();
        console.log("Triple click simulated");
    } else {
        console.log("Brand logo NOT found");
    }
}, 3000);

// Test 5: Manual menu test
setTimeout(() => {
    console.log("5. Testing menu rendering...");
    if (typeof renderMenuItems === 'function') {
        try {
            renderMenuItems('coffee');
            console.log("Menu rendering test: SUCCESS");
        } catch (e) {
            console.error("Menu rendering test: ERROR", e);
        }
    } else {
        console.log("renderMenuItems function not available");
    }
}, 4000);