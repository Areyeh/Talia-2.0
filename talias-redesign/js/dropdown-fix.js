/**
 * Dropdown Menu Fix
 * This script fixes the dropdown menu functionality for the currency selector
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Dropdown fix script loaded');
    
    // Get all dropdown toggles
    const currencyToggle = document.querySelector('.currency-selector .dropdown-toggle');
    const currencyMenu = document.querySelector('.currency-selector .dropdown-menu');
    
    if (currencyToggle && currencyMenu) {
        console.log('Currency dropdown elements found');
        
        // Add click event listener to toggle
        currencyToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Currency toggle clicked');
            
            // Toggle the show class
            currencyMenu.classList.toggle('show');
        });
        
        // Add click event listeners to currency options
        const currencyLinks = document.querySelectorAll('.currency-selector .dropdown-menu a');
        currencyLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Currency option clicked:', this.getAttribute('data-currency'));
                
                // Hide the dropdown menu
                currencyMenu.classList.remove('show');
            });
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.currency-selector')) {
            if (currencyMenu && currencyMenu.classList.contains('show')) {
                currencyMenu.classList.remove('show');
            }
        }
    });
});
