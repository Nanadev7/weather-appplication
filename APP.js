import { DEFAULT_CITY } from './constants.js';
import { searchLocations, fetchWeatherData } from './API.js';
import { elements, renderCurrentWeather, renderForecastList } from './UI.js';

async function loadWeather(lat, lon, customName, state, country) {
  try {
    const { currentData, dailyMap } = await fetchWeatherData(lat, lon);
    renderCurrentWeather(currentData, customName, country);
    renderForecastList(dailyMap, Math.round(currentData.main.temp));
  } catch (err) {
    alert('Could not fetch weather data for this location.');
  }
}

async function handleSearch() {
  const query = elements.searchInput.value.trim();
  if (!query) return;

  const location = await searchLocations(query);
  if (location) {
    await loadWeather(location.lat, location.lon, location.name, location.state, location.country);
    elements.searchInput.value = '';
  }
}

if (elements.searchBtn) {
  elements.searchBtn.addEventListener('click', handleSearch);
}

if (elements.searchInput) {
  elements.searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  });
}

// Default initial load
loadWeather(
  DEFAULT_CITY.lat,
  DEFAULT_CITY.lon,
  DEFAULT_CITY.name,
  DEFAULT_CITY.state,
  DEFAULT_CITY.country
);