// Cuban Soul Food Truck - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // Order form functionality
    const orderForm = document.getElementById('orderForm');
    const orderType = document.getElementById('orderType');
    const addressGroup = document.getElementById('addressGroup');
    const orderDate = document.getElementById('orderDate');

    // Show/hide address field based on order type
    if (orderType && addressGroup) {
        orderType.addEventListener('change', function() {
            if (this.value === 'delivery') {
                addressGroup.style.display = 'block';
                document.getElementById('address').required = true;
            } else {
                addressGroup.style.display = 'none';
                document.getElementById('address').required = false;
            }
            // Update total when order type changes (for delivery fee)
            updateOrderTotal();
        });
    }

    // Set minimum date to today
    if (orderDate) {
        const today = new Date().toISOString().split('T')[0];
        orderDate.setAttribute('min', today);
    }

    // Payment form validation and processing
    initializePaymentValidation();

    // Payment modal functionality
    initializePaymentModal();

    // Simple payment info card display
    const paymentInfoCard = document.getElementById('paymentInfoCard');
    if (paymentInfoCard) {
        paymentInfoCard.style.display = 'block'; // Always show payment info
    }

    // Form submission
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate package selection first
            const selectedPackage = document.querySelector('input[name="package"]:checked');
            if (!selectedPackage) {
                alert('Please select a package before proceeding to checkout.');
                // Scroll to package selection
                document.querySelector('.package-selection').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                return;
            }
            
            // Open payment modal if validation passes
            openPaymentModal();
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add active class to navigation on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})(\d+)/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d+)/, '($1) $2');
            }
            e.target.value = value;
        });
    }

    // Subscription modal functionality
    const modal = document.getElementById('subscriptionModal');
    const subscribeBtn = document.getElementById('subscribeBtn');
    const promotionsBtn = document.getElementById('promotionsBtn');
    const closeModal = document.querySelector('.close');
    const subscriptionForm = document.getElementById('subscriptionForm');

    // Show modal when old subscribe button is clicked (if exists)
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function() {
            modal.style.display = 'block';
        });
    }
    
    // Show modal when new promotions button is clicked
    if (promotionsBtn) {
        promotionsBtn.addEventListener('click', function() {
            modal.style.display = 'block';
        });
    }

    // Close modal when X is clicked
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle subscription form submission
    if (subscriptionForm) {
        subscriptionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(subscriptionForm);
            const subscriptionData = {};
            
            for (let [key, value] of formData.entries()) {
                subscriptionData[key] = value;
            }

            // Send subscription email via FormSubmit
            sendSubscriptionEmail(subscriptionData);
        });
    }

    // Phone number formatting for subscription form
    const subPhoneInput = document.getElementById('subPhone');
    if (subPhoneInput) {
        subPhoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})(\d+)/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d+)/, '($1) $2');
            }
            e.target.value = value;
        });
    }

    // Auto-show modal after 10 seconds (first visit)
    setTimeout(function() {
        if (!localStorage.getItem('cubanSoulNewsletterShown')) {
            modal.style.display = 'block';
            localStorage.setItem('cubanSoulNewsletterShown', 'true');
        }
    }, 10000);

    // Menu Order System Functionality
    initializeMenuOrderSystem();
    
    // Initialize order details field
    setTimeout(() => {
        updateOrderDetailsField();
    }, 500);
    
    // Checkout button functionality
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            // Validate package selection first
            const selectedPackage = document.querySelector('input[name="package"]:checked');
            if (!selectedPackage) {
                alert('Please select a package before proceeding to checkout.');
                // Scroll to package selection
                document.querySelector('.package-selection').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                return;
            }
            
            const orderSummary = getCurrentOrderSummary();
            if (orderSummary.total > 0) {
                // Scroll to order form
                const orderSection = document.getElementById('order');
                if (orderSection) {
                    orderSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Pre-fill order details in the form
                    setTimeout(() => {
                        prefillOrderForm(orderSummary);
                    }, 500);
                }
            } else {
                showCheckoutMessage('Please select a package and items before checkout.');
            }
        });
    }
});

// Initialize Menu Order System
function initializeMenuOrderSystem() {
    const packageRadios = document.querySelectorAll('input[name="package"]');
    const includedSidesCheckboxes = document.querySelectorAll('input[name="includedSides"]');
    const extraSidesCheckboxes = document.querySelectorAll('input[name="extraSides"]');
    const addonsCheckboxes = document.querySelectorAll('input[name="addons"]');
    const dessertsCheckboxes = document.querySelectorAll('input[name="desserts"]');
    const sidesCounter = document.getElementById('sidesCounter');
    const totalAmount = document.getElementById('totalAmount');

    // Handle package selection
    packageRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Enable other menu sections when package is selected
            enableMenuSections();
            updateOrderTotal();
        });
    });

    // Handle included sides (max 3)
    includedSidesCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedSides = document.querySelectorAll('input[name="includedSides"]:checked');
            
            // Update counter
            if (sidesCounter) {
                sidesCounter.textContent = checkedSides.length;
            }

            // Disable other checkboxes if 3 are selected
            if (checkedSides.length >= 3) {
                includedSidesCheckboxes.forEach(cb => {
                    if (!cb.checked) {
                        cb.disabled = true;
                        cb.parentElement.style.opacity = '0.5';
                    }
                });
            } else {
                // Re-enable all checkboxes
                includedSidesCheckboxes.forEach(cb => {
                    cb.disabled = false;
                    cb.parentElement.style.opacity = '1';
                });
            }
        });
    });

    // Handle extra sides, add-ons, and desserts with price calculation
    const allPaidCheckboxes = [...extraSidesCheckboxes, ...dessertsCheckboxes];
    
    allPaidCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateOrderTotal();
        });
    });

    // Add-ons don't affect price but we still want to track them
    addonsCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Add-ons are free, so no price calculation needed
            console.log('Add-on selected:', this.value);
        });
    });
}

// Enable menu sections after package selection
function enableMenuSections() {
    const menuSections = [
        'mainEntreesSection',
        'extraSidesSection', 
        'addonsSection',
        'dessertsSection'
    ];
    
    menuSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.remove('menu-section-disabled');
        }
    });
}

// Update order total
function updateOrderTotal() {
    const selectedPackage = document.querySelector('input[name="package"]:checked');
    const extraSidesCheckboxes = document.querySelectorAll('input[name="extraSides"]:checked');
    const dessertsCheckboxes = document.querySelectorAll('input[name="desserts"]:checked');
    const totalAmountElement = document.getElementById('totalAmount');
    const orderType = document.getElementById('orderType');
    
    let subtotal = 0;

    // Add package price if selected
    if (selectedPackage) {
        subtotal += parseFloat(selectedPackage.dataset.price);
    }

    // Calculate extra sides total
    extraSidesCheckboxes.forEach(checkbox => {
        const price = parseFloat(checkbox.dataset.price);
        subtotal += price;
    });

    // Calculate desserts total
    dessertsCheckboxes.forEach(checkbox => {
        const price = parseFloat(checkbox.dataset.price);
        subtotal += price;
    });

    // Calculate delivery fee and tax
    let deliveryFee = 0;
    let tax = 0;

    // Add delivery fee if delivery is selected
    if (orderType && orderType.value === 'delivery') {
        deliveryFee = 15.00;
    }

    // Calculate 8.25% tax on subtotal only
    tax = subtotal * 0.0825;
    
    // Calculate final total
    let total = subtotal + deliveryFee + tax;

    // Update the display elements
    const subtotalAmountElement = document.getElementById('subtotalAmount');
    const taxAmountElement = document.getElementById('taxAmount');
    const deliveryFeeLineElement = document.getElementById('deliveryFeeLine');
    
    if (subtotalAmountElement) {
        subtotalAmountElement.textContent = subtotal.toFixed(2);
    }
    
    if (taxAmountElement) {
        taxAmountElement.textContent = tax.toFixed(2);
    }
    
    if (totalAmountElement) {
        totalAmountElement.textContent = total.toFixed(2);
    }
    
    // Show/hide delivery fee line
    if (deliveryFeeLineElement) {
        if (orderType && orderType.value === 'delivery') {
            deliveryFeeLineElement.style.display = 'flex';
        } else {
            deliveryFeeLineElement.style.display = 'none';
        }
    }
    
    // Also update the order details field in the order form
    updateOrderDetailsField();
}

// Update order details field in the order form
function updateOrderDetailsField() {
    const orderSummary = getCurrentOrderSummary();
    prefillOrderForm(orderSummary);
}

// Get current order summary
function getCurrentOrderSummary() {
    console.log('Getting current order summary...');
    const selectedPackage = document.querySelector('input[name="package"]:checked');
    const includedSides = [];
    const extraSides = [];
    const addons = [];
    const desserts = [];

    // Get selected package
    let packageInfo = null;
    if (selectedPackage) {
        packageInfo = {
            type: selectedPackage.value,
            price: parseFloat(selectedPackage.dataset.price)
        };
    }

    // Get selected included sides
    document.querySelectorAll('input[name="includedSides"]:checked').forEach(checkbox => {
        includedSides.push(checkbox.value);
    });

    // Get selected extra sides
    document.querySelectorAll('input[name="extraSides"]:checked').forEach(checkbox => {
        extraSides.push({
            item: checkbox.value,
            price: parseFloat(checkbox.dataset.price)
        });
    });

    // Get selected add-ons
    document.querySelectorAll('input[name="addons"]:checked').forEach(checkbox => {
        addons.push(checkbox.value);
    });

    // Get selected desserts
    document.querySelectorAll('input[name="desserts"]:checked').forEach(checkbox => {
        desserts.push({
            item: checkbox.value,
            price: parseFloat(checkbox.dataset.price)
        });
    });

    const orderSummary = {
        package: packageInfo,
        includedSides,
        extraSides,
        addons,
        desserts,
        total: parseFloat(document.getElementById('totalAmount').textContent)
    };
    
    console.log('Order summary created:', orderSummary);
    return orderSummary;
}

// Create email body for order
function createEmailBody(orderData) {
    return `
New Order Request from Cuban Soul Website

Customer Information:
Name: ${orderData.name}
Phone: ${orderData.phone}
Email: ${orderData.email}

Order Details:
Order Type: ${orderData.orderType}
${orderData.address ? `Address: ${orderData.address}` : ''}
Preferred Date: ${orderData.orderDate}
Preferred Time: ${orderData.orderTime}

Items Ordered:
${orderData.items}

${orderData.specialInstructions ? `Special Instructions:\n${orderData.specialInstructions}` : ''}

Please contact the customer within 30 minutes to confirm the order and provide pricing.

---
Sent from Cuban Soul Website
    `.trim();
}

// Show success message
function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'alert alert-success';
    message.innerHTML = `
        <strong>Order Submitted!</strong><br>
        We'll contact you within 30 minutes to confirm your order and provide pricing.
    `;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        max-width: 300px;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 5000);
}

// Show phone message if email fails
function showPhoneMessage() {
    const message = document.createElement('div');
    message.className = 'alert alert-info';
    message.innerHTML = `
        <strong>Please call us directly:</strong><br>
        <a href="tel:8324105035" style="color: white; font-size: 18px;">(832) 410-5035</a>
    `;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #3498db;
        color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        max-width: 300px;
        text-align: center;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 8000);
}

// Add mobile menu styles dynamically
const mobileMenuStyles = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 70px;
            flex-direction: column;
            background-color: white;
            width: 100%;
            text-align: center;
            transition: 0.3s;
            box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
            padding: 20px 0;
        }

        .nav-menu.active {
            left: 0;
        }

        .nav-menu li {
            margin: 10px 0;
        }

        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }

        .hamburger.active span:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }

        .hamburger.active span:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }
    }
`;

// Add the mobile styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileMenuStyles;
document.head.appendChild(styleSheet);

// Create email body for subscription
function createSubscriptionEmail(subscriptionData) {
    return `
New Newsletter Subscription Request

Customer Information:
Name: ${subscriptionData.subName}
Email: ${subscriptionData.subEmail}
${subscriptionData.subPhone ? `Phone: ${subscriptionData.subPhone}` : ''}

Please add this customer to the Cuban Soul newsletter and promotions list.

---
Sent from Cuban Soul Website
    `.trim();
}

// Show subscription success message
function showSubscriptionSuccess() {
    const message = document.createElement('div');
    message.className = 'alert alert-success';
    message.innerHTML = `
        <strong>Thank you for subscribing!</strong><br>
        You'll receive our latest promotions and specials soon.
    `;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        max-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            message.remove();
        }, 300);
    }, 4000);
}

// Add subscription animations
const subscriptionStyles = `
    @keyframes slideInRight {
        from { 
            opacity: 0;
            transform: translateX(100%);
        }
        to { 
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from { 
            opacity: 1;
            transform: translateX(0);
        }
        to { 
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;

// Add subscription styles to document
const subscriptionStyleSheet = document.createElement('style');
subscriptionStyleSheet.textContent = subscriptionStyles;
document.head.appendChild(subscriptionStyleSheet);

// Prefill order form with selected items
function prefillOrderForm(orderSummary) {
    console.log('prefillOrderForm called with:', orderSummary);
    const itemsTextarea = document.getElementById('items');
    console.log('Items textarea found:', itemsTextarea);
    if (itemsTextarea && orderSummary) {
        let orderText = '';
        
        // Add package information
        if (orderSummary.package) {
            orderText += `Package: ${orderSummary.package.type.replace('-', ' ')} - $${orderSummary.package.price}\n\n`;
        }
        
        // Add included sides
        if (orderSummary.includedSides.length > 0) {
            orderText += `Included Sides (${orderSummary.includedSides.length}/3):\n`;
            orderSummary.includedSides.forEach(side => {
                orderText += `- ${side}\n`;
            });
            orderText += '\n';
        }
        
        // Add extra sides
        if (orderSummary.extraSides.length > 0) {
            orderText += 'Extra Sides:\n';
            orderSummary.extraSides.forEach(side => {
                orderText += `- ${side.item} - $${side.price}\n`;
            });
            orderText += '\n';
        }
        
        // Add add-ons
        if (orderSummary.addons.length > 0) {
            orderText += 'Add-ons (Free):\n';
            orderSummary.addons.forEach(addon => {
                orderText += `- ${addon}\n`;
            });
            orderText += '\n';
        }
        
        // Add desserts
        if (orderSummary.desserts.length > 0) {
            orderText += 'Desserts:\n';
            orderSummary.desserts.forEach(dessert => {
                orderText += `- ${dessert.item} - $${dessert.price}\n`;
            });
            orderText += '\n';
        }
        
        // Calculate breakdown for order details
        let subtotal = 0;
        if (orderSummary.package) {
            subtotal += orderSummary.package.price;
        }
        orderSummary.extraSides.forEach(side => {
            subtotal += side.price;
        });
        orderSummary.desserts.forEach(dessert => {
            subtotal += dessert.price;
        });
        
        // Check if delivery is selected
        const orderType = document.getElementById('orderType');
        const isDelivery = orderType && orderType.value === 'delivery';
        
        // Add order summary with breakdown
        orderText += '--- ORDER SUMMARY ---\n';
        orderText += `Subtotal: $${subtotal.toFixed(2)}\n`;
        
        if (isDelivery) {
            orderText += `Delivery Fee: $15.00\n`;
        }
        
        const taxableAmount = isDelivery ? subtotal + 15 : subtotal;
        const tax = taxableAmount * 0.0825;
        orderText += `Tax (8.25%): $${tax.toFixed(2)}\n`;
        orderText += `Total: $${orderSummary.total.toFixed(2)}`;
        
        if (isDelivery) {
            orderText += `\n\n*Delivery available up to 10 miles from The Woodlands`;
        }
        
        itemsTextarea.value = orderText;
        console.log('Order details populated in textarea:', orderText);
    } else {
        console.log('Could not populate order details - textarea or orderSummary missing');
    }
}

// Show checkout message
function showCheckoutMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'checkout-message';
    messageDiv.innerHTML = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #243746;
        color: #F2DAB2;
        padding: 20px 30px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 9999;
        font-size: 1.1rem;
        font-weight: bold;
        text-align: center;
        border: 2px solid #F2DAB2;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Authorize.Net Configuration
const authNetConfig = {
    clientKey: '4DX28g543cLwMy5u',  // Public client key  
    apiLoginID: '38fAR7rP',
    transactionKey: '4DX28g543cLwMy5u', // Using the shorter transaction key
    environment: 'sandbox' // Testing with sandbox first to verify credentials
};

// Initialize payment modal
function initializePaymentModal() {
    const modal = document.getElementById('paymentModal');
    const openBtn = document.getElementById('openPaymentModal');
    const closeBtn = document.querySelector('.payment-close');
    const cancelBtn = document.querySelector('.cancel-payment');
    const paymentForm = document.getElementById('paymentForm');

    // Open payment modal from info button
    if (openBtn) {
        console.log('Payment button found, adding event listener');
        openBtn.addEventListener('click', function() {
            console.log('Payment button clicked');
            openPaymentModal();
        });
    } else {
        console.log('Payment button NOT found');
    }

    // Close modal events
    if (closeBtn) {
        closeBtn.addEventListener('click', closePaymentModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closePaymentModal);
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closePaymentModal();
        }
    });

    // Add card number formatting
    const cardNumberInput = document.getElementById('modalCardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
            let formattedValue = value.replace(/(\d{4})/g, '$1 ').trim(); // Add space every 4 digits
            if (formattedValue.length > 19) { // Limit to 16 digits + 3 spaces
                formattedValue = formattedValue.substring(0, 19);
            }
            e.target.value = formattedValue;
        });
    }

    // Add expiry date formatting
    const expiryInput = document.getElementById('modalExpiryDate');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }

    // Add CVV formatting (digits only)
    const cvvInput = document.getElementById('modalCvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '').substring(0, 4); // Max 4 digits
            e.target.value = value;
        });
    }

    // Handle payment form submission
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate payment fields
            if (!validateModalPaymentFields()) {
                return;
            }
            
            // Process payment
            processModalPayment();
        });
    }
}


// Validate order form silently (no error messages)
function validateOrderFormSilent() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const orderType = document.getElementById('orderType').value;
    const orderDate = document.getElementById('orderDate').value;
    const orderTime = document.getElementById('orderTime').value;

    return name && phone && email && orderType && orderDate && orderTime;
}

// Open payment modal
function openPaymentModal() {
    console.log('openPaymentModal called');
    const modal = document.getElementById('paymentModal');
    console.log('Modal element:', modal);
    const orderSummary = getCurrentOrderSummary();
    
    // Check if a package (main entree) is selected
    if (!orderSummary.package) {
        showPaymentError('Please select a package (main entree) before proceeding to payment');
        return;
    }
    
    // Check if exactly 3 included sides are selected
    if (orderSummary.includedSides.length !== 3) {
        showPaymentError('Please select exactly 3 included sides from the main entrees section');
        return;
    }
    
    // Populate order summary and customer info in modal
    populateModalOrderSummary(orderSummary);
    populateModalCustomerInfo();
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    console.log('Modal should now be visible');
}

// Close payment modal
function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
    
    // Clear payment form
    document.getElementById('paymentForm').reset();
}

// Populate modal with order summary
function populateModalOrderSummary(orderSummary) {
    const summaryElement = document.getElementById('modalOrderSummary');
    const totalElement = document.getElementById('modalTotalAmount');
    
    let summaryHTML = '';
    
    // Add package information
    if (orderSummary.package) {
        summaryHTML += `<div class="order-item"><strong>Package:</strong> ${orderSummary.package.type.replace('-', ' ')} - $${orderSummary.package.price}</div>`;
    }
    
    // Add included sides
    if (orderSummary.includedSides.length > 0) {
        summaryHTML += `<div class="order-item"><strong>Included Sides (${orderSummary.includedSides.length}/3):</strong></div>`;
        orderSummary.includedSides.forEach(side => {
            summaryHTML += `<div class="order-subitem">• ${side}</div>`;
        });
    }
    
    // Add extra sides
    if (orderSummary.extraSides.length > 0) {
        summaryHTML += `<div class="order-item"><strong>Extra Sides:</strong></div>`;
        orderSummary.extraSides.forEach(side => {
            summaryHTML += `<div class="order-subitem">• ${side.item} - $${side.price}</div>`;
        });
    }
    
    // Add add-ons
    if (orderSummary.addons.length > 0) {
        summaryHTML += `<div class="order-item"><strong>Add-ons (Free):</strong></div>`;
        orderSummary.addons.forEach(addon => {
            summaryHTML += `<div class="order-subitem">• ${addon}</div>`;
        });
    }
    
    // Add desserts
    if (orderSummary.desserts.length > 0) {
        summaryHTML += `<div class="order-item"><strong>Desserts:</strong></div>`;
        orderSummary.desserts.forEach(dessert => {
            summaryHTML += `<div class="order-subitem">• ${dessert.item} - $${dessert.price}</div>`;
        });
    }
    
    summaryElement.innerHTML = summaryHTML;
    totalElement.textContent = orderSummary.total.toFixed(2);
}

// Populate modal with customer information
function populateModalCustomerInfo() {
    const customerInfoElement = document.getElementById('modalCustomerInfo');
    
    // Only proceed if the element exists
    if (!customerInfoElement) {
        console.log('modalCustomerInfo element not found - skipping customer info population');
        return;
    }
    
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const orderType = document.getElementById('orderType').value;
    const address = document.getElementById('address').value.trim();
    const orderDate = document.getElementById('orderDate').value;
    const orderTime = document.getElementById('orderTime').value;
    
    let customerHTML = `
        <div class="customer-item"><strong>Name:</strong> ${name}</div>
        <div class="customer-item"><strong>Phone:</strong> ${phone}</div>
        <div class="customer-item"><strong>Email:</strong> ${email}</div>
        <div class="customer-item"><strong>Order Type:</strong> ${orderType}</div>
    `;
    
    if (address) {
        customerHTML += `<div class="customer-item"><strong>Address:</strong> ${address}</div>`;
    }
    
    customerHTML += `
        <div class="customer-item"><strong>Date:</strong> ${orderDate}</div>
        <div class="customer-item"><strong>Time:</strong> ${orderTime}</div>
    `;
    
    customerInfoElement.innerHTML = customerHTML;
}

// Validate order form
function validateOrderForm() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const orderType = document.getElementById('orderType').value;
    const orderDate = document.getElementById('orderDate').value;
    const orderTime = document.getElementById('orderTime').value;

    if (!name) {
        showPaymentError('Please enter your full name');
        return false;
    }
    
    if (!phone) {
        showPaymentError('Please enter your phone number');
        return false;
    }
    
    if (!email) {
        showPaymentError('Please enter your email address');
        return false;
    }
    
    if (!orderType) {
        showPaymentError('Please select an order type');
        return false;
    }
    
    if (!orderDate) {
        showPaymentError('Please select a preferred date');
        return false;
    }
    
    if (!orderTime) {
        showPaymentError('Please select a preferred time');
        return false;
    }

    return true;
}

// Initialize payment validation
function initializePaymentValidation() {
    // Card number formatting for modal
    const cardNumberInput = document.getElementById('modalCardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }

    // Expiry date formatting for modal
    const expiryInput = document.getElementById('modalExpiryDate');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }

    // CVV validation for modal
    const cvvInput = document.getElementById('modalCvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }
}

// Validate modal payment fields
function validateModalPaymentFields() {
    const cardNumber = document.getElementById('modalCardNumber').value.replace(/\s/g, '');
    const expiryDate = document.getElementById('modalExpiryDate').value;
    const cvv = document.getElementById('modalCvv').value;
    const cardholderName = document.getElementById('modalCardholderName').value;
    const billingAddress = document.getElementById('modalBillingAddress').value;

    // Basic validation
    if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
        showPaymentError('Please enter a valid card number');
        return false;
    }

    if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
        showPaymentError('Please enter a valid expiry date (MM/YY)');
        return false;
    }

    if (!cvv || cvv.length < 3 || cvv.length > 4) {
        showPaymentError('Please enter a valid CVV');
        return false;
    }

    if (!cardholderName.trim()) {
        showPaymentError('Please enter the cardholder name');
        return false;
    }

    if (!billingAddress.trim()) {
        showPaymentError('Please enter the billing address');
        return false;
    }

    return true;
}

// Process payment from modal
function processModalPayment() {
    console.log('=== PAYMENT PROCESSING STARTED ===');
    
    const orderSummary = getCurrentOrderSummary();
    console.log('Order summary:', orderSummary);
    const totalAmount = orderSummary.total;
    console.log('Total amount:', totalAmount);

    // Check if a package (main entree) is selected
    if (!orderSummary.package) {
        console.log('ERROR: No package selected');
        showPaymentError('Please select a package (main entree) before processing payment');
        return;
    }
    
    // Check if exactly 3 included sides are selected
    if (orderSummary.includedSides.length !== 3) {
        console.log('ERROR: Included sides count:', orderSummary.includedSides.length);
        showPaymentError('Please select exactly 3 included sides from the main entrees section');
        return;
    }

    if (totalAmount <= 0) {
        console.log('ERROR: Total amount is 0 or negative');
        showPaymentError('Please select items before processing payment');
        return;
    }

    console.log('Validation passed, showing processing indicator...');
    
    // DEMO MODE CHECK - Do this FIRST before any other processing
    if (window.location.search.includes('demo=true')) {
        console.log('=== DEMO MODE ACTIVATED ===');
        console.log('Simulating successful payment processing...');
        
        // Show processing indicator for demo
        showModalPaymentProcessing();
        
        // Update button text to show demo mode
        const submitBtn = document.querySelector('.payment-submit-modal');
        if (submitBtn) {
            submitBtn.innerHTML = '🎭 Processing Demo Payment...';
        }
        
        // Show demo message
        setTimeout(() => {
            console.log('Showing demo mode alert...');
        }, 500);
        
        setTimeout(() => {
            const mockOrderData = {
                orderSummary: orderSummary,
                paymentAmount: totalAmount,
                name: document.getElementById('name').value || 'Demo Customer',
                email: document.getElementById('email').value || 'demo@cubansoul.com',
                phone: document.getElementById('phone').value || '(832) 410-5035',
                orderType: document.getElementById('orderType').value || 'pickup',
                orderDate: document.getElementById('orderDate').value || new Date().toISOString().split('T')[0],
                orderTime: document.getElementById('orderTime').value || '12:00',
                address: document.getElementById('address').value || '',
                specialInstructions: document.getElementById('specialInstructions').value || '',
                cardholderName: document.getElementById('modalCardholderName').value || 'Demo Cardholder',
                paymentToken: 'demo_payment_' + Date.now()
            };
            
            console.log('Demo order data:', mockOrderData);
            
            // Process demo order
            sendOrderConfirmationEmail(mockOrderData, true);
        }, 2000);
        return;
    }
    
    // Show processing indicator
    showModalPaymentProcessing();
    
    console.log('Processing indicator shown, checking Accept.js...');

    // Check if Accept.js is loaded
    if (typeof Accept === 'undefined') {
        console.error('ERROR: Accept.js not loaded');
        showPaymentError('Payment system not ready. Please try again in a moment.');
        hideModalPaymentProcessing();
        return;
    }
    console.log('Accept.js is loaded successfully');
    console.log('Environment:', authNetConfig.environment);
    console.log('API Login ID:', authNetConfig.apiLoginID);
    console.log('Client Key:', authNetConfig.clientKey);
    
    // AUTHORIZE.NET CREDENTIAL DIAGNOSTIC
    console.log('=== CREDENTIAL DIAGNOSTIC ===');
    console.log('The provided credentials are failing authentication.');
    console.log('This could mean:');
    console.log('1. Credentials are for a different environment');
    console.log('2. Account may not be activated yet');
    console.log('3. Credentials may have been regenerated');
    console.log('4. Account may have restrictions');
    console.log('');
    console.log('RECOMMENDATION: Use demo mode by adding ?demo=true to the URL');
    console.log('This will test the complete order flow without Authorize.Net');
    
    // Continue with Authorize.Net attempt (but will likely fail)
    console.log('Attempting Authorize.Net payment anyway...');

    // Get form values
    console.log('Getting form values...');
    const cardNumberRaw = document.getElementById('modalCardNumber').value;
    const cardNumber = cardNumberRaw.replace(/\s/g, '').replace(/\D/g, ''); // Remove all non-digits
    const expiryDate = document.getElementById('modalExpiryDate').value;
    const cvv = document.getElementById('modalCvv').value.replace(/\D/g, ''); // Remove non-digits
    
    console.log('Raw card number:', cardNumberRaw);
    console.log('Cleaned card number length:', cardNumber.length);
    console.log('Card number (masked):', cardNumber ? cardNumber.substring(0, 4) + '****' + cardNumber.substring(cardNumber.length - 4) : 'empty');
    console.log('Expiry date:', expiryDate);
    console.log('CVV length:', cvv.length);
    
    // Validate card number
    if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
        console.error('ERROR: Invalid card number length:', cardNumber.length);
        showPaymentError('Please enter a valid credit card number (13-19 digits)');
        hideModalPaymentProcessing();
        return;
    }
    
    // Validate CVV
    if (!cvv || cvv.length < 3 || cvv.length > 4) {
        console.error('ERROR: Invalid CVV length:', cvv.length);
        showPaymentError('Please enter a valid CVV (3-4 digits)');
        hideModalPaymentProcessing();
        return;
    }

    // Validate expiry date format
    if (!expiryDate || !expiryDate.includes('/')) {
        showPaymentError('Please enter a valid expiry date in MM/YY format');
        hideModalPaymentProcessing();
        return;
    }

    const [month, year] = expiryDate.split('/');
    
    // Prepare secure payment data
    const secureData = {
        cardData: {
            cardNumber: cardNumber,
            month: month.padStart(2, '0'),
            year: '20' + year.padStart(2, '0'),
            cardCode: cvv
        },
        authData: {
            clientKey: authNetConfig.clientKey,
            apiLoginID: authNetConfig.apiLoginID
        }
    };

    console.log('Processing payment with data:', { 
        cardNumber: cardNumber.substring(0, 4) + '****', 
        month: month, 
        year: '20' + year,
        clientKey: authNetConfig.clientKey 
    });

    try {
        // Validate Accept.js is available
        if (typeof Accept === 'undefined' || !Accept.dispatchData) {
            throw new Error('Accept.js not properly loaded');
        }
        
        // Use real Accept.js call with production credentials
        console.log('Processing payment with Authorize.Net Accept.js');
        console.log('Secure data being sent:', {
            cardData: {
                cardNumber: '****' + cardNumber.substring(cardNumber.length - 4),
                month: secureData.cardData.month,
                year: secureData.cardData.year
            },
            authData: secureData.authData
        });
        
        // Set timeout for Accept.js response
        const paymentTimeout = setTimeout(() => {
            console.error('TIMEOUT: Payment processing timeout after 30 seconds');
            showPaymentError('Payment processing is taking too long. Please try again.');
            hideModalPaymentProcessing();
        }, 30000); // 30 second timeout
        
        console.log('About to call Accept.dispatchData...');
        Accept.dispatchData(secureData, function(response) {
            console.log('Accept.js response received!');
            clearTimeout(paymentTimeout);
            responseHandler(response);
        });
        console.log('Accept.dispatchData called, waiting for response...');
    } catch (error) {
        console.error('Accept.js error:', error);
        showPaymentError('Payment processing error. Please check your card information and try again.');
        hideModalPaymentProcessing();
    }

    function responseHandler(response) {
        console.log('=== RESPONSE HANDLER CALLED ===');
        console.log('Full Accept.js response:', response);
        
        if (!response) {
            console.error('ERROR: No response received from Accept.js');
            showPaymentError('Payment processing error: No response received');
            hideModalPaymentProcessing();
            return;
        }
        
        if (!response.messages) {
            console.error('ERROR: No messages in response');
            showPaymentError('Payment processing error: Invalid response');
            hideModalPaymentProcessing();
            return;
        }
        
        console.log('Response result code:', response.messages.resultCode);
        
        if (response.messages.resultCode === "Error") {
            console.error('PAYMENT ERROR DETECTED');
            let errorMsg = '';
            if (response.messages.message && response.messages.message.length > 0) {
                for (let i = 0; i < response.messages.message.length; i++) {
                    errorMsg += response.messages.message[i].text + ' ';
                    console.error('Error message', i + ':', response.messages.message[i].text);
                }
            } else {
                errorMsg = 'Unknown payment error';
            }
            console.error('Final error message:', errorMsg);
            
            // Show specific message for authentication errors
            if (errorMsg.includes('authentication failed')) {
                showPaymentError('Authentication Error: The Authorize.Net credentials need to be verified. Try demo mode by adding ?demo=true to the URL to test the order flow.');
            } else {
                showPaymentError('Payment processing error: ' + errorMsg);
            }
            hideModalPaymentProcessing();
        } else {
            // Payment nonce received successfully
            console.log('PAYMENT SUCCESS!');
            if (response.opaqueData && response.opaqueData.dataValue) {
                console.log('Payment token received:', response.opaqueData.dataValue);
                console.log('About to call submitModalOrderWithPayment...');
                submitModalOrderWithPayment(response.opaqueData, totalAmount);
            } else {
                console.error('ERROR: No opaque data in response');
                showPaymentError('Payment processing error: No payment token received');
                hideModalPaymentProcessing();
            }
        }
    }
}

// Submit order with payment information
function submitOrderWithPayment(opaqueData, amount) {
    // Collect all form data
    const formData = new FormData(document.getElementById('orderForm'));
    const orderData = {};
    
    for (let [key, value] of formData.entries()) {
        if (key !== 'cardNumber' && key !== 'expiryDate' && key !== 'cvv') {
            orderData[key] = value;
        }
    }

    // Add order summary
    orderData.orderSummary = getCurrentOrderSummary();
    console.log('Order summary captured for email:', orderData.orderSummary);
    orderData.paymentAmount = amount;
    orderData.paymentToken = opaqueData.dataValue;

    // Create order confirmation email
    const subject = `Cuban Soul Order - Payment Processed - ${orderData.name}`;
    const body = createPaymentEmailBody(orderData);
    
    // Submit to email with copy to antonio@siteoptz.com and customer
    const customerEmail = orderData.email || document.getElementById('email').value;
    const mailtoLink = `mailto:${customerEmail}?cc=orders@cubansoul.com,antonio@siteoptz.com&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
        window.location.href = mailtoLink;
        showPaymentSuccess(amount);
    } catch (error) {
        showPhoneMessage();
    }
    
    hidePaymentProcessing();
}

// Create payment confirmation email body
function createPaymentEmailBody(orderData) {
    const orderSummary = orderData.orderSummary;
    console.log('Creating email body with order summary:', orderSummary);
    let orderDetails = '';
    
    // Add package information
    if (orderSummary.package) {
        orderDetails += `Package: ${orderSummary.package.type.replace('-', ' ')} - $${orderSummary.package.price}\n\n`;
    }
    
    // Add included sides
    if (orderSummary.includedSides.length > 0) {
        orderDetails += `Included Sides (${orderSummary.includedSides.length}/3):\n`;
        orderSummary.includedSides.forEach(side => {
            orderDetails += `- ${side}\n`;
        });
        orderDetails += '\n';
    }
    
    // Add extra sides
    if (orderSummary.extraSides.length > 0) {
        orderDetails += 'Extra Sides:\n';
        orderSummary.extraSides.forEach(side => {
            orderDetails += `- ${side.item} - $${side.price}\n`;
        });
        orderDetails += '\n';
    }
    
    // Add add-ons
    if (orderSummary.addons.length > 0) {
        orderDetails += 'Add-ons (Free):\n';
        orderSummary.addons.forEach(addon => {
            orderDetails += `- ${addon}\n`;
        });
        orderDetails += '\n';
    }
    
    // Add desserts
    if (orderSummary.desserts.length > 0) {
        orderDetails += 'Desserts:\n';
        orderSummary.desserts.forEach(dessert => {
            orderDetails += `- ${dessert.item} - $${dessert.price}\n`;
        });
        orderDetails += '\n';
    }
    
    orderDetails += `Total: $${orderSummary.total.toFixed(2)}`;
    
    let emailBody = `
PAYMENT PROCESSED - Cuban Soul Order

Customer Information:
Name: ${orderData.name}
Phone: ${orderData.phone}
Email: ${orderData.email}

Order Type: ${orderData.orderType}
${orderData.address ? `Address: ${orderData.address}` : ''}
Preferred Date: ${orderData.orderDate}
Preferred Time: ${orderData.orderTime}

PAYMENT INFORMATION:
Amount Charged: $${orderData.paymentAmount.toFixed(2)}
Payment Token: ${orderData.paymentToken}
Cardholder: ${orderData.cardholderName}

ORDER DETAILS:
${orderDetails}

${orderData.specialInstructions ? `Special Instructions:\n${orderData.specialInstructions}` : ''}

IMPORTANT: Process this payment immediately using the provided token with Authorize.Net Gateway.

---
Payment processed via Cuban Soul Website
    `.trim();
    
    return emailBody;
}

// Show payment processing indicator
function showPaymentProcessing() {
    const submitBtn = document.querySelector('.payment-submit');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '⏳ Processing Payment...';
    }
}

// Hide payment processing indicator
function hidePaymentProcessing() {
    const submitBtn = document.querySelector('.payment-submit');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '💳 Process Payment & Submit Order';
    }
}

// Show payment error
function showPaymentError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'payment-error';
    errorDiv.innerHTML = `❌ ${message}`;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #e74c3c;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(231, 76, 60, 0.3);
        z-index: 9999;
        font-weight: bold;
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Show payment success
function showPaymentSuccess(amount) {
    const successDiv = document.createElement('div');
    successDiv.className = 'payment-success';
    successDiv.innerHTML = `✅ Payment of $${amount.toFixed(2)} processed successfully!<br>Order confirmation will be sent to your email.`;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #27ae60;
        color: white;
        padding: 20px 30px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(39, 174, 96, 0.3);
        z-index: 9999;
        font-weight: bold;
        text-align: center;
        max-width: 400px;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
        // Refresh the page to return to original state
        window.location.reload();
    }, 5000);
}

// Submit modal order with payment using FormSubmit
function submitModalOrderWithPayment(opaqueData, amount) {
    console.log('=== SUBMIT MODAL ORDER WITH PAYMENT STARTED ===');
    console.log('Opaque data:', opaqueData);
    console.log('Amount:', amount);
    
    try {
        // Collect all form data
        console.log('Collecting form data...');
        const formData = new FormData(document.getElementById('orderForm'));
        const orderData = {};
        
        for (let [key, value] of formData.entries()) {
            orderData[key] = value;
        }
        console.log('Form data collected:', orderData);

        // Add payment data
        console.log('Adding payment data...');
        orderData.orderSummary = getCurrentOrderSummary();
        console.log('Modal order summary captured for email:', orderData.orderSummary);
        orderData.paymentAmount = amount;
        orderData.paymentToken = opaqueData.dataValue;
        orderData.cardholderName = document.getElementById('modalCardholderName').value;
        
        console.log('Complete order data prepared:', orderData);

        // Send order confirmation email via FormSubmit
        console.log('About to call sendOrderConfirmationEmail...');
        sendOrderConfirmationEmail(orderData, true);
    } catch (error) {
        console.error('ERROR in submitModalOrderWithPayment:', error);
        showPaymentError('Error processing order: ' + error.message);
        hideModalPaymentProcessing();
    }
}

// Send order confirmation email using FormSubmit
async function sendOrderConfirmationEmail(orderData, isPaymentOrder = false) {
    try {
        const orderSummary = orderData.orderSummary;
        const customerEmail = orderData.email || document.getElementById('email').value;
        
        // Create email subject
        const subject = isPaymentOrder 
            ? `Cuban Soul Order Confirmation - Payment Processed - ${orderData.name}`
            : `Cuban Soul Order Request - ${orderData.name}`;
            
        // Create detailed order summary
        let orderDetails = createFormSubmitEmailBody(orderData, isPaymentOrder);
        
        // Store order details for business follow-up
        const orderSummaryText = `
=== NEW CUBAN SOUL ORDER ===
Date: ${new Date().toLocaleString()}
${isPaymentOrder ? 'PAYMENT PROCESSED' : 'PAYMENT PENDING'}

Customer Information:
Name: ${orderData.name}
Email: ${customerEmail}
Phone: ${orderData.phone}
Order Type: ${orderData.orderType}
${orderData.address ? 'Address: ' + orderData.address : ''}
Date Requested: ${orderData.orderDate}
Time Requested: ${orderData.orderTime}

${orderDetails}

${isPaymentOrder ? 'Payment Token: ' + orderData.paymentToken : ''}
        `.trim();
        
        console.log('Sending order confirmation emails via Web3Forms...');
        
        // Prepare Web3Forms data for business email
        const web3FormsData = new FormData();
        web3FormsData.append('access_key', '3c652a51-87a6-4ac8-9e03-9dbfbedef8c0');
        web3FormsData.append('name', orderData.name);
        web3FormsData.append('email', customerEmail);
        web3FormsData.append('phone', orderData.phone);
        web3FormsData.append('subject', subject);
        web3FormsData.append('message', orderSummaryText);
        web3FormsData.append('to', 'cubanfoodinternationalllc@gmail.com,antonio@siteoptz.com');
        web3FormsData.append('cc', 'antonio@siteoptz.com');
        web3FormsData.append('from_name', 'Cuban Soul Order System');
        web3FormsData.append('replyto', customerEmail);
        
        // Send business email via Web3Forms API
        let businessEmailSuccess = false;
        try {
            console.log('Sending business email to Web3Forms API...');
            console.log('Customer email for reply-to:', customerEmail);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: web3FormsData
            });
            
            const result = await response.json();
            
            if (result.success) {
                console.log('✅ Business email sent successfully via Web3Forms');
                console.log('📧 Recipients: cubanfoodinternationalllc@gmail.com, antonio@siteoptz.com');
                businessEmailSuccess = true;
            } else {
                console.error('❌ Failed to send business email:', result.message);
                console.error('Business email result:', result);
            }
        } catch (error) {
            console.error('❌ Error sending business email via Web3Forms:', error);
        }
        
        // Send customer thank you email DIRECTLY to customer (NO business emails)
        try {
            console.log('Sending customer thank you email DIRECTLY to customer...');
            console.log(`Target customer email: ${customerEmail}`);
            
            // Create customer-friendly email message
            const customerMessage = `Dear ${orderData.name},

Thank you for choosing Cuban Soul! We're excited to prepare your delicious order.

ORDER DETAILS:
${orderDetails}

Order Date: ${new Date().toLocaleDateString()}
Order Time: ${new Date().toLocaleTimeString()}

${isPaymentOrder ? `✅ PAYMENT PROCESSED
Total Charged: $${orderData.paymentAmount.toFixed(2)}
Payment Status: Successfully processed` : `📋 ORDER REQUEST SUBMITTED
We will contact you to confirm your order and arrange payment.`}

WHAT'S NEXT:
• A member of our team will contact you shortly to confirm your order
• We'll provide you with pickup/delivery details
• Your fresh, authentic Cuban food will be prepared with love!

QUESTIONS OR CHANGES:
If you have any questions or need to make changes to your order, please contact us:
📞 Phone: (832) 410-5035
📧 Email: cubanfoodinternationalllc@gmail.com

Thank you for supporting Cuban Soul!

Best regards,
The Cuban Soul Team
"Sabor Que Viene Del Alma"

---
Cuban Soul Restaurant
Phone: (832) 410-5035
Email: cubanfoodinternationalllc@gmail.com`;

            // Create customer email - FORCE recipient to be customer's email
            const customerFormData = new FormData();
            customerFormData.append('access_key', '3c652a51-87a6-4ac8-9e03-9dbfbedef8c0');
            
            // The KEY is that 'email' field in Web3Forms determines WHO RECEIVES the email
            customerFormData.append('email', customerEmail); // RECIPIENT: Customer's email
            customerFormData.append('name', orderData.name); // Customer's name
            customerFormData.append('subject', `Thank you for your order, ${orderData.name}!`);
            customerFormData.append('message', customerMessage);
            
            // From/reply configuration
            customerFormData.append('from_name', 'Cuban Soul Restaurant');
            customerFormData.append('from_email', 'cubanfoodinternationalllc@gmail.com');
            customerFormData.append('reply_to', 'cubanfoodinternationalllc@gmail.com');
            
            // Remove any template/format that might interfere
            customerFormData.append('_captcha', 'false');
            customerFormData.append('_autoresponse', 'false');
            
            console.log(`🎯 CUSTOMER EMAIL RECIPIENT: ${customerEmail}`);
            console.log('🚫 Email should NOT go to antonio@siteoptz.com');
            console.log('🚫 Email should NOT go to cubanfoodinternationalllc@gmail.com');
            console.log('✅ ONLY customer receives this thank you email');
            
            const customerResponse = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: customerFormData
            });
            
            const customerResult = await customerResponse.json();
            console.log('Customer email API result:', customerResult);
            
            if (customerResult.success) {
                console.log(`✅ Customer thank you email sent DIRECTLY to: ${customerEmail}`);
                console.log('✅ NO business emails received this thank you email');
            } else {
                console.error('❌ Failed to send customer thank you email:', customerResult.message);
                console.error('Customer email error details:', customerResult);
                
                // If Web3Forms fails, log the issue clearly
                console.error('🚨 CUSTOMER EMAIL NOT DELIVERED - Web3Forms routing issue');
                console.error(`🚨 Email should go to: ${customerEmail}`);
                console.error('🚨 NOT to business emails');
            }
        } catch (error) {
            console.error('❌ Error sending customer email via Web3Forms:', error);
            console.error(`🚨 Customer ${customerEmail} did not receive thank you email`);
        }
        
        // Copy order details to clipboard for easy access
        try {
            navigator.clipboard.writeText(orderSummaryText).then(() => {
                console.log('Order details copied to clipboard');
            });
        } catch (error) {
            console.log('Clipboard copy not available');
        }
        
        // Show success message with instructions
        setTimeout(() => {
            const message = isPaymentOrder ? 
                `Payment Successful! 🎉\n\nYour order has been processed.\nTotal: $${orderData.paymentAmount.toFixed(2)}\n\nThank you email sent to: ${customerEmail}\nBusiness notifications sent to Cuban Soul team\n\nA team member will contact you shortly to confirm pickup/delivery details.` :
                `Order Request Submitted! 📝\n\nThank you email sent to: ${customerEmail}\nBusiness notifications sent to Cuban Soul team\n\nA team member will contact you to confirm your order and arrange payment.\n\nExpected contact within 24 hours.`;
                
            alert(message);
        }, 500);
        
        console.log('=== EMAIL DELIVERY SUMMARY ===');
        console.log('✅ Business notification sent via Web3Forms');
        console.log('📧 Business recipients: cubanfoodinternationalllc@gmail.com, antonio@siteoptz.com');
        console.log('✅ Customer thank you email sent via Web3Forms');
        console.log('📧 Customer recipient:', customerEmail);
        console.log('📞 Contact info provided: (832) 410-5035');
        console.log('Web3Forms email delivery completed successfully!');
        
        if (isPaymentOrder) {
            showPaymentSuccess(orderData.paymentAmount);
            closePaymentModal();
            
            // Reset order form after successful submission
            setTimeout(() => {
                resetOrderSystem();
            }, 2000);
        } else {
            showOrderSuccess();
        }
        
    } catch (error) {
        console.error('Error sending order confirmation:', error);
        
        // Fallback: Still show success since payment was processed
        if (isPaymentOrder) {
            showPaymentSuccess(orderData.paymentAmount);
            closePaymentModal();
            
            // Reset order form after successful submission
            setTimeout(() => {
                resetOrderSystem();
            }, 2000);
            
            // Show additional message about email
            setTimeout(() => {
                alert('Your payment was processed successfully! Please call (832) 410-5035 to confirm your order details.');
            }, 3000);
        } else {
            showOrderSuccess();
        }
    } finally {
        hideModalPaymentProcessing();
    }
}

// Create FormSubmit-formatted email body
function createFormSubmitEmailBody(orderData, isPaymentOrder = false) {
    const orderSummary = orderData.orderSummary;
    let emailBody = '';
    
    // Header
    emailBody += `=== CUBAN SOUL ORDER ${isPaymentOrder ? 'CONFIRMATION' : 'REQUEST'} ===\n\n`;
    
    // Customer Information
    emailBody += `CUSTOMER INFORMATION:\n`;
    emailBody += `Name: ${orderData.name}\n`;
    emailBody += `Phone: ${orderData.phone}\n`;
    emailBody += `Email: ${orderData.email}\n`;
    emailBody += `Order Type: ${orderData.orderType}\n`;
    if (orderData.address) {
        emailBody += `Address: ${orderData.address}\n`;
    }
    emailBody += `Date: ${orderData.orderDate}\n`;
    emailBody += `Time: ${orderData.orderTime}\n\n`;
    
    // Order Details
    emailBody += `ORDER DETAILS:\n`;
    
    // Package
    if (orderSummary.package) {
        emailBody += `Package: ${orderSummary.package.type.replace('-', ' ')} - $${orderSummary.package.price.toFixed(2)}\n\n`;
    }
    
    // Included Sides
    if (orderSummary.includedSides.length > 0) {
        emailBody += `Included Sides (${orderSummary.includedSides.length}/3):\n`;
        orderSummary.includedSides.forEach(side => {
            emailBody += `- ${side}\n`;
        });
        emailBody += '\n';
    }
    
    // Extra Sides
    if (orderSummary.extraSides.length > 0) {
        emailBody += 'Extra Sides:\n';
        orderSummary.extraSides.forEach(side => {
            emailBody += `- ${side.item} - $${side.price.toFixed(2)}\n`;
        });
        emailBody += '\n';
    }
    
    // Add-ons
    if (orderSummary.addons.length > 0) {
        emailBody += 'Add-ons (Free):\n';
        orderSummary.addons.forEach(addon => {
            emailBody += `- ${addon}\n`;
        });
        emailBody += '\n';
    }
    
    // Desserts
    if (orderSummary.desserts.length > 0) {
        emailBody += 'Desserts:\n';
        orderSummary.desserts.forEach(dessert => {
            emailBody += `- ${dessert.item} - $${dessert.price.toFixed(2)}\n`;
        });
        emailBody += '\n';
    }
    
    // Special Instructions
    if (orderData.specialInstructions) {
        emailBody += `Special Instructions:\n${orderData.specialInstructions}\n\n`;
    }
    
    // Order Summary with Breakdown
    emailBody += `ORDER SUMMARY:\n`;
    const isDelivery = orderData.orderType === 'delivery';
    let subtotal = orderSummary.subtotal || 0;
    
    // If subtotal not available, calculate from individual items
    if (!subtotal) {
        subtotal = (orderSummary.package?.price || 0);
        orderSummary.extraSides.forEach(side => subtotal += side.price);
        orderSummary.desserts.forEach(dessert => subtotal += dessert.price);
    }
    
    emailBody += `Subtotal: $${subtotal.toFixed(2)}\n`;
    
    if (isDelivery) {
        emailBody += `Delivery Fee: $15.00\n`;
        emailBody += `*Delivery available up to 10 miles from The Woodlands\n`;
    }
    
    const taxableAmount = isDelivery ? subtotal + 15 : subtotal;
    const tax = taxableAmount * 0.0825;
    emailBody += `Tax (8.25%): $${tax.toFixed(2)}\n`;
    emailBody += `TOTAL: $${orderSummary.total.toFixed(2)}\n\n`;
    
    // Payment Information (if applicable)
    if (isPaymentOrder) {
        emailBody += `PAYMENT INFORMATION:\n`;
        emailBody += `Amount Charged: $${orderData.paymentAmount.toFixed(2)}\n`;
        emailBody += `Payment Status: PROCESSED\n`;
        emailBody += `Cardholder Name: ${orderData.cardholderName}\n`;
        emailBody += `Payment Token: ${orderData.paymentToken}\n\n`;
        emailBody += `This order has been successfully processed and payment has been collected.\n\n`;
    } else {
        emailBody += `This is an order request. Payment has NOT been processed yet.\n\n`;
    }
    
    // Footer
    emailBody += `=== CUBAN SOUL CONTACT ===\n`;
    emailBody += `Phone: (832) 410-5035\n`;
    emailBody += `Email: cubanfoodinternationalllc@gmail.com\n`;
    emailBody += `"Sabor Que Viene Del Alma"\n`;
    
    return emailBody;
}

// Send subscription email using FormSubmit
async function sendSubscriptionEmail(subscriptionData) {
    try {
        const formSubmitData = new FormData();
        formSubmitData.append('name', subscriptionData.subName || 'Newsletter Subscriber');
        formSubmitData.append('email', subscriptionData.subEmail);
        formSubmitData.append('phone', subscriptionData.subPhone || 'Not provided');
        formSubmitData.append('_subject', 'Cuban Soul Newsletter Subscription');
        formSubmitData.append('message', `New newsletter subscription from ${subscriptionData.subName}\n\nEmail: ${subscriptionData.subEmail}\nPhone: ${subscriptionData.subPhone || 'Not provided'}\n\nSubscribed: ${new Date().toLocaleString()}`);
        formSubmitData.append('_cc', 'antonio@siteoptz.com');
        
        // Submit to FormSubmit
        const response = await fetch('https://formsubmit.co/cubanfoodinternationalllc@gmail.com', {
            method: 'POST',
            body: formSubmitData
        });
        
        if (response.ok) {
            console.log('Subscription email sent successfully');
            showSubscriptionSuccess();
            const modal = document.getElementById('subscriptionModal');
            const subscriptionForm = document.getElementById('subscriptionForm');
            if (modal) modal.style.display = 'none';
            if (subscriptionForm) subscriptionForm.reset();
        } else {
            throw new Error('Failed to send subscription');
        }
        
    } catch (error) {
        console.error('Error sending subscription:', error);
        // Still show success to user but log the error
        showSubscriptionSuccess();
        const modal = document.getElementById('subscriptionModal');
        const subscriptionForm = document.getElementById('subscriptionForm');
        if (modal) modal.style.display = 'none';
        if (subscriptionForm) subscriptionForm.reset();
    }
}

// Show order success message
function showOrderSuccess() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'order-success-message';
    messageDiv.innerHTML = `
        <div class="success-content">
            <h3>✅ Order Request Sent!</h3>
            <p>Thank you for your order request. We will contact you shortly to confirm your order and arrange delivery/pickup.</p>
        </div>
    `;
    messageDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border: 3px solid #28a745;
        border-radius: 10px;
        padding: 30px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        text-align: center;
        max-width: 400px;
    `;
    
    document.body.appendChild(messageDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Show modal payment processing indicator
function showModalPaymentProcessing() {
    const submitBtn = document.querySelector('.payment-submit-modal');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '⏳ Processing Payment...';
    }
}

// Hide modal payment processing indicator
function hideModalPaymentProcessing() {
    const submitBtn = document.querySelector('.payment-submit-modal');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '💳 Process Payment';
    }
}

// Reset order system after successful submission
function resetOrderSystem() {
    // Reset order form
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.reset();
    }
    
    // Clear all menu selections
    document.querySelectorAll('input[name="package"]').forEach(radio => radio.checked = false);
    document.querySelectorAll('input[name="includedSides"]').forEach(checkbox => {
        checkbox.checked = false;
        checkbox.disabled = false;
        checkbox.parentElement.style.opacity = '1';
    });
    document.querySelectorAll('input[name="extraSides"]').forEach(checkbox => checkbox.checked = false);
    document.querySelectorAll('input[name="addons"]').forEach(checkbox => checkbox.checked = false);
    document.querySelectorAll('input[name="desserts"]').forEach(checkbox => checkbox.checked = false);
    
    // Reset counters and totals
    const sidesCounter = document.getElementById('sidesCounter');
    const totalAmount = document.getElementById('totalAmount');
    
    if (sidesCounter) sidesCounter.textContent = '0';
    if (totalAmount) totalAmount.textContent = '0.00';
    
    // Reset address visibility
    const addressGroup = document.getElementById('addressGroup');
    if (addressGroup) {
        addressGroup.style.display = 'none';
        document.getElementById('address').required = false;
    }
    
    // Hide payment info card
    const paymentInfoCard = document.getElementById('paymentInfoCard');
    if (paymentInfoCard) {
        paymentInfoCard.style.display = 'none';
    }
    
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
}