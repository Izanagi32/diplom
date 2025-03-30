const map = L.map("map").setView([49.8397, 24.0297], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const deliveryLocations = [
  //Україна
  { city: "Київ", coords: [50.4501, 30.5234], region: "ua" },
  { city: "Харків", coords: [49.9935, 36.2304], region: "ua" },
  { city: "Дніпро", coords: [48.4647, 35.0462], region: "ua" },
  { city: "Одеса", coords: [46.4825, 30.7233], region: "ua" },
  { city: "Запоріжжя", coords: [47.8388, 35.1396], region: "ua" },
  { city: "Львів", coords: [49.8397, 24.0297], region: "ua" },
  { city: "Кривий Ріг", coords: [47.9105, 33.3918], region: "ua" },
  { city: "Миколаїв", coords: [46.975, 31.9946], region: "ua" },
  { city: "Вінниця", coords: [49.2328, 28.48], region: "ua" },
  { city: "Полтава", coords: [49.5883, 34.5514], region: "ua" },
  { city: "Чернігів", coords: [51.4982, 31.2893], region: "ua" },
  { city: "Черкаси", coords: [49.4444, 32.0598], region: "ua" },
  { city: "Суми", coords: [50.9077, 34.7981], region: "ua" },
  { city: "Житомир", coords: [50.2547, 28.6587], region: "ua" },
  { city: "Хмельницький", coords: [49.4216, 26.9965], region: "ua" },
  { city: "Івано-Франківськ", coords: [48.9226, 24.7103], region: "ua" },
  { city: "Тернопіль", coords: [49.5535, 25.5948], region: "ua" },
  { city: "Луцьк", coords: [50.7472, 25.3254], region: "ua" },
  { city: "Ужгород", coords: [48.6208, 22.2879], region: "ua" },
  { city: "Рівне", coords: [50.6199, 26.2516], region: "ua" },
  { city: "Кропивницький", coords: [48.5079, 32.2623], region: "ua" },
  { city: "Чернівці", coords: [48.2915, 25.9403], region: "ua" },
  // Польща
  { city: "Варшава", coords: [52.2297, 21.0122], region: "eu" },
  { city: "Краків", coords: [50.0647, 19.945], region: "eu" },
  { city: "Лодзь", coords: [51.7592, 19.456], region: "eu" },
  { city: "Вроцлав", coords: [51.1079, 17.0385], region: "eu" },
  { city: "Познань", coords: [52.4064, 16.9252], region: "eu" },
  { city: "Гданськ", coords: [54.352, 18.6466], region: "eu" },
  { city: "Щецин", coords: [53.4285, 14.5528], region: "eu" },
  { city: "Люблін", coords: [51.2465, 22.5684], region: "eu" },
  { city: "Катовіце", coords: [50.2649, 19.0238], region: "eu" },

  // Німеччина
  { city: "Берлін", coords: [52.52, 13.405], region: "eu" },
  { city: "Гамбург", coords: [53.5511, 9.9937], region: "eu" },
  { city: "Мюнхен", coords: [48.1351, 11.582], region: "eu" },
  { city: "Кельн", coords: [50.9375, 6.9603], region: "eu" },
  { city: "Франкфурт-на-Майні", coords: [50.1109, 8.6821], region: "eu" },
  { city: "Штутгарт", coords: [48.7758, 9.1829], region: "eu" },
  { city: "Дюссельдорф", coords: [51.2277, 6.7735], region: "eu" },

  // Нідерланди
  { city: "Амстердам", coords: [52.3676, 4.9041], region: "eu" },
  { city: "Роттердам", coords: [51.9244, 4.4777], region: "eu" },
  { city: "Гаага", coords: [52.0705, 4.3007], region: "eu" },
  { city: "Утрехт", coords: [52.0907, 5.1214], region: "eu" },

  // Бельгія
  { city: "Брюссель", coords: [50.8503, 4.3517], region: "eu" },
  { city: "Антверпен", coords: [51.2194, 4.4025], region: "eu" },
  { city: "Гент", coords: [51.0543, 3.7174], region: "eu" },
  { city: "Льєж", coords: [50.6326, 5.5797], region: "eu" },

  // Додаткові європейські міста
  { city: "Білосток", coords: [53.1325, 23.1688], region: "eu" },
  { city: "Бидгощ", coords: [53.1235, 18.0084], region: "eu" },
  { city: "Гдиня", coords: [54.5189, 18.5305], region: "eu" },
  { city: "Жешув", coords: [50.0412, 21.9991], region: "eu" },
  { city: "Торунь", coords: [53.0138, 18.5984], region: "eu" },
  { city: "Дортмунд", coords: [51.5136, 7.4653], region: "eu" },
  { city: "Ессен", coords: [51.4556, 7.0116], region: "eu" },
  { city: "Лейпциг", coords: [51.3397, 12.3731], region: "eu" },
  { city: "Дрезден", coords: [51.0504, 13.7373], region: "eu" },
  { city: "Ганновер", coords: [52.3759, 9.732], region: "eu" },
  { city: "Бонн", coords: [50.7374, 7.0982], region: "eu" },
  { city: "Нюрнберг", coords: [49.4521, 11.0767], region: "eu" },
  { city: "Ейндговен", coords: [51.4416, 5.4697], region: "eu" },
  { city: "Гронінген", coords: [53.2194, 6.5665], region: "eu" },
  { city: "Маастрихт", coords: [50.8514, 5.69], region: "eu" },
  { city: "Бреда", coords: [51.5719, 4.7683], region: "eu" },
  { city: "Арнем", coords: [51.9851, 5.8987], region: "eu" },
  { city: "Шарлеруа", coords: [50.4114, 4.4447], region: "eu" },
  { city: "Намюр", coords: [50.4674, 4.8718], region: "eu" },
  { city: "Брюгге", coords: [51.2093, 3.2247], region: "eu" },
  { city: "Левен", coords: [50.8798, 4.7005], region: "eu" },
  { city: "Генк", coords: [50.9631, 5.5003], region: "eu" },
];

const markers = [];

function renderMarkers(region) {
  markers.forEach((m) => map.removeLayer(m));
  markers.length = 0;

  deliveryLocations
    .filter((loc) => region === "all" || loc.region === region)
    .forEach((loc) => {
      const marker = L.marker(loc.coords)
        .addTo(map)
        .bindPopup(`<b>${loc.city}</b>`);
      markers.push(marker);
    });
}

renderMarkers("all");

document
  .getElementById("filterAll")
  .addEventListener("click", () => renderMarkers("all"));
document
  .getElementById("filterUA")
  .addEventListener("click", () => renderMarkers("ua"));
document
  .getElementById("filterEU")
  .addEventListener("click", () => renderMarkers("eu"));

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("citySearch");

function searchCity() {
  const input = searchInput.value.trim().toLowerCase();
  const found = deliveryLocations.find(
    (loc) => loc.city.toLowerCase() === input
  );

  if (found) {
    map.setView(found.coords, 10);
    const popup = L.popup()
      .setLatLng(found.coords)
      .setContent(`<b>${found.city}</b>`)
      .openOn(map);
  } else {
    alert("Місто не знайдено!");
  }
}

searchBtn.addEventListener("click", searchCity);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchCity();
  }
});

const suggestionsList = document.getElementById("citySuggestions");

searchInput.addEventListener("input", () => {
  const input = searchInput.value.toLowerCase();
  suggestionsList.innerHTML = "";

  if (!input) {
    suggestionsList.classList.remove("active");
    return;
  }

  const matches = deliveryLocations
    .filter((loc) => loc.city.toLowerCase().includes(input))
    .slice(0, 3); // Показати лише 3 підказки

  if (matches.length === 0) {
    suggestionsList.classList.remove("active");
    return;
  }

  suggestionsList.classList.add("active");

  matches.forEach((loc) => {
    const li = document.createElement("li");
    li.textContent = loc.city;
    li.addEventListener("click", () => {
      searchInput.value = loc.city;
      suggestionsList.innerHTML = "";
      suggestionsList.classList.remove("active");
      map.setView(loc.coords, 10);
      L.popup()
        .setLatLng(loc.coords)
        .setContent(`<b>${loc.city}</b>`)
        .openOn(map);
    });
    suggestionsList.appendChild(li);
  });
});

document.addEventListener("click", (e) => {
  if (!suggestionsList.contains(e.target) && e.target !== searchInput) {
    suggestionsList.innerHTML = "";
  }
});

fetch(
  "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
)
  .then((res) => res.json())
  .then((data) => {
    L.geoJSON(data, {
      filter: (feature) =>
        ["Ukraine", "Germany", "Poland", "Belgium", "Netherlands"].includes(
          feature.properties.ADMIN
        ),
      style: (feature) => {
        const country = feature.properties.ADMIN;
        let color = "#000";
        switch (country) {
          case "Ukraine":
            color = "#1e40af";
            break;
          case "Germany":
            color = "#dc2626";
            break;
          case "Poland":
            color = "#16a34a";
            break;
          case "Belgium":
            color = "#f59e0b";
            break;
          case "Netherlands":
            color = "#d946ef";
            break;
        }
        return {
          color: color,
          weight: 2,
          fillOpacity: 0.1,
        };
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(`<b>${feature.properties.ADMIN}</b>`);
      },
    }).addTo(map);
  });
