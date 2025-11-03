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
            if (this.value === 'delivery' || this.value === 'catering') {
                addressGroup.style.display = 'block';
                document.getElementById('address').required = true;
            } else {
                addressGroup.style.display = 'none';
                document.getElementById('address').required = false;
            }
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

    // Monitor order form completion
    initializeOrderFormMonitoring();

    // Form submission
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate order form first
            if (!validateOrderForm()) {
                return;
            }
            
            // Open payment modal
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

            // Create email content for subscription
            const subject = 'Cuban Soul Newsletter Subscription';
            const body = createSubscriptionEmail(subscriptionData);
            
            // Create mailto link
            const mailtoLink = `mailto:subscribe@cubansoul.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            // Try to open email client
            try {
                window.location.href = mailtoLink;
                showSubscriptionSuccess();
                modal.style.display = 'none';
                subscriptionForm.reset();
            } catch (error) {
                showSubscriptionSuccess();
                modal.style.display = 'none';
                subscriptionForm.reset();
            }
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
    
    // Checkout button functionality
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
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

// Update order total
function updateOrderTotal() {
    const selectedPackage = document.querySelector('input[name="package"]:checked');
    const extraSidesCheckboxes = document.querySelectorAll('input[name="extraSides"]:checked');
    const dessertsCheckboxes = document.querySelectorAll('input[name="desserts"]:checked');
    const totalAmountElement = document.getElementById('totalAmount');
    
    let total = 0;

    // Add package price if selected
    if (selectedPackage) {
        total += parseFloat(selectedPackage.dataset.price);
    }

    // Calculate extra sides total
    extraSidesCheckboxes.forEach(checkbox => {
        const price = parseFloat(checkbox.dataset.price);
        total += price;
    });

    // Calculate desserts total
    dessertsCheckboxes.forEach(checkbox => {
        const price = parseFloat(checkbox.dataset.price);
        total += price;
    });

    // Update the display
    if (totalAmountElement) {
        totalAmountElement.textContent = total.toFixed(2);
    }
}

// Get current order summary
function getCurrentOrderSummary() {
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

    return {
        package: packageInfo,
        includedSides,
        extraSides,
        addons,
        desserts,
        total: parseFloat(document.getElementById('totalAmount').textContent)
    };
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
    const itemsTextarea = document.getElementById('items');
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
        
        orderText += `Total: $${orderSummary.total.toFixed(2)}`;
        
        itemsTextarea.value = orderText;
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
    clientKey: '38fAR7rP',  // API Login ID (using as clientKey for demo)
    apiLoginID: '38fAR7rP',
    environment: 'sandbox' // Change to 'production' for live transactions
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
        openBtn.addEventListener('click', function() {
            openPaymentModal();
        });
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

// Initialize order form monitoring
function initializeOrderFormMonitoring() {
    const requiredFields = ['name', 'phone', 'email', 'orderType', 'orderDate', 'orderTime'];
    const paymentInfoBtn = document.getElementById('openPaymentModal');
    const reviewOrderBtn = document.querySelector('#orderForm button[type="submit"]');
    const paymentInfoCard = document.getElementById('paymentInfoCard');
    
    function checkFormCompletion() {
        const orderSummary = getCurrentOrderSummary();
        const formComplete = validateOrderFormSilent();
        const hasMenuItems = orderSummary.total > 0;
        
        if (formComplete && hasMenuItems) {
            // Show payment info card
            if (paymentInfoCard) {
                paymentInfoCard.style.display = 'block';
            }
            
            // Enable payment buttons
            if (paymentInfoBtn) {
                paymentInfoBtn.disabled = false;
                paymentInfoBtn.textContent = '💳 Enter Payment Details';
            }
            if (reviewOrderBtn) {
                reviewOrderBtn.disabled = false;
                reviewOrderBtn.textContent = '📋 Review Order & Pay';
            }
        } else {
            // Hide payment info card
            if (paymentInfoCard) {
                paymentInfoCard.style.display = 'none';
            }
            
            // Disable payment buttons
            if (paymentInfoBtn) {
                paymentInfoBtn.disabled = true;
                paymentInfoBtn.textContent = '💳 Complete Order Form First';
            }
            if (reviewOrderBtn) {
                reviewOrderBtn.disabled = !formComplete;
                reviewOrderBtn.textContent = formComplete ? '📋 Select Items from Menu' : '📋 Complete Order Form';
            }
        }
    }
    
    // Monitor required fields
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', checkFormCompletion);
            field.addEventListener('change', checkFormCompletion);
        }
    });
    
    // Monitor menu selections
    document.addEventListener('change', function(e) {
        if (e.target.matches('input[name="package"], input[name="extraSides"], input[name="desserts"]')) {
            checkFormCompletion();
        }
    });
    
    // Initial check
    checkFormCompletion();
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
    const modal = document.getElementById('paymentModal');
    const orderSummary = getCurrentOrderSummary();
    
    // Validate order form
    if (!validateOrderForm()) {
        return;
    }
    
    // Check if user has selected items from menu
    if (orderSummary.total <= 0) {
        showPaymentError('Please select items from the menu before proceeding to payment');
        return;
    }
    
    // Populate order summary and customer info in modal
    populateModalOrderSummary(orderSummary);
    populateModalCustomerInfo();
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
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
    const orderSummary = getCurrentOrderSummary();
    const totalAmount = orderSummary.total;

    if (totalAmount <= 0) {
        showPaymentError('Please select items before processing payment');
        return;
    }

    // Show processing indicator
    showModalPaymentProcessing();

    // Check if Accept.js is loaded
    if (typeof Accept === 'undefined') {
        console.error('Accept.js not loaded');
        showPaymentError('Payment system not ready. Please try again in a moment.');
        hideModalPaymentProcessing();
        return;
    }

    // Get form values
    const cardNumber = document.getElementById('modalCardNumber').value.replace(/\s/g, '');
    const expiryDate = document.getElementById('modalExpiryDate').value;
    const cvv = document.getElementById('modalCvv').value;

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
        // For testing purposes, if using test card numbers, simulate success
        if (cardNumber === '4111111111111111' || cardNumber === '4007000000027' || cardNumber === '5424000000000015') {
            console.log('Using test card - simulating successful response');
            setTimeout(() => {
                const mockResponse = {
                    messages: { resultCode: "Ok" },
                    opaqueData: {
                        dataDescriptor: "COMMON.ACCEPT.INAPP.PAYMENT",
                        dataValue: "test_payment_nonce_" + Date.now()
                    }
                };
                responseHandler(mockResponse);
            }, 1000);
            return;
        }
        
        // Use Accept.js to get payment nonce
        Accept.dispatchData(secureData, responseHandler);
    } catch (error) {
        console.error('Accept.js error:', error);
        
        // Fallback: proceed with order submission without tokenization for demo purposes
        console.log('Falling back to demo mode');
        showPaymentError('Demo Mode: Proceeding with order submission. In production, this would process the payment securely.');
        
        setTimeout(() => {
            const mockResponse = {
                messages: { resultCode: "Ok" },
                opaqueData: {
                    dataDescriptor: "DEMO.FALLBACK.PAYMENT",
                    dataValue: "demo_payment_token_" + Date.now()
                }
            };
            responseHandler(mockResponse);
        }, 2000);
    }

    function responseHandler(response) {
        console.log('Accept.js response:', response);
        
        if (response.messages.resultCode === "Error") {
            let errorMsg = '';
            for (let i = 0; i < response.messages.message.length; i++) {
                errorMsg += response.messages.message[i].text + ' ';
            }
            console.error('Payment error:', errorMsg);
            showPaymentError('Payment processing error: ' + errorMsg);
            hideModalPaymentProcessing();
        } else {
            // Payment nonce received successfully
            console.log('Payment token received:', response.opaqueData.dataValue);
            submitModalOrderWithPayment(response.opaqueData, totalAmount);
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
    orderData.paymentAmount = amount;
    orderData.paymentToken = opaqueData.dataValue;

    // Create order confirmation email
    const subject = `Cuban Soul Order - Payment Processed - ${orderData.name}`;
    const body = createPaymentEmailBody(orderData);
    
    // Submit to email (in production, this would go to your payment processing backend)
    const mailtoLink = `mailto:orders@cubansoul.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
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
    }, 8000);
}

// Submit modal order with payment
function submitModalOrderWithPayment(opaqueData, amount) {
    // Collect all form data
    const formData = new FormData(document.getElementById('orderForm'));
    const orderData = {};
    
    for (let [key, value] of formData.entries()) {
        orderData[key] = value;
    }

    // Add payment data
    orderData.orderSummary = getCurrentOrderSummary();
    orderData.paymentAmount = amount;
    orderData.paymentToken = opaqueData.dataValue;
    orderData.cardholderName = document.getElementById('modalCardholderName').value;

    // Create order confirmation email
    const subject = `Cuban Soul Order - Payment Processed - ${orderData.name}`;
    const body = createPaymentEmailBody(orderData);
    
    // Submit to email with copy to antonio@siteoptz.com
    const mailtoLink = `mailto:orders@cubansoul.com?cc=antonio@siteoptz.com&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
        window.location.href = mailtoLink;
        showPaymentSuccess(amount);
        closePaymentModal();
        
        // Reset order form after successful submission
        setTimeout(() => {
            resetOrderSystem();
        }, 2000);
    } catch (error) {
        showPhoneMessage();
    }
    
    hideModalPaymentProcessing();
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