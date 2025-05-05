// Cart functionality with AJAX
// Create a global cart manager object
window.cartManager = {
    // Store the last clicked product ID to prevent duplicate clicks
    lastClickedProduct: null,
    lastClickTime: 0,
    // Debounce time in milliseconds
    DEBOUNCE_TIME: 1000
    // Using global priceFormatter utility instead of duplicating code
};

document.addEventListener('DOMContentLoaded', function() {
    // Using the global priceFormatter utility
    
    // Function to format all price elements on the page
    function formatAllPrices() {
        document.querySelectorAll('.cart-item-price, .cart-item-total, .order-summary-subtotal, .order-summary-total').forEach(el => {
            const price = window.priceFormatter.parse(el.textContent);
            if (!isNaN(price)) {
                el.textContent = window.priceFormatter.format(price);
            }
        });
    }
    
    // Format prices on page load
    formatAllPrices();
    // Function to update cart count in navbar
    function updateCartCount(count) {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = count;
        }
    }
    
    // Make updateCartCount globally accessible
    window.cartManager.updateCartCount = updateCartCount;
    
    // Initialize cart count on page load
    initializeCartCount();

    // Function to add item to cart with debouncing
    function addToCart(productId) {
        const now = Date.now();
        if (productId === window.cartManager.lastClickedProduct && 
            (now - window.cartManager.lastClickTime) < window.cartManager.DEBOUNCE_TIME) {
            return; // Prevent duplicate clicks
        }
        window.cartManager.lastClickedProduct = productId;
        window.cartManager.lastClickTime = now;

        if (!productId || typeof productId !== 'string') {
            console.error('Invalid product ID:', productId);
            Swal.fire({
                title: 'Error!',
                text: 'Invalid product ID',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }
        console.log('Adding product to cart:', productId);
        fetch('/users/add-to-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId: productId.trim() }),
            credentials: 'include'
        })
        .then(response => {
            if (response.redirected) {
                // User is not logged in, redirect to login page
                window.location.href = response.url;
                return null;
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                if (data.status === 'success') {
                    // Update cart count
                    updateCartCount(data.cartCount);
                    // Show success message
                    Swal.fire({
                        title: 'Success!',
                        text: 'Item added to cart',
                        icon: 'success',
                        timer: 1000,
                        showConfirmButton: false
                    });
                } else {
                    throw new Error(data.message || 'Failed to add item to cart');
                }
            }
        })
        .catch(error => {
            console.error('Error adding to cart:', error);
            Swal.fire({
                title: 'Error!',
                text: error.message || 'Failed to add item to cart',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
    }

    // Make addToCart globally accessible
    window.cartManager.addToCart = addToCart;
    
    // Function to initialize cart count
    function initializeCartCount() {
        // Check if user is logged in by attempting to fetch cart count
        fetch('/users/get-cart-count', { credentials: 'include' })
            .then(response => {
                if (response.redirected || !response.ok) {
                    // User is not logged in or there was an error
                    updateCartCount(0);
                    return null;
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    // Set cart count to 0 if it's not available
                    const count = data.count || 0;
                    updateCartCount(count);
                }
            })
            .catch(error => {
                console.error('Error fetching cart count:', error);
                // Set cart count to 0 if there's an error
                updateCartCount(0);
            });
    }
    
    // Add click event listeners to all add-to-cart buttons
    document.addEventListener('click', function(e) {
        // Check if the clicked element or its parent has the add-to-cart-btn class
        const button = e.target.closest('.add-to-cart-btn');
        if (button) {
            const productId = button.getAttribute('data-product-id');
            if (productId) {
                addToCart(productId);
            }
        }
    });

    // Function to update cart item quantity
    function updateCartItemQuantity(productId, quantity) {
        // Update UI immediately for better user experience
        const row = document.querySelector(`tr[data-product-id="${productId}"]`);
        if (row) {
            const qtyElem = row.querySelector('.cart-item-qty, .quantity-value');
            const priceElem = row.querySelector('.cart-item-price');
            const totalElem = row.querySelector('.cart-item-total');
            
            if (qtyElem) qtyElem.textContent = quantity;
            
            // Get the current price and update total
            if (priceElem && totalElem) {
                // Use the global priceFormatter utility
                const price = window.priceFormatter.parse(priceElem.textContent);
                totalElem.textContent = window.priceFormatter.format(quantity * price);
            }
        }

        fetch('/cart/api/update-quantity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                productId: productId,
                quantity: quantity
            }),
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update cart count
                if (data.cartCount !== undefined) {
                    updateCartCount(data.cartCount);
                }
                // Update summary totals
                if (data.totalAmount !== undefined) {
                    const subtotalElement = document.querySelector('.order-summary-subtotal');
                    const totalElement = document.querySelector('.order-summary-total');
                    
                    // Format and update subtotal and total with consistent formatting
                    if (subtotalElement) subtotalElement.textContent = window.priceFormatter.format(data.totalAmount);
                    if (totalElement) totalElement.textContent = window.priceFormatter.format(data.totalAmount);
                    
                    // Reformat all prices to ensure consistency
                    formatAllPrices();
                    
                    // Update any other price elements that might be affected
                    document.querySelectorAll('.cart-item-total').forEach(el => {
                        const row = el.closest('tr');
                        if (row) {
                            const productId = row.getAttribute('data-product-id');
                            const qtyElem = row.querySelector('.quantity-value');
                            const priceElem = row.querySelector('.cart-item-price');
                            
                            if (productId && qtyElem && priceElem) {
                                const qty = parseInt(qtyElem.textContent, 10);
                                const price = window.priceFormatter.parse(priceElem.textContent);
                                    
                                el.textContent = window.priceFormatter.format(qty * price);
                            }
                        }
                    });
                }
            } else {
                // Revert UI changes if server update fails
                updateCartItemQuantity(productId, quantity - 1);
                throw new Error(data.error || 'Failed to update cart');
            }
        })
        .catch(error => {
            Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
    }

    // Function to handle + and - button clicks
    function updateQuantity(productId, change) {
        const row = document.querySelector(`tr[data-product-id="${productId}"]`);
        if (!row) return;
        const qtyElem = row.querySelector('.cart-item-qty, .quantity-value');
        let currentQty = parseInt(qtyElem ? qtyElem.textContent : '1', 10);
        let newQty = currentQty + change;
        if (newQty < 1) return; // Prevent decrement below 1
        updateCartItemQuantity(productId, newQty);
    }

    // Function to remove item from cart
    function removeFromCart(productId) {
        if (!productId) return;
        
        fetch('/users/remove-from-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId: productId }),
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Remove the item's row from the table
                const row = document.querySelector(`tr[data-product-id="${productId}"]`);
                if (row) row.remove();
                // Update cart count and total
                updateCartCount(data.cartCount);
                if (data.totalAmount !== undefined) {
                    const subtotalElement = document.querySelector('.order-summary-subtotal');
                    const totalElement = document.querySelector('.order-summary-total');
                    if (subtotalElement) {
                        subtotalElement.textContent = window.priceFormatter.format(data.totalAmount);
                    }
                    if (totalElement) {
                        totalElement.textContent = window.priceFormatter.format(data.totalAmount);
                    }
                }
                // If no more items in cart, show empty cart message and hide cart table/summary
                const remainingRows = document.querySelectorAll('tbody tr[data-product-id]');
                if (remainingRows.length === 0) {
                    const cartContainer = document.querySelector('.cart-items-container');
                    if (cartContainer) {
                        cartContainer.innerHTML = `<div class=\"text-center py-5 border rounded bg-light\"><i class=\"bi bi-cart-x text-muted\" style=\"font-size: 4rem;\"></i><h3 class=\"mt-3\">Your cart is empty</h3><p class=\"text-muted mb-4\">Looks like you haven't added any products yet.</p><a href=\"/users/view-products\" class=\"btn btn-primary\"><i class=\"bi bi-arrow-left me-2\"></i>Continue Shopping</a></div>`;
                    }
                }
            } else {
                throw new Error(data.message || 'Failed to remove item from cart');
            }
        })
        .catch(error => {
            Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
    }

    // Make cart functions globally accessible
    window.cartManager.removeFromCart = removeFromCart;
    window.cartManager.updateQuantity = updateQuantity;
});