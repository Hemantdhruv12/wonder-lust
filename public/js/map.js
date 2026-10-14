mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12', // Standard map layout
    zoom: 9, 
    center: listing.geometry.coordinates, // Use the 'coordinates' variable parsed from EJS
});

// Create the marker and popup
const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates) // Use the 'coordinates' variable
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // 'Popup' must have a capital 'P'
            .setHTML(`<h4>${listing.title}</h4><p>Exact location will be provided after booking</p>`)
    )
    .addTo(map);
