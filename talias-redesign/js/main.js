/**
 * Talia's Art - Modern Website Redesign
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mini Cart Functionality
    const cartToggle = document.getElementById('cart-toggle');
    const closeCart = document.getElementById('close-cart');
    const miniCart = document.getElementById('mini-cart');
    const miniCartOverlay = document.getElementById('mini-cart-overlay');
    
    if (cartToggle && closeCart && miniCart && miniCartOverlay) {
        cartToggle.addEventListener('click', function() {
            miniCart.classList.add('open');
            miniCartOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
        
        closeCart.addEventListener('click', function() {
            miniCart.classList.remove('open');
            miniCartOverlay.classList.remove('open');
            document.body.style.overflow = '';
        });
        
        miniCartOverlay.addEventListener('click', function() {
            miniCart.classList.remove('open');
            miniCartOverlay.classList.remove('open');
            document.body.style.overflow = '';
        });
    }
    
    // Quick View Modal Functionality
    const quickViewButtons = document.querySelectorAll('.quick-view');
    const modal = document.getElementById('quick-view-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    if (quickViewButtons.length && modal && closeModal && modalOverlay) {
        quickViewButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                modal.classList.add('open');
                modalOverlay.classList.add('open');
                document.body.style.overflow = 'hidden';
            });
        });
        
        closeModal.addEventListener('click', function() {
            modal.classList.remove('open');
            modalOverlay.classList.remove('open');
            document.body.style.overflow = '';
        });
        
        modalOverlay.addEventListener('click', function() {
            modal.classList.remove('open');
            modalOverlay.classList.remove('open');
            document.body.style.overflow = '';
        });
    }
    
    // Product Thumbnail Gallery
    const thumbnails = document.querySelectorAll('.thumbnail-gallery img');
    const mainImage = document.querySelector('.main-image');
    
    if (thumbnails.length && mainImage) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Remove active class from all thumbnails
                thumbnails.forEach(thumb => thumb.classList.remove('active'));
                
                // Add active class to clicked thumbnail
                this.classList.add('active');
                
                // Update main image source
                mainImage.src = this.src;
            });
        });
    }
    
    // Product Filter Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    if (filterButtons.length && productCards.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get filter value
                const filter = this.getAttribute('data-filter');
                
                // Filter products
                if (filter === 'all') {
                    productCards.forEach(card => {
                        card.style.display = 'block';
                    });
                } else {
                    productCards.forEach(card => {
                        const category = card.querySelector('.product-category').textContent.toLowerCase();
                        
                        if (category.includes(filter)) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    }
    
    // Quantity Selector Functionality
    const minusButtons = document.querySelectorAll('.quantity-btn.minus');
    const plusButtons = document.querySelectorAll('.quantity-btn.plus');
    
    if (minusButtons.length && plusButtons.length) {
        minusButtons.forEach(button => {
            button.addEventListener('click', function() {
                const input = this.nextElementSibling;
                let value = parseInt(input.value);
                
                if (value > 1) {
                    value--;
                    input.value = value;
                }
            });
        });
        
        plusButtons.forEach(button => {
            button.addEventListener('click', function() {
                const input = this.previousElementSibling;
                let value = parseInt(input.value);
                const max = parseInt(input.getAttribute('max')) || 10;
                
                if (value < max) {
                    value++;
                    input.value = value;
                }
            });
        });
    }
    
    // Add to Cart Functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart, .add-to-cart-btn');
    const cartCount = document.querySelector('.cart-count');
    let cartItems = [];
    
    if (addToCartButtons.length && cartCount) {
        // Load cart items from localStorage if available
        if (localStorage.getItem('cartItems')) {
            cartItems = JSON.parse(localStorage.getItem('cartItems'));
            updateCartCount();
        }
        
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get product info
                let productCard;
                if (this.classList.contains('add-to-cart-btn')) {
                    // Quick view modal
                    productCard = this.closest('.product-details');
                } else {
                    // Product card
                    productCard = this.closest('.product-card');
                }
                
                const productTitle = productCard.querySelector('.product-title') ? 
                                    productCard.querySelector('.product-title').textContent : 
                                    productCard.querySelector('h2').textContent;
                
                const productPrice = productCard.querySelector('.product-price').textContent;
                
                const productImage = this.closest('.product-card') ? 
                                    this.closest('.product-card').querySelector('.product-image img').src : 
                                    document.querySelector('.main-image').src;
                
                // Create product object
                const product = {
                    id: Date.now(), // Using timestamp as a simple unique ID
                    title: productTitle,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                };
                
                // Add to cart
                cartItems.push(product);
                
                // Save to localStorage
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                
                // Update cart count
                updateCartCount();
                
                // Show mini cart
                if (miniCart && miniCartOverlay) {
                    updateMiniCartItems();
                    miniCart.classList.add('open');
                    miniCartOverlay.classList.add('open');
                    document.body.style.overflow = 'hidden';
                }
                
                // Show success message
                showNotification('Product added to cart!', 'success');
            });
        });
    }
    
    // Update Cart Count
    function updateCartCount() {
        if (cartCount) {
            cartCount.textContent = cartItems.length;
        }
    }
    
    // Update Mini Cart Items
    function updateMiniCartItems() {
        const miniCartItems = document.querySelector('.mini-cart-items');
        const emptyCartMessage = document.querySelector('.empty-cart-message');
        const subtotalAmount = document.querySelector('.subtotal-amount');
        
        if (miniCartItems && emptyCartMessage && subtotalAmount) {
            if (cartItems.length === 0) {
                // Show empty cart message
                emptyCartMessage.style.display = 'flex';
                subtotalAmount.textContent = '₪0.00';
                return;
            }
            
            // Hide empty cart message
            emptyCartMessage.style.display = 'none';
            
            // Clear mini cart items
            miniCartItems.innerHTML = '';
            
            // Calculate subtotal
            let subtotal = 0;
            
            // Add cart items
            cartItems.forEach(item => {
                // Extract price as number
                const priceText = item.price.replace(/[^\d.]/g, '');
                const price = parseFloat(priceText);
                subtotal += price * item.quantity;
                
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                cartItemElement.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="cart-item-content">
                        <h4>${item.title}</h4>
                        <div class="cart-item-price">${item.price} × ${item.quantity}</div>
                        <div class="cart-item-actions">
                            <button class="remove-item" data-id="${item.id}">Remove</button>
                        </div>
                    </div>
                `;
                
                miniCartItems.appendChild(cartItemElement);
            });
            
            // Update subtotal
            subtotalAmount.textContent = `₪${subtotal.toFixed(2)}`;
            
            // Add event listeners to remove buttons
            const removeButtons = document.querySelectorAll('.remove-item');
            removeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const itemId = parseInt(this.getAttribute('data-id'));
                    removeCartItem(itemId);
                });
            });
        }
    }
    
    // Remove Cart Item
    function removeCartItem(itemId) {
        cartItems = cartItems.filter(item => item.id !== itemId);
        
        // Save to localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Update cart count
        updateCartCount();
        
        // Update mini cart items
        updateMiniCartItems();
        
        // Show notification
        showNotification('Item removed from cart!', 'info');
    }
    
    // Show Notification
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.classList.add('notification', `notification-${type}`);
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Currency Converter Functionality
    const currencyLinks = document.querySelectorAll('.currency-selector a');
    const currencyToggle = document.querySelector('.currency-selector .dropdown-toggle');
    
    if (currencyLinks.length && currencyToggle) {
        // Exchange rates (simplified for demo)
        const exchangeRates = {
            ILS: 1,
            USD: 0.27,
            EUR: 0.25,
            GBP: 0.21
        };
        
        // Get currency from localStorage or default to ILS
        let currentCurrency = localStorage.getItem('currency') || 'ILS';
        let currentCurrencySymbol = getCurrencySymbol(currentCurrency);
        
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
        
        function updateCurrencyToggle() {
            currencyToggle.innerHTML = `
                <i class="fas fa-coins"></i> ${currentCurrency} ${currentCurrencySymbol} <i class="fas fa-chevron-down"></i>
            `;
        }
        
        function convertPrices(currency) {
            const priceElements = document.querySelectorAll('.product-price');
            
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
    
    // Language Selector Functionality
    const languageLinks = document.querySelectorAll('.language-selector a');
    const languageToggle = document.querySelector('.language-selector .dropdown-toggle');
    
    if (languageLinks.length && languageToggle) {
        // Get language from localStorage or default to English
        let currentLanguage = localStorage.getItem('language') || 'en';
        
        // Update language toggle text
        updateLanguageToggle();
        
        languageLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get selected language
                const language = this.getAttribute('data-lang');
                
                // Save to localStorage
                localStorage.setItem('language', language);
                
                // Update current language
                currentLanguage = language;
                
                // Update language toggle text
                updateLanguageToggle();
                
                // Show notification
                showNotification(`Language changed to ${getLanguageName(language)}!`, 'info');
                
                // In a real implementation, this would reload the page with the new language
                // or dynamically update the page content
                // For this demo, we'll just show a notification
                showNotification('In a real implementation, the page would be translated to ' + getLanguageName(language), 'info');
            });
        });
        
        function updateLanguageToggle() {
            languageToggle.innerHTML = `
                <i class="fas fa-globe"></i> ${getLanguageName(currentLanguage)} <i class="fas fa-chevron-down"></i>
            `;
        }
        
        function getLanguageName(code) {
            switch (code) {
                case 'en':
                    return 'English';
                case 'he':
                    return 'עברית';
                case 'es':
                    return 'Español';
                case 'fr':
                    return 'Français';
                default:
                    return 'English';
            }
        }
    }
    
    // Add CSS for notifications
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 20px;
            background-color: white;
            color: var(--text-color);
            border-radius: var(--border-radius-md);
            box-shadow: var(--shadow-md);
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
            z-index: 1000;
        }
        
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .notification-success {
            border-left: 4px solid var(--success-color);
        }
        
        .notification-error {
            border-left: 4px solid var(--error-color);
        }
        
        .notification-info {
            border-left: 4px solid var(--info-color);
        }
        
        .cart-item {
            display: flex;
            gap: var(--spacing-md);
            padding: var(--spacing-md) 0;
            border-bottom: 1px solid var(--border-color);
        }
        
        .cart-item-image {
            width: 80px;
            height: 80px;
        }
        
        .cart-item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: var(--border-radius-sm);
        }
        
        .cart-item-content {
            flex: 1;
        }
        
        .cart-item-content h4 {
            font-size: 1rem;
            margin-bottom: var(--spacing-xs);
        }
        
        .cart-item-price {
            font-size: 0.9rem;
            color: var(--light-text);
            margin-bottom: var(--spacing-xs);
        }
        
        .cart-item-actions button {
            font-size: 0.8rem;
            color: var(--error-color);
            text-decoration: underline;
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
        }
    `;
    
    document.head.appendChild(notificationStyles);
    
    // Initialize mini cart if there are items in localStorage
    if (localStorage.getItem('cartItems') && miniCart) {
        cartItems = JSON.parse(localStorage.getItem('cartItems'));
        updateCartCount();
        updateMiniCartItems();
    }
});
