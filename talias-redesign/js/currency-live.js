/**
 * Live Currency Converter
 * Updates daily with the latest exchange rates for USD and Euro
 */

document.addEventListener('DOMContentLoaded', function() {
    // Currency Converter Functionality
    const currencyLinks = document.querySelectorAll('.currency-selector a');
    const currencyToggle = document.querySelector('.currency-selector .dropdown-toggle');
    
    if (currencyLinks.length && currencyToggle) {
        // Initialize exchange rates with default values
        let exchangeRates = {
            ILS: 1,
            USD: 0.27,
            EUR: 0.25,
            GBP: 0.21
        };
        
        // Get currency from localStorage or default to ILS
        let currentCurrency = localStorage.getItem('currency') || 'ILS';
        let currentCurrencySymbol = getCurrencySymbol(currentCurrency);
        
        // Fetch live exchange rates
        fetchExchangeRates();
        
        // Update currency toggle text
        updateCurrencyToggle();
        
        // Convert prices on page load
        convertPrices(currentCurrency);
        
        currencyLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get selected currency
                const currency = this.getAttribute('data-currency');
                
                // Save to localStorage
                localStorage.setItem('currency', currency);
                
                // Update current currency
                currentCurrency = currency;
                currentCurrencySymbol = getCurrencySymbol(currency);
                
                // Update currency toggle text
                updateCurrencyToggle();
                
                // Convert prices
                convertPrices(currency);
                
                // Show notification
                showNotification(`Currency changed to ${currency}!`, 'info');
            });
        });
        
        // Fetch live exchange rates from API
        async function fetchExchangeRates() {
            try {
                // Check if we have cached rates and if they're still valid (less than 24 hours old)
                const cachedRates = JSON.parse(localStorage.getItem('exchangeRates'));
                const cachedTimestamp = localStorage.getItem('exchangeRatesTimestamp');
                
                const now = new Date().getTime();
                const oneDayInMs = 24 * 60 * 60 * 1000;
                
                // If we have valid cached rates, use them
                if (cachedRates && cachedTimestamp && (now - parseInt(cachedTimestamp) < oneDayInMs)) {
                    exchangeRates = cachedRates;
                    console.log('Using cached exchange rates');
                    convertPrices(currentCurrency); // Update prices with cached rates
                    return;
                }
                
                // Otherwise fetch new rates
                const response = await fetch('https://open.er-api.com/v6/latest/ILS');
                const data = await response.json();
                
                if (data && data.rates) {
                    // Create our exchange rates object (ILS is base currency with value 1)
                    exchangeRates = {
                        ILS: 1,
                        USD: data.rates.USD,
                        EUR: data.rates.EUR,
                        GBP: data.rates.GBP
                    };
                    
                    // Cache the rates and timestamp
                    localStorage.setItem('exchangeRates', JSON.stringify(exchangeRates));
                    localStorage.setItem('exchangeRatesTimestamp', now.toString());
                    
                    // Update prices with new rates
                    convertPrices(currentCurrency);
                    
                    console.log('Exchange rates updated:', exchangeRates);
                    showNotification('Exchange rates updated with latest values', 'success');
                }
            } catch (error) {
                console.error('Error fetching exchange rates:', error);
                // If fetch fails, we'll use the default rates
                showNotification('Using default exchange rates', 'info');
            }
        }
        
        function updateCurrencyToggle() {
            currencyToggle.innerHTML = `
                <i class="fas fa-coins"></i> ${currentCurrency} ${currentCurrencySymbol} <i class="fas fa-chevron-down"></i>
            `;
        }
        
        function convertPrices(currency) {
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
                const convertedPrice = (parseFloat(originalPrice) * exchangeRates[currency]).toFixed(2);
                
                // Update price text
                if (element.querySelector('.original-price')) {
                    // Handle sale price
                    const originalPriceElement = element.querySelector('.original-price');
                    const originalSalePrice = originalPriceElement.getAttribute('data-original-price') || originalPriceElement.textContent.replace(/[^\d.]/g, '');
                    originalPriceElement.setAttribute('data-original-price', originalSalePrice);
                    
                    const convertedSalePrice = (parseFloat(originalSalePrice) * exchangeRates[currency]).toFixed(2);
                    originalPriceElement.textContent = `${currentCurrencySymbol}${convertedSalePrice}`;
                    
                    element.innerHTML = `<span class="original-price">${currentCurrencySymbol}${convertedSalePrice}</span> ${currentCurrencySymbol}${convertedPrice}`;
                } else {
                    element.textContent = `${currentCurrencySymbol}${convertedPrice}`;
                }
            });
            
            // Update cart subtotal if visible
            const subtotalAmount = document.querySelector('.subtotal-amount');
            if (subtotalAmount) {
                const originalSubtotal = subtotalAmount.getAttribute('data-original-subtotal') || subtotalAmount.textContent.replace(/[^\d.]/g, '');
                subtotalAmount.setAttribute('data-original-subtotal', originalSubtotal);
                
                const convertedSubtotal = (parseFloat(originalSubtotal) * exchangeRates[currency]).toFixed(2);
                subtotalAmount.textContent = `${currentCurrencySymbol}${convertedSubtotal}`;
            }
        }
        
        function getCurrencySymbol(currency) {
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
    }
});
