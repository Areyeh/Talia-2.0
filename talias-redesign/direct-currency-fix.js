/**
 * Direct Currency Dropdown Fix
 * This script directly modifies the DOM to fix the currency dropdown
 */

// Execute immediately when the script loads
(function() {
    console.log('Direct currency fix executing immediately');
    
    // Function to fix the currency dropdown
    function fixCurrencyDropdown() {
        console.log('Fixing currency dropdown');
        
        // Get the currency selector container
        const currencySelector = document.querySelector('.currency-selector');
        
        if (currencySelector) {
            console.log('Found currency selector, applying fix');
            
            // Create new HTML with inline styles
            const newHTML = `
                <button class="dropdown-toggle" id="currency-toggle" style="display: flex; align-items: center; gap: 5px; cursor: pointer; background: none; border: none; padding: 8px 12px;">
                    <i class="fas fa-coins"></i> <span id="current-currency">ILS ₪</span> <i class="fas fa-chevron-down"></i>
                </button>
                <div id="currency-dropdown" style="display: none; position: absolute; top: 100%; left: 0; background-color: white; border: 1px solid #e1e1e1; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); width: 150px; z-index: 9999;">
                    <a href="#" data-currency="ILS" style="display: block; padding: 8px 12px; color: #333; text-decoration: none;">ILS ₪</a>
                    <a href="#" data-currency="USD" style="display: block; padding: 8px 12px; color: #333; text-decoration: none;">USD $</a>
                    <a href="#" data-currency="EUR" style="display: block; padding: 8px 12px; color: #333; text-decoration: none;">EUR €</a>
                    <a href="#" data-currency="GBP" style="display: block; padding: 8px 12px; color: #333; text-decoration: none;">GBP £</a>
                </div>
            `;
            
            // Replace the content
            currencySelector.innerHTML = newHTML;
            currencySelector.style.position = 'relative';
            
            // Get the new elements
            const toggle = document.getElementById('currency-toggle');
            const dropdown = document.getElementById('currency-dropdown');
            
            // Add click event to toggle
            toggle.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Toggle clicked');
                
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            };
            
            // Add click events to currency options
            const currencyLinks = dropdown.querySelectorAll('a');
            currencyLinks.forEach(link => {
                link.onclick = function(e) {
                    e.preventDefault();
                    const currency = this.getAttribute('data-currency');
                    const currencyText = this.textContent;
                    console.log('Selected currency:', currency);
                    
                    // Update display
                    document.getElementById('current-currency').textContent = currencyText;
                    
                    // Update localStorage
                    localStorage.setItem('currency', currency);
                    
                    // Hide dropdown
                    dropdown.style.display = 'none';
                    
                    // Reload page to apply changes
                    location.reload();
                };
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.currency-selector')) {
                    dropdown.style.display = 'none';
                }
            });
            
            console.log('Currency dropdown fix applied successfully');
        } else {
            console.error('Currency selector not found');
        }
    }
    
    // Try to fix immediately
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(fixCurrencyDropdown, 0);
    } else {
        // Or wait for DOM to be ready
        document.addEventListener('DOMContentLoaded', fixCurrencyDropdown);
    }
    
    // Also try again after a short delay to ensure everything is loaded
    setTimeout(fixCurrencyDropdown, 500);
})();
