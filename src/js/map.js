import RouteManager from './routeManager.js';

const map = L.map("map", {
  fullscreenControl: true,
  fullscreenControlOptions: {
    position: 'topleft',
    title: 'Повноекранний режим',
    titleCancel: 'Вийти з повноекранного режиму'
  }
}).setView([50.4501, 30.5234], 6);

// Toggle fullscreen via button
document.getElementById('fullscreenToggle').addEventListener('click', function() {
  if (map.isFullscreen()) {
    map.toggleFullscreen();
  } else {
    map.toggleFullscreen();
  }
});

const osmStandard = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

const trafficLayer = L.tileLayer(
  'https://api.tomtom.com/traffic/map/4/flow/absolute/tile/{z}/{x}/{y}.png?key=7TAXesmpLl4EdNU3ErwvQMcHRbbyMAMD',
  { attribution: 'Traffic © TomTom', minZoom: 6, zIndex: 650, className: 'traffic-layer' }
);

const cloudsLayer = L.tileLayer(
  'https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=09135cbec6c864d2ebe7a013d74d45ce',
  { opacity: 0.5, attribution: 'Clouds © OpenWeatherMap' }
);

const precipitationLayer = L.tileLayer(
  'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=09135cbec6c864d2ebe7a013d74d45ce',
  { opacity: 0.5, attribution: 'Rain © OpenWeatherMap' }
);

const trafficIncidentsLayer = L.tileLayer(
  'https://api.tomtom.com/traffic/map/4/incidents/s1/{z}/{x}/{y}.png?key=7TAXesmpLl4EdNU3ErwvQMcHRbbyMAMD',
  { attribution: 'Traffic Incidents © TomTom', minZoom: 6, zIndex: 650 }
);

const temperatureLayer = L.tileLayer(
  'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=09135cbec6c864d2ebe7a013d74d45ce',
  { opacity: 0.5, attribution: 'Temperature © OpenWeatherMap' }
);


const satelliteLayer = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  { attribution: 'Tiles © Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community' }
);

const darkLayer = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
  { attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>' }
);

const topoLayer = L.tileLayer(
  'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
  { attribution: 'Map data: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)' }
);

L.control.layers({
  "OSM Standard": osmStandard,
  "Супутникова карта": satelliteLayer,
  "Темна карта": darkLayer,
  "Топографічна карта": topoLayer
}, {
  "Трафік (TomTom)": trafficLayer,
  "Інциденти на дорогах (TomTom)": trafficIncidentsLayer,
  "Хмари (OWM)": cloudsLayer,
  "Опади (OWM)": precipitationLayer,
  "Температура (OWM)": temperatureLayer
}, { collapsed: true }).addTo(map);

const geocoderControl = L.Control.geocoder({
  collapsed: true,
  placeholder: 'Пошук вулиці або адреси...'
}).addTo(map);

const routingControl = RouteManager.initRouting(map);

async function loadAllGeoJSON() {
  const countries = [
    { code: 'UKR', layer: 'ukrGeoLayer' },
    { code: 'DEU', layer: 'deuGeoLayer' },
    { code: 'POL', layer: 'polGeoLayer' },
    { code: 'BEL', layer: 'belGeoLayer' },
    { code: 'NLD', layer: 'nldGeoLayer' }
  ];

  for (const country of countries) {
    const geoJSON = await RouteManager.loadGeoJSON(`src/data/geoBoundaries-${country.code}-ADM0.geojson`);
    if (geoJSON) {
      window[country.layer] = L.geoJSON(geoJSON, {
        style: { color: '#ff7800', weight: 2, fillOpacity: 0.1 }
      });
    }
  }
}

loadAllGeoJSON();

let startPoint, endPoint;

map.on('click', (e) => {
  if (!startPoint) {
    startPoint = e.latlng;
    L.marker(startPoint).addTo(map).bindPopup("Початкова точка").openPopup();
  } else if (!endPoint) {
    endPoint = e.latlng;
    L.marker(endPoint).addTo(map).bindPopup("Кінцева точка").openPopup();
    routingControl.setWaypoints([startPoint, endPoint]);
  }
});

geocoderControl.on('markgeocode', (e) => {
  if (!startPoint) {
    startPoint = e.geocode.center;
    alert('Початкова точка вибрана: ' + e.geocode.name);
  } else if (!endPoint) {
    endPoint = e.geocode.center;
    alert('Кінцева точка вибрана: ' + e.geocode.name);
    routingControl.setWaypoints([startPoint, endPoint]);
  }
});

let currentRegion = 'all';

let ukrGeoLayer;
fetch('src/data/geoBoundaries-UKR-ADM0.geojson')
  .then(res => res.json())
  .then(geojson => {
    ukrGeoLayer = L.geoJSON(geojson, { style: { color: '#ff7800', weight: 2, fillOpacity: 0.1 }});
  })
  .catch(err => console.error('Error loading Ukraine GeoJSON:', err));

let deuGeoLayer;
fetch('src/data/geoBoundaries-DEU-ADM0.geojson')
  .then(res => res.json())
  .then(geojson => {
    deuGeoLayer = L.geoJSON(geojson, { style: { color: '#ff7800', weight: 2, fillOpacity: 0.1 }});
  })
  .catch(err => console.error('Error loading Germany GeoJSON:', err));

let polGeoLayer;
fetch('src/data/geoBoundaries-POL-ADM0.geojson')
  .then(res => res.json())
  .then(geojson => {
    polGeoLayer = L.geoJSON(geojson, { style: { color: '#ff7800', weight: 2, fillOpacity: 0.1 }});
  })
  .catch(err => console.error('Error loading Poland GeoJSON:', err));

let belGeoLayer;
fetch('src/data/geoBoundaries-BEL-ADM0.geojson')
  .then(res => res.json())
  .then(geojson => {
    belGeoLayer = L.geoJSON(geojson, { style: { color: '#ff7800', weight: 2, fillOpacity: 0.1 }});
  })
  .catch(err => console.error('Error loading Belgium GeoJSON:', err));

let nldGeoLayer;
fetch('src/data/geoBoundaries-NLD-ADM0.geojson')
  .then(res => res.json())
  .then(geojson => {
    nldGeoLayer = L.geoJSON(geojson, { style: { color: '#ff7800', weight: 2, fillOpacity: 0.1 }});
  })
  .catch(err => console.error('Error loading Netherlands GeoJSON:', err));

function renderMarkers(region) {
  document.getElementById('filterAll').classList.toggle('active', region === 'all');
  document.getElementById('filterUA').classList.toggle('active', region === 'ua');
  document.getElementById('filterEU').classList.toggle('active', region === 'eu');

  currentRegion = region;
  if (ukrGeoLayer && map.hasLayer(ukrGeoLayer)) map.removeLayer(ukrGeoLayer);
  if (deuGeoLayer && map.hasLayer(deuGeoLayer)) map.removeLayer(deuGeoLayer);
  if (polGeoLayer && map.hasLayer(polGeoLayer)) map.removeLayer(polGeoLayer);
  if (belGeoLayer && map.hasLayer(belGeoLayer)) map.removeLayer(belGeoLayer);
  if (nldGeoLayer && map.hasLayer(nldGeoLayer)) map.removeLayer(nldGeoLayer);

  if (region === 'ua' && ukrGeoLayer) {
    ukrGeoLayer.addTo(map);
    map.fitBounds(ukrGeoLayer.getBounds());
  } else if (region === 'eu') {
    if (deuGeoLayer) deuGeoLayer.addTo(map);
    if (polGeoLayer) polGeoLayer.addTo(map);
    if (belGeoLayer) belGeoLayer.addTo(map);
    if (nldGeoLayer) nldGeoLayer.addTo(map);
    const euBounds = L.latLngBounds([]);
    if (deuGeoLayer) euBounds.extend(deuGeoLayer.getBounds());
    if (polGeoLayer) euBounds.extend(polGeoLayer.getBounds());
    if (belGeoLayer) euBounds.extend(belGeoLayer.getBounds());
    if (nldGeoLayer) euBounds.extend(nldGeoLayer.getBounds());
    if (euBounds.isValid()) map.fitBounds(euBounds);
  } else if (region === 'all') {
    if (ukrGeoLayer) ukrGeoLayer.addTo(map);
    if (deuGeoLayer) deuGeoLayer.addTo(map);
    if (polGeoLayer) polGeoLayer.addTo(map);
    if (belGeoLayer) belGeoLayer.addTo(map);
    if (nldGeoLayer) nldGeoLayer.addTo(map);
    const allBounds = L.latLngBounds([]);
    if (ukrGeoLayer) allBounds.extend(ukrGeoLayer.getBounds());
    if (deuGeoLayer) allBounds.extend(deuGeoLayer.getBounds());
    if (polGeoLayer) allBounds.extend(polGeoLayer.getBounds());
    if (belGeoLayer) allBounds.extend(belGeoLayer.getBounds());
    if (nldGeoLayer) allBounds.extend(nldGeoLayer.getBounds());
    if (allBounds.isValid()) map.fitBounds(allBounds);
  }
}

if (ukrGeoLayer && map.hasLayer(ukrGeoLayer)) map.removeLayer(ukrGeoLayer);
if (deuGeoLayer && map.hasLayer(deuGeoLayer)) map.removeLayer(deuGeoLayer);
if (polGeoLayer && map.hasLayer(polGeoLayer)) map.removeLayer(polGeoLayer);
if (belGeoLayer && map.hasLayer(belGeoLayer)) map.removeLayer(belGeoLayer);
if (nldGeoLayer && map.hasLayer(nldGeoLayer)) map.removeLayer(nldGeoLayer);

function highlightCountries() {
  if (ukrGeoLayer) ukrGeoLayer.addTo(map);
  if (deuGeoLayer) deuGeoLayer.addTo(map);
  if (polGeoLayer) polGeoLayer.addTo(map);
  if (belGeoLayer) belGeoLayer.addTo(map);
  if (nldGeoLayer) nldGeoLayer.addTo(map);
}

let bordersVisible = false;

const filterCountriesButton = document.getElementById('filterCountries');
filterCountriesButton.addEventListener('click', () => {
  if (bordersVisible) {
    if (ukrGeoLayer && map.hasLayer(ukrGeoLayer)) map.removeLayer(ukrGeoLayer);
    if (deuGeoLayer && map.hasLayer(deuGeoLayer)) map.removeLayer(deuGeoLayer);
    if (polGeoLayer && map.hasLayer(polGeoLayer)) map.removeLayer(polGeoLayer);
    if (belGeoLayer && map.hasLayer(belGeoLayer)) map.removeLayer(belGeoLayer);
    if (nldGeoLayer && map.hasLayer(nldGeoLayer)) map.removeLayer(nldGeoLayer);
  } else {
    highlightCountries();
  }
  bordersVisible = !bordersVisible;
});

document.getElementById('startRoute').addEventListener('click', () => {
  startPoint = null;
  endPoint = null;
  map.eachLayer(layer => {
    if (layer instanceof L.Marker) map.removeLayer(layer);
  });
});

document.getElementById('resetRoute').addEventListener('click', () => {
  routingControl.setWaypoints([]);
  startPoint = null;
  endPoint = null;
  
  map.eachLayer(layer => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  document.getElementById('routeDistance').textContent = '-';
  document.getElementById('routeTime').textContent = '-';
});

routingControl.on('routesfound', (e) => {
  const routes = e.routes;
  const summary = routes[0].summary;
  document.getElementById('routeDistance').textContent = (summary.totalDistance / 1000).toFixed(2) + ' км';

  const totalSeconds = summary.totalTime;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  document.getElementById('routeTime').textContent = `${hours} год. ${minutes} хв.`;
});
