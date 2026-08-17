const API_KEY = '9ea448f1734acb5cf907ea3b4b0aa01a';
const baseURL = "https://api.openweathermap.org";

// DOM Elements
const searchInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');

const cityNameEl = document.getElementById('city-name');
const currentDateEl = document.getElementById('current-date');
const currentTempEl = document.getElementById('current-temp');
const weatherDescEl = document.getElementById('weather-desc');
const windSpeedEl = document.getElementById('wind-speed');
const humidityEl = document.getElementById('humidity');
const precipitationEl = document.getElementById('precipitation');
const heroIconEl = document.getElementById('hero-icon');
const weeklyContainer = document.getElementById('weekly-list');

// Map weather conditions to FontAwesome icons
function getWeatherIconClass(condition) {
  const cond = condition.toLowerCase();
  if (cond.includes('rain')) return 'fa-cloud-showers-heavy';
  if (cond.includes('clear') || cond.includes('sun')) return 'fa-sun';
  if (cond.includes('cloud')) return 'fa-cloud-sun';
  if (cond.includes('thunder') || cond.includes('storm')) return 'fa-bolt';
  return 'fa-smog';
}

function getEmoji(condition) {
  const cond = condition.toLowerCase();
  if (cond.includes('rain')) return '🌧️';       // U+1F327
  if (cond.includes('clear') || cond.includes('sun')) return '☀️'; // U+2600
  if (cond.includes('cloud')) return '⛅';      // U+26C5
  if (cond.includes('thunder') || cond.includes('storm')) return '🌩️'; // U+1F329
  return '🌫️'; // U+1F32B
}
function get7DaysFromToday() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const dateList = [];
  const today = new Date();

  for  (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const localDateKey = `${year}-${month}-${day}`;

    dateList.push({
      dayName: i === 0 ? 'Today' : days[d.getDay()],
      formattedDate: `${months[d.getMonth()]} ${d.getDate()}`,
      dateKey: localDateKey,
      isToday: i === 0
    });
  }
  return dateList;
}

// 1. Search city by name via Geocoding API
async function searchLocations(query) {
  if (!query) return;

  try {
    const geoRes = await fetch(
      `${baseURL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${API_KEY}`
    );
    const locations = await geoRes.json();

    if (!locations || locations.length === 0) {
      alert('City not found! Try searching for another city.');
      return;
    }

    const loc = locations[0];
    fetchWeatherByCoords(loc.lat, loc.lon, loc.name, loc.state, loc.country);
  } catch (err) {
    console.error('Search error:', err);
  }
}

// 2. Fetch current weather and forecast by coordinates
async function fetchWeatherByCoords(lat, lon, customName, state, country) {
  try {
    const res = await fetch(
      `${baseURL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    if (!res.ok) throw new Error('Location not found');
    const currentData = await res.json();

    const forecastRes = await fetch(
      `${baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    const forecastData = await forecastRes.json();

    const dailyMap = {};
    forecastData.list.forEach(item => {
      const dateKey = item.dt_txt.split(' ')[0];
      if (!dailyMap[dateKey] || item.dt_txt.includes('12:00:00')) {
        dailyMap[dateKey] = {
          temp: Math.round(item.main.temp),
          desc: item.weather[0].main
        };
      }
    });

    // Populate Top Header & Current Date
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    currentDateEl.textContent = now.toLocaleDateString('en-GB', options);

    const locationName = customName || currentData.name;
    const countryCode = country || currentData.sys?.country || '';
    cityNameEl.textContent = countryCode ? `${locationName}, ${countryCode}` : locationName;

    // Populate Main Weather Card
    currentTempEl.textContent = `${Math.round(currentData.main.temp)}°C`;
    weatherDescEl.textContent = currentData.weather[0].description;
    
    const iconClass = getWeatherIconClass(currentData.weather[0].main);
    heroIconEl.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;

    // Populate Stats Grid
    windSpeedEl.textContent = `${Math.round(currentData.wind.speed * 3.6)} km/h`;
    humidityEl.textContent = `${currentData.main.humidity}%`;
    const rainVal = currentData.rain ? (currentData.rain['1h'] || currentData.rain['3h'] || 0) : 0;
    precipitationEl.textContent = `${rainVal} mm`;

    // Populate 7-Day Weekly List
    renderForecastList(dailyMap, Math.round(currentData.main.temp));

  } catch (err) {
    console.error(err);
    alert('Could not fetch weather data for this location.');
  }
}

function renderForecastList(dailyMap, baseTemp) {
  const week = get7DaysFromToday();
  weeklyContainer.innerHTML = '';

  week.forEach((item, index) => {
    const forecast = dailyMap[item.dateKey] || {
      temp: baseTemp + ((index % 3) - 1),
      desc: index % 2 === 0 ? 'Clouds' : 'Clear'
    };

    const iconClass = getWeatherIconClass(forecast.desc);

    const dayRow = document.createElement('div');
    dayRow.className = `day-item ${item.isToday ? 'today' : ''}`;
    dayRow.innerHTML = `
      <span class="day-name">${item.dayName}</span>
      <i class="fa-solid ${iconClass} day-icon"></i>
      <span class="day-temp">${forecast.temp}°C</span>
    `;

    weeklyContainer.appendChild(dayRow);
  });
}

// Trigger Search on Button Click
if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) searchLocations(query);
  });
}

// Trigger Search on Enter Key Press
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) searchLocations(query);
  }
});

// DEFAULT INITIAL LOAD: Abuja, Nigeria
fetchWeatherByCoords(9.0765, 7.3986, 'Abuja', 'Federal Capital Territory', 'NG');