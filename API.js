import { API_KEY, BASE_URL } from './constants.js';

export async function searchLocations(query) {
  if (!query) return null;

  try {
    const res = await fetch(
      `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${API_KEY}`
    );
    const locations = await res.json();

    if (!locations || locations.length === 0) {
      alert('City not found! Try searching for another city.');
      return null;
    }

    return locations[0];
  } catch (err) {
    console.error('Search API error:', err);
    throw err;
  }
}

export async function fetchWeatherData(lat, lon) {
  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
      fetch(`${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const currentData = await currentRes.json();
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

    return { currentData, dailyMap };
  } catch (err) {
    console.error('Weather API error:', err);
    throw err;
  }
}