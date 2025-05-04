document.addEventListener('DOMContentLoaded', function() {
    const steps = ['shipping-step', 'payment-step', 'review-step'];
    let currentStep = 0;

    // Form validation
    function validateForm(formId) {
        const form = document.getElementById(formId);
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return false;
        }
        return true;
    }

    // Navigation between steps
    function showStep(stepIndex) {
        document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
        document.getElementById(steps[stepIndex]).classList.add('active');
        currentStep = stepIndex;
        updateOrderSummary();
    }

    // Handle shipping form submission
    document.getElementById('shipping-form').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm('shipping-form')) {
            showStep(1); // Move to payment step
        }
    });

    // Handle payment form submission
    document.getElementById('payment-form').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm('payment-form')) {
            showStep(2); // Move to review step
        }
    });

    // Handle back buttons
    document.querySelectorAll('.btn-secondary').forEach(button => {
        button.addEventListener('click', function() {
            if (currentStep > 0) {
                showStep(currentStep - 1);
            }
        });
    });

    // Handle place order button
    document.querySelector('.btn-success').addEventListener('click', function() {
        placeOrder();
    });

    // Update order summary
    function updateOrderSummary() {
        fetch('/cart/get-cart-items', {
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.items) {
                const cartItemsContainer = document.getElementById('cart-items');
                const orderItemsList = document.getElementById('order-items-list');
                
                // Update cart items in sidebar
                cartItemsContainer.innerHTML = data.items.map(item => `
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span>${item.name} x ${item.quantity}</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('');

                // Update order items in review step
                if (orderItemsList) {
                    orderItemsList.innerHTML = data.items.map(item => `
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span>${item.name} x ${item.quantity}</span>
                            <span>$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('');
                }

                // Update totals
                const subtotal = parseFloat(data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2));
                const shipping = 5.00; // Fixed shipping cost
                const total = parseFloat((subtotal + shipping).toFixed(2));

                document.querySelectorAll('.order-summary-subtotal').forEach(el => el.textContent = `$${subtotal.toFixed(2)}`);
                document.querySelectorAll('.order-summary-shipping').forEach(el => el.textContent = `$${shipping.toFixed(2)}`);
                document.querySelectorAll('.order-summary-total').forEach(el => el.textContent = `$${total.toFixed(2)}`);
            }
        })
        .catch(error => {
            console.error('Error updating order summary:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update order summary',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
    }

    // Place order function
    function placeOrder() {
        const orderData = {
            shipping: {
                fullName: document.getElementById('fullName').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                zipCode: document.getElementById('zipCode').value
            },
            payment: {
                cardNumber: document.getElementById('cardNumber').value,
                expiryDate: document.getElementById('expiryDate').value,
                cvv: document.getElementById('cvv').value,
                nameOnCard: document.getElementById('nameOnCard').value
            }
        };

        fetch('/cart/place-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Your order has been placed successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    window.location.href = '/users/orders'; // Redirect to orders page
                });
            } else {
                throw new Error(data.message || 'Failed to place order');
            }
        })
        .catch(error => {
            console.error('Error placing order:', error);
            Swal.fire({
                title: 'Error!',
                text: error.message || 'Failed to place order',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
    }

    // Initialize order summary
    updateOrderSummary();
});