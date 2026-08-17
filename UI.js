import { getWeatherIconClass, get7DaysFromToday, formatHeaderDate } from './function.js';

export const elements = {
  searchInput: document.getElementById('city-input'),
  searchBtn: document.getElementById('search-btn'),
  cityName: document.getElementById('city-name'),
  currentDate: document.getElementById('current-date'),
  currentTemp: document.getElementById('current-temp'),
  weatherDesc: document.getElementById('weather-desc'),
  windSpeed: document.getElementById('wind-speed'),
  humidity: document.getElementById('humidity'),
  precipitation: document.getElementById('precipitation'),
  heroIcon: document.getElementById('hero-icon'),
  weeklyContainer: document.getElementById('weekly-list')
};

export function renderCurrentWeather(currentData, customName, country) {
  elements.currentDate.textContent = formatHeaderDate();

  const locationName = customName || currentData.name;
  const countryCode = country || currentData.sys?.country || '';
  elements.cityName.textContent = countryCode ? `${locationName}, ${countryCode}` : locationName;

  elements.currentTemp.textContent = `${Math.round(currentData.main.temp)}°C`;
  elements.weatherDesc.textContent = currentData.weather[0].description;

  const iconClass = getWeatherIconClass(currentData.weather[0].main);
  elements.heroIcon.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;

  elements.windSpeed.textContent = `${Math.round(currentData.wind.speed * 3.6)} km/h`;
  elements.humidity.textContent = `${currentData.main.humidity}%`;

  const rainVal = currentData.rain ? (currentData.rain['1h'] || currentData.rain['3h'] || 0) : 0;
  elements.precipitation.textContent = `${rainVal} mm`;
}

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