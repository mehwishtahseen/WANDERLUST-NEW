mapboxgl.accessToken = mapToken; // Set the access token for Mapbox GL JS

// Initialize the Mapbox map with the specified options
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: list.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

// Create a new popup that will be displayed when the marker is clicked
const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
  `<h4>${list.title}</h4><p>Exact Location Provided !</p>`
);

// Create a new marker with a red color
const marker1 = new mapboxgl.Marker({ color: "red" })
  .setLngLat(list.geometry.coordinates)
  .setPopup(popup) // attach the popup to the marker
  .addTo(map);
