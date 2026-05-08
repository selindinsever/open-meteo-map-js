// TR ve EN diller için çeviri nesneleri
const translate = {
    tr: {
        title: "Konum Seçin",
        desc: "Haritaya tıklayın",
        refresh: "Yenile",
        details: "Detaylar",
        wind: "Rüzgar",
        direction: "Yön",
        loading: "Veri alınıyor...",
        error: "Bağlantı Hatası!",
        unknownLoc: "Bilinmeyen Yer",
        weather: {
            0: "Açık", 1: "Çoğunlukla Açık", 2: "Parçalı Bulutlu", 3: "Bulutlu",
            45: "Sisli", 61: "Hafif Yağmurlu", 71: "Karlı", 95: "Fırtına",
            unknown: "Bilinmiyor"
        }
    },
    en: {
        title: "Select Location",
        desc: "Click on map",
        refresh: "Refresh",
        details: "Details",
        //DÜZELTME YAPILDI Türkçe karakter sorununu önlemek için i ile js kod bloğu ile düzelttim 
        wind: "Wind",
        direction: "Direction",
        loading: "Loading...",
        error: "Connection Error!",
        unknownLoc: "Unknown Location",
        weather: {
            0: "Clear Sky", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
            45: "Foggy", 61: "Slight Rain", 71: "Snowy", 95: "Thunderstorm",
            unknown: "Unknown"
        }
    }
};

let currentLang = 'tr';
let lastWeatherCode = null;
let lastLocationName = "";


const tempDisplay = document.getElementById('temp-value');
const descDisplay = document.getElementById('weather-desc');
const windDisplay = document.getElementById('wind-speed');
const dirDisplay = document.getElementById('wind-dir');
const coordsDisplay = document.getElementById('coords-display');
const refreshBtn = document.getElementById('refresh-btn');
const detailBtn = document.getElementById('detail-btn');
const extraDetails = document.getElementById('extra-details');

let currentLat, currentLon;

// Dil Değiştirme (Bu kısımda yapay zekadan yardım aldım döngü kullanmamak için nasıl farklı bir yol denerim diye soru sormuştum 
// ve bana bu şekilde bir fonksiyon yazmıştı. Döngü  kullanmamını tercih etmememin sebebi ise çevrilecek alan sayısı az olduğu 
// için büyük bir döngü kurup sistemi yormak istemedim.)
function changeLanguage(lang) {
    currentLang = lang;

    const title = lastLocationName || translate[lang].title;

    document.querySelector('header h1').innerHTML =
        `<i class="fa-solid fa-map-location-dot"></i> ${title}`;

    refreshBtn.innerHTML =
        `<i class="fa-solid fa-arrows-rotate"></i> ${translate[lang].refresh}`;

    detailBtn.innerHTML =
        `<i class="fa-solid fa-list-ul"></i> ${translate[lang].details}`;

    document.querySelector('.detail-item:nth-child(1) span').innerText =
        translate[lang].wind;

    document.querySelector('.detail-item:nth-child(2) span').innerText =
        translate[lang].direction;


    if (lastWeatherCode !== null) {
        descDisplay.innerText =
            translate[lang].weather[lastWeatherCode] ||
            translate[lang].weather.unknown;
    } else {
        descDisplay.innerText = translate[lang].desc;
    }
}

//Harita konumlandırılması
const map = L.map('map-container').setView([38.42, 27.14], 8);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO'
}).addTo(map);

let currentMarker;

//Yer adı 
async function getLocationName(lat, lon) {
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await res.json();

        return data.address.city ||
               data.address.town ||
               data.address.village ||
               data.address.suburb ||
               translate[currentLang].unknownLoc;

    } catch {
        return translate[currentLang].unknownLoc;
    }
}


map.on('click', function(e) {
    const { lat, lng } = e.latlng;
    currentLat = lat;
    currentLon = lng;

    if (currentMarker) {
        currentMarker.setLatLng(e.latlng);
    } else {
        currentMarker = L.marker(e.latlng).addTo(map);
    }

    coordsDisplay.innerText = `Lat: ${lat.toFixed(2)}, Lon: ${lng.toFixed(2)}`;

    refreshBtn.classList.remove('hidden');
    detailBtn.classList.remove('hidden');

    fetchWeather(lat, lng);
});

//Open-Meteo API'sinden hava durumu verilerini çekme
async function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    try {
        descDisplay.innerText = translate[currentLang].loading;

        const [weatherRes, locationName] = await Promise.all([
            fetch(url).then(res => {
                if (!res.ok) throw new Error("API error");
                return res.json();
            }),
            getLocationName(lat, lon)
        ]);

        lastWeatherCode = weatherRes.current_weather.weathercode;
        lastLocationName = locationName;

        document.querySelector('header h1').innerHTML =
            `<i class="fa-solid fa-map-location-dot"></i> ${locationName}`;

        updateUI(weatherRes.current_weather);

    } catch (err) {
        descDisplay.innerText = translate[currentLang].error;
    }
}



function updateUI(weather) {
    tempDisplay.innerText = `${Math.round(weather.temperature)}°C`;
    
  
    const weatherIcon = document.querySelector('.weather-icon');
    let iconClass = "fa-sun";

    const code = weather.weathercode;
    

    //Burada hava durumu kodlarına göre ikon sınıfını belirleme
    if (code === 0) {
        iconClass = "fa-sun"; // Açık
    } else if (code >= 1 && code <= 3) {
        iconClass = "fa-cloud-sun"; // Parçalı Bulutlu
    } else if (code >= 45 && code <= 48) {
        iconClass = "fa-smog"; // Sisli
    } else if (code >= 51 && code <= 67) {
        iconClass = "fa-cloud-showers-heavy"; // Yağmurlu
    } else if (code >= 71 && code <= 77) {
        iconClass = "fa-snowflake"; // Karlı
    } else if (code >= 95) {
        iconClass = "fa-bolt"; // Fırtına
    }

   
    weatherIcon.className = `fa-solid ${iconClass} weather-icon`;

    descDisplay.innerText = translate[currentLang].weather[code] || translate[currentLang].weather.unknown;

    // Rüzgar hızı (km/h)
    windDisplay.innerText = `${weather.windspeed} km/h`;
    dirDisplay.innerText = `${weather.winddirection}°`;
}

//Refres butonu
refreshBtn.addEventListener('click', () => {
    if (currentLat && currentLon) {
        fetchWeather(currentLat, currentLon);
    }
});

// Detay Göster/Gizle Butonu
detailBtn.addEventListener('click', () => {
    extraDetails.classList.toggle('hidden');
});


// HTML'de id'si 'quick-city-select' olan bir select varsa çalışır
const citySelect = document.getElementById('quick-city-select');
if (citySelect) {
    citySelect.addEventListener('change', (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const lat = parseFloat(selectedOption.getAttribute('data-lat'));
        const lon = parseFloat(selectedOption.getAttribute('data-lon'));

        // Haritayı seçilen yere kaydır
        map.flyTo([lat, lon], 10);

       
        if (currentMarker) {
            currentMarker.setLatLng([lat, lon]);
        } else {
            currentMarker = L.marker([lat, lon]).addTo(map);
        }

        currentLat = lat;
        currentLon = lon;
        coordsDisplay.innerText = `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`;
        
        fetchWeather(lat, lon);
    });
}

// Sayfa ilk açıldığında varsayılan dili yükle
changeLanguage(currentLang);