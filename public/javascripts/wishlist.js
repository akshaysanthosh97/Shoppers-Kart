document.addEventListener('DOMContentLoaded', function() {
    // Handle removing items from wishlist
    document.querySelectorAll('.remove-from-wishlist').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            if (!productId) return;

            Swal.fire({
                title: 'Remove from Wishlist?',
                text: 'Are you sure you want to remove this item from your wishlist?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, remove it',
                cancelButtonText: 'No, keep it'
            }).then((result) => {
                if (result.isConfirmed) {
                    removeFromWishlist(productId, this);
                }
            });
        });
    });

    // Function to remove item from wishlist
    function removeFromWishlist(productId, button) {
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
                const productCard = button.closest('.col-md-3');
                if (productCard) {
                    productCard.remove();
                    // Check if wishlist is empty
                    const remainingItems = document.querySelectorAll('.product-card');
                    if (remainingItems.length === 0) {
                        const container = document.querySelector('.row');
                        if (container) {
                            container.innerHTML = `
                                <div class="col-12 text-center py-5">
                                    <div class="empty-wishlist">
                                        <i class="bi bi-heart display-1 text-muted mb-3"></i>
                                        <h3>Your wishlist is empty</h3>
                                        <p class="text-muted mb-4">Browse our products and add your favorites to the wishlist</p>
                                        <a href="/users/view-products" class="btn btn-primary">
                                            <i class="bi bi-shop me-2"></i>Browse Products
                                        </a>
                                    </div>
                                </div>`;
                        }
                    }
                }
                Swal.fire({
                    title: 'Removed!',
                    text: 'Item has been removed from your wishlist',
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
    }

    // Handle adding items to cart
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            if (productId && window.cartManager && window.cartManager.addToCart) {
                window.cartManager.addToCart(productId);
            }
        });
    });
});