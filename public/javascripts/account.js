// Account page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Format all price elements on the page
    const formatPrices = () => {
        // Format prices in product cards
        document.querySelectorAll('.card-text').forEach(priceElement => {
            const priceText = priceElement.textContent;
            if (priceText && priceText.includes('$')) {
                const price = window.priceFormatter.parse(priceText);
                if (!isNaN(price)) {
                    priceElement.textContent = window.priceFormatter.format(price);
                }
            }
        });
        
        // Format any other price elements
        document.querySelectorAll('[data-price]').forEach(element => {
            const price = parseFloat(element.dataset.price);
            if (!isNaN(price)) {
                element.textContent = window.priceFormatter.format(price);
            }
        });
    };
    
    // Initial price formatting
    formatPrices();
    // Handle profile form submission
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = {
                name: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value
            };

            fetch('/users/update-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Profile updated successfully',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });
                } else {
                    throw new Error(data.message || 'Failed to update profile');
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
        });
    }

    // Handle settings form submission
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (newPassword !== confirmPassword) {
                Swal.fire({
                    title: 'Error!',
                    text: 'New passwords do not match',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                return;
            }

            const formData = {
                currentPassword: currentPassword,
                newPassword: newPassword,
                notifications: {
                    orderUpdates: document.getElementById('orderUpdates').checked,
                    promotions: document.getElementById('promotions').checked
                }
            };

            fetch('/users/update-settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Settings updated successfully',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    // Clear password fields
                    document.getElementById('currentPassword').value = '';
                    document.getElementById('newPassword').value = '';
                    document.getElementById('confirmPassword').value = '';
                } else {
                    throw new Error(data.message || 'Failed to update settings');
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
        });
    }

    // Handle wishlist item removal
    document.querySelectorAll('.remove-from-wishlist').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            if (!productId) return;

            fetch('/users/remove-from-wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId: productId }),
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Remove the product card from the UI
                    const productCard = this.closest('.col');
                    if (productCard) {
                        productCard.remove();
                        // Check if wishlist is empty
                        const remainingItems = document.querySelectorAll('#wishlist-items .col');
                        if (remainingItems.length === 0) {
                            document.getElementById('wishlist-items').innerHTML = `
                                <div class="col-12 text-center text-muted my-4">
                                    <i class="bi bi-heart d-block mb-3" style="font-size: 2rem;"></i>
                                    Your wishlist is empty
                                </div>`;
                        }
                    }
                    Swal.fire({
                        title: 'Success!',
                        text: 'Item removed from wishlist',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });
                } else {
                    throw new Error(data.message || 'Failed to remove item from wishlist');
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
        });
    });

    // Add to cart functionality for wishlist items
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            if (productId && window.cartManager && window.cartManager.addToCart) {
                window.cartManager.addToCart(productId);
            }
        });
    });
});