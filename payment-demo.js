// MINIMAL DEMO PAYMENT SCRIPT - NO CACHE ISSUES
console.log('🚀 MINIMAL DEMO SCRIPT LOADED! 🚀');

// Override the payment function completely
window.processModalPayment = function() {
    console.log('🎉 DEMO PAYMENT STARTED!');
    
    // Show processing
    const submitBtn = document.querySelector('.payment-submit-modal');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '⏳ Processing Demo Payment...';
    }
    
    // Simulate success after 2 seconds
    setTimeout(() => {
        console.log('✅ Demo payment successful!');
        
        // Reset button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '💳 Process Payment';
        }
        
        // Show success
        alert('🎉 Payment Successful!\n\nDemo Mode - No real payment processed.\nYour order has been recorded.');
        
        // Close modal
        const modal = document.getElementById('paymentModal');
        if (modal) {
            modal.style.display = 'none';
        }
        
        // Try to reset form if function exists
        if (typeof resetOrderSystem === 'function') {
            resetOrderSystem();
        }
    }, 2000);
};

console.log('Demo payment function ready!');