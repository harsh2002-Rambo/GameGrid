// Product data
const products = [
    {
        id: 1,
        title: "RGB Gaming Keyboard",
        description: "Mechanical keyboard with customizable RGB lighting and anti-ghosting technology",
        price: 149.99,
        image: "⌨️",
        rating: 4.8,
        category: "keyboard"
    },
    {
        id: 2,
        title: "Pro Gaming Mouse",
        description: "High-precision gaming mouse with 16000 DPI and programmable buttons",
        price: 89.99,
        image: "🖱️",
        rating: 4.9,
        category: "mouse"
    },
    {
        id: 3,
        title: "Gaming Headset",
        description: "7.1 Surround Sound Gaming Headset with noise-canceling microphone",
        price: 199.99,
        image: "🎧",
        rating: 4.7,
        category: "audio"
    },
    {
        id: 4,
        title: "Gaming Monitor 27\"",
        description: "144Hz QHD Gaming Monitor with 1ms response time and G-Sync",
        price: 449.99,
        image: "🖥️",
        rating: 4.8,
        category: "monitor"
    },
    {
        id: 5,
        title: "Gaming Chair",
        description: "Ergonomic RGB gaming chair with lumbar support and adjustable height",
        price: 299.99,
        image: "🪑",
        rating: 4.6,
        category: "furniture"
    },
    {
        id: 6,
        title: "Mechanical Switches",
        description: "Premium mechanical switches for custom keyboard builds",
        price: 49.99,
        image: "🔧",
        rating: 4.9,
        category: "accessories"
    },
    {
        id: 7,
        title: "Gaming Mousepad XXL",
        description: "Extended RGB gaming mousepad with smooth surface and LED lighting",
        price: 39.99,
        image: "📱",
        rating: 4.5,
        category: "accessories"
    },
    {
        id: 8,
        title: "Webcam 4K",
        description: "4K streaming webcam with auto-focus and built-in microphone",
        price: 129.99,
        image: "📹",
        rating: 4.7,
        category: "streaming"
    },
    {
        id: 9,
        title: "Gaming Controller",
        description: "Wireless gaming controller with haptic feedback and RGB lighting",
        price: 79.99,
        image: "🎮",
        rating: 4.8,
        category: "controller"
    },
    {
        id: 10,
        title: "Graphics Card RTX 4090",
        description: "High-end graphics card for 4K gaming and ray tracing",
        price: 1599.99,
        image: "💾",
        rating: 5.0,
        category: "hardware"
    },
    {
        id: 11,
        title: "Gaming Laptop Cooling fan",
        description: "RGB cooling pad with 6 fans for optimal laptop temperature",
        price: 69.99,
        image: "🌀",
        rating: 4.4,
        category: "cooling"
    },
    {
        id: 12,
        title: "PS5",
        description: "Discover and play games.",
        price: 29.99,
        image: "💡",
        rating: 4.6,
        category: "lighting"
    }
];

// Cart state
let cart = JSON.parse(localStorage.getItem('gamezone_cart')) || [];
let isCartView = false;
let currentFilter = 'all';

// Initialize the page
function init() {
    // Only render products if we're on the products page
    if (document.getElementById('productsGrid')) {
        renderProducts();
        setupFilterButtons();
    }
    updateCartCount();
    setupNavigation();
}

// Setup navigation for smooth scrolling on same page
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Handle anchor links on the same page
            if (href.includes('#') && href.includes(window.location.pathname.split('/').pop())) {
                e.preventDefault();
                
                // If we're in cart view, switch back to main page first
                if (isCartView) {
                    toggleCart();
                }
                
                // Then scroll to the target section
                setTimeout(() => {
                    const targetId = href.split('#')[1];
                    const target = document.getElementById(targetId);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 100);
            }
        });
    });
}

// Setup filter buttons
function setupFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('mouseover', function() {
            if (!this.classList.contains('active')) {
                this.style.background = 'linear-gradient(45deg, #ff0080, #0080ff)';
            }
        });
        
        btn.addEventListener('mouseout', function() {
            if (!this.classList.contains('active')) {
                this.style.background = 'rgba(255, 255, 255, 0.1)';
            }
        });
    });
}

// Filter products by category
function filterProducts(category) {
    currentFilter = category;
    
    // Update active filter button
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = 'rgba(255, 255, 255, 0.1)';
    });
    
    event.target.classList.add('active');
    event.target.style.background = 'linear-gradient(45deg, #ff0080, #0080ff)';
    
    renderProducts();
}

// Render products to the grid
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';

    const filteredProducts = currentFilter === 'all' 
        ? products 
        : products.filter(product => product.category === currentFilter);

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: rgba(255, 255, 255, 0.6);">
                <h3>No products found in this category</h3>
                <p>Try selecting a different category</p>
            </div>
        `;
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create individual product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image" data-icon="${product.image}"></div>
        <h3 class="product-title">${product.title}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-price">$${product.price}</div>
        <div class="product-rating">
            <span class="stars">${generateStars(product.rating)}</span>
            <span>(${product.rating})</span>
        </div>
        <button class="add-to-cart" onclick="addToCart(event, ${product.id})">
            Add to Cart
        </button>
    `;
    return card;
}

// Generate star rating display
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '⭐';
    }
    
    if (hasHalfStar) {
        stars += '⭐';
    }
    
    return stars;
}

// Add product to cart
function addToCart(event, productId) { // Add 'event' as a parameter
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    showSuccessPopup();

    // --- NEW: Data Layer Push for GTM ---
    window.dataLayer = window.dataLayer || []; // Ensure dataLayer is initialized
    dataLayer.push({
        event: 'add_to_cart_custom', // Your custom event name
        ecommerce: { // GA4 recommended e-commerce schema
            items: [{
                item_id: product.id.toString(),
                item_name: product.title,
                item_category: product.category,
                price: product.price,
                quantity: existingItem ? existingItem.quantity : 1 // Send the new quantity
            }]
        }
    });
    console.log('dataLayer push for add_to_cart_custom:', { product: product.title, quantity: existingItem ? existingItem.quantity : 1 }); // For debugging


    // Add loading animation to button
    const button = event.target; // Now 'event' is defined!
    const originalText = button.textContent;
    button.innerHTML = '<span class="loading"></span> Adding...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 1000);
}
// Save cart to localStorage
function saveCart() {
    localStorage.setItem('gamezone_cart', JSON.stringify(cart));
}

// Update cart count display
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Toggle between main page and cart view
function toggleCart() {
    const mainPage = document.getElementById('mainPage');
    const cartPage = document.getElementById('cartPage');
    
    isCartView = !isCartView;
    
    if (isCartView) {
        mainPage.classList.add('hidden');
        cartPage.classList.add('active');
        renderCart();
    } else {
        mainPage.classList.remove('hidden');
        cartPage.classList.remove('active');
    }
}

// Render cart page
function renderCart() {
    const cartContent = document.getElementById('cartContent');
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add some amazing gaming gear to get started!</p>
                <a href="products.html" style="display: inline-block; margin-top: 1rem; background: linear-gradient(45deg, #ff0080, #0080ff); padding: 1rem 2rem; border-radius: 25px; color: white; text-decoration: none; font-weight: bold;">
                    Browse Products
                </a>
            </div>
        `;
        return;
    }

    const cartItemsHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.image}</div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">$${item.price}</div>
            </div>
            <div class="quantity-controls">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 100 ? 0 : 9.99;
    const total = subtotal + tax + shipping;

    cartContent.innerHTML = `
        <div class="cart-items">
            ${cartItemsHTML}
        </div>
        
        <div class="cart-summary">
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Tax:</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping:</span>
                <span>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <button class="checkout-btn" onclick="checkout()">
                Proceed to Checkout
            </button>
        </div>
    `;
}

// Update item quantity in cart
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCart();
    updateCartCount();
    renderCart();
}

// Remove item from cart
// Remove item from cart
function removeFromCart(productId) {
    const itemToRemove = cart.find(item => item.id === productId); // Get item before filtering
    if (!itemToRemove) return;

    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();

    // --- NEW: Data Layer Push for remove_from_cart ---
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
        event: 'remove_from_cart_custom',
        ecommerce: {
            items: [{
                item_id: itemToRemove.id.toString(),
                item_name: itemToRemove.title,
                item_category: itemToRemove.category,
                price: itemToRemove.price,
                quantity: itemToRemove.quantity // Quantity being removed
            }]
        }
    });
    console.log('dataLayer push for remove_from_cart_custom:', itemToRemove.title); // For debugging
}

// Show success popup
function showSuccessPopup() {
    const popup = document.getElementById('successPopup');
    if (popup) {
        popup.classList.add('show');
        
        setTimeout(() => {
            popup.classList.remove('show');
        }, 2000);
    }
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Capture cart items *before* they are cleared for the purchase event.
    // This is crucial to send the correct items and quantities that were just purchased.
    const purchasedItems = [...cart]; // Create a copy of the current cart

    // --- NEW: Data Layer Push for initiate_checkout event ---
    // (This event fires when they START the checkout process)
    window.dataLayer = window.dataLayer || []; // Ensure dataLayer is initialized
    dataLayer.push({
        event: 'initiate_checkout_custom', // Your custom event name for beginning checkout
        ecommerce: {
            items: purchasedItems.map(item => ({ // Use the copied items for initiate_checkout
                item_id: item.id.toString(),
                item_name: item.title,
                item_category: item.category,
                price: item.price,
                quantity: item.quantity
            }))
        }
    });
    console.log('dataLayer push for initiate_checkout_custom with cart items.'); // For debugging


    // Simulate checkout process (UI update and delay)
    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.innerHTML = '<span class="loading"></span> Processing...';
    checkoutBtn.disabled = true;

    // This setTimeout simulates the time it takes for a purchase to complete
    setTimeout(() => {
        alert('🎉 Order placed successfully! Thank you for shopping with GameZone!');

        // --- NEW: Data Layer Push for purchase_complete_custom event ---
        // (This event fires when the purchase is confirmed)

        // Calculate total values *before* pushing to dataLayer for purchase
        const transactionId = 'T' + Date.now(); // Generate a unique transaction ID
        const subtotal = purchasedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = (subtotal * 0.08).toFixed(2); // Example 8% tax
        const shipping = (subtotal > 100 ? 0 : 9.99).toFixed(2); // Example free shipping over $100
        const totalValue = (parseFloat(subtotal) + parseFloat(tax) + parseFloat(shipping)).toFixed(2); // Final total value

        dataLayer.push({
            event: 'purchase_complete_custom', // Your custom event name for purchase
            ecommerce: {
                transaction_id: transactionId,         // Unique transaction ID
                value: parseFloat(totalValue),         // Total value of the purchase (as a number)
                tax: parseFloat(tax),                  // Tax amount (as a number)
                shipping: parseFloat(shipping),        // Shipping cost (as a number)
                currency: 'USD',                       // Currency (adjust if needed)
                items: purchasedItems.map(item => ({   // <--- Crucial: The 'items' array for purchased products
                    item_id: item.id.toString(),
                    item_name: item.title,
                    item_category: item.category,
                    price: item.price,
                    quantity: item.quantity            // <--- IMPORTANT: Quantity of each item
                }))
            }
        });
        console.log('dataLayer push for purchase_complete_custom:', transactionId, 'Total:', totalValue, 'Items:', purchasedItems.length); // For debugging

        // --- Post-purchase actions: Clear cart and update UI ---
        cart = []; // Clear the cart *after* the purchase event has been pushed
        saveCart();
        updateCartCount();
        renderCart();

        checkoutBtn.textContent = 'Proceed to Checkout';
        checkoutBtn.disabled = false;
    }, 3000); // Simulate 3-second processing time
}
document.addEventListener('DOMContentLoaded', () => {
    // --- Debugging Step 1: Confirm script loading and DOM readiness ---
    const navLinks = document.querySelectorAll('.nav-links a'); // Selects all <a> tags within elements that have the class 'nav-links'

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // IMPORTANT: Consider if you need to prevent default navigation briefly.
            // If the page changes too quickly, the dataLayer push might not complete.
            // For this assignment, it's often safer to preventDefault, push, then navigate.
            // For now, let's just push directly.
            // event.preventDefault(); // Uncomment this if you face issues with data not being sent

            window.dataLayer = window.dataLayer || []; // Ensures dataLayer exists
            window.dataLayer.push({
                'event': 'custom_nav_link_click', // This is the EXACT custom event name GTM will listen for
                'link_text': this.innerText,       // The visible text of the clicked link (e.g., "Home", "Products")
                'link_url': this.href,             // The full URL the link points to
                'link_target': this.target || '_self' // e.g., "_blank" if it opens in new tab, or "_self"
            });

            console.log('dataLayer push for custom_nav_link_click event sent:', {
                'event': 'custom_nav_link_click',
                'link_text': this.innerText,
                'link_url': this.href,
                'link_target': this.target || '_self'
            });

            // If event.preventDefault() was used above, you'd navigate here after a small delay:
            // setTimeout(() => {
            //     window.location.href = this.href;
            // }, 100);
        });
    });
    console.log('script.js: DOMContentLoaded fired. Script is running.');

    const contactForm = document.querySelector('.contact-form form');

    if (contactForm) {
        // --- Debugging Step 2: Confirm form element is found ---
        console.log('script.js: Contact form element found successfully.');

        // Ensure contactForm is defined earlier in your script, e.g.:
// const contactForm = document.querySelector('.contact-form form');
// if (contactForm) { ... } // Your existing check for contactForm

contactForm.addEventListener('submit', function(event) {
    // --- Debugging Step 3: Confirm form submission event is detected ---
    console.log('script.js: Form submission event detected!');

    event.preventDefault(); // Prevent the default form submission (stops page reload)

    // Get input values using their new IDs for more reliability
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const messageInput = document.getElementById('userMessage');
    const ageInput = document.getElementById('userAge');
    const ratingInput = document.getElementById('userRating');
    const purchasesInput = document.getElementById('userPurchases');

    // --- Debugging Step 4: Check if all input elements were actually found ---
    if (!nameInput || !emailInput || !messageInput || !ageInput || !ratingInput || !purchasesInput) {
        console.error('script.js: ERROR: One or more form input elements not found by ID. Check your HTML IDs!');
        alert('An internal error occurred. Please try again later.');
        return; // Stop execution if elements are missing
    }

    const name = nameInput.value;
    const email = emailInput.value;
    const message = messageInput.value; // CORRECTED: Changed from messageInput.Input to messageInput.value
    const age = ageInput.value;
    const rating = ratingInput.value;
    const purchases = purchasesInput.value;

    // --- Debugging Step 5: Log all captured form data ---
    console.log('script.js: Captured form data:', {
        name: name,
        email: email,
        message: message,
        age: age,
        rating: rating,
        purchases: purchases
    });

    // --- NEW: Data Layer Push for GTM ---
    // Ensure dataLayer is initialized before pushing to it
    window.dataLayer = window.dataLayer || []; 
    dataLayer.push({
        event: 'contact_form_submit_custom', // This is the custom event name GTM will listen for
        form_name: 'contact_us_form',      // A static identifier for this specific form
        user_name: name,                   // User's name from the form
        user_email: email,                 // User's email from the form (CAUTION: PII)
        user_age: parseInt(age),           // User's age (converted to a number for metrics)
        user_rating: parseInt(rating),     // User's rating (converted to a number for metrics)
        num_purchases: parseInt(purchases) // Number of purchases (converted to a number for metrics)
    });
    console.log('dataLayer push for contact_form_submit_custom event sent to Data Layer.');

    // --- Final Action: Show alert and reset form ---
    // A small delay to ensure Data Layer push registers before alert/reset
    setTimeout(() => {
        alert('Thank you for your message! We will get back to you soon.');
        console.log('script.js: Alert message displayed.');
        contactForm.reset(); // Clear form fields
        console.log('script.js: Form fields reset.');
    }, 50); 
});
    } else {
        // --- Debugging Step 2 Failure: Form element not found ---
        console.error('script.js: ERROR: Contact form element NOT found. Selector: ".contact-form form". Please verify your HTML structure and class names.');
    }
});
// Initialize the website
document.addEventListener('DOMContentLoaded', init);
