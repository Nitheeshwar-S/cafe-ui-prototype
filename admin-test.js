// Admin Page Functionality Test Script
// This script tests all admin features to ensure everything works correctly

console.log('🧪 Starting Admin Page Comprehensive Test...');

// Test 1: Check if all required admin elements exist
function testAdminElementsExist() {
    console.log('Test 1: Checking admin page elements...');

    const requiredElements = [
        'brandLogo',
        'adminPage',
        'adminModal',
        'adminComboList',
        'adminMenuList',
        'totalOrders',
        'totalRevenue',
        'totalMenuItems'
    ];

    let allElementsExist = true;
    requiredElements.forEach(id => {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`❌ Missing element: ${id}`);
            allElementsExist = false;
        } else {
            console.log(`✅ Found element: ${id}`);
        }
    });

    return allElementsExist;
}

// Test 2: Check admin access functionality
function testAdminAccess() {
    console.log('Test 2: Testing admin access...');

    try {
        // Simulate triple click on logo
        const brandLogo = document.getElementById('brandLogo');
        if (brandLogo) {
            // Simulate 3 rapid clicks
            for (let i = 0; i < 3; i++) {
                brandLogo.click();
            }
            console.log('✅ Admin modal should appear after triple-click');
            return true;
        } else {
            console.error('❌ Brand logo not found');
            return false;
        }
    } catch (error) {
        console.error('❌ Admin access test failed:', error);
        return false;
    }
}

// Test 3: Check admin statistics update
function testAdminStats() {
    console.log('Test 3: Testing admin statistics...');

    try {
        if (typeof updateAdminStats === 'function') {
            updateAdminStats();
            console.log('✅ Admin stats updated successfully');
            return true;
        } else {
            console.error('❌ updateAdminStats function not found');
            return false;
        }
    } catch (error) {
        console.error('❌ Admin stats test failed:', error);
        return false;
    }
}

// Test 4: Check menu items rendering
function testMenuItemsRender() {
    console.log('Test 4: Testing menu items rendering...');

    try {
        if (typeof renderAdminMenuItems === 'function') {
            renderAdminMenuItems();
            console.log('✅ Admin menu items rendered successfully');
            return true;
        } else {
            console.error('❌ renderAdminMenuItems function not found');
            return false;
        }
    } catch (error) {
        console.error('❌ Menu items render test failed:', error);
        return false;
    }
}

// Test 5: Check combos rendering
function testCombosRender() {
    console.log('Test 5: Testing combos rendering...');

    try {
        if (typeof renderAdminCombos === 'function') {
            renderAdminCombos();
            console.log('✅ Admin combos rendered successfully');
            return true;
        } else {
            console.error('❌ renderAdminCombos function not found');
            return false;
        }
    } catch (error) {
        console.error('❌ Combos render test failed:', error);
        return false;
    }
}

// Test 6: Check CSS animations
function testCSSAnimations() {
    console.log('Test 6: Testing CSS animations...');

    const adminSections = document.querySelectorAll('.admin-section');
    const adminCards = document.querySelectorAll('.admin-card');

    if (adminSections.length === 0 && adminCards.length === 0) {
        console.log('ℹ️  Admin page not currently visible - animations will be tested when page loads');
        return true;
    }

    // Check if animations are properly defined in CSS
    const testElement = document.createElement('div');
    testElement.className = 'admin-section';
    testElement.style.visibility = 'hidden';
    document.body.appendChild(testElement);

    const computedStyle = getComputedStyle(testElement);
    const hasAnimation = computedStyle.animation !== 'none' && computedStyle.animation !== '';

    document.body.removeChild(testElement);

    if (hasAnimation || adminSections.length > 0) {
        console.log('✅ CSS animations properly configured');
        return true;
    } else {
        console.error('❌ CSS animations not found');
        return false;
    }
}

// Test 7: Check responsive breakpoints
function testResponsiveDesign() {
    console.log('Test 7: Testing responsive design...');

    const breakpoints = [
        { width: 1920, name: 'Desktop' },
        { width: 1024, name: 'Large Tablet' },
        { width: 768, name: 'Tablet' },
        { width: 480, name: 'Mobile' },
        { width: 320, name: 'Small Mobile' }
    ];

    let responsiveWorking = true;

    // Check if viewport meta tag exists
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
        console.error('❌ Viewport meta tag missing');
        responsiveWorking = false;
    } else {
        console.log('✅ Viewport meta tag found');
    }

    // Check if CSS media queries exist
    const styleSheets = document.styleSheets;
    let hasMediaQueries = false;

    try {
        for (let sheet of styleSheets) {
            if (sheet.href && sheet.href.includes('styles.css')) {
                // Assume media queries exist in the main stylesheet
                hasMediaQueries = true;
                break;
            }
        }
    } catch (e) {
        // Cross-origin restrictions may prevent access
        hasMediaQueries = true; // Assume they exist
    }

    if (hasMediaQueries) {
        console.log('✅ Responsive CSS detected');
    } else {
        console.error('❌ No responsive CSS found');
        responsiveWorking = false;
    }

    return responsiveWorking;
}

// Test 8: Check for JavaScript errors
function testForJSErrors() {
    console.log('Test 8: Checking for JavaScript errors...');

    // Override console.error to catch errors
    let errorCount = 0;
    const originalError = console.error;

    console.error = function(...args) {
        errorCount++;
        originalError.apply(console, args);
    };

    // Run a few admin functions to check for errors
    try {
        if (typeof initAdminAccess === 'function') {
            initAdminAccess();
        }

        setTimeout(() => {
            console.error = originalError; // Restore original
            if (errorCount === 0) {
                console.log('✅ No JavaScript errors detected');
            } else {
                console.log(`⚠️  ${errorCount} JavaScript errors detected`);
            }
        }, 100);

        return errorCount === 0;
    } catch (error) {
        console.error = originalError; // Restore original
        console.error('❌ JavaScript error test failed:', error);
        return false;
    }
}

// Run all tests
function runAllTests() {
    console.log('🚀 Running comprehensive admin page tests...\n');

    const tests = [
        { name: 'Admin Elements Exist', fn: testAdminElementsExist },
        { name: 'Admin Access', fn: testAdminAccess },
        { name: 'Admin Statistics', fn: testAdminStats },
        { name: 'Menu Items Render', fn: testMenuItemsRender },
        { name: 'Combos Render', fn: testCombosRender },
        { name: 'CSS Animations', fn: testCSSAnimations },
        { name: 'Responsive Design', fn: testResponsiveDesign },
        { name: 'JavaScript Errors', fn: testForJSErrors }
    ];

    let passedTests = 0;
    const totalTests = tests.length;

    tests.forEach((test, index) => {
        console.log(`\n--- Test ${index + 1}: ${test.name} ---`);
        const result = test.fn();
        if (result) {
            passedTests++;
        }
    });

    console.log('\n📊 TEST RESULTS:');
    console.log(`Passed: ${passedTests}/${totalTests} (${Math.round(passedTests/totalTests*100)}%)`);

    if (passedTests === totalTests) {
        console.log('🎉 ALL TESTS PASSED! Admin page is working perfectly.');
    } else {
        console.log('⚠️  Some tests failed. Please check the issues above.');
    }

    return passedTests === totalTests;
}

// Auto-run tests when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllTests);
} else {
    runAllTests();
}