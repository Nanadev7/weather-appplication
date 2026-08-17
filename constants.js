export const API_KEY = '9ea448f1734acb5cf907ea3b4b0aa01a';
export const BASE_URL = 'https://api.openweathermap.org';

export const DEFAULT_CITY = {
  lat: 9.0765,
  lon: 7.3986,
  name: 'Abuja',
  state: 'Federal Capital Territory',
  country: 'NG'
};

// Map weather conditions to FontAwesome icons
export function getWeatherIconClass(condition) {
  const cond = condition.toLowerCase();
  if (cond.includes('rain')) return 'fa-cloud-showers-heavy';
  if (cond.includes('clear') || cond.includes('sun')) return 'fa-sun';
  if (cond.includes('cloud')) return 'fa-cloud-sun';
  if (cond.includes('thunder') || cond.includes('storm')) return 'fa-bolt';
  return 'fa-smog';
}

// Map weather conditions to Emojis
export function getEmoji(condition) {
  const cond = condition.toLowerCase();
  if (cond.includes('rain')) return '🌧️';
  if (cond.includes('clear') || cond.includes('sun')) return '☀️';
  if (cond.includes('cloud')) return '⛅';
  if (cond.includes('thunder') || cond.includes('storm')) return '🌩️';
  return '🌫️';
}

// Generate next 7 days date structure
export function get7DaysFromToday() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const dateList = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
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