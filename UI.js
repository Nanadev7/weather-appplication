import { getWeatherIconClass, get7DaysFromToday } from './constants.js';

// DOM Elements
export const elements = {
  searchInput: document.getElementById('city-input'),
  searchBtn: document.getElementById('search-btn'),
  cityNameEl: document.getElementById('city-name'),
  currentDateEl: document.getElementById('current-date'),
  currentTempEl: document.getElementById('current-temp'),
  weatherDescEl: document.getElementById('weather-desc'),
  windSpeedEl: document.getElementById('wind-speed'),
  humidityEl: document.getElementById('humidity'),
  precipitationEl: document.getElementById('precipitation'),
  heroIconEl: document.getElementById('hero-icon'),
  weeklyContainer: document.getElementById('weekly-list')
};

// Render main weather information
export function renderCurrentWeather(currentData, customName, country) {
  const now = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'short' };
  elements.currentDateEl.textContent = now.toLocaleDateString('en-GB', options);

  const locationName = customName || currentData.name;
  const countryCode = country || currentData.sys?.country || '';
  elements.cityNameEl.textContent = countryCode ? `${locationName}, ${countryCode}` : locationName;

  elements.currentTempEl.textContent = `${Math.round(currentData.main.temp)}°C`;
  elements.weatherDescEl.textContent = currentData.weather[0].description;

  const iconClass = getWeatherIconClass(currentData.weather[0].main);
  elements.heroIconEl.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;

  elements.windSpeedEl.textContent = `${Math.round(currentData.wind.speed * 3.6)} km/h`;
  elements.humidityEl.textContent = `${currentData.main.humidity}%`;
  
  const rainVal = currentData.rain ? (currentData.rain['1h'] || currentData.rain['3h'] || 0) : 0;
  elements.precipitationEl.textContent = `${rainVal} mm`;
}

// Render weekly forecast list
export function renderForecastList(dailyMap, baseTemp) {
  const week = get7DaysFromToday();
  elements.weeklyContainer.innerHTML = '';

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

    elements.weeklyContainer.appendChild(dayRow);
  });
}