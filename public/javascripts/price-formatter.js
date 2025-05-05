// Price formatter utility
const priceFormatter = {
    format: function(price) {
        // Ensure price is a number
        const numPrice = Number(price);
        if (isNaN(numPrice)) return '$0.00';
        // Format to 2 decimal places
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numPrice);
    },
    
    parse: function(priceString) {
        if (!priceString) return 0;
        // Remove currency symbols and non-numeric characters except decimal point
        return parseFloat(priceString.replace(/[^0-9.]/g, '')) || 0;
    }
};

// Make formatter globally accessible
window.priceFormatter = priceFormatter;

