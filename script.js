// Hamburger Menu Toggle
document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Property Search Functionality
document.querySelector('.search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    filterProperties();
});

// Live Search on Input
document.querySelector('#search-input').addEventListener('input', filterProperties);

function filterProperties() {
    const searchInput = document.querySelector('#search-input').value.toLowerCase();
    const propertyCards = document.querySelectorAll('.property-card');

    propertyCards.forEach(card => {
        const price = card.getAttribute('data-price');
        const beds = card.getAttribute('data-beds');
        const type = card.getAttribute('data-type').toLowerCase();
        const priceFormatted = `$${parseInt(price).toLocaleString()}`.toLowerCase();

        const matches = price.includes(searchInput) ||
                        priceFormatted.includes(searchInput) ||
                        beds.includes(searchInput) ||
                        type.includes(searchInput);

        card.style.display = matches ? 'block' : 'none';
    });
}

// Add New Property Functionality
document.querySelector('#add-property-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.querySelector('input[name="name"]').value;
    const price = form.querySelector('input[name="price"]').value;
    const beds = form.querySelector('input[name="beds"]').value;
    const type = form.querySelector('input[name="type"]').value;
    const imageInput = form.querySelector('input[name="image"]').files[0];

    // Convert image to base64
    const reader = new FileReader();
    reader.onload = () => {
        const imageData = reader.result;

        // Create new property object
        const property = {
            name,
            price,
            beds,
            type,
            image: imageData,
            baths: Math.ceil(beds / 2) // Simple assumption for baths
        };

        // Save to localStorage
        let properties = JSON.parse(localStorage.getItem('properties') || '[]');
        properties.push(property);
        localStorage.setItem('properties', JSON.stringify(properties));

        // Add to property grid
        addPropertyToGrid(property);

        // Reset form
        form.reset();
    };

    if (imageInput) {
        reader.readAsDataURL(imageInput);
    }
});

// Load Properties from localStorage on Page Load
function loadProperties() {
    const properties = JSON.parse(localStorage.getItem('properties') || '[]');
    properties.forEach(property => addPropertyToGrid(property));
}

function addPropertyToGrid(property) {
    const propertyGrid = document.querySelector('.property-grid');
    const card = document.createElement('div');
    card.className = 'property-card';
    card.setAttribute('data-price', property.price);
    card.setAttribute('data-beds', property.beds);
    card.setAttribute('data-type', property.type);

    card.innerHTML = `
        <img src="${property.image}" alt="${property.name}">
        <h3>${property.name}</h3>
        <p>$${parseInt(property.price).toLocaleString()} | ${property.beds} Beds | ${property.baths} Baths</p>
        <a href="#" class="property-button">View Details</a>
    `;

    propertyGrid.appendChild(card);
}

// Initialize
document.addEventListener('DOMContentLoaded', loadProperties);