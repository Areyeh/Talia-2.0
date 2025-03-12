/**
 * Currency Converter with Live Exchange Rates
 * Updates daily with the latest exchange rates
 */

class CurrencyConverter {
    constructor() {
        // Initialize exchange rates with default values
        this.exchangeRates = {
            ILS: 1,
            USD: 0.27,
            EUR: 0.25,
            GBP: 0.21
        };
        
        // Get currency from localStorage or default to ILS
        this.currentCurrency = localStorage.getItem('currency') || 'ILS';
        this.currentCurrencySymbol = this.getCurrencySymbol(this.currentCurrency);
        
        // DOM elements
        this.currencyLinks = document.querySelectorAll('.currency-selector a');
        this.currencyToggle = document.querySelector('.currency-selector .dropdown-toggle');
        
        // Initialize
        this.init();
    }
    
    init() {
        if (!this.currencyLinks.length || !this.currencyToggle) return;
        
        // Fetch live exchange rates
        this.fetchExchangeRates();
        
        // Update currency toggle text
        this.updateCurrencyToggle();
        
        // Convert prices on page load
        this.convertPrices(this.currentCurrency);
        
        // Add event listeners
        this.addEventListeners();
    }
    
    addEventListeners() {
        this.currencyLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get selected currency
                const currency = link.getAttribute('data-currency');
                
                // Save to localStorage
                localStorage.setItem('currency', currency);
                
                // Update current currency
                this.currentCurrency = currency;
                this.currentCurrencySymbol = this.getCurrencySymbol(currency);
                
                // Update currency toggle text
                this.updateCurrencyToggle();
                
                // Convert prices
                this.convertPrices(currency);
                
                // Show notification
                this.showNotification(`Currency changed to ${currency}!`, 'info');
            });
        });
    }
    
    // Fetch live exchange rates from API
    async fetchExchangeRates() {
        try {
            // Check if we have cached rates and if they're still valid (less than 24 hours old)
            const cachedRates = JSON.parse(localStorage.getItem('exchangeRates'));
            const cachedTimestamp = localStorage.getItem('exchangeRatesTimestamp');
            
            const now = new Date().getTime();
            const oneDayInMs = 24 * 60 * 60 * 1000;
            
            // If we have valid cached rates, use them
            if (cachedRates && cachedTimestamp && (now - cachedTimestamp < oneDayInMs)) {
                this.exchangeRates = cachedRates;
                console.log('Using cached exchange rates');
                this.convertPrices(this.currentCurrency); // Update prices with cached rates
                return;
            }
            
            // Otherwise fetch new rates
            const response = await fetch('https://open.er-api.com/v6/latest/ILS');
            const data = await response.json();
            
            if (data && data.rates) {
                // Create our exchange rates object (ILS is base currency with value 1)
                this.exchangeRates = {
                    ILS: 1,
                    USD: data.rates.USD,
                    EUR: data.rates.EUR,
                    GBP: data.rates.GBP
                };
                
                // Cache the rates and timestamp
                localStorage.setItem('exchangeRates', JSON.stringify(this.exchangeRates));
                localStorage.setItem('exchangeRatesTimestamp', now.toString());
                
                // Update prices with new rates
                this.convertPrices(this.currentCurrency);
                
                console.log('Exchange rates updated:', this.exchangeRates);
                this.showNotification('Exchange rates updated with latest values', 'success');
            }
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
            // If fetch fails, we'll use the default rates
            this.showNotification('Using default exchange rates', 'info');
        }
    }
    
    updateCurrencyToggle() {
        this.currencyToggle.innerHTML = `
            <i class="fas fa-coins"></i> ${this.currentCurrency} ${this.currentCurrencySymbol} <i class="fas fa-chevron-down"></i>
        `;
    }
    
    convertPrices(currency) {
        const priceElements = document.querySelectorAll('.product-price, .cart-item-price, .order-item-price, .subtotal-amount, .cart-summary-row span:last-child, .cart-total span:last-child, .order-summary-row span:last-child, .order-total span:last-child');
        
        priceElements.forEach(element => {
            // Get original price in ILS
            let originalPrice = element.getAttribute('data-original-price');
            
            if (!originalPrice) {
                // Store original price if not already stored
                originalPrice = element.textContent.replace(/[^\d.]/g, '');
                element.setAttribute('data-original-price', originalPrice);
            }
            
            // Convert price
            const convertedPrice = (parseFloat(originalPrice) * this.exchangeRates[currency]).toFixed(2);
            
            // Update price text
            if (element.querySelector('.original-price')) {
                // Handle sale price
                const originalPriceElement = element.querySelector('.original-price');
                const originalSalePrice = originalPriceElement.getAttribute('data-original-price') || originalPriceElement.textContent.replace(/[^\d.]/g, '');
                originalPriceElement.setAttribute('data-original-price', originalSalePrice);
                
                const convertedSalePrice = (parseFloat(originalSalePrice) * this.exchangeRates[currency]).toFixed(2);
                originalPriceElement.textContent = `${this.currentCurrencySymbol}${convertedSalePrice}`;
                
                element.innerHTML = `<span class="original-price">${this.currentCurrencySymbol}${convertedSalePrice}</span> ${this.currentCurrencySymbol}${convertedPrice}`;
            } else {
                element.textContent = `${this.currentCurrencySymbol}${convertedPrice}`;
            }
        });
        
        // Update cart subtotal if visible
        const subtotalAmount = document.querySelector('.subtotal-amount');
        if (subtotalAmount) {
            const originalSubtotal = subtotalAmount.getAttribute('data-original-subtotal') || subtotalAmount.textContent.replace(/[^\d.]/g, '');
            subtotalAmount.setAttribute('data-original-subtotal', originalSubtotal);
            
            const convertedSubtotal = (parseFloat(originalSubtotal) * this.exchangeRates[currency]).toFixed(2);
            subtotalAmount.textContent = `${this.currentCurrencySymbol}${convertedSubtotal}`;
        }
    }
    
    getCurrencySymbol(currency) {
        switch (currency) {
            case 'ILS':
                return '₪';
            case 'USD':
                return '$';
            case 'EUR':
                return '€';
            case 'GBP':
                return '£';
            default:
                return '₪';
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <p>${message}</p>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            
            // Remove from DOM after animation
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize currency converter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CurrencyConverter();
});
