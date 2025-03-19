// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Add Italian translations for breakfast items and order text
    const italianTranslations = {
        'plain-croissant': 'Cornetto vuoto',
        'chocolate-croissant': 'Cornetto con cioccolato',
        'jam-croissant': 'Cornetto con marmellata',
        'cream-croissant': 'Cornetto con crema',
        'cappuccino': 'Cappuccino',
        'espresso': 'Espresso',
        'tea': 'Tè',
        'latte': 'Latte Macchiato',
        'coffee-macchiato': 'Caffè Macchiato',
        'americano': 'Caffè Americano',
        'breakfast_order_for': 'Ordine colazione per',
        'room': 'Camera',
        'total': 'Totale',
        'checkout_message': 'Salve, sto effettuando il check-out. Grazie per il meraviglioso soggiorno!',
        'photo_share_message': 'Salve, vorrei condividere {count} foto del mio soggiorno. Le invierò separatamente dopo questo messaggio.'
    };

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

    // Add event listeners for quantity controls
    document.querySelectorAll('.qty-control').forEach(control => {
        control.addEventListener('click', function() {
            const itemId = this.getAttribute('data-item');
            const change = parseInt(this.getAttribute('data-change'));
            updateQuantity(itemId, change);
        });
    });

    // Function to update quantity for an item
    function updateQuantity(itemId, change) {
        const qtyElement = document.getElementById('qty-' + itemId);
        let currentQty = parseInt(qtyElement.textContent);
        
        // Ensure quantity doesn't go below zero
        if (currentQty + change >= 0) {
            currentQty += change;
            qtyElement.textContent = currentQty;
        }
        
        updateTotal();
    }

    // Function to update the total price
    function updateTotal() {
        const prices = {
            'plain-croissant': 1.50,
            'chocolate-croissant': 1.50,
            'jam-croissant': 1.50,
            'cream-croissant': 1.50,
            'cappuccino': 2.50,
            'espresso': 1.00,
            'tea': 2.00,
            'latte': 2.50,
            'coffee-macchiato': 1.50,
            'americano': 2.00
        };
        
        let total = 0;
        
        for (const item in prices) {
            const qtyElement = document.getElementById('qty-' + item);
            if (qtyElement) {
                const qty = parseInt(qtyElement.textContent);
                total += qty * prices[item];
            }
        }
        
        const totalElement = document.getElementById('breakfast-total');
        if (totalElement) {
            totalElement.textContent = '€' + total.toFixed(2);
        }
    }

    // Add event listener for the order button
    const orderButton = document.getElementById('order-breakfast');
    if (orderButton) {
        orderButton.addEventListener('click', sendWhatsAppOrder);
    }

    // Function to send order via WhatsApp - Modified to always use Italian
    function sendWhatsAppOrder() {
        // Get guest name
        const guestNameElement = document.getElementById('guest-name');
        if (!guestNameElement) return;
        
        const guestName = guestNameElement.value.trim();
        if (!guestName) {
            alert('Please enter your name before placing the order.');
            return;
        }
        
        // Get selected room
        const roomElement = document.getElementById('room-select');
        if (!roomElement) return;
        
        const room = roomElement.value;
        
        // Get all items with quantity > 0
        const items = [];
        const itemIds = [
            'plain-croissant', 'chocolate-croissant', 'jam-croissant', 'cream-croissant',
            'cappuccino', 'espresso', 'tea', 'latte', 'coffee-macchiato', 'americano'
        ];
        
        let hasItems = false;
        for (const id of itemIds) {
            const qtyElement = document.getElementById('qty-' + id);
            if (qtyElement) {
                const qty = parseInt(qtyElement.textContent);
                if (qty > 0) {
                    // Use Italian translations for item names
                    items.push(`${qty}x ${italianTranslations[id]}`);
                    hasItems = true;
                }
            }
        }
        
        if (!hasItems) {
            alert('Please select at least one item to order.');
            return;
        }
        
        const totalElement = document.getElementById('breakfast-total');
        if (!totalElement) return;
        
        const total = totalElement.textContent;
        
        // Create message for WhatsApp in Italian
        let message = `${italianTranslations['breakfast_order_for']} ${guestName}, ${italianTranslations['room']} ${room}:\n`;
        message += items.join('\n');
        message += `\n\n${italianTranslations['total']}: ${total}`;
        
        // Encode message for URL
        const encodedMessage = encodeURIComponent(message);
        
        // Open WhatsApp with the message
        window.open(`https://wa.me/393339201524?text=${encodedMessage}`, '_blank');
    }

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

    // Share photos via WhatsApp - Modified to use Italian
    if (shareButton) {
        shareButton.addEventListener('click', function() {
            // Count the photos
            const photoCount = document.querySelectorAll('.photo-item').length;
            // Use Italian translation for the message
            const message = italianTranslations['photo_share_message'].replace('{count}', photoCount);

            // Open WhatsApp with the general phone number
            window.open(`https://wa.me/393245242326?text=${encodeURIComponent(message)}`);
        });
    }

    // Check out button - Modified to use Italian
    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            const message = italianTranslations['checkout_message'];
            window.open(`https://wa.me/393245242326?text=${encodeURIComponent(message)}`);
        });
    }

    // Initialize Google Map
    window.initMap = function() {
        // Only proceed if the map canvas exists
        const mapCanvas = document.getElementById('map-canvas');
        if (!mapCanvas) return;
        
        // Default coordinates (replace with your accommodation location)
        const defaultLocation = { lat: 38.2234, lng: 15.2423 }; // Milazzo coordinates  
      
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
            
            // Info tab
            "general_info": "Informazioni Generali",
            "checkin": "Check-in:",
            "checkout": "Check-out:",
            "address": "Indirizzo:",
            "contact_us": "Contattaci",
            "additional_services": "Servizi Aggiuntivi",
            "bike_rental": "Noleggio Biciclette",
            "bike_rental_details": "€10 al giorno - Chiedi alla reception",
            "scuba_diving": "Immersioni Subacquee",
            "scuba_diving_details": "€50 a persona - Prenota con 24 ore di anticipo",
            "explore_city": "Esplora la Città",
            "view_itinerary": "Visualizza Itinerario",
            
            // Breakfast tab
            "order_breakfast": "Ordina la Colazione",
            "breakfast_instructions": "Seleziona i prodotti per la tua colazione. Gli ordini devono essere effettuati entro le 20:00 per la consegna il mattino successivo.",
            "your_name": "Il tuo nome:",
            "select_room": "Seleziona la tua camera:",
            "total": "Totale:",
            "place_order": "Effettua l'Ordine",
            
            // Photos tab
            "share_photos": "Condividi le Tue Foto",
            "photos_instructions": "Carica le foto del tuo soggiorno. Potremmo pubblicarle sul nostro sito web (con il tuo permesso)!",
            "add_photos": "Aggiungi Foto",
            "share_photos_btn": "Condividi Foto via WhatsApp",
            
            // Checkout tab
            "checkout_title": "Check Out",
            "checkout_instructions": "Pronto per il check-out? Assicurati di aver:",
            "checkout_item1": "Restituito tutte le chiavi e le carte di accesso",
            "checkout_item2": "Raccolto tutti gli effetti personali",
            "checkout_item3": "Regolato eventuali pagamenti in sospeso",
            "checkout_note": "Clicca il pulsante qui sotto per avvisarci che stai effettuando il check-out.",
            "complete_checkout": "Completa il Check Out",
            
            // Map tab
            "city_map": "Mappa della Città"
        },
        "es": {
            // Tabs
            "tab_info": "Para Ti",
            "tab_breakfast": "Desayuno",
            "tab_photos": "Enviar Documentos",
            "tab_map": "Mapa de la Ciudad",
            "tab_checkout": "Check Out",
            
            // Info tab
            "general_info": "Información General",
            "checkin": "Check-in:",
            "checkout": "Check-out:",
            "address": "Dirección:",
            "contact_us": "Contáctanos",
            "additional_services": "Servicios Adicionales",
            "bike_rental": "Alquiler de Bicicletas",
            "bike_rental_details": "€10 por día - Pregunta en recepción",
            "scuba_diving": "Buceo",
            "scuba_diving_details": "€50 por persona - Reserva con 24 horas de antelación",
            "explore_city": "Explora la Ciudad",
            "view_itinerary": "Ver Itinerario",
            
            // Breakfast tab
            "order_breakfast": "Pedir Desayuno",
            "breakfast_instructions": "Selecciona elementos para tu desayuno. Los pedidos deben realizarse antes de las 8:00 PM para entrega a la mañana siguiente.",
            "your_name": "Tu nombre:",
            "select_room": "Selecciona tu habitación:",
            "total": "Total:",
            "place_order": "Realizar Pedido",
            
            // Photos tab
            "share_photos": "Comparte Tus Fotos",
            "photos_instructions": "Sube fotos de tu estancia. ¡Podríamos mostrarlas en nuestra web (con tu permiso)!",
            "add_photos": "Añadir Fotos",
            "share_photos_btn": "Compartir Fotos por WhatsApp",
            
            // Checkout tab
            "checkout_title": "Check Out",
            "checkout_instructions": "¿Listo para el check-out? Por favor, asegúrate de haber:",
            "checkout_item1": "Devuelto todas las llaves y tarjetas de acceso",
            "checkout_item2": "Recogido todas tus pertenencias",
            "checkout_item3": "Liquidado cualquier pago pendiente",
            "checkout_note": "Haz clic en el botón de abajo para notificarnos que estás realizando el check-out.",
            "complete_checkout": "Completar Check Out",
            
            // Map tab
            "city_map": "Mapa de la Ciudad"
        },
        "fr": {
            // Tabs
            "tab_info": "Pour Vous",
            "tab_breakfast": "Petit-déjeuner",
            "tab_photos": "Envoyer Documents",
            "tab_map": "Plan de la Ville",
            "tab_checkout": "Check Out",
            
            // Info tab
            "general_info": "Informations Générales",
            "checkin": "Arrivée:",
            "checkout": "Départ:",
            "address": "Adresse:",
            "contact_us": "Contactez-nous",
            "additional_services": "Services Supplémentaires",
            "bike_rental": "Location de Vélos",
            "bike_rental_details": "€10 par jour - Demandez à la réception",
            "scuba_diving": "Plongée Sous-marine",
            "scuba_diving_details": "€50 par personne - Réservez 24h à l'avance",
            "explore_city": "Explorez la Ville",
            "view_itinerary": "Voir l'Itinéraire",
            
            // Breakfast tab
            "order_breakfast": "Commander Votre Petit-déjeuner",
            "breakfast_instructions": "Sélectionnez les articles pour votre petit-déjeuner. Les commandes doivent être passées avant 20h00 pour une livraison le lendemain matin.",
            "your_name": "Votre nom:",
            "select_room": "Sélectionnez votre chambre:",
            "total": "Total:",
            "place_order": "Passer la Commande",
            
            // Photos tab
            "share_photos": "Partagez Vos Photos",
            "photos_instructions": "Téléchargez des photos de votre séjour. Nous pourrions les présenter sur notre site web (avec votre permission) !",
            "add_photos": "Ajouter des Photos",
            "share_photos_btn": "Partager les Photos via WhatsApp",
            
            // Checkout tab
            "checkout_title": "Check Out",
            "checkout_instructions": "Prêt pour le départ ? Veuillez vous assurer d'avoir :",
            "checkout_item1": "Rendu toutes les clés et cartes d'accès",
            "checkout_item2": "Récupéré tous vos effets personnels",
            "checkout_item3": "Réglé tous les paiements en suspens",
            "checkout_note": "Cliquez sur le bouton ci-dessous pour nous informer que vous partez.",
            "complete_checkout": "Terminer le Check Out",
            
            // Map tab
            "city_map": "Plan de la Ville"
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
                <p><strong>${translations[lang].address}</strong> Via San Giovanni 42, Milazzo (ME)</p>
            `;
        }

        // Update Contact Us section
        const contactTitle = document.querySelector('#info .section-title:nth-of-type(2)');
        if (contactTitle) contactTitle.textContent = translations[lang].contact_us;

        // Update Additional Services section
        const servicesTitle = document.querySelector('#info .section-title:nth-of-type(3)');
        if (servicesTitle) servicesTitle.textContent = translations[lang].additional_services;

        const bikeRental = document.querySelector('.service-item:nth-of-type(1) strong');
        if (bikeRental) bikeRental.textContent = translations[lang].bike_rental;

        const scubaDiving = document.querySelector('.service-item:nth-of-type(2) strong');
        if (scubaDiving) scubaDiving.textContent = translations[lang].scuba_diving;

        // Update Breakfast tab content
        const breakfastTitle = document.querySelector('#breakfast .section-title');
        if (breakfastTitle) breakfastTitle.textContent = translations[lang].order_breakfast;

        const breakfastInstructions = document.querySelector('#breakfast p');
        if (breakfastInstructions) breakfastInstructions.textContent = translations[lang].breakfast_instructions;

        // Update guest name and room selection labels
        const guestNameLabel = document.querySelector('label[for="guest-name"]');
        if (guestNameLabel && translations[lang].your_name) guestNameLabel.textContent = translations[lang].your_name;

        const roomSelectLabel = document.querySelector('label[for="room-select"]');
        if (roomSelectLabel && translations[lang].select_room) roomSelectLabel.textContent = translations[lang].select_room;

        // Update total text
        const totalText = document.querySelector('.total-section div:first-child');
        if (totalText) totalText.textContent = translations[lang].total;

        // Update order button text
        const orderButton = document.getElementById('order-breakfast');
        if (orderButton) orderButton.innerHTML = `<i class="material-icons">send</i>${translations[lang].place_order}`;

        // Update Photos tab content
        const photosTitle = document.querySelector('#photos .section-title');
        if (photosTitle) photosTitle.textContent = translations[lang].share_photos;

        const photosInstructions = document.querySelector('#photos p');
        if (photosInstructions) photosInstructions.textContent = translations[lang].photos_instructions;

        const addPhotosButton = document.querySelector('.upload-btn-wrapper .mdc-button');
        if (addPhotosButton) addPhotosButton.innerHTML = `<i class="material-icons">add_photo_alternate</i>${translations[lang].add_photos}`;

        const sharePhotosButton = document.getElementById('share-photos');
        if (sharePhotosButton) sharePhotosButton.innerHTML = `<i class="material-icons">share</i>${translations[lang].share_photos_btn}`;

        // Update Map tab content
        const mapTitle = document.querySelector('#map .section-title');
        if (mapTitle) mapTitle.textContent = translations[lang].city_map;

        // Update Checkout tab content
        const checkoutTitle = document.querySelector('#checkout .section-title');
        if (checkoutTitle) checkoutTitle.textContent = translations[lang].checkout_title;

        const checkoutInstructions = document.querySelector('#checkout .mdc-card p:first-child');
        if (checkoutInstructions) checkoutInstructions.textContent = translations[lang].checkout_instructions;

        const checkoutItems = document.querySelectorAll('#checkout .mdc-card ul li');
        if (checkoutItems.length >= 3) {
            checkoutItems[0].textContent = translations[lang].checkout_item1;
            checkoutItems[1].textContent = translations[lang].checkout_item2;
            checkoutItems[2].textContent = translations[lang].checkout_item3;
        }

        const checkoutNote = document.querySelector('#checkout .mdc-card p:last-of-type');
        if (checkoutNote) checkoutNote.textContent = translations[lang].checkout_note;

        const completeCheckoutButton = document.getElementById('checkout-button');
        if (completeCheckoutButton) completeCheckoutButton.innerHTML = `<i class="material-icons">logout</i>${translations[lang].complete_checkout}`;
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
    
    // Initialize total on page load
    updateTotal();
});
