document.addEventListener('DOMContentLoaded', function() {
    // Initialize category filter functionality
    initCategoryFilter();
    
    // Initialize wishlist functionality
    initWishlistFunctionality();
});

// Function to initialize category filtering
function initCategoryFilter() {
    // Create category filter container if it doesn't exist
    if (!document.getElementById('category-filter')) {
        const productsSection = document.querySelector('.products');
        if (productsSection) {
            // Create category filter HTML
            const categoryFilterHTML = `
                <div id="category-filter" class="mb-4">
                    <h5 class="mb-3">Filter by Category</h5>
                    <div class="d-flex flex-wrap gap-2">
                        <button class="btn btn-sm btn-outline-primary category-btn active" data-category="all">All</button>
                        <button class="btn btn-sm btn-outline-primary category-btn" data-category="Electronics">Electronics</button>
                        <button class="btn btn-sm btn-outline-primary category-btn" data-category="Clothing">Clothing</button>
                        <button class="btn btn-sm btn-outline-primary category-btn" data-category="Books">Books</button>
                        <button class="btn btn-sm btn-outline-primary category-btn" data-category="Home & Kitchen">Home & Kitchen</button>
                        <button class="btn btn-sm btn-outline-primary category-btn" data-category="Toys & Games">Toys & Games</button>
                    </div>
                </div>
            `;
            
            // Insert category filter before product grid
            productsSection.insertAdjacentHTML('afterbegin', categoryFilterHTML);
            
            // Add event listeners to category buttons
            document.querySelectorAll('.category-btn').forEach(button => {
                button.addEventListener('click', function() {
                    // Remove active class from all buttons
                    document.querySelectorAll('.category-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    // Get selected category
                    const category = this.getAttribute('data-category');
                    
                    // Filter products
                    filterProductsByCategory(category);
                });
            });
        }
    }
}

// Function to filter products by category
function filterProductsByCategory(category) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Get product category from data attribute or hidden field
        // If category data is not available, we'll need to add it to the product card template
        const productCategory = card.getAttribute('data-category');
        
        if (category === 'all' || !category) {
            // Show all products
            card.closest('.product-grid > *').style.display = '';
        } else if (productCategory && productCategory === category) {
            // Show products matching the category
            card.closest('.product-grid > *').style.display = '';
        } else {
            // Hide products not matching the category
            card.closest('.product-grid > *').style.display = 'none';
        }
    });
}

// Function to initialize wishlist functionality
function initWishlistFunctionality() {
    // Fetch server-side wishlist state and sync with localStorage
    fetch('/users/get-wishlist', {
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && Array.isArray(data.wishlist)) {
            // Update localStorage with server state
            localStorage.setItem('wishlistItems', JSON.stringify(data.wishlist));
            // Update UI state based on server data
            document.querySelectorAll('.add-to-wishlist-btn').forEach(button => {
                const productId = button.getAttribute('data-product-id');
                if (data.wishlist.includes(productId)) {
                    const icon = button.querySelector('i');
                    icon.classList.remove('bi-heart');
                    icon.classList.add('bi-heart-fill');
                }
            });
        }
    })
    .catch(() => {
        // Fallback to localStorage if server request fails
        const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems') || '[]');
        document.querySelectorAll('.add-to-wishlist-btn').forEach(button => {
            const productId = button.getAttribute('data-product-id');
            if (wishlistItems.includes(productId)) {
                const icon = button.querySelector('i');
                icon.classList.remove('bi-heart');
                icon.classList.add('bi-heart-fill');
            }
        });
    });

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
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // Toggle wishlist icon
                    const icon = this.querySelector('i');
                    icon.classList.remove('bi-heart');
                    icon.classList.add('bi-heart-fill');
                    // Update localStorage
                    const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems') || '[]');
                    if (!wishlistItems.includes(productId)) {
                        wishlistItems.push(productId);
                        localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
                    }
                    // Show success message
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
}