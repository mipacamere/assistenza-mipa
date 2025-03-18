// script.js
    <script src="https://cdnjs.cloudflare.com/ajax/libs/material-components-web/14.0.0/material-components-web.min.js"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY"></script>
    <script>
        // Tab switching
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

            // Place breakfast order - Updated with the correct WhatsApp number
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

            // Share photos via WhatsApp - Updated with the correct phone number
            shareButton.addEventListener('click', function() {
                // Count the photos
                const photoCount = document.querySelectorAll('.photo-item').length;
                const message = `Hello, I would like to share ${photoCount} photos from my stay. I'll send them separately after this message.`;

                // Open WhatsApp with the general phone number
                window.open(`https://wa.me/393245242326?text=${encodeURIComponent(message)}`);
            });

            // Check out button - Updated with the correct phone number
            document.getElementById('checkout-button').addEventListener('click', function() {
                const message = "Hello, I'm checking out now. Thank you for the wonderful stay!";
                window.open(`https://wa.me/393245242326?text=${encodeURIComponent(message)}`);
            });

            // Initialize Google Map
            window.initMap = function() {
                // Default coordinates (replace with your accommodation location)
                const defaultLocation = { lat: 40.7128, lng: -74.0060 };

                const mapOptions = {
                    center: defaultLocation,
                    zoom: 14,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                const map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

                // Add marker for accommodation location
                new google.maps.Marker({
                    position: defaultLocation,
                    map: map,
                    title: 'Your Accommodation'
                });

            };
        });
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
            "scuba_diving_details": "€50 a persona - Prenota 24h in anticipo",
            "explore_city": "Esplora la Città",
            "view_itinerary": "Visualizza Itinerario",

            // Breakfast tab
            "order_breakfast": "Ordina la Tua Colazione",
            "breakfast_instructions": "Seleziona gli elementi per la tua colazione. Gli ordini devono essere effettuati entro le 20:00 per la consegna la mattina successiva.",
            "continental_breakfast": "Colazione Continentale",
            "continental_desc": "Croissant, marmellata, burro, caffè o tè",
            "full_breakfast": "Colazione Completa",
            "full_desc": "Uova, pancetta, toast, pomodoro, funghi, caffè o tè",
            "vegan_breakfast": "Colazione Vegana",
            "vegan_desc": "Toast con avocado, macedonia di frutta, yogurt vegetale, caffè o tè",
            "orange_juice": "Succo d'Arancia Fresco",
            "juice_desc": "300ml di succo d'arancia appena spremuto",
            "fruit_plate": "Piatto di Frutta",
            "fruit_desc": "Selezione di frutta di stagione",
            "total": "Totale:",
            "place_order": "Effettua Ordine",

            // Photos tab
            "share_photos": "Condividi le Tue Foto",
            "photos_instructions": "Carica le foto del tuo soggiorno. Potremmo mostrarle sul nostro sito web (con il tuo permesso)!",
            "add_photos": "Aggiungi Foto",
            "share_photos_btn": "Condividi Foto via WhatsApp",

            // Checkout tab
            "checkout_title": "Check Out",
            "checkout_instructions": "Pronto per il check out? Assicurati di aver:",
            "checkout_item1": "Restituito tutte le chiavi e le tessere d'accesso",
            "checkout_item2": "Raccolto tutti i tuoi effetti personali",
            "checkout_item3": "Saldato eventuali pagamenti in sospeso",
            "checkout_note": "Clicca il pulsante sottostante per comunicarci che stai effettuando il check out.",
            "complete_checkout": "Completa Check Out",

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
            "bike_rental_details": "€10 por día - Pregunte en recepción",
            "scuba_diving": "Buceo",
            "scuba_diving_details": "€50 por persona - Reserve con 24h de antelación",
            "explore_city": "Explora la Ciudad",
            "view_itinerary": "Ver Itinerario",

            // Breakfast tab
            "order_breakfast": "Pide Tu Desayuno",
            "breakfast_instructions": "Selecciona los elementos para tu desayuno. Los pedidos deben realizarse antes de las 20:00 para la entrega a la mañana siguiente.",
            "continental_breakfast": "Desayuno Continental",
            "continental_desc": "Croissant, mermelada, mantequilla, café o té",
            "full_breakfast": "Desayuno Completo",
            "full_desc": "Huevos, bacon, tostada, tomate, champiñones, café o té",
            "vegan_breakfast": "Desayuno Vegano",
            "vegan_desc": "Tostada con aguacate, ensalada de frutas, yogur vegetal, café o té",
            "orange_juice": "Zumo de Naranja Natural",
            "juice_desc": "300ml de zumo de naranja recién exprimido",
            "fruit_plate": "Plato de Frutas",
            "fruit_desc": "Selección de frutas de temporada",
            "total": "Total:",
            "place_order": "Realizar Pedido",

            // Photos tab
            "share_photos": "Comparte Tus Fotos",
            "photos_instructions": "Sube fotos de tu estancia. ¡Podríamos mostrarlas en nuestra web (con tu permiso)!",
            "add_photos": "Añadir Fotos",
            "share_photos_btn": "Compartir Fotos por WhatsApp",

            // Checkout tab
            "checkout_title": "Check Out",
            "checkout_instructions": "¿Listo para el check out? Por favor, asegúrate de haber:",
            "checkout_item1": "Devuelto todas las llaves y tarjetas de acceso",
            "checkout_item2": "Recogido todas tus pertenencias personales",
            "checkout_item3": "Liquidado cualquier pago pendiente",
            "checkout_note": "Haz clic en el botón de abajo para notificarnos que estás haciendo el check out.",
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
            "checkin": "Check-in:",
            "checkout": "Check-out:",
            "address": "Adresse:",
            "contact_us": "Nous Contacter",
            "additional_services": "Services Supplémentaires",
            "bike_rental": "Location de Vélos",
            "bike_rental_details": "€10 par jour - Demandez à la réception",
            "scuba_diving": "Plongée Sous-marine",
            "scuba_diving_details": "€50 par personne - Réservez 24h à l'avance",
            "explore_city": "Explorez la Ville",
            "view_itinerary": "Voir l'Itinéraire",

            // Breakfast tab
            "order_breakfast": "Commandez Votre Petit-déjeuner",
            "breakfast_instructions": "Sélectionnez les éléments pour votre petit-déjeuner. Les commandes doivent être passées avant 20h00 pour une livraison le lendemain matin.",
            "continental_breakfast": "Petit-déjeuner Continental",
            "continental_desc": "Croissant, confiture, beurre, café ou thé",
            "full_breakfast": "Petit-déjeuner Complet",
            "full_desc": "Œufs, bacon, toast, tomate, champignons, café ou thé",
            "vegan_breakfast": "Petit-déjeuner Végétalien",
            "vegan_desc": "Toast à l'avocat, salade de fruits, yaourt végétal, café ou thé",
            "orange_juice": "Jus d'Orange Frais",
            "juice_desc": "300ml de jus d'orange fraîchement pressé",
            "fruit_plate": "Assiette de Fruits",
            "fruit_desc": "Sélection de fruits de saison",
            "total": "Total:",
            "place_order": "Passer la Commande",

            // Photos tab
            "share_photos": "Partagez Vos Photos",
            "photos_instructions": "Téléchargez des photos de votre séjour. Nous pourrions les présenter sur notre site web (avec votre permission) !",
            "add_photos": "Ajouter des Photos",
            "share_photos_btn": "Partager des Photos via WhatsApp",

            // Checkout tab
            "checkout_title": "Check Out",
            "checkout_instructions": "Prêt pour le check out ? Veuillez vous assurer d'avoir :",
            "checkout_item1": "Rendu toutes les clés et cartes d'accès",
            "checkout_item2": "Récupéré tous vos effets personnels",
            "checkout_item3": "Réglé tous les paiements en suspens",
            "checkout_note": "Cliquez sur le bouton ci-dessous pour nous informer que vous effectuez le check out.",
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
        document.querySelector('[data-tab="info"]').innerHTML =
            `<i class="material-icons">info</i>${translations[lang].tab_info}`;
        document.querySelector('[data-tab="breakfast"]').innerHTML =
            `<i class="material-icons">restaurant</i>${translations[lang].tab_breakfast}`;
        document.querySelector('[data-tab="photos"]').innerHTML =
            `<i class="material-icons">photo_camera</i>${translations[lang].tab_photos}`;
        document.querySelector('[data-tab="map"]').innerHTML =
            `<i class="material-icons">map</i>${translations[lang].tab_map}`;
        document.querySelector('[data-tab="checkout"]').innerHTML =
            `<i class="material-icons">logout</i>${translations[lang].tab_checkout}`;

        // Update heading
        document.querySelector('.header h1').textContent = "Guest Support";

        // Update Info tab
        document.querySelector('#info .section-title:nth-of-type(1)').textContent = translations[lang].general_info;
        const generalInfo = document.querySelector('#info .mdc-card');
        generalInfo.innerHTML = `
            <p><strong>${translations[lang].checkin}</strong> 3:00 PM - 10:00 PM</p>
            <p><strong>${translations[lang].checkout}</strong> By 10:30 AM</p>
            <p><strong>${translations[lang].address}</strong> Via San Giovanni, 42</p>
        `;

        document.querySelector('#info .section-title:nth-of-type(2)').textContent = translations[lang].contact_us;
        document.querySelector('#info .section-title:nth-of-type(3)').textContent = translations[lang].additional_services;

        const bikeRental = document.querySelector('#info .service-item:nth-of-type(1) div');
        bikeRental.innerHTML = `
            <div><strong>${translations[lang].bike_rental}</strong></div>
            <div>${translations[lang].bike_rental_details}</div>
        `;

        const scubaDiving = document.querySelector('#info .service-item:nth-of-type(2) div');
        scubaDiving.innerHTML = `
            <div><strong>${translations[lang].scuba_diving}</strong></div>
            <div>${translations[lang].scuba_diving_details}</div>
        `;

        document.querySelector('#info .section-title:nth-of-type(4)').textContent = translations[lang].explore_city;
        document.querySelector('#info .mdc-button').innerHTML = `
            <i class="material-icons">explore</i>${translations[lang].view_itinerary}
        `;

        // Update Breakfast tab
        document.querySelector('#breakfast .section-title').textContent = translations[lang].order_breakfast;
        document.querySelector('#breakfast p').textContent = translations[lang].breakfast_instructions;

        // Continental Breakfast
        const continental = document.querySelector('#breakfast-items .breakfast-item:nth-of-type(1) .breakfast-details');
        continental.innerHTML = `
            <div class="breakfast-name">${translations[lang].continental_breakfast}</div>
            <div class="breakfast-description">${translations[lang].continental_desc}</div>
        `;

        // Full Breakfast
        const full = document.querySelector('#breakfast-items .breakfast-item:nth-of-type(2) .breakfast-details');
        full.innerHTML = `
            <div class="breakfast-name">${translations[lang].full_breakfast}</div>
            <div class="breakfast-description">${translations[lang].full_desc}</div>
        `;

        // Vegan Breakfast
        const vegan = document.querySelector('#breakfast-items .breakfast-item:nth-of-type(3) .breakfast-details');
        vegan.innerHTML = `
            <div class="breakfast-name">${translations[lang].vegan_breakfast}</div>
            <div class="breakfast-description">${translations[lang].vegan_desc}</div>
        `;

        // Orange Juice
        const juice = document.querySelector('#breakfast-items .breakfast-item:nth-of-type(4) .breakfast-details');
        juice.innerHTML = `
            <div class="breakfast-name">${translations[lang].orange_juice}</div>
            <div class="breakfast-description">${translations[lang].juice_desc}</div>
        `;

        // Fruit Plate
        const fruit = document.querySelector('#breakfast-items .breakfast-item:nth-of-type(5) .breakfast-details');
        fruit.innerHTML = `
            <div class="breakfast-name">${translations[lang].fruit_plate}</div>
            <div class="breakfast-description">${translations[lang].fruit_desc}</div>
        `;

        document.querySelector('.total-section div:first-child').textContent = translations[lang].total;
        document.querySelector('#order-breakfast').innerHTML = `
            <i class="material-icons">send</i>${translations[lang].place_order}
        `;

        // Update Photos tab
        document.querySelector('#photos .section-title').textContent = translations[lang].share_photos;
        document.querySelector('#photos p').textContent = translations[lang].photos_instructions;
        document.querySelector('#photos .mdc-button').innerHTML = `
            <i class="material-icons">add_photo_alternate</i>${translations[lang].add_photos}
        `;
        document.querySelector('#share-photos').innerHTML = `
            <i class="material-icons">share</i>${translations[lang].share_photos_btn}
        `;

        // Update Checkout tab
        document.querySelector('#checkout .section-title').textContent = translations[lang].checkout_title;
        const checkoutCard = document.querySelector('#checkout .mdc-card');
        checkoutCard.innerHTML = `
            <p>${translations[lang].checkout_instructions}</p>
            <ul>
                <li>${translations[lang].checkout_item1}</li>
                <li>${translations[lang].checkout_item2}</li>
                <li>${translations[lang].checkout_item3}</li>
            </ul>
            <p>${translations[lang].checkout_note}</p>

            <button class="mdc-button" id="checkout-button">
                <i class="material-icons">logout</i>
                ${translations[lang].complete_checkout}
            </button>
        `;

        // Re-attach event listener for checkout button
        document.getElementById('checkout-button').addEventListener('click', function() {
            const message = "Hello, I'm checking out now. Thank you for the wonderful stay!";
            window.open(`https://wa.me/393245242326?text=${encodeURIComponent(message)}`);
        });

        // Update Map tab
        document.querySelector('#map .section-title').textContent = translations[lang].city_map;
    }

// Language switching
document.addEventListener('DOMContentLoaded', function() {
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

    // Initialize with saved language AFTER all other DOM elements are loaded
    // This ensures all elements exist before we try to update their content
    setTimeout(() => {
        updateLanguage(savedLang);
    }, 100);
});

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
    document.querySelector('[data-tab="info"]').innerHTML =
        `<i class="material-icons">info</i>${translations[lang].tab_info}`;
    document.querySelector('[data-tab="breakfast"]').innerHTML =
        `<i class="material-icons">restaurant</i>${translations[lang].tab_breakfast}`;
    document.querySelector('[data-tab="photos"]').innerHTML =
        `<i class="material-icons">photo_camera</i>${translations[lang].tab_photos}`;
    document.querySelector('[data-tab="map"]').innerHTML =
        `<i class="material-icons">map</i>${translations[lang].tab_map}`;
    document.querySelector('[data-tab="checkout"]').innerHTML =
        `<i class="material-icons">logout</i>${translations[lang].tab_checkout}`;

    // Update rest of the language elements...
    // (Keeping all other translation updates)
}
