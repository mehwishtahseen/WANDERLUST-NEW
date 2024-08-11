mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  center: list.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
  `<h4>${list.title}</h4><p>Exact Location Provided !</p>`
);

const marker1 = new mapboxgl.Marker({ color: "red" })
  .setLngLat(list.geometry.coordinates)
  .setPopup(popup) // set the popup to the marker
  .addTo(map);
