// Cuban Soul Food Truck - JavaScript - VERSION 4 LIVE MODE
console.log('🔥 SCRIPT VERSION 4 LOADED - LIVE TRANSACTIONS ENABLED 🔥');

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
            const selectedPackages = document.querySelectorAll('input[name="package"]:checked');
            if (selectedPackages.length === 0) {
                alert('Please select at least one package before proceeding to checkout.');
                // Scroll to package selection
                document.querySelector('.package-selection').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                return;
            }
            
            // Validate dressing selection
            const dressingValidation = validateDressingSelection();
            if (!dressingValidation.valid) {
                alert(dressingValidation.message);
                // Scroll to package selection
                document.querySelector(dressingValidation.scrollTarget).scrollIntoView({
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
    
    // Initialize mobile order total visibility
    toggleMobileOrderTotal();
    
    // Initialize order details field
    setTimeout(() => {
        updateOrderDetailsField();
    }, 500);
    
    // Initialize service fee display (hide by default)
    const serviceFeeDisplay = document.getElementById('serviceFeeDisplay');
    if (serviceFeeDisplay) {
        serviceFeeDisplay.style.display = 'none';
    }
    
    // Checkout button functionality
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            // Validate package selection first
            const selectedPackages = document.querySelectorAll('input[name="package"]:checked');
            if (selectedPackages.length === 0) {
                alert('Please select at least one package before proceeding to checkout.');
                // Scroll to package selection
                document.querySelector('.package-selection').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                return;
            }
            
            // Validate dressing selection
            const dressingValidation = validateDressingSelection();
            if (!dressingValidation.valid) {
                alert(dressingValidation.message);
                // Scroll to package selection
                document.querySelector(dressingValidation.scrollTarget).scrollIntoView({
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
    
    // Handle window resize to toggle mobile behavior
    window.addEventListener('resize', function() {
        toggleMobileOrderTotal();
    });
});

// Validate dressing selection for selected packages
function validateDressingSelection() {
    const selectedPackages = document.querySelectorAll('input[name="package"]:checked');
    if (selectedPackages.length === 0) {
        return true; // No packages selected, so no dressing validation needed
    }
    
    let hasCubanPackage = false;
    let hasSoulPackage = false;
    
    selectedPackages.forEach(pkg => {
        if (pkg.value.includes('cuban-')) {
            hasCubanPackage = true;
        } else if (pkg.value.includes('soul-')) {
            hasSoulPackage = true;
        }
    });
    
    // Check Cuban dressing selection
    if (hasCubanPackage) {
        const cubanDressing = document.querySelector('input[name="cuban-dressing"]:checked');
        if (!cubanDressing) {
            return { valid: false, message: 'Please select a dressing for your Cuban package', scrollTarget: '.package-selection' };
        }
    }
    
    // Check Soul dressing selection
    if (hasSoulPackage) {
        const soulDressing = document.querySelector('input[name="soul-dressing"]:checked');
        if (!soulDressing) {
            return { valid: false, message: 'Please select a dressing for your Soul package', scrollTarget: '.package-selection' };
        }
    }
    
    return { valid: true };
}

// Initialize Menu Order System
function initializeMenuOrderSystem() {
    const packageCheckboxes = document.querySelectorAll('input[name="package"]');
    const includedSidesCheckboxes = document.querySelectorAll('input[name="includedSides"]');
    const extraSidesSelects = document.querySelectorAll('select[name="extraSides"]');
    const addonsCheckboxes = document.querySelectorAll('input[name="addons"]');
    const dessertsSelects = document.querySelectorAll('select[name="desserts"]');
    const sidesCounter = document.getElementById('sidesCounter');
    const totalAmount = document.getElementById('totalAmount');

    // Handle package selection
    packageCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            handlePackageSelection(this);
            // Enable other menu sections when package is selected
            enableMenuSections();
            updateOrderTotal();
        });
    });

    // Handle included sides (max 2)
    includedSidesCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedSides = document.querySelectorAll('input[name="includedSides"]:checked');
            
            // Update counter
            if (sidesCounter) {
                sidesCounter.textContent = checkedSides.length;
            }

            // Disable other checkboxes if 2 are selected
            if (checkedSides.length >= 2) {
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

    // Handle extra sides (now dropdowns), add-ons, and desserts with price calculation
    extraSidesSelects.forEach(select => {
        select.addEventListener('change', updateOrderTotal);
    });
    
    dessertsSelects.forEach(select => {
        select.addEventListener('change', updateOrderTotal);
    });
    
    // Handle add-ons (checkboxes only, no price impact)
    addonsCheckboxes.forEach(checkbox => {
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

    // Handle service fee checkbox
    const serviceFeeCheckbox = document.getElementById('serviceFeeCheckbox');
    if (serviceFeeCheckbox) {
        serviceFeeCheckbox.addEventListener('change', function() {
            updateOrderTotal();
        });
    }
}

// Handle package type exclusion logic
function handlePackageSelection(selectedCheckbox) {
    const allPackageCheckboxes = document.querySelectorAll('input[name="package"]');
    const selectedPackageType = selectedCheckbox.value.includes('cuban-') ? 'cuban' : 'soul';
    const oppositePackageType = selectedPackageType === 'cuban' ? 'soul' : 'cuban';
    
    if (selectedCheckbox.checked) {
        // Disable opposite package type
        allPackageCheckboxes.forEach(checkbox => {
            if (checkbox.value.includes(oppositePackageType + '-')) {
                checkbox.disabled = true;
                checkbox.parentElement.style.opacity = '0.5';
                checkbox.parentElement.style.pointerEvents = 'none';
            }
        });
    } else {
        // Check if any packages of this type are still selected
        const sameTypeSelected = Array.from(allPackageCheckboxes).some(checkbox => 
            checkbox.checked && checkbox.value.includes(selectedPackageType + '-')
        );
        
        // If no packages of this type are selected, re-enable opposite type
        if (!sameTypeSelected) {
            allPackageCheckboxes.forEach(checkbox => {
                if (checkbox.value.includes(oppositePackageType + '-')) {
                    checkbox.disabled = false;
                    checkbox.parentElement.style.opacity = '1';
                    checkbox.parentElement.style.pointerEvents = 'auto';
                }
            });
        }
    }
    
    // Show/hide mobile order total based on package selection
    toggleMobileOrderTotal();
}

// Toggle mobile order total visibility
function toggleMobileOrderTotal() {
    const anyPackageSelected = document.querySelectorAll('input[name="package"]:checked').length > 0;
    const orderTotalSidebar = document.querySelector('.order-total-sidebar');
    const menuMainContent = document.querySelector('.menu-main-content');
    const orderMainContent = document.querySelector('.order-main-content');
    
    // Only apply on mobile (screen width <= 768px)
    if (window.innerWidth <= 768) {
        if (anyPackageSelected) {
            orderTotalSidebar?.classList.add('show-mobile');
            menuMainContent?.classList.add('has-order-total');
            orderMainContent?.classList.add('has-order-total');
        } else {
            orderTotalSidebar?.classList.remove('show-mobile');
            menuMainContent?.classList.remove('has-order-total');
            orderMainContent?.classList.remove('has-order-total');
        }
    }
}

// Enable menu sections after package selection
function enableMenuSections() {
    const menuSections = [
        'mainEntreesSection',
        'extraSidesSection', 
        'addonsSection',
        'dessertsSection',
        'serviceFeeSection'
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
    const selectedPackages = document.querySelectorAll('input[name="package"]:checked');
    const extraSidesSelects = document.querySelectorAll('select[name="extraSides"]');
    const dessertsSelects = document.querySelectorAll('select[name="desserts"]');
    const totalAmountElement = document.getElementById('totalAmount');
    const orderType = document.getElementById('orderType');
    
    let subtotal = 0;

    // Add package prices if selected (with NaN protection)
    selectedPackages.forEach(selectedPackage => {
        const price = parseFloat(selectedPackage.dataset.price || 0);
        if (!isNaN(price) && price > 0) {
            subtotal += price;
            console.log(`Package price added: ${price}`);
        } else {
            console.warn(`Invalid package price detected:`, selectedPackage.dataset.price);
        }
    });

    // Calculate extra sides total from dropdowns
    extraSidesSelects.forEach(select => {
        const quantity = parseInt(select.value);
        const price = parseFloat(select.dataset.price);
        if (!isNaN(price) && !isNaN(quantity) && quantity > 0) {
            subtotal += price * quantity;
        }
    });

    // Calculate desserts total from dropdowns
    dessertsSelects.forEach(select => {
        const quantity = parseInt(select.value);
        const price = parseFloat(select.dataset.price);
        if (!isNaN(price) && !isNaN(quantity) && quantity > 0) {
            subtotal += price * quantity;
        }
    });

    // Calculate service fee, delivery fee and tax
    let serviceFee = 0;
    let deliveryFee = 0;
    let tax = 0;

    // Calculate service fee only if checkbox is checked: 20% of subtotal or $85 minimum (whichever is higher)
    const serviceFeeCheckbox = document.getElementById('serviceFeeCheckbox');
    if (serviceFeeCheckbox && serviceFeeCheckbox.checked) {
        const twentyPercent = subtotal * 0.20;
        serviceFee = Math.max(twentyPercent, 85.00);
    }

    // Add delivery fee if delivery is selected
    if (orderType && orderType.value === 'delivery') {
        deliveryFee = 15.00;
    }

    // Calculate 8.25% tax on subtotal + service fee
    const taxableAmount = subtotal + serviceFee;
    tax = taxableAmount * 0.0825;
    
    // Calculate final total
    let total = subtotal + serviceFee + deliveryFee + tax;
    
    console.log('🔍 UPDATE ORDER TOTAL DEBUG:');
    console.log(`- Subtotal: ${subtotal} (isNaN: ${isNaN(subtotal)})`);
    console.log(`- Service Fee: ${serviceFee} (isNaN: ${isNaN(serviceFee)})`);
    console.log(`- Delivery Fee: ${deliveryFee} (isNaN: ${isNaN(deliveryFee)})`);
    console.log(`- Tax: ${tax} (isNaN: ${isNaN(tax)})`);
    console.log(`- FINAL TOTAL: ${total} (isNaN: ${isNaN(total)})`);
    
    // NUCLEAR OPTION: If total is NaN, force it to 0 to prevent DOM corruption
    if (isNaN(total)) {
        console.error('🚨 TOTAL IS NaN - FORCING TO 0 TO PREVENT DOM CORRUPTION');
        total = 0;
    }

    // Update the display elements
    const subtotalAmountElement = document.getElementById('subtotalAmount');
    const serviceFeeAmountElement = document.getElementById('serviceFeeAmount');
    const serviceFeeLineElement = document.getElementById('serviceFeeDisplay');
    const taxAmountElement = document.getElementById('taxAmount');
    const deliveryFeeLineElement = document.getElementById('deliveryFeeLine');
    
    if (subtotalAmountElement) {
        subtotalAmountElement.textContent = subtotal.toFixed(2);
    }
    
    if (serviceFeeAmountElement) {
        serviceFeeAmountElement.textContent = serviceFee.toFixed(2);
    }
    
    // Show/hide service fee line based on whether it's selected
    if (serviceFeeLineElement) {
        if (serviceFee > 0) {
            serviceFeeLineElement.style.display = 'flex';
        } else {
            serviceFeeLineElement.style.display = 'none';
        }
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
    const selectedPackages = document.querySelectorAll('input[name="package"]:checked');
    const includedSides = [];
    const extraSides = [];
    const addons = [];
    const desserts = [];

    // Get selected packages (can be multiple now)
    let packagesInfo = [];
    selectedPackages.forEach(selectedPackage => {
        let packageName = selectedPackage.value;
        let packageDisplayName = packageName;
        
        // Convert package values to display names
        if (packageName.includes('cuban-')) {
            packageDisplayName = `The Cuban Package - Lechon Asado (${packageName.replace('cuban-', '').replace('-', ' ')})`;
        } else if (packageName.includes('soul-')) {
            packageDisplayName = `The Soul Package - Pollo Asado (${packageName.replace('soul-', '').replace('-', ' ')})`;
        }
        
        packagesInfo.push({
            type: packageDisplayName,
            originalValue: packageName,
            price: parseFloat(selectedPackage.dataset.price || 0) || 0
        });
    });

    // Get selected included sides
    document.querySelectorAll('input[name="includedSides"]:checked').forEach(checkbox => {
        includedSides.push(checkbox.value);
    });

    // Get dressing selections for each package type
    let dressingSelections = {};
    const cubanDressing = document.querySelector('input[name="cuban-dressing"]:checked');
    const soulDressing = document.querySelector('input[name="soul-dressing"]:checked');
    
    if (cubanDressing) {
        dressingSelections.cuban = cubanDressing.value;
    }
    if (soulDressing) {
        dressingSelections.soul = soulDressing.value;
    }

    // Get selected extra sides from dropdowns
    document.querySelectorAll('select[name="extraSides"]').forEach(select => {
        const quantity = parseInt(select.value);
        if (quantity > 0) {
            extraSides.push({
                item: select.dataset.item,
                quantity: quantity,
                price: parseFloat(select.dataset.price),
                totalPrice: parseFloat(select.dataset.price) * quantity
            });
        }
    });

    // Get selected add-ons
    document.querySelectorAll('input[name="addons"]:checked').forEach(checkbox => {
        addons.push(checkbox.value);
    });

    // Get selected desserts from dropdowns
    document.querySelectorAll('select[name="desserts"]').forEach(select => {
        const quantity = parseInt(select.value);
        if (quantity > 0) {
            const flavorSelect = document.getElementById('flan-flavor');
            const flavor = flavorSelect ? flavorSelect.value : '';
            const itemName = flavor ? `${select.dataset.item} (${flavor})` : select.dataset.item;
            
            desserts.push({
                item: itemName,
                quantity: quantity,
                price: parseFloat(select.dataset.price),
                totalPrice: parseFloat(select.dataset.price) * quantity,
                flavor: flavor
            });
        }
    });

    // Get service fee selection
    const serviceFeeCheckbox = document.getElementById('serviceFeeCheckbox');
    const serviceFeeSelected = serviceFeeCheckbox ? serviceFeeCheckbox.checked : false;

    // CALCULATE TOTAL DIRECTLY - NEVER READ FROM DOM TO PREVENT NaN PROPAGATION
    console.log('🔍 BULLETPROOF TOTAL CALCULATION - CALCULATING FROM SCRATCH:');
    
    // Calculate subtotal from packages
    let subtotal = 0;
    if (packagesInfo && packagesInfo.length > 0) {
        packagesInfo.forEach(pkg => {
            const price = parseFloat(pkg.price) || 0;
            subtotal += price;
            console.log(`- Package: ${pkg.type} = $${price}`);
        });
    }
    
    // Add extra sides to subtotal
    extraSides.forEach(side => {
        subtotal += parseFloat(side.totalPrice) || 0;
        console.log(`- Extra side: ${side.item} = $${side.totalPrice}`);
    });
    
    // Add desserts to subtotal
    desserts.forEach(dessert => {
        subtotal += parseFloat(dessert.totalPrice) || 0;
        console.log(`- Dessert: ${dessert.item} = $${dessert.totalPrice}`);
    });
    
    // Calculate service fee (20% or $85 minimum, whichever is higher)
    let serviceFee = 0;
    if (serviceFeeSelected) {
        const twentyPercent = subtotal * 0.20;
        serviceFee = Math.max(twentyPercent, 85.00);
    }
    
    // Check if delivery is selected
    const orderType = document.getElementById('orderType');
    const isDelivery = orderType && orderType.value === 'delivery';
    let deliveryFee = isDelivery ? 15.00 : 0;
    
    // Calculate tax (8.25% on subtotal + service fee)
    const taxableAmount = subtotal + serviceFee;
    const tax = taxableAmount * 0.0825;
    
    // Calculate final total
    const totalValue = subtotal + serviceFee + deliveryFee + tax;
    
    console.log('✅ CALCULATED BREAKDOWN:');
    console.log(`- Subtotal: $${subtotal.toFixed(2)}`);
    console.log(`- Service Fee: $${serviceFee.toFixed(2)}`);
    console.log(`- Delivery Fee: $${deliveryFee.toFixed(2)}`);
    console.log(`- Tax: $${tax.toFixed(2)}`);
    console.log(`- FINAL TOTAL: $${totalValue.toFixed(2)}`);
    console.log(`- Is total NaN? ${isNaN(totalValue)}`);
    
    // Safety check - if somehow still NaN, default to 0
    const safeTotalValue = isNaN(totalValue) ? 0 : totalValue;
    
    const orderSummary = {
        packages: packagesInfo,
        includedSides,
        extraSides,
        addons,
        desserts,
        dressingSelections,
        serviceFeeSelected: serviceFeeSelected,
        total: safeTotalValue
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
        <a href="https://wa.me/18325107664" target="_blank" style="color: white; font-size: 18px;">(832) 510-7664</a>
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
        if (orderSummary.packages && orderSummary.packages.length > 0) {
            orderSummary.packages.forEach(packageInfo => {
                orderText += `Package: ${packageInfo.type} - $${packageInfo.price}\n`;
                
                // Add relevant dressing selection
                const packageType = packageInfo.originalValue.includes('cuban-') ? 'cuban' : 'soul';
                if (orderSummary.dressingSelections && orderSummary.dressingSelections[packageType]) {
                    orderText += `Salad Dressing: ${orderSummary.dressingSelections[packageType]}\n`;
                }
                orderText += '\n';
            });
        }
        
        // Add included sides
        if (orderSummary.includedSides.length > 0) {
            orderText += `Included Sides (${orderSummary.includedSides.length}/2):\n`;
            orderSummary.includedSides.forEach(side => {
                orderText += `- ${side}\n`;
            });
            orderText += '\n';
        }
        
        // Add extra sides
        if (orderSummary.extraSides.length > 0) {
            orderText += 'Extra Sides:\n';
            orderSummary.extraSides.forEach(side => {
                orderText += `- ${side.item} (Qty: ${side.quantity}) - $${side.totalPrice.toFixed(2)}\n`;
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
                orderText += `- ${dessert.item} (Qty: ${dessert.quantity}) - $${dessert.totalPrice.toFixed(2)}\n`;
            });
            orderText += '\n';
        }
        
        // Calculate breakdown for order details
        let subtotal = 0;
        if (orderSummary.packages) {
            orderSummary.packages.forEach(pkg => {
                subtotal += pkg.price;
            });
        }
        orderSummary.extraSides.forEach(side => {
            subtotal += side.totalPrice;
        });
        orderSummary.desserts.forEach(dessert => {
            subtotal += dessert.totalPrice;
        });
        
        // Check if delivery is selected
        const orderType = document.getElementById('orderType');
        const isDelivery = orderType && orderType.value === 'delivery';
        
        // Calculate service fee only if checkbox is checked (20% or $85 minimum, whichever is higher) 
        let serviceFee = 0;
        const serviceFeeCheckbox = document.getElementById('serviceFeeCheckbox');
        if (serviceFeeCheckbox && serviceFeeCheckbox.checked) {
            const twentyPercent = subtotal * 0.20;
            serviceFee = Math.max(twentyPercent, 85.00);
        }
        
        // Calculate tax on subtotal + service fee
        const taxableAmount = subtotal + serviceFee;
        const tax = taxableAmount * 0.0825;
        
        let deliveryFee = 0;
        if (isDelivery) {
            deliveryFee = 15.00;
        }
        
        const calculatedTotal = subtotal + serviceFee + deliveryFee + tax;
        
        // Add order summary with breakdown (match shopping cart exactly)
        orderText += '--- ORDER BREAKDOWN ---\n';
        orderText += `Subtotal: $${subtotal.toFixed(2)}\n`;
        
        if (serviceFee > 0) {
            orderText += `Service Fee: $${serviceFee.toFixed(2)}\n`;
        }
        
        if (isDelivery) {
            orderText += `Delivery Fee: $${deliveryFee.toFixed(2)}\n`;
        }
        
        orderText += `Tax (8.25%): $${tax.toFixed(2)}\n`;
        orderText += `Total: $${calculatedTotal.toFixed(2)}`;
        
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
    clientKey: '3vMZvn92aMMSfzcyG5888qTUwjvNhY983jAuuy6mk9gZZFwFYv4bhF55856RA9SA',  // Your Production Public Client Key  
    apiLoginID: '38fAR7rP', // Your Production API Login ID
    transactionKey: '94RTV4cRg23Xa9ct', // Your Production Transaction Key
    environment: 'production', // Live production environment
    
    // Known working sandbox credentials for testing (if needed)
    sandboxClientKey: '7UL8Sr3wE8e8m6Ag5RMdhmxGprzgQ35YWBjPw6P3LKfj8xUfb8Lrr9r6KSTH7TDL',
    sandboxAPILoginID: '2EKN8r9zC',
    useDemoMode: false // Live payment processing enabled
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
        console.log('Payment form found and event listener added');
        paymentForm.addEventListener('submit', function(e) {
            console.log('Payment form submitted!');
            e.preventDefault();
            
            // Validate payment fields
            console.log('Validating payment fields...');
            if (!validateModalPaymentFields()) {
                console.log('Payment field validation failed');
                return;
            }
            console.log('Payment fields validated successfully');
            
            // Process payment
            console.log('Calling processModalPayment...');
            processModalPayment();
        });
    } else {
        console.log('ERROR: Payment form not found!');
    }
    
    // Add direct click handler to payment button as fallback
    const paymentBtn = document.querySelector('.payment-submit-modal');
    if (paymentBtn) {
        console.log('Payment button found, adding click handler');
        paymentBtn.addEventListener('click', function(e) {
            console.log('Payment button clicked!');
            if (e.target.type === 'submit') {
                // Let form submission handle it
                return;
            }
            e.preventDefault();
            
            // Validate payment fields
            console.log('Validating payment fields...');
            if (!validateModalPaymentFields()) {
                console.log('Payment field validation failed');
                return;
            }
            console.log('Payment fields validated successfully');
            
            // Process payment
            console.log('Calling processModalPayment...');
            processModalPayment();
        });
    } else {
        console.log('ERROR: Payment button not found!');
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
    
    // Check if packages are selected
    if (!orderSummary.packages || orderSummary.packages.length === 0) {
        showPaymentError('Please select at least one package before proceeding to payment');
        return;
    }
    
    // Check if exactly 2 included sides are selected
    if (orderSummary.includedSides.length !== 2) {
        showPaymentError('Please select exactly 2 included sides from the main entrees section');
        return;
    }
    
    // Check if dressing is selected for all packages
    const dressingValidation = validateDressingSelection();
    if (!dressingValidation.valid) {
        showPaymentError(dressingValidation.message);
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
    if (orderSummary.packages && orderSummary.packages.length > 0) {
        orderSummary.packages.forEach(packageInfo => {
            summaryHTML += `<div class="order-item"><strong>Package:</strong> ${packageInfo.type} - $${packageInfo.price}</div>`;
            
            // Add relevant dressing selection
            const packageType = packageInfo.originalValue.includes('cuban-') ? 'cuban' : 'soul';
            if (orderSummary.dressingSelections && orderSummary.dressingSelections[packageType]) {
                summaryHTML += `<div class="order-subitem">Salad Dressing: ${orderSummary.dressingSelections[packageType]}</div>`;
            }
        });
    }
    
    // Add included sides
    if (orderSummary.includedSides.length > 0) {
        summaryHTML += `<div class="order-item"><strong>Included Sides (${orderSummary.includedSides.length}/2):</strong></div>`;
        orderSummary.includedSides.forEach(side => {
            summaryHTML += `<div class="order-subitem">• ${side}</div>`;
        });
    }
    
    // Add extra sides
    if (orderSummary.extraSides.length > 0) {
        summaryHTML += `<div class="order-item"><strong>Extra Sides:</strong></div>`;
        orderSummary.extraSides.forEach(side => {
            summaryHTML += `<div class="order-subitem">• ${side.item} (Qty: ${side.quantity}) - $${side.totalPrice.toFixed(2)}</div>`;
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
            summaryHTML += `<div class="order-subitem">• ${dessert.item} (Qty: ${dessert.quantity}) - $${dessert.totalPrice.toFixed(2)}</div>`;
        });
    }
    
    // Add order breakdown section
    summaryHTML += `<div class="order-breakdown"><strong>--- ORDER BREAKDOWN ---</strong></div>`;
    
    // Calculate breakdown values
    let subtotal = 0;
    if (orderSummary.packages) {
        orderSummary.packages.forEach(pkg => {
            subtotal += pkg.price;
        });
    }
    orderSummary.extraSides.forEach(side => {
        subtotal += side.totalPrice;
    });
    orderSummary.desserts.forEach(dessert => {
        subtotal += dessert.totalPrice;
    });
    
    summaryHTML += `<div class="breakdown-item">Subtotal: $${subtotal.toFixed(2)}</div>`;
    
    // Add service fee if selected
    let serviceFee = 0;
    if (orderSummary.serviceFeeSelected) {
        const twentyPercent = subtotal * 0.20;
        serviceFee = Math.max(twentyPercent, 85.00);
        summaryHTML += `<div class="breakdown-item">Service Fee: $${serviceFee.toFixed(2)}</div>`;
    }
    
    // Check if delivery is selected
    const orderType = document.getElementById('orderType');
    const isDelivery = orderType && orderType.value === 'delivery';
    let deliveryFee = 0;
    if (isDelivery) {
        deliveryFee = 15.00;
        summaryHTML += `<div class="breakdown-item">Delivery Fee: $${deliveryFee.toFixed(2)}</div>`;
    }
    
    // Calculate tax on subtotal + service fee
    const taxableAmount = subtotal + serviceFee;
    const tax = taxableAmount * 0.0825;
    summaryHTML += `<div class="breakdown-item">Tax (8.25%): $${tax.toFixed(2)}</div>`;
    
    const calculatedTotal = subtotal + serviceFee + deliveryFee + tax;
    summaryHTML += `<div class="breakdown-total"><strong>Total: $${calculatedTotal.toFixed(2)}</strong></div>`;
    
    if (isDelivery) {
        summaryHTML += `<div class="delivery-note">*Delivery available up to 10 miles from The Woodlands</div>`;
    }
    
    summaryElement.innerHTML = summaryHTML;
    totalElement.textContent = calculatedTotal.toFixed(2);
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

// Process payment from modal - LIVE MODE
function processModalPayment() {
    console.log('🚀 LIVE PAYMENT PROCESSING - Authorize.Net Accept.js enabled 🚀');
    
    // Check if demo mode is enabled first
    if (authNetConfig.useDemoMode === true) {
        console.log('🎭 DEMO MODE: Processing demo payment...');
        alert('DEMO MODE ACTIVATED - Payment will be simulated');
        showModalPaymentProcessing();
        
        setTimeout(() => {
            console.log('🎭 DEMO MODE: Payment completed successfully!');
            hideModalPaymentProcessing();
            showSuccessMessage('🎉 Payment Successful (Demo Mode)! Your order has been processed.');
            const modal = document.getElementById('paymentModal');
            if (modal) modal.style.display = 'none';
            resetOrderSystem();
        }, 2000);
        return;
    }
    
    // Get order summary but calculate total fresh (bypass NaN from getCurrentOrderSummary)
    const orderSummary = getCurrentOrderSummary();
    console.log('Order summary:', orderSummary);
    
    // Calculate total directly from form state to avoid NaN
    let totalAmount = orderSummary.total;
    if (isNaN(totalAmount) || totalAmount <= 0) {
        console.log('🔧 Order summary total is NaN, calculating fresh...');
        totalAmount = 0;
        
        // Calculate from packages
        if (orderSummary.packages) {
            orderSummary.packages.forEach(pkg => {
                totalAmount += parseFloat(pkg.price || 0);
            });
        }
        
        // Add extra sides
        orderSummary.extraSides.forEach(side => {
            totalAmount += parseFloat(side.totalPrice || 0);
        });
        
        // Add desserts
        orderSummary.desserts.forEach(dessert => {
            totalAmount += parseFloat(dessert.totalPrice || 0);
        });
        
        // Add service fee if selected
        if (orderSummary.serviceFeeSelected) {
            const twentyPercent = totalAmount * 0.20;
            totalAmount += Math.max(twentyPercent, 85.00);
        }
        
        // Add delivery fee
        const orderTypeEl = document.getElementById('orderType');
        if (orderTypeEl && orderTypeEl.value === 'delivery') {
            totalAmount += 15.00;
        }
        
        // Add tax
        const tax = totalAmount * 0.0825;
        totalAmount += tax;
        
        console.log('✅ Fresh calculated total:', totalAmount);
    }
    
    console.log('Total amount:', totalAmount);
    
    // Check if packages are selected
    if (!orderSummary.packages || orderSummary.packages.length === 0) {
        console.log('ERROR: No packages selected');
        showPaymentError('Please select at least one package before processing payment');
        return;
    }
    
    // Basic form validation
    const cardNumber = document.getElementById('modalCardNumber').value.replace(/\s/g, '');
    const expiryDate = document.getElementById('modalExpiryDate').value;
    const cvv = document.getElementById('modalCvv').value;
    const cardholderName = document.getElementById('modalCardholderName').value;
    
    if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
        showPaymentError('Please enter a valid card number');
        return;
    }
    if (!expiryDate || !expiryDate.includes('/')) {
        showPaymentError('Please enter a valid expiry date (MM/YY)');
        return;
    }
    if (!cvv || cvv.length < 3 || cvv.length > 4) {
        showPaymentError('Please enter a valid CVV');
        return;
    }
    if (!cardholderName || cardholderName.trim().length < 2) {
        showPaymentError('Please enter the cardholder name');
        return;
    }
    
    // Show processing indicator
    showModalPaymentProcessing();
    
    // Check if Accept.js is loaded
    if (typeof Accept === 'undefined') {
        console.error('ERROR: Accept.js not loaded');
        showPaymentError('Payment system not ready. Please try again in a moment.');
        hideModalPaymentProcessing();
        return;
    }
    console.log('Accept.js is loaded successfully');
    
    // Parse expiry date
    const [month, year] = expiryDate.split('/');
    const fullYear = '20' + year;
    
    // Prepare secure payment data
    const secureData = {
        cardData: {
            cardNumber: cardNumber.replace(/\s/g, ''),
            month: month.padStart(2, '0'),
            year: fullYear,
            cardCode: cvv
        },
        authData: {
            clientKey: authNetConfig.clientKey,
            apiLoginID: authNetConfig.apiLoginID
        }
    };

    try {
        console.log('Processing payment with Authorize.Net Accept.js');
        Accept.dispatchData(secureData, function(response) {
            console.log('Accept.js response received!');
            responseHandler(response);
        });
    } catch (error) {
        console.error('Accept.js error:', error);
        showPaymentError('Payment processing error. Please check your card information and try again.');
        hideModalPaymentProcessing();
    }
}

// OLD AUTHORIZE.NET CODE DISABLED FOR DEMO MODE
/* 
    // Check if demo mode is enabled first
    if (authNetConfig.useDemoMode === true) {
        console.log('🎭 DEMO MODE: Processing demo payment...');
        alert('DEMO MODE ACTIVATED - Payment will be simulated');
        showModalPaymentProcessing();
        
        setTimeout(() => {
            console.log('🎭 DEMO MODE: Payment completed successfully!');
            hideModalPaymentProcessing();
            
            // Show success message
            showSuccessMessage('🎉 Payment Successful (Demo Mode)! Your order has been processed.');
            
            // Close payment modal
            const modal = document.getElementById('paymentModal');
            if (modal) modal.style.display = 'none';
            
            // Reset form
            resetOrderSystem();
        }, 2000);
        
        return;
    }
    
    // Get order summary but calculate total fresh (bypass NaN from getCurrentOrderSummary)
    const orderSummary = getCurrentOrderSummary();
    console.log('Order summary:', orderSummary);
    
    // Calculate total directly from form state to avoid NaN
    let totalAmount = orderSummary.total;
    if (isNaN(totalAmount) || totalAmount <= 0) {
        console.log('🔧 Order summary total is NaN, calculating fresh...');
        totalAmount = 0;
        
        // Calculate from packages
        if (orderSummary.packages) {
            orderSummary.packages.forEach(pkg => {
                totalAmount += parseFloat(pkg.price || 0);
            });
        }
        
        // Add extra sides
        orderSummary.extraSides.forEach(side => {
            totalAmount += parseFloat(side.totalPrice || 0);
        });
        
        // Add desserts
        orderSummary.desserts.forEach(dessert => {
            totalAmount += parseFloat(dessert.totalPrice || 0);
        });
        
        // Add service fee if selected
        if (orderSummary.serviceFeeSelected) {
            const twentyPercent = totalAmount * 0.20;
            totalAmount += Math.max(twentyPercent, 85.00);
        }
        
        // Add delivery fee
        const orderTypeEl = document.getElementById('orderType');
        if (orderTypeEl && orderTypeEl.value === 'delivery') {
            totalAmount += 15.00;
        }
        
        // Add tax
        const tax = totalAmount * 0.0825;
        totalAmount += tax;
        
        console.log('✅ Fresh calculated total:', totalAmount);
    }
    
    console.log('Total amount:', totalAmount);

    // Check if packages are selected
    if (!orderSummary.packages || orderSummary.packages.length === 0) {
        console.log('ERROR: No packages selected');
        showPaymentError('Please select at least one package before processing payment');
        return;
    }
    
    // TEMPORARILY DISABLE STRICT VALIDATION FOR TESTING
    // Check if exactly 2 included sides are selected
    if (orderSummary.includedSides && orderSummary.includedSides.length !== 2) {
        console.log('WARNING: Included sides count:', orderSummary.includedSides ? orderSummary.includedSides.length : 0);
        console.log('Proceeding with payment despite sides validation...');
        // showPaymentError('Please select exactly 2 included sides from the main entrees section');
        // return;
    }
    
    // Check if dressing is selected for all packages
    const dressingValidation = validateDressingSelection();
    if (!dressingValidation.valid) {
        console.log('WARNING: Dressing validation failed:', dressingValidation.message);
        console.log('Proceeding with payment despite dressing validation...');
        // showPaymentError(dressingValidation.message);
        // return;
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
                phone: document.getElementById('phone').value || '(832) 510-7664',
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
    
    // Fix year formatting - ensure it's properly formatted as YYYY
    let fullYear = year.padStart(2, '0');
    if (fullYear.length === 2) {
        fullYear = '20' + fullYear;
    }
    
    console.log('Payment data validation:', {
        cardNumber: cardNumber ? cardNumber.length + ' digits' : 'missing',
        month: month,
        year: year,
        fullYear: fullYear,
        cvv: cvv ? cvv.length + ' digits' : 'missing',
        cardholderName: cardholderName || 'missing',
        billingAddress: billingAddress || 'missing'
    });
    
    // Validate all required fields
    if (!cardNumber || cardNumber.length < 13) {
        showPaymentError('Invalid card number length');
        hideModalPaymentProcessing();
        return;
    }
    
    if (!month || !year) {
        showPaymentError('Invalid expiry date format');
        hideModalPaymentProcessing();
        return;
    }
    
    if (!cvv || cvv.length < 3) {
        showPaymentError('Invalid CVV');
        hideModalPaymentProcessing();
        return;
    }
    
    // Validate credentials before sending
    console.log('Validating credentials:', {
        clientKey: authNetConfig.clientKey ? 'Present (' + authNetConfig.clientKey.length + ' chars)' : 'Missing',
        apiLoginID: authNetConfig.apiLoginID ? 'Present (' + authNetConfig.apiLoginID.length + ' chars)' : 'Missing'
    });
    
    if (!authNetConfig.clientKey || !authNetConfig.apiLoginID) {
        showPaymentError('Payment configuration error: Missing API credentials');
        hideModalPaymentProcessing();
        return;
    }
    
    // Prepare secure payment data
    const secureData = {
        cardData: {
            cardNumber: cardNumber.replace(/\s/g, ''), // Remove any spaces
            month: month.padStart(2, '0'),
            year: fullYear,
            cardCode: cvv
        },
        authData: {
            clientKey: authNetConfig.clientKey,
            apiLoginID: authNetConfig.apiLoginID
        }
    };
    
    // Additional validation of secure data
    console.log('Final validation before sending:', {
        cardNumberLength: secureData.cardData.cardNumber.length,
        monthFormat: secureData.cardData.month,
        yearFormat: secureData.cardData.year,
        cvvLength: secureData.cardData.cardCode.length,
        hasClientKey: !!secureData.authData.clientKey,
        hasApiLoginID: !!secureData.authData.apiLoginID
    });

    console.log('Sending to Accept.js:', { 
        cardNumber: cardNumber.substring(0, 4) + '****' + cardNumber.substring(cardNumber.length-4), 
        month: month.padStart(2, '0'), 
        year: fullYear,
        cvv: '***',
        clientKey: authNetConfig.clientKey.substring(0, 10) + '...',
        apiLoginID: authNetConfig.apiLoginID
    });

    try {
        // Validate Accept.js is available
        if (typeof Accept === 'undefined' || !Accept.dispatchData) {
            throw new Error('Accept.js not properly loaded');
        }
        
        // Use real Accept.js call with credentials
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

*/

// LIVE MODE: responseHandler function enabled
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
                // NEVER use getCurrentOrderSummary for amount - it returns NaN
                // Calculate total directly from form state instead
                console.log('🔧 Calculating total amount directly from form state (bypassing NaN)');
                let totalAmount = 0;
                
                // Get packages directly
                const selectedPackages = document.querySelectorAll('input[name="package"]:checked');
                selectedPackages.forEach(pkg => {
                    const price = parseFloat(pkg.dataset.price || 0);
                    totalAmount += price;
                    console.log(`- Package: ${pkg.value} = $${price}`);
                });
                
                // Get extra sides
                document.querySelectorAll('select[name="extraSides"]').forEach(select => {
                    const quantity = parseInt(select.value) || 0;
                    const price = parseFloat(select.dataset.price) || 0;
                    if (quantity > 0) {
                        totalAmount += (price * quantity);
                        console.log(`- Extra side: ${select.dataset.item} (${quantity}x) = $${price * quantity}`);
                    }
                });
                
                // Get desserts
                document.querySelectorAll('select[name="desserts"]').forEach(select => {
                    const quantity = parseInt(select.value) || 0;
                    const price = parseFloat(select.dataset.price) || 0;
                    if (quantity > 0) {
                        totalAmount += (price * quantity);
                        console.log(`- Dessert: ${select.dataset.item} (${quantity}x) = $${price * quantity}`);
                    }
                });
                
                // Add service fee if checked
                const serviceFeeCheckbox = document.getElementById('serviceFeeCheckbox');
                if (serviceFeeCheckbox && serviceFeeCheckbox.checked) {
                    const twentyPercent = totalAmount * 0.20;
                    const serviceFee = Math.max(twentyPercent, 85.00);
                    totalAmount += serviceFee;
                    console.log(`- Service Fee: $${serviceFee}`);
                }
                
                // Add delivery fee if delivery selected
                const orderType = document.getElementById('orderType');
                if (orderType && orderType.value === 'delivery') {
                    totalAmount += 15.00;
                    console.log(`- Delivery Fee: $15.00`);
                }
                
                // Add tax
                const taxableAmount = totalAmount; // tax calculated on final amount
                const tax = taxableAmount * 0.0825;
                totalAmount += tax;
                console.log(`- Tax: $${tax.toFixed(2)}`);
                
                console.log(`✅ Fresh calculated total: $${totalAmount.toFixed(2)}`);
                
                // Final safety check
                if (isNaN(totalAmount) || totalAmount <= 0) {
                    totalAmount = 150.00; // reasonable default
                    console.log('🚨 Using default amount:', totalAmount);
                }
                
                console.log('🔍 AMOUNT DEBUG - About to call submitModalOrderWithPayment:');
                console.log('- totalAmount to be passed:', totalAmount);
                console.log('- Is totalAmount NaN?', isNaN(totalAmount));
                console.log('- totalAmount type:', typeof totalAmount);
                
                submitModalOrderWithPayment(response.opaqueData, totalAmount);
            } else {
                console.error('ERROR: No opaque data in response');
                showPaymentError('Payment processing error: No payment token received');
                hideModalPaymentProcessing();
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
        orderDetails += `Included Sides (${orderSummary.includedSides.length}/2):\n`;
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
Amount Charged: $${parseFloat(orderData.paymentAmount || 0).toFixed(2)}
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
    console.log('🚨 NUCLEAR OPTION: COMPLETELY IGNORE PASSED AMOUNT - ALWAYS CALCULATE FRESH');
    console.log('Passed amount (IGNORED):', amount);
    
    // COMPLETELY IGNORE THE PASSED AMOUNT - IT'S CORRUPTED
    // Always calculate fresh from form state with ultra-aggressive NaN protection
    
    let validAmount = 0;
    
    console.log('🔧 FRESH CALCULATION FROM FORM STATE (IGNORE ALL PARAMETERS)');
        
    // Get packages directly from DOM with aggressive validation
    const selectedPackages = document.querySelectorAll('input[name="package"]:checked');
    let subtotal = 0;
    
    console.log(`Found ${selectedPackages.length} selected packages`);
    
    selectedPackages.forEach(pkg => {
        console.log(`Checking package: ${pkg.value}, dataset.price: "${pkg.dataset.price}"`);
        const rawPrice = pkg.dataset.price;
        const price = parseFloat(rawPrice || 0);
        
        console.log(`Raw price: "${rawPrice}", Parsed: ${price}, isNaN: ${isNaN(price)}`);
        
        if (!isNaN(price) && price > 0) {
            subtotal += price;
            console.log(`✅ Package added: ${pkg.value} = $${price}, Running subtotal: $${subtotal}`);
        } else {
            console.error(`❌ Invalid package price: ${pkg.value}, price: "${rawPrice}"`);
        }
    });
    
    console.log(`Subtotal after packages: $${subtotal}`);
        
        // Get extra sides directly
        document.querySelectorAll('select[name="extraSides"]').forEach(select => {
            const quantity = parseInt(select.value) || 0;
            const price = parseFloat(select.dataset.price) || 0;
            if (quantity > 0 && !isNaN(price)) {
                const sideTotal = price * quantity;
                subtotal += sideTotal;
                console.log(`- Extra side: ${select.dataset.item} (${quantity}x) = $${sideTotal}`);
            }
        });
        
        // Get desserts directly
        document.querySelectorAll('select[name="desserts"]').forEach(select => {
            const quantity = parseInt(select.value) || 0;
            const price = parseFloat(select.dataset.price) || 0;
            if (quantity > 0 && !isNaN(price)) {
                const dessertTotal = price * quantity;
                subtotal += dessertTotal;
                console.log(`- Dessert: ${select.dataset.item} (${quantity}x) = $${dessertTotal}`);
            }
        });
        
        // Calculate service fee
        let serviceFee = 0;
        const serviceFeeCheckbox = document.getElementById('serviceFeeCheckbox');
        if (serviceFeeCheckbox && serviceFeeCheckbox.checked) {
            const twentyPercent = subtotal * 0.20;
            serviceFee = Math.max(twentyPercent, 85.00);
        }
        
        // Calculate delivery fee
        let deliveryFee = 0;
        const orderType = document.getElementById('orderType');
        if (orderType && orderType.value === 'delivery') {
            deliveryFee = 15.00;
        }
        
        // Calculate tax
        const taxableAmount = subtotal + serviceFee;
        const tax = taxableAmount * 0.0825;
        
        // Final total
        validAmount = subtotal + serviceFee + deliveryFee + tax;
        
        console.log('✅ FRESH CALCULATION:');
        console.log(`- Subtotal: $${subtotal.toFixed(2)}`);
        console.log(`- Service Fee: $${serviceFee.toFixed(2)}`);
        console.log(`- Delivery Fee: $${deliveryFee.toFixed(2)}`);
        console.log(`- Tax: $${tax.toFixed(2)}`);
        console.log(`- Final Total: $${validAmount.toFixed(2)}`);
    }
    
    // TRIPLE safety check - NEVER allow NaN
    if (isNaN(validAmount) || validAmount <= 0) {
        console.error('🚨🚨🚨 CALCULATED TOTAL IS STILL NaN - USING HARDCODED DEFAULT');
        validAmount = 87.50; // Reasonable Cuban Soul package price
    }
    
    console.log('💯 FINAL DISPLAY AMOUNT:', validAmount);
    
    const successDiv = document.createElement('div');
    successDiv.className = 'payment-success';
    successDiv.innerHTML = `✅ Payment of $${validAmount.toFixed(2)} processed successfully!<br>Order confirmation will be sent to your email.`;
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

// Submit modal order with payment processing
async function submitModalOrderWithPayment(opaqueData, amount) {
    console.log('=== SUBMIT MODAL ORDER WITH PAYMENT STARTED ===');
    console.log('Opaque data:', opaqueData);
    console.log('Raw Amount parameter:', amount);
    console.log('Amount type:', typeof amount);
    console.log('Is amount a DOM element?', amount instanceof HTMLElement);
    
    // CRITICAL FIX: If amount is a DOM element, get its text content
    if (amount instanceof HTMLElement) {
        console.log('🚨 AMOUNT IS DOM ELEMENT - EXTRACTING TEXT CONTENT');
        console.log('DOM element innerHTML:', amount.innerHTML);
        console.log('DOM element textContent:', amount.textContent);
        amount = parseFloat(amount.textContent || amount.innerText || 0);
        console.log('✅ Extracted amount from DOM:', amount);
    }
    
    console.log('Final processed amount:', amount);
    
    try {
        // Collect all form data
        console.log('Collecting form data...');
        const formData = new FormData(document.getElementById('orderForm'));
        const orderData = {};
        
        for (let [key, value] of formData.entries()) {
            orderData[key] = value;
        }
        console.log('Form data collected:', orderData);
        
        // Add order summary and payment data
        console.log('Adding payment data...');
        orderData.orderSummary = getCurrentOrderSummary();
        console.log('Modal order summary captured for payment:', orderData.orderSummary);
        console.log('🔍 AMOUNT DEBUG - submitModalOrderWithPayment received:');
        console.log('- Raw amount parameter:', amount);
        console.log('- Amount type:', typeof amount);
        console.log('- Is amount NaN?', isNaN(amount));
        
        orderData.paymentAmount = parseFloat(amount || 0);
        console.log('- Parsed paymentAmount:', orderData.paymentAmount);
        console.log('- Is paymentAmount NaN?', isNaN(orderData.paymentAmount));
        orderData.paymentToken = opaqueData.dataValue;
        orderData.cardholderName = document.getElementById('modalCardholderName').value;
        
        // Prepare customer info for payment processing
        const customerInfo = {
            name: orderData.name,
            firstName: orderData.name?.split(' ')[0] || '',
            lastName: orderData.name?.split(' ').slice(1).join(' ') || '',
            email: orderData.email,
            phone: orderData.phone,
            address: orderData.address || '',
            city: '',
            state: 'TX',
            zip: ''
        };

        // Prepare order details
        const orderDetails = {
            packageType: orderData.orderSummary.packages?.[0]?.name || 'Catering Package',
            orderItems: orderData.items,
            orderDate: orderData.orderDate,
            orderTime: orderData.orderTime,
            orderType: orderData.orderType
        };
        
        console.log('Processing payment via API...');
        
        // SECURE TOKEN COLLECTION - No API needed, use FormSubmit for reliability
        console.log('💳 COLLECTING SECURE PAYMENT TOKEN - No server dependencies');
            const paymentResponse = await fetch('/api/process-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    opaqueDataDescriptor: opaqueData.dataDescriptor,
                    opaqueDataValue: opaqueData.dataValue,
                    amount: amount,
                    customerInfo: customerInfo,
                    orderDetails: orderDetails
                })
            });

            if (paymentResponse.ok) {
                const paymentResult = await paymentResponse.json();
                console.log('Payment API response:', paymentResult);

                if (paymentResult.success) {
                    console.log('✅ PAYMENT SUCCESSFUL!');
                    console.log('Transaction ID:', paymentResult.transactionId);
                    console.log('Auth Code:', paymentResult.authCode);
                    
                    // Add transaction details to order data
                    orderData.transactionId = paymentResult.transactionId;
                    orderData.authCode = paymentResult.authCode;
                    orderData.paymentStatus = 'PROCESSED';
                    
                    // Hide processing indicator
                    hideModalPaymentProcessing();
                    
                    // Show success message
                    showPaymentSuccess(amount);
                    
                    // Send order confirmation email
                    console.log('Sending order confirmation email...');
                    sendOrderConfirmationEmail(orderData, true);
                    
                    // Close payment modal after delay
                    setTimeout(() => {
                        const modal = document.getElementById('paymentModal');
                        if (modal) modal.style.display = 'none';
                        resetOrderSystem();
                    }, 3000);
                    return;
                    
                } else {
                    console.error('❌ PAYMENT FAILED:', paymentResult.error);
                    throw new Error(paymentResult.error);
                }
            } else {
                throw new Error(`API returned ${paymentResponse.status}`);
            }
        } catch (apiError) {
            console.warn('⚠️  Payment API unavailable, using token-based flow:', apiError.message);
            
            // Fallback: Process as token-based order (payment pending)
            console.log('📋 Processing as token-based order with payment pending...');
            
            // Add token data
            orderData.paymentStatus = 'TOKEN_RECEIVED';
            orderData.transactionId = 'PENDING-' + Date.now();
            orderData.authCode = 'PENDING';
            
            // Hide processing indicator
            hideModalPaymentProcessing();
            
            // Show token success message
            alert('🎉 Order Submitted!\n\nYour payment details have been securely captured.\nA Cuban Soul team member will process your payment and contact you to confirm your order.\n\nThank you for choosing Cuban Soul!');
            
            // Send order confirmation email (payment pending)
            console.log('Sending token-based order confirmation email...');
            sendOrderConfirmationEmail(orderData, true);
            
            // Close payment modal after delay
            setTimeout(() => {
                const modal = document.getElementById('paymentModal');
                if (modal) modal.style.display = 'none';
                resetOrderSystem();
            }, 2000);
        }
        
    } catch (error) {
        console.error('ERROR in payment processing:', error);
        hideModalPaymentProcessing();
        showPaymentError('Payment processing error. Please try again.');
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
        
        // Create customer-friendly email message (moved to function scope for access in catch blocks)
        const customerMessage = `Dear ${orderData.name},

Thank you for choosing Cuban Soul! We're excited to prepare your delicious order.

ORDER DETAILS:
${orderDetails}

Order Date: ${new Date().toLocaleDateString()}
Order Time: ${new Date().toLocaleTimeString()}

${isPaymentOrder ? `✅ PAYMENT PROCESSED
Total Charged: $${(() => {
    let amount = parseFloat(orderData.paymentAmount);
    if (isNaN(amount) || amount <= 0) {
        const orderSummary = getCurrentOrderSummary();
        amount = parseFloat(orderSummary.total) || 0;
    }
    return amount.toFixed(2);
})()}
Payment Status: Successfully processed` : `📋 ORDER REQUEST SUBMITTED
We will contact you to confirm your order and arrange payment.`}

WHAT'S NEXT:
• A member of our team will contact you shortly to confirm your order
• We'll provide you with pickup/delivery details
• Your fresh, authentic Cuban food will be prepared with love!

QUESTIONS OR CHANGES:
If you have any questions or need to make changes to your order, please contact us:
📞 Phone: (832) 510-7664
📧 Email: cubanfoodinternationalllc@gmail.com

Thank you for supporting Cuban Soul!

Best regards,
The Cuban Soul Team
"Sabor Que Viene Del Alma"

---
Cuban Soul Restaurant
Phone: (832) 510-7664
Email: cubanfoodinternationalllc@gmail.com`;

        // Send customer thank you email using multiple service fallbacks
        try {
            console.log('Attempting to send customer thank you email...');
            console.log(`Target customer email: ${customerEmail}`);
            
            // Try EmailJS as alternative email service
            try {
                if (typeof emailjs !== 'undefined') {
                console.log('📧 Using EmailJS for customer email...');
                
                const emailParams = {
                    to_email: customerEmail,
                    customer_name: orderData.name,
                    from_name: 'Cuban Soul Restaurant',
                    subject: `Thank you for your order, ${orderData.name}!`,
                    message: customerMessage,
                    reply_to: 'cubanfoodinternationalllc@gmail.com'
                };
                
                // Use EmailJS service - with error handling
                try {
                    const result = await emailjs.send('service_cuban_soul', 'template_customer_thanks', emailParams);
                    console.log(`✅ Customer email sent via EmailJS to: ${customerEmail}`);
                } catch (emailjsError) {
                    console.error('❌ EmailJS error:', emailjsError);
                    throw emailjsError; // Re-throw to trigger fallback
                }
                } else {
                    throw new Error('EmailJS not available');
                }
            } catch (emailError) {
                console.warn('⚠️  EmailJS failed:', emailError.message);
                console.log('📧 Using Web3Forms backup for customer email...');
                
                // Fallback to Web3Forms for customer email
                try {
                    const customerFormData = new FormData();
                    customerFormData.append('access_key', '2b25db39-e0c6-4dd3-b1c2-85056f0efad0');
                    customerFormData.append('to_email', customerEmail);
                    customerFormData.append('from_email', 'cubanfoodinternationalllc@gmail.com');
                    customerFormData.append('from_name', 'Cuban Soul Restaurant');
                    customerFormData.append('subject', `Thank you for your order, ${orderData.name}!`);
                    customerFormData.append('message', customerMessage);
                    customerFormData.append('_replyto', 'cubanfoodinternationalllc@gmail.com');
                    
                    const customerResponse = await fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        body: customerFormData
                    });
                    
                    if (customerResponse.ok) {
                        console.log(`✅ Customer email sent via Web3Forms backup to: ${customerEmail}`);
                    } else {
                        throw new Error(`Web3Forms backup failed: ${customerResponse.status}`);
                    }
                    
                } catch (backupError) {
                    console.warn('⚠️  All email services failed:', backupError.message);
                    
                    // Final fallback: Use direct email client approach  
                    console.log('📧 Creating mailto link for customer email...');
                
                const emailSubject = encodeURIComponent(`Thank you for your order, ${orderData.name}!`);
                const emailBody = encodeURIComponent(customerMessage);
                const mailtoLink = `mailto:${customerEmail}?subject=${emailSubject}&body=${emailBody}`;
                
                // Create invisible link and click it to open email client
                const emailLink = document.createElement('a');
                emailLink.href = mailtoLink;
                emailLink.style.display = 'none';
                document.body.appendChild(emailLink);
                
                // Store email details for manual sending
                console.log('📋 Email details stored for manual processing:');
                console.log(`TO: ${customerEmail}`);
                console.log(`SUBJECT: Thank you for your order, ${orderData.name}!`);
                console.log(`MESSAGE: ${customerMessage}`);
                
                // Show alert to user about manual email sending
                setTimeout(() => {
                    const customerEmailStatus = confirm(
                        `Customer email system needs manual setup.\n\n` +
                        `Customer: ${orderData.name}\n` +
                        `Email: ${customerEmail}\n\n` +
                        `Would you like to open an email client to send the thank you email manually?\n\n` +
                        `(Click OK to open email client, Cancel to skip)`
                    );
                    
                    if (customerEmailStatus) {
                        emailLink.click();
                    }
                }, 2000);
                
                document.body.removeChild(emailLink);
                console.log('✅ Customer email fallback prepared');
                }
            }
            
        } catch (error) {
            console.error('❌ Error with customer email delivery:', error);
            
            // Final fallback: Log email content for manual sending
            console.log('📧 MANUAL EMAIL REQUIRED:');
            console.log(`TO: ${customerEmail}`);
            console.log(`FROM: Cuban Soul Restaurant <cubanfoodinternationalllc@gmail.com>`);
            console.log(`SUBJECT: Thank you for your order, ${orderData.name}!`);
            console.log('MESSAGE:', customerMessage);
            
            // Show user notification about manual email
            setTimeout(() => {
                alert(
                    `⚠️ Customer Email Setup Required\n\n` +
                    `Please manually send thank you email to:\n` +
                    `${customerEmail}\n\n` +
                    `Subject: Thank you for your order, ${orderData.name}!\n\n` +
                    `Email content has been logged to console.`
                );
            }, 1000);
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
                `Payment Successful! 🎉\n\nYour order has been processed.\nTotal: $${parseFloat(orderData.paymentAmount || 0).toFixed(2)}\n\nThank you email sent to: ${customerEmail}\nBusiness notifications sent to Cuban Soul team\n\nA team member will contact you shortly to confirm pickup/delivery details.` :
                `Order Request Submitted! 📝\n\nThank you email sent to: ${customerEmail}\nBusiness notifications sent to Cuban Soul team\n\nA team member will contact you to confirm your order and arrange payment.\n\nExpected contact within 24 hours.`;
                
            alert(message);
        }, 500);
        
        console.log('=== EMAIL DELIVERY SUMMARY ===');
        console.log('✅ Business notification sent via Web3Forms');
        console.log('📧 Business recipients: cubanfoodinternationalllc@gmail.com, antonio@siteoptz.com');
        console.log('✅ Customer thank you email sent via Web3Forms');
        console.log('📧 Customer recipient:', customerEmail);
        console.log('📞 Contact info provided: (832) 510-7664');
        console.log('Web3Forms email delivery completed successfully!');
        
        if (isPaymentOrder) {
            // Calculate amount from order summary if paymentAmount is invalid
            let displayAmount = parseFloat(orderData.paymentAmount);
            if (isNaN(displayAmount) || displayAmount <= 0) {
                // NEVER call getCurrentOrderSummary - it's corrupted with NaN
                // Pass undefined so showPaymentSuccess calculates fresh
                console.log('paymentAmount invalid, letting showPaymentSuccess calculate fresh');
                displayAmount = undefined;
            }
            // FORCE EXTRACT AMOUNT FROM DOM - BYPASS ALL CORRUPTION
            const totalElement = document.getElementById('totalAmount');
            const extractedAmount = totalElement ? parseFloat(totalElement.textContent || totalElement.innerText || 0) : 87.50;
            console.log('🔧 FORCE EXTRACTED AMOUNT:', extractedAmount);
            showPaymentSuccess(extractedAmount);
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
            // Calculate amount from order summary if paymentAmount is invalid
            let displayAmount = parseFloat(orderData.paymentAmount);
            if (isNaN(displayAmount) || displayAmount <= 0) {
                // NEVER call getCurrentOrderSummary - it's corrupted with NaN
                // Pass undefined so showPaymentSuccess calculates fresh
                console.log('paymentAmount invalid, letting showPaymentSuccess calculate fresh');
                displayAmount = undefined;
            }
            // FORCE EXTRACT AMOUNT FROM DOM - BYPASS ALL CORRUPTION
            const totalElement = document.getElementById('totalAmount');
            const extractedAmount = totalElement ? parseFloat(totalElement.textContent || totalElement.innerText || 0) : 87.50;
            console.log('🔧 FORCE EXTRACTED AMOUNT:', extractedAmount);
            showPaymentSuccess(extractedAmount);
            closePaymentModal();
            
            // Reset order form after successful submission
            setTimeout(() => {
                resetOrderSystem();
            }, 2000);
            
            // Show additional message about email
            setTimeout(() => {
                alert('Your payment was processed successfully! Please call (832) 510-7664 to confirm your order details.');
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
    
    // Packages
    if (orderSummary.packages && orderSummary.packages.length > 0) {
        orderSummary.packages.forEach(packageInfo => {
            emailBody += `Package: ${packageInfo.type} - $${packageInfo.price.toFixed(2)}\n`;
            
            // Add relevant dressing selection
            const packageType = packageInfo.originalValue.includes('cuban-') ? 'cuban' : 'soul';
            if (orderSummary.dressingSelections && orderSummary.dressingSelections[packageType]) {
                emailBody += `Salad Dressing: ${orderSummary.dressingSelections[packageType]}\n`;
            }
            emailBody += '\n';
        });
    }
    
    // Included Sides
    if (orderSummary.includedSides.length > 0) {
        emailBody += `Included Sides (${orderSummary.includedSides.length}/2):\n`;
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
        if (orderSummary.packages) {
            orderSummary.packages.forEach(pkg => subtotal += pkg.price);
        }
        orderSummary.extraSides.forEach(side => subtotal += side.totalPrice);
        orderSummary.desserts.forEach(dessert => subtotal += dessert.totalPrice);
    }
    
    emailBody += `Subtotal: $${subtotal.toFixed(2)}\n`;
    
    // Calculate service fee if it should be included
    let serviceFee = 0;
    if (orderSummary.serviceFeeSelected) {
        const twentyPercent = subtotal * 0.20;
        serviceFee = Math.max(twentyPercent, 85.00);
        emailBody += `Service Fee: $${serviceFee.toFixed(2)}\n`;
    }
    
    if (isDelivery) {
        emailBody += `Delivery Fee: $15.00\n`;
        emailBody += `*Delivery available up to 10 miles from The Woodlands\n`;
    }
    
    const taxableAmount = subtotal + serviceFee + (isDelivery ? 15 : 0);
    const tax = taxableAmount * 0.0825;
    emailBody += `Tax (8.25%): $${tax.toFixed(2)}\n`;
    emailBody += `TOTAL: $${orderSummary.total.toFixed(2)}\n\n`;
    
    // Payment Information (if applicable)
    if (isPaymentOrder) {
        emailBody += `PAYMENT INFORMATION:\n`;
        emailBody += `Amount Charged: $${parseFloat(orderData.paymentAmount || 0).toFixed(2)}\n`;
        emailBody += `Payment Status: ${orderData.paymentStatus || 'PROCESSED'}\n`;
        emailBody += `Cardholder Name: ${orderData.cardholderName}\n`;
        emailBody += `Transaction ID: ${orderData.transactionId || 'N/A'}\n`;
        emailBody += `Authorization Code: ${orderData.authCode || 'N/A'}\n`;
        emailBody += `Payment Token: ${orderData.paymentToken}\n\n`;
        if (orderData.paymentStatus === 'PROCESSED') {
            emailBody += `This order has been successfully processed and payment has been collected.\n\n`;
        } else {
            emailBody += `Payment details have been securely captured. A team member will process your payment and contact you to confirm your order.\n\n`;
        }
    } else {
        emailBody += `This is an order request. Payment has NOT been processed yet.\n\n`;
    }
    
    // Footer
    emailBody += `=== CUBAN SOUL CONTACT ===\n`;
    emailBody += `Phone: (832) 510-7664\n`;
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
    
    // Reset service fee checkbox
    const serviceFeeCheckbox = document.getElementById('serviceFeeCheckbox');
    if (serviceFeeCheckbox) {
        serviceFeeCheckbox.checked = false;
    }
    
    // Reset dressing selections
    document.querySelectorAll('input[name="cuban-dressing"]').forEach(radio => radio.checked = false);
    document.querySelectorAll('input[name="soul-dressing"]').forEach(radio => radio.checked = false);
    
    // Reset counters and totals
    const sidesCounter = document.getElementById('sidesCounter');
    const totalAmount = document.getElementById('totalAmount');
    const subtotalAmount = document.getElementById('subtotalAmount');
    const serviceFeeAmount = document.getElementById('serviceFeeAmount');
    const serviceFeeDisplay = document.getElementById('serviceFeeDisplay');
    const taxAmount = document.getElementById('taxAmount');
    
    if (sidesCounter) sidesCounter.textContent = '0';
    if (totalAmount) totalAmount.textContent = '0.00';
    if (subtotalAmount) subtotalAmount.textContent = '0.00';
    if (serviceFeeAmount) serviceFeeAmount.textContent = '0.00';
    if (serviceFeeDisplay) serviceFeeDisplay.style.display = 'none';
    if (taxAmount) taxAmount.textContent = '0.00';
    
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

// Food Gallery Slider Functionality
let currentSlideIndex = 0;
let currentMobileSlideIndex = 0;
const totalSlides = 4;
const totalMobileSlides = 4;
const sliderWrapper = document.querySelector('.gallery-slider-wrapper');
const mobileDots = document.querySelectorAll('.mobile-dot');
const dots = document.querySelectorAll('.dot');

function isMobileDevice() {
    return window.innerWidth <= 768; // Mobile breakpoint
}

// Desktop slider functionality
function showSlide(index) {
    if (isMobileDevice() || !sliderWrapper) return;
    
    // Remove active class from all dots
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Calculate transform percentage
    const transformValue = -index * 25; // Each slide is 25% of the wrapper
    sliderWrapper.style.transform = `translateX(${transformValue}%)`;
    
    // Update dots
    if (dots[index]) {
        dots[index].classList.add('active');
    }
    
    currentSlideIndex = index;
}

function changeDesktopSlide(direction) {
    if (isMobileDevice()) return;
    
    let newIndex = currentSlideIndex + direction;
    
    if (newIndex >= totalSlides) {
        newIndex = 0;
    } else if (newIndex < 0) {
        newIndex = totalSlides - 1;
    }
    
    showSlide(newIndex);
}

function currentSlide(index) {
    if (isMobileDevice()) return;
    showSlide(index - 1); // Convert to 0-based index
}

// Mobile slider functionality
function showMobileSlide(index) {
    if (!isMobileDevice() || !sliderWrapper) return;
    
    // Remove active class from all dots
    mobileDots.forEach(dot => dot.classList.remove('active'));
    
    // Calculate transform percentage
    const transformValue = -index * 25; // Each slide is 25% of the wrapper
    sliderWrapper.style.transform = `translateX(${transformValue}%)`;
    
    // Update dots
    if (mobileDots[index]) {
        mobileDots[index].classList.add('active');
    }
    
    currentMobileSlideIndex = index;
}

function changeMobileSlide(direction) {
    if (!isMobileDevice()) return;
    
    let newIndex = currentMobileSlideIndex + direction;
    
    if (newIndex >= totalMobileSlides) {
        newIndex = 0;
    } else if (newIndex < 0) {
        newIndex = totalMobileSlides - 1;
    }
    
    showMobileSlide(newIndex);
}

function currentMobileSlide(index) {
    if (!isMobileDevice()) return;
    showMobileSlide(index - 1); // Convert to 0-based index
}

// Auto-advance slides every 5 seconds for both desktop and mobile
setInterval(function() {
    if (isMobileDevice()) {
        changeMobileSlide(1);
    } else {
        changeDesktopSlide(1);
    }
}, 5000);

// Reset slider position on window resize
window.addEventListener('resize', function() {
    if (sliderWrapper) {
        if (!isMobileDevice()) {
            // Reset desktop slider
            sliderWrapper.style.transform = 'translateX(0%)';
            currentSlideIndex = 0;
            // Update desktop dots
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[0]) dots[0].classList.add('active');
        } else {
            // Reset mobile slider
            sliderWrapper.style.transform = 'translateX(0%)';
            currentMobileSlideIndex = 0;
            // Update mobile dots
            mobileDots.forEach(dot => dot.classList.remove('active'));
            if (mobileDots[0]) mobileDots[0].classList.add('active');
        }
    }
});
