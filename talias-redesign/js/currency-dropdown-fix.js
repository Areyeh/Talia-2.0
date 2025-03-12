/**
 * Direct Currency Dropdown Fix
 * This script completely replaces the existing dropdown with a new implementation
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Direct currency dropdown fix loaded');
    
    // Get the currency selector container
    const currencySelector = document.querySelector('.currency-selector');
    
    if (currencySelector) {
        console.log('Currency selector found, replacing with new implementation');
        
        // Create the new dropdown HTML
        const newDropdownHTML = `
            <button class="dropdown-toggle" id="currency-toggle">
                <i class="fas fa-coins"></i> <span id="current-currency">ILS ₪</span> <i class="fas fa-chevron-down"></i>
            </button>
            <div class="currency-dropdown" id="currency-dropdown" style="display: none; position: absolute; top: 100%; left: 0; background-color: white; border: 1px solid #e1e1e1; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); padding: 8px 0; min-width: 150px; z-index: 9999;">
                <a href="#" data-currency="ILS" style="display: block; padding: 8px 12px; color: #333; text-decoration: none;">ILS ₪</a>
                <a href="#" data-currency="USD" style="display: block; padding: 8px 12px; color: #333; text-decoration: none;">USD $</a>
                <a href="#" data-currency="EUR" style="display: block; padding: 8px 12px; color: #333; text-decoration: none;">EUR €</a>
                <a href="#" data-currency="GBP" style="display: block; padding: 8px 12px; color: #333; text-decoration: none;">GBP £</a>
            </div>
        `;
        
        // Replace the existing content
        currencySelector.innerHTML = newDropdownHTML;
        
        // Get the new elements
        const currencyToggle = document.getElementById('currency-toggle');
        const currencyDropdown = document.getElementById('currency-dropdown');
        const currentCurrencySpan = document.getElementById('current-currency');
        const currencyLinks = currencyDropdown.querySelectorAll('a');
        
        // Toggle dropdown on click
        currencyToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Currency toggle clicked');
            
            if (currencyDropdown.style.display === 'block') {
                currencyDropdown.style.display = 'none';
            } else {
                currencyDropdown.style.display = 'block';
            }
        });
        
        // Handle currency selection
        currencyLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const currency = this.getAttribute('data-currency');
                const currencyText = this.textContent;
                console.log('Selected currency:', currency);
                
                // Update current currency display
                currentCurrencySpan.textContent = currencyText;
                
                // Hide dropdown
                currencyDropdown.style.display = 'none';
                
                // Trigger currency change event for currency-live.js
                const event = new CustomEvent('currencyChange', { 
                    detail: { currency: currency } 
                });
                document.dispatchEvent(event);
                
                // Also update localStorage for compatibility with existing code
                localStorage.setItem('currency', currency);
                
                // Show notification
                showNotification('Currency changed to ' + currencyText, 'info');
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.currency-selector')) {
                currencyDropdown.style.display = 'none';
            }
        });
        
        // Simple notification function
        function showNotification(message, type = 'info') {
            console.log('Notification:', message);
            
            // Create notification element
            const notification = document.createElement('div');
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.right = '20px';
            notification.style.backgroundColor = type === 'info' ? '#3498db' : '#2ecc71';
            notification.style.color = 'white';
            notification.style.padding = '12px 20px';
            notification.style.borderRadius = '4px';
            notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            notification.style.zIndex = '10000';
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            notification.textContent = message;
            
            // Add to body
            document.body.appendChild(notification);
            
            // Show notification
            setTimeout(() => {
                notification.style.opacity = '1';
            }, 10);
            
            // Remove notification after 3 seconds
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        }
    }
});
