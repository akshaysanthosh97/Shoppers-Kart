// Price formatting utility function
const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price);
};

// Export the function for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { formatPrice };
} else {
    // For browser environment
    window.utils = window.utils || {};
    window.utils.formatPrice = formatPrice;
}