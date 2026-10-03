/**
 * Utility functions for WeatherNow app
 * Handles local timezone formatting using Intl.DateTimeFormat
 */

/**
 * Converts Celsius temperature to Fahrenheit if unit is 'F'
 * @param {number} tempC - Temperature in Celsius
 * @param {'C' | 'F'} unit - Target unit
 * @returns {number} Rounded temperature value
 */
export const convertTemp = (tempC, unit) => {
  if (tempC === undefined || tempC === null) return 0;
  if (unit === 'F') {
    return Math.round((tempC * 9) / 5 + 32);
  }
  return Math.round(tempC);
};

/**
 * Formats temperature with unit symbol
 * @param {number} tempC - Temperature in Celsius
 * @param {'C' | 'F'} unit - Target unit
 * @returns {string} e.g. "28°"
 */
export const formatTemp = (tempC, unit) => {
  return `${convertTemp(tempC, unit)}°`;
};

/**
 * Converts any timestamp (in seconds or ms) or Date object into city local Date object
 * by applying OpenWeather's timezone offset (in seconds).
 * @param {number|Date} timestampOrDate 
 * @param {number} timezoneOffsetSeconds 
 * @returns {Date} Date object normalized to UTC equivalent of target local time
 */
export const getCityShiftedDate = (timestampOrDate, timezoneOffsetSeconds = 0) => {
  let dateMs;
  if (typeof timestampOrDate === 'number') {
    // OpenWeather timestamps are in UTC seconds (10 digits)
    dateMs = timestampOrDate < 1e11 ? timestampOrDate * 1000 : timestampOrDate;
  } else if (timestampOrDate instanceof Date) {
    dateMs = timestampOrDate.getTime();
  } else {
    dateMs = new Date(timestampOrDate).getTime();
  }

  if (isNaN(dateMs)) dateMs = Date.now();

  // Shift UTC ms by city's timezone offset in seconds
  const localMs = dateMs + (timezoneOffsetSeconds * 1000);
  return new Date(localMs);
};

/**
 * Formats city local time string (e.g. "5:21:14 PM" or "05:21 PM") using Intl.DateTimeFormat
 * @param {number|Date} timestampOrDate - Unix timestamp in seconds/ms or Date
 * @param {number} timezoneOffsetSeconds - OpenWeather timezone offset in seconds
 * @param {object} customOptions - Optional Intl.DateTimeFormat options
 * @returns {string} Formatted local time
 */
export const formatCityLocalTime = (timestampOrDate, timezoneOffsetSeconds = 0, customOptions = {}) => {
  if (!timestampOrDate) return '';
  const shiftedDate = getCityShiftedDate(timestampOrDate, timezoneOffsetSeconds);

  const defaultOptions = {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'UTC',
    ...customOptions
  };

  return new Intl.DateTimeFormat('en-US', defaultOptions).format(shiftedDate);
};

/**
 * Formats city local date string (e.g. "Saturday, Oct 3, 2026") using Intl.DateTimeFormat
 * @param {number|Date} timestampOrDate - Unix timestamp in seconds/ms or Date
 * @param {number} timezoneOffsetSeconds - OpenWeather timezone offset in seconds
 * @returns {string} Formatted local date
 */
export const formatCityLocalDate = (timestampOrDate, timezoneOffsetSeconds = 0) => {
  if (!timestampOrDate) return '';
  const shiftedDate = getCityShiftedDate(timestampOrDate, timezoneOffsetSeconds);

  const options = {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  };

  return new Intl.DateTimeFormat('en-US', options).format(shiftedDate);
};

/**
 * Formats short time for hourly forecast (e.g. "4 PM", "12 AM")
 * @param {number} unixTimestamp - UTC timestamp in seconds
 * @param {number} timezoneOffsetSeconds - Timezone offset in seconds
 * @returns {string} e.g. "4 PM"
 */
export const formatShortTime = (unixTimestamp, timezoneOffsetSeconds = 0) => {
  if (!unixTimestamp) return '';
  const shiftedDate = getCityShiftedDate(unixTimestamp, timezoneOffsetSeconds);

  const options = {
    hour: 'numeric',
    hour12: true,
    timeZone: 'UTC'
  };

  return new Intl.DateTimeFormat('en-US', options).format(shiftedDate);
};

/**
 * Generates formatted UTC offset string (e.g. "UTC+05:30", "UTC+09:00", "UTC-04:00")
 * @param {number} offsetSeconds 
 * @returns {string}
 */
export const getUtcOffsetString = (offsetSeconds = 0) => {
  const sign = offsetSeconds >= 0 ? '+' : '-';
  const absSec = Math.abs(offsetSeconds);
  const hours = Math.floor(absSec / 3600);
  const mins = Math.floor((absSec % 3600) / 60);
  const padH = String(hours).padStart(2, '0');
  const padM = String(mins).padStart(2, '0');
  return `UTC${sign}${padH}:${padM}`;
};

/**
 * Converts country code (e.g. "IN", "US") to full country name
 * @param {string} countryCode 
 * @returns {string} e.g. "India"
 */
export const getCountryName = (countryCode) => {
  if (!countryCode) return '';
  try {
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    return regionNames.of(countryCode) || countryCode;
  } catch (e) {
    return countryCode;
  }
};

/**
 * OpenWeather Icon URL generator
 * @param {string} iconCode 
 * @param {'@2x' | '@4x'} scale 
 * @returns {string} URL
 */
export const getWeatherIconUrl = (iconCode, scale = '@2x') => {
  if (!iconCode) return '';
  return `https://openweathermap.org/img/wn/${iconCode}${scale}.png`;
};

/**
 * Groups 5-day / 3-hour forecast entries by calendar day in target city local time
 * Calculates min & max temp for each day, picks mid-day condition icon
 * @param {Array} list - OpenWeather forecast items list
 * @param {number} timezoneOffsetSeconds - Timezone offset in seconds
 * @returns {Array} Array of daily forecast objects
 */
export const groupDailyForecast = (list = [], timezoneOffsetSeconds = 0) => {
  if (!list || list.length === 0) return [];

  const daysMap = {};

  // Find today's date string in city local time
  const todayShifted = getCityShiftedDate(Date.now(), timezoneOffsetSeconds);
  const todayDateStr = `${todayShifted.getUTCFullYear()}-${todayShifted.getUTCMonth() + 1}-${todayShifted.getUTCDate()}`;

  list.forEach((item) => {
    const itemShifted = getCityShiftedDate(item.dt, timezoneOffsetSeconds);
    const dateStr = `${itemShifted.getUTCFullYear()}-${itemShifted.getUTCMonth() + 1}-${itemShifted.getUTCDate()}`;
    const hour = itemShifted.getUTCHours();

    if (!daysMap[dateStr]) {
      daysMap[dateStr] = {
        dateStr,
        dt: item.dt,
        dayOfWeek: itemShifted.getUTCDay(),
        minTemp: item.main.temp_min,
        maxTemp: item.main.temp_max,
        entries: [item],
        repItem: item,
        closestToNoonDiff: Math.abs(hour - 12)
      };
    } else {
      const dayData = daysMap[dateStr];
      if (item.main.temp_min < dayData.minTemp) dayData.minTemp = item.main.temp_min;
      if (item.main.temp_max > dayData.maxTemp) dayData.maxTemp = item.main.temp_max;
      dayData.entries.push(item);

      const diff = Math.abs(hour - 12);
      if (diff < dayData.closestToNoonDiff) {
        dayData.closestToNoonDiff = diff;
        dayData.repItem = item;
      }
    }
  });

  const dayKeys = Object.keys(daysMap).slice(0, 5);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return dayKeys.map((dateStr, index) => {
    const dayData = daysMap[dateStr];
    let label = '';

    if (dateStr === todayDateStr || index === 0) {
      label = 'Today';
    } else if (index === 1) {
      label = 'Tomorrow';
    } else {
      label = shortDayNames[dayData.dayOfWeek];
    }

    const weather = dayData.repItem.weather[0] || {};

    return {
      dateStr,
      label,
      fullDayName: dayNames[dayData.dayOfWeek],
      minTemp: dayData.minTemp,
      maxTemp: dayData.maxTemp,
      icon: weather.icon,
      condition: weather.main || 'Clear',
      description: weather.description || ''
    };
  });
};

/**
 * Gets next 8 hourly forecast entries
 * @param {Array} list - OpenWeather forecast list
 * @param {number} count - Number of entries to return (default 8)
 * @returns {Array} Sliced list of forecast items
 */
export const getHourlyForecast = (list = [], count = 8) => {
  if (!list) return [];
  return list.slice(0, count);
};

/**
 * Determines theme class based on main weather condition and day/night state
 * @param {string} mainCondition - Main weather state
 * @param {string} iconCode - OpenWeather icon code
 * @returns {object} { bgGradient, themeClass, isNight }
 */
export const getWeatherTheme = (mainCondition = '', iconCode = '01d') => {
  const isNight = iconCode ? iconCode.endsWith('n') : false;
  const condition = (mainCondition || '').toLowerCase();

  if (isNight) {
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return { themeClass: 'theme-rain-night', bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)', isNight: true };
    }
    if (condition.includes('thunderstorm')) {
      return { themeClass: 'theme-thunder-night', bgGradient: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 50%, #2e1065 100%)', isNight: true };
    }
    if (condition.includes('snow')) {
      return { themeClass: 'theme-snow-night', bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)', isNight: true };
    }
    return { themeClass: 'theme-clear-night', bgGradient: 'linear-gradient(135deg, #0b1329 0%, #1e1b4b 50%, #111827 100%)', isNight: true };
  }

  // Day time themes
  if (condition.includes('thunderstorm')) {
    return { themeClass: 'theme-thunderstorm', bgGradient: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)', isNight: false };
  }
  if (condition.includes('rain') || condition.includes('drizzle')) {
    return { themeClass: 'theme-rain', bgGradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)', isNight: false };
  }
  if (condition.includes('snow')) {
    return { themeClass: 'theme-snow', bgGradient: 'linear-gradient(135deg, #334155 0%, #64748b 50%, #94a3b8 100%)', isNight: false };
  }
  if (condition.includes('cloud')) {
    return { themeClass: 'theme-clouds', bgGradient: 'linear-gradient(135deg, #1e293b 0%, #0284c7 50%, #38bdf8 100%)', isNight: false };
  }
  if (condition.includes('mist') || condition.includes('fog') || condition.includes('haze')) {
    return { themeClass: 'theme-mist', bgGradient: 'linear-gradient(135deg, #334155 0%, #475569 50%, #64748b 100%)', isNight: false };
  }

  // Default Clear Day
  return { themeClass: 'theme-clear-day', bgGradient: 'linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #4f46e5 100%)', isNight: false };
};

/**
 * Format wind speed based on unit preference
 * @param {number} speedMs 
 * @param {'C' | 'F'} unit 
 * @returns {string} e.g. "3.2 m/s" or "7 mph"
 */
export const formatWindSpeed = (speedMs, unit) => {
  if (speedMs === undefined || speedMs === null) return '0 m/s';
  if (unit === 'F') {
    const mph = speedMs * 2.23694;
    return `${Math.round(mph)} mph`;
  }
  return `${speedMs.toFixed(1)} m/s`;
};

/**
 * Format visibility range
 * @param {number} meters 
 * @param {'C' | 'F'} unit 
 * @returns {string} e.g. "10 km" or "6.2 mi"
 */
export const formatVisibility = (meters, unit) => {
  if (!meters && meters !== 0) return 'N/A';
  if (unit === 'F') {
    const miles = meters / 1609.34;
    return `${miles.toFixed(1)} mi`;
  }
  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
};
