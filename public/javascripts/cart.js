// Cart functionality with AJAX
// Create a global cart manager object
window.cartManager = {
    // Store the last clicked product ID to prevent duplicate clicks
    lastClickedProduct: null,
    lastClickTime: 0,
    // Debounce time in milliseconds
    DEBOUNCE_TIME: 1000
};

document.addEventListener('DOMContentLoaded', function() {
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
                        timer: 1500,
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
        fetch('/users/update-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                productId: productId,
                quantity: quantity
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Update cart count
                updateCartCount(data.cartCount);
                // Update total price
                if (data.total) {
                    const totalElement = document.getElementById('cart-total');
                    if (totalElement) {
                        totalElement.textContent = data.total;
                    }
                }
            } else {
                throw new Error(data.message || 'Failed to update cart');
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
                if (data.total) {
                    const totalElement = document.getElementById('cart-total');
                    if (totalElement) {
                        totalElement.textContent = data.total;
                    }
                }
                
                // Show success message
                Swal.fire({
                    title: 'Removed!',
                    text: 'Item removed from cart',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        })
        .catch(error => {
            console.error('Error removing item:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to remove item',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
    }

    // Function to update quantity
    function updateQuantity(productId, change) {
        const row = document.querySelector(`tr[data-product-id="${productId}"]`);
        if (!row) return;
        
        const currentQuantity = parseInt(row.querySelector('.quantity-value').textContent);
        const newQuantity = currentQuantity + change;
        
        if (newQuantity > 0) {
            updateCartItemQuantity(productId, newQuantity);
        } else if (newQuantity === 0) {
            removeFromCart(productId);
        }
    }

    // Make cart functions globally accessible
    window.cartManager.removeFromCart = removeFromCart;
    window.cartManager.updateQuantity = updateQuantity;
});