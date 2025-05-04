document.addEventListener('DOMContentLoaded', function() {
    const filterForm = document.getElementById('filter-form');
    const sortSelect = document.getElementById('sort-select');
    const productsGrid = document.getElementById('products-grid');

    // Handle filter form submission
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            applyFilters();
        });
    }

    // Handle sort selection change
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            applyFilters();
        });
    }

    // Function to apply filters and sorting
    function applyFilters() {
        const minPrice = document.getElementById('minPrice').value;
        const maxPrice = document.getElementById('maxPrice').value;
        const rating = document.getElementById('rating').value;
        const sort = sortSelect.value;

        // Get current URL and update query parameters
        const url = new URL(window.location.href);
        if (minPrice) url.searchParams.set('minPrice', minPrice);
        if (maxPrice) url.searchParams.set('maxPrice', maxPrice);
        if (rating) url.searchParams.set('rating', rating);
        if (sort) url.searchParams.set('sort', sort);

        // Reload page with new filters
        window.location.href = url.toString();
    }

    // Handle adding items to wishlist
    document.querySelectorAll('.add-to-wishlist-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            if (!productId) return;

            fetch('/users/add-to-wishlist', {
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
                    // Toggle wishlist icon
                    const icon = this.querySelector('i');
                    icon.classList.remove('bi-heart');
                    icon.classList.add('bi-heart-fill');
                    this.classList.remove('btn-outline-primary');
                    this.classList.add('btn-primary');

                    Swal.fire({
                        title: 'Added to Wishlist!',
                        text: 'Item has been added to your wishlist',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });
                } else {
                    throw new Error(data.message || 'Failed to add item to wishlist');
                }
            })
            .catch(error => {
                if (error.message.includes('login')) {
                    // Redirect to login if user is not authenticated
                    window.location.href = '/users/login';
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: error.message,
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            });
        });
    });

    // Handle adding items to cart
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            if (productId && window.cartManager && window.cartManager.addToCart) {
                window.cartManager.addToCart(productId);
            }
        });
    });

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});