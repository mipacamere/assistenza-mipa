// Function to show selected section and update nav buttons
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update nav buttons
    document.querySelectorAll('nav button').forEach(button => {
        button.classList.remove('active');
    });
    document.getElementById(sectionId + '-btn').classList.add('active');
}

// Initialize breakfast order variables
const items = {
    'continental': { price: 12.99, qty: 0 },
    'american': { price: 14.99, qty: 0 },
    'vegetarian': { price: 13.99, qty: 0 },
    'fruit': { price: 8.99, qty: 0 },
    'coffee': { price: 3.99, qty: 0 },
    'tea': { price: 3.49, qty: 0 },
    'juice': { price: 4.99, qty: 0 }
};

// Adjust quantity of breakfast items
function adjustQuantity(item, change) {
    const newQty = Math.max(0, items[item].qty + change);
    items[item].qty = newQty;
    document.getElementById(`${item}-qty`).textContent = newQty;
    updateOrderSummary();
}

// Update the order summary
function updateOrderSummary() {
    let summaryText = '';
    let total = 0;
    
    let hasItems = false;
    
    for (const [item, data] of Object.entries(items)) {
        if (data.qty > 0) {
            hasItems = true;
            const itemTotal = data.qty * data.price;
            total += itemTotal;
            const itemName = item.charAt(0).toUpperCase() + item.slice(1);
            summaryText += `${itemName}: ${data.qty} x $${data.price.toFixed(2)} = $${itemTotal.toFixed(2)}<br>`;
        }
    }
    
    document.getElementById('order-summary').innerHTML = hasItems ? summaryText : 'No items selected';
    document.getElementById('order-total').textContent = `$${total.toFixed(2)}`;
}

// Handle room service form submission
document.getElementById('roomServiceForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // In a real app, you would send the form data to a server here
    // For now, we'll just show a success message
    document.getElementById('service-success').style.display = 'block';
    
    // Reset form
    this.reset();
    
    // Hide success message after 3 seconds
    setTimeout(() => {
        document.getElementById('service-success').style.display = 'none';
    }, 3000);
});

// Handle breakfast form submission
document.getElementById('breakfastForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Check if any items are selected
    let hasItems = false;
    for (const data of Object.values(items)) {
        if (data.qty > 0) {
            hasItems = true;
            break;
        }
    }
    
    if (!hasItems) {
        alert('Please select at least one item for your breakfast order.');
        return;
    }
    
    // In a real app, you would send the order data to a server here
    // For now, we'll just show a success message
    document.getElementById('breakfast-success').style.display = 'block';
    
    // Reset form and items
    this.reset();
    for (const key in items) {
        items[key].qty = 0;
        document.getElementById(`${key}-qty`).textContent = '0';
    }
    updateOrderSummary();
    
    // Hide success message after 3 seconds
    setTimeout(() => {
        document.getElementById('breakfast-success').style.display = 'none';
    }, 3000);
});

// Handle accordion for FAQs
document.querySelectorAll('.accordion').forEach(accordion => {
    accordion.addEventListener('click', function() {
        this.classList.toggle('active');
        
        const panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + 'px';
        }
        
        // Toggle plus/minus icon
        const svg = this.querySelector('svg');
        if (this.classList.contains('active')) {
            svg.innerHTML = '<path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>';
        } else {
            svg.innerHTML = '<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>';
        }
    });
});

// Service Worker Registration for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}
