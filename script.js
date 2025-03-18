// script.js
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab-item');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            // Remove active class from all tabs and content
            document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            // Add active class to current tab and content
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');

            // Initialize map if map tab is selected
            if (tabId === 'map') {
                initMap();
            }
        });
    });

    // Breakfast ordering system
    const breakfastItems = {
        'continental': { price: 8.50, qty: 0 },
        'full': { price: 12.00, qty: 0 },
        'vegan': { price: 10.50, qty: 0 },
        'juice': { price: 3.50, qty: 0 },
        'fruit': { price: 6.00, qty: 0 }
    };

    window.updateQuantity = function(itemId, change) {
        const currentQty = breakfastItems[itemId].qty;
        const newQty = Math.max(0, currentQty + change);
        breakfastItems[itemId].qty = newQty;

        // Update display
        document.getElementById(`qty-${itemId}`).textContent = newQty;
        updateTotal();
    };

    function updateTotal() {
        let total = 0;
        for (const item in breakfastItems) {
            total += breakfastItems[item].price * breakfastItems[item].qty;
        }
        document.getElementById('breakfast-total').textContent = `€${total.toFixed(2)}`;
    }

    // Place breakfast order - With the correct WhatsApp number
    document.getElementById('order-breakfast').addEventListener('click', function() {
        let orderText = "Hello, I would like to order breakfast:";
        let hasItems = false;
        let total = 0;

        for (const item in breakfastItems) {
            if (breakfastItems[item].qty > 0) {
                const itemName = document.querySelector(`#qty-${item}`).parentNode.parentNode.previousElementSibling.previousElementSibling.querySelector('.breakfast-name').textContent;
                const itemPrice = breakfastItems[item].price;
                const itemTotal = itemPrice * breakfastItems[item].qty;

                orderText += `\n${breakfastItems[item].qty}x ${itemName} - €${itemTotal.toFixed(2)}`;
                total += itemTotal;
                hasItems = true;
            }
        }

        if (!hasItems) {
            alert("Please select at least one item");
            return;
        }

        orderText += `\n\nTotal: €${total.toFixed(2)}`;

        // Open WhatsApp with the order text and the breakfast-specific phone number
        window.open(`https://wa.me/393245242451?text=${encodeURIComponent(orderText)}`);
    });

    // Photo upload
    const photoUpload = document.getElementById('photo-upload');
    const photoGallery = document.getElementById('photo-gallery');
    const shareButton = document.getElementById('share-photos');
    let uploadedPhotos = [];

    if (photoUpload) {
        photoUpload.addEventListener('change', function(e) {
            const files = e.target.files;

            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                if (!file.type.match('image.*')) {
                    continue;
                }

                const reader = new FileReader();

                reader.onload = (function(theFile) {
                    return function(e) {
                        // Add image to gallery
                        const div = document.createElement('div');
                        div.className = 'photo-item';

                        const img = document.createElement('img');
                        img.src = e.target.result;
                        div.appendChild(img);

                        const removeBtn = document.createElement('div');
                        removeBtn.className = 'remove-photo';
                        removeBtn.innerHTML = '×';
                        removeBtn.addEventListener('click', function() {
                            div.remove();
                            uploadedPhotos = uploadedPhotos.filter(p => p !== e.target.result);
                            if (uploadedPhotos.length === 0) {
                                shareButton.disabled = true;
                            }
                        });

                        div.appendChild(removeBtn);
                        photoGallery.appendChild(div);

                        uploadedPhotos.push(e.target.result);
                        shareButton.disabled = false;
                    };
                })(file);

                reader.readAsDataURL(file);
            }
        });
    }

    // Share photos via WhatsApp - With the correct phone number
    if (shareButton) {
        shareButton.addEventListener('click', function() {
            // Count the photos
            const photoCount = document.querySelectorAll('.photo-item').length;
            const message = `Hello, I would like to share ${photoCount} photos from my stay. I'll send them separately after this message.`;

            // Open WhatsApp with the general phone number
            window.open(`https://wa.me/393245242326?text=${encodeURIComponent(message)}`);
        });
    }

    // Check out button - With the correct phone number
    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            const message = "Hello, I'm checking out now. Thank you for the wonderful stay!";
            window.open(`https://wa.me/393245242326?text=${encodeURIComponent(message)}`);
        });
    }

    // Initialize Google Map
    window.initMap = function() {
        // Only proceed if the map canvas exists
        const mapCanvas = document.getElementById('map-canvas');
        if (!mapCanvas) return;
        
        // Default coordinates (replace with your accommodation location)
        const defaultLocation = { lat: 40.7128, lng: -74.0060 };

        const mapOptions = {
            center: defaultLocation,
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        const map = new google.maps.Map(mapCanvas, mapOptions);

        // Add marker for accommodation location
        new google.maps.Marker({
            position: defaultLocation,
            map: map,
            title: 'Your Accommodation'
        });
    };

    // Language translations
    const translations = {
        "en": {
            // Tabs
            "tab_info": "For You",
            "tab_breakfast": "Breakfast",
            "tab_photos": "Send Documents",
            "tab_map": "City Map",
            "tab_checkout": "Check Out",

            // Info tab
            "general_info": "General Info",
            "checkin": "Check-in:",
            "checkout": "Check-out:",
            "address": "Address:",
            "contact_us": "Contact Us",
            "additional_services": "Additional Services",
            "bike_rental": "Bike Rental",
            "bike_rental_details": "€10 per day - Ask at reception",
            "scuba_diving": "Scuba Diving",
            "scuba_diving_details": "€50 per person - Book 24h in advance",
            "explore_city": "Explore the City",
            "view_itinerary": "View Itinerary",

            // Breakfast tab
            "order_breakfast": "Order Your Breakfast",
            "breakfast_instructions": "Select items for your breakfast. Orders must be placed by 8:00 PM for next morning delivery.",
            "continental_breakfast": "Continental Breakfast",
            "continental_desc": "Croissant, jam, butter, coffee or tea",
            "full_breakfast": "Full Breakfast",
            "full_desc": "Eggs, bacon, toast, tomato, mushrooms, coffee or tea",
            "vegan_breakfast": "Vegan Breakfast",
            "vegan_desc": "Avocado toast, fruit salad, plant-based yogurt, coffee or tea",
            "orange_juice": "Fresh Orange Juice",
            "juice_desc": "300ml freshly squeezed orange juice",
            "fruit_plate": "Fruit Plate",
            "fruit_desc": "Selection of seasonal fruits",
            "total": "Total:",
            "place_order": "Place Order",

            // Photos tab
            "share_photos": "Share Your Photos",
            "photos_instructions": "Upload photos from your stay. We may feature them on our website (with your permission)!",
            "add_photos": "Add Photos",
            "share_photos_btn": "Share Photos via WhatsApp",

            // Checkout tab
            "checkout_title": "Check Out",
            "checkout_instructions": "Ready to check out? Please ensure you have:",
            "checkout_item1": "Returned all keys and access cards",
            "checkout_item2": "Collected all personal belongings",
            "checkout_item3": "Settled any outstanding payments",
            "checkout_note": "Click the button below to notify us that you are checking out.",
            "complete_checkout": "Complete Check Out",

            // Map tab
            "city_map": "City Map"
        },
        "it": {
            // Tabs
            "tab_info": "Per Te",
            "tab_breakfast": "Colazione",
            "tab_photos": "Invia Documenti",
            "tab_map": "Mappa della Città",
            "tab_checkout": "Check Out",
            
            // Other Italian translations...
        },
        "es": {
            // Spanish translations...
        },
        "fr": {
            // French translations...
        }
    };

    // Function to update all text elements with the selected language
    function updateLanguage(lang) {
        // Set active class on the selected language button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });

        // Save selected language to localStorage
        localStorage.setItem('selectedLanguage', lang);

        // Update tab text
        const infoTab = document.querySelector('[data-tab="info"]');
        if (infoTab) infoTab.innerHTML = `<i class="material-icons">info</i>${translations[lang].tab_info}`;
        
        const breakfastTab = document.querySelector('[data-tab="breakfast"]');
        if (breakfastTab) breakfastTab.innerHTML = `<i class="material-icons">restaurant</i>${translations[lang].tab_breakfast}`;
        
        const photosTab = document.querySelector('[data-tab="photos"]');
        if (photosTab) photosTab.innerHTML = `<i class="material-icons">photo_camera</i>${translations[lang].tab_photos}`;
        
        const mapTab = document.querySelector('[data-tab="map"]');
        if (mapTab) mapTab.innerHTML = `<i class="material-icons">map</i>${translations[lang].tab_map}`;
        
        const checkoutTab = document.querySelector('[data-tab="checkout"]');
        if (checkoutTab) checkoutTab.innerHTML = `<i class="material-icons">logout</i>${translations[lang].tab_checkout}`;

        // Update heading
        const headerTitle = document.querySelector('.header h1');
        if (headerTitle) headerTitle.textContent = "Guest Support";

        // Update Info tab content
        const infoSectionTitle = document.querySelector('#info .section-title:nth-of-type(1)');
        if (infoSectionTitle) infoSectionTitle.textContent = translations[lang].general_info;
        
        const generalInfo = document.querySelector('#info .mdc-card');
        if (generalInfo) {
            generalInfo.innerHTML = `
                <p><strong>${translations[lang].checkin}</strong> 3:00 PM - 10:00 PM</p>
                <p><strong>${translations[lang].checkout}</strong> By 10:30 AM</p>
                <p><strong>${translations[lang].address}</strong> Via San Giovanni, 42</p>
            `;
        }

        // Continue updating other elements...
        // Attach event listener for checkout button again
        const checkoutButton = document.getElementById('checkout-button');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', function() {
                const message = "Hello, I'm checking out now. Thank you for the wonderful stay!";
                window.open(`https://wa.me/393245242326?text=${encodeURIComponent(message)}`);
            });
        }
    }

    // Language switching
    const langButtons = document.querySelectorAll('.lang-btn');

    // Set default language or get from localStorage
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';

    // Add click event to language buttons
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            updateLanguage(lang);
        });
    });

    // Initialize with saved language
    setTimeout(() => {
        updateLanguage(savedLang);
    }, 100);
});
