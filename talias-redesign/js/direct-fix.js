/**
 * Direct fix for currency dropdown menu
 */

// Run as soon as the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Direct currency fix loaded');
    
    // Add a simple script to directly replace the currency dropdown
    function fixCurrencyDropdown() {
        // Get the currency selector
        const currencySelector = document.querySelector('.currency-selector');
        
        if (currencySelector) {
            console.log('Found currency selector, applying fix');
            
            // Create a completely new dropdown with inline styles
            const newDropdown = document.createElement('div');
            newDropdown.className = 'currency-selector';
            newDropdown.style.position = 'relative';
            
            // Set the HTML content with inline styles
            newDropdown.innerHTML = `
                <button id="currency-btn" style="display: flex; align-items: center; gap: 5px; cursor: pointer; background: none; border: none; padding: 8px 12px;">
                    <i class="fas fa-coins"></i> <span id="current-currency">ILS ₪</span> <i class="fas fa-chevron-down"></i>
                </button>
                <div id="currency-options" style="display: none; position: absolute; top: 100%; left: 0; background-color: white; border: 1px solid #e1e1e1; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); padding: 8px 0; min-width: 150px; z-index: 9999;">
                    <a href="#" data-currency="ILS" style="display: block; padding: 8px 12px; color: #333; text-decoration: none;">ILS ₪</a>
                    <a href="#" data-currency="USD" style="display: block; padding: 8px 12px; color: #333; text-decoration: none;">USD $</a>
                    <a href="#" data-currency="EUR" style="display: block; padding: 8px 12px; color: #333; text-decoration: none;">EUR €</a>
                    <a href="#" data-currency="GBP" style="display: block; padding: 8px 12px; color: #333; text-decoration: none;">GBP £</a>
                </div>
            `;
            
            // Replace the existing dropdown with the new one
            currencySelector.parentNode.replaceChild(newDropdown, currencySelector);
            
            // Get the new elements
            const currencyBtn = document.getElementById('currency-btn');
            const currencyOptions = document.getElementById('currency-options');
            
            // Add click event to toggle button
            currencyBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Currency button clicked');
                
                // Toggle the dropdown
                if (currencyOptions.style.display === 'block') {
                    currencyOptions.style.display = 'none';
                } else {
                    currencyOptions.style.display = 'block';
                }
            });
            
            // Add click events to currency options
            const currencyLinks = currencyOptions.querySelectorAll('a');
            currencyLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const currency = this.getAttribute('data-currency');
                    const currencyText = this.textContent;
                    console.log('Selected currency:', currency);
                    
                    // Update display
                    document.getElementById('current-currency').textContent = currencyText;
                    
                    // Update localStorage
                    localStorage.setItem('currency', currency);
                    
                    // Hide dropdown
                    currencyOptions.style.display = 'none';
                    
                    // Show notification
                    alert('Currency changed to ' + currencyText);
                    
                    // Reload page to apply changes
                    location.reload();
                });
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.currency-selector')) {
                    currencyOptions.style.display = 'none';
                }
            });
            
            console.log('Currency dropdown fix applied successfully');
        } else {
            console.error('Currency selector not found');
        }
    }
    
    // Try to fix the dropdown
    setTimeout(fixCurrencyDropdown, 100);
});
