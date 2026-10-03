# 🌤️ WeatherNow - Modern Weather Dashboard

**WeatherNow** is a modern, responsive, glassmorphism weather dashboard built with **React**, **Vite**, **JavaScript**, **CSS3**, and **OpenWeather API**.

---

## ✨ Features

- 🏙️ **City Search**: Search weather for any city worldwide (e.g. New Delhi, London, Tokyo, New York).
- 📍 **Current Location**: Detect user geolocation and display weather for current coordinates.
- 🌡️ **Temperature Unit Toggle (°C / °F)**: Instant conversion between Celsius and Fahrenheit without extra API calls.
- 📊 **Comprehensive Weather Details**: Humidity, Wind Speed, Atmospheric Pressure, Visibility, Cloudiness, and Feels Like temperature.
- 🌅 **Sunrise & Sunset Tracker**: Localized sunrise and sunset times with visual daylight duration progress.
- ⏰ **Hourly Forecast**: Scrollable 24-hour forecast in 3-hour steps.
- 📅 **5-Day Forecast**: Grouped daily forecast showing weather conditions and min/max temperatures.
- 🎨 **Dynamic Backgrounds & Themes**: Automatically updates application theme and background gradients based on weather condition and day/night state.
- 🕒 **Recent Searches**: Saves the last 5 searched cities in `localStorage` for fast one-click access.
- ⚡ **Glassmorphism UI**: Premium translucent cards, smooth hover effects, responsive layout for Mobile, Tablet, and Desktop.
- 🛡️ **Robust Error & Loading States**: Skeleton loading placeholders and user-friendly error banners.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Make sure you have **Node.js** (v16 or higher) installed on your system.

### 2. Installation
Clone or navigate to the project directory and install dependencies:

```bash
npm install
```

### 3. Environment Setup & API Key
Create a `.env` file in the root folder of the project (you can copy `.env.example`):

```bash
cp .env.example .env
```

Open `.env` and add your **OpenWeather API Key**:

```env
VITE_OPENWEATHER_API_KEY=your_actual_openweather_api_key_here
```

> 🔑 **How to get an API Key:**
> 1. Sign up for free at [OpenWeather](https://openweathermap.org/).
> 2. Go to your account dashboard under **API Keys**.
> 3. Generate a key and paste it into `.env`.

### 4. Run Development Server
Start the Vite development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000` (or the URL shown in your terminal).

---

## 🛠️ Tech Stack & Dependencies

- **Frontend Framework**: React 18
- **Build Tool**: Vite 6
- **Icons**: Lucide React (`lucide-react`)
- **API Provider**: OpenWeather API (Current Weather + 5-Day/3-Hour Forecast)
- **Styling**: Modern Modular CSS3 (CSS Variables, Flexbox, Grid, Glassmorphism Backdrop Blur)

---

## 📁 Component & Project Structure

```
weatherApp/
├── .env                  # Local environment file (API Key)
├── .env.example          # Example environment configuration
├── .gitignore            # Git ignore rules (ignores .env, node_modules, build)
├── index.html            # HTML entry point with Inter font & favicon
├── package.json          # Node dependencies & npm scripts
├── README.md             # Project documentation
├── vite.config.js        # Vite configuration
└── src/
    ├── App.jsx           # Main application state & theme orchestrator
    ├── main.jsx          # React DOM render entry point
    ├── index.css         # Global glassmorphism & responsive CSS
    ├── components/
    │   ├── Navbar.jsx            # App header, branding, search container & unit toggle
    │   ├── SearchBar.jsx         # Input field, search button & location button
    │   ├── CurrentWeather.jsx    # Primary weather card (city, date, icon, temp, condition)
    │   ├── WeatherDetails.jsx    # Highlights grid (humidity, wind, pressure, visibility)
    │   ├── SunriseSunset.jsx     # Sunrise/sunset schedule & daylight progress bar
    │   ├── HourlyForecast.jsx    # Horizontal scrollable 24-hour forecast
    │   ├── DailyForecast.jsx     # 5-day daily forecast list with min/max temps
    │   ├── RecentSearches.jsx    # Quick-access pills for recent search history
    │   ├── Loading.jsx           # Skeleton loader UI during API fetches
    │   └── ErrorMessage.jsx      # Friendly error notification banner
    ├── services/
    │   └── weatherApi.js         # Fetch service for OpenWeather endpoints
    └── utils/
        └── weatherUtils.js       # Date formatting, unit conversion, grouping & themes
```

---

## 🌐 OpenWeather API Integration Details

The application uses two key OpenWeather endpoints:

1. **Current Weather API**:
   - `https://api.openweathermap.org/data/2.5/weather?q={CITY}&appid={API_KEY}&units=metric`
   - `https://api.openweathermap.org/data/2.5/weather?lat={LAT}&lon={LON}&appid={API_KEY}&units=metric`

2. **5-Day / 3-Hour Forecast API**:
   - `https://api.openweathermap.org/data/2.5/forecast?q={CITY}&appid={API_KEY}&units=metric`
   - `https://api.openweathermap.org/data/2.5/forecast?lat={LAT}&lon={LON}&appid={API_KEY}&units=metric`

3. **Weather Icons**:
   - `https://openweathermap.org/img/wn/{ICON_CODE}@2x.png`
   - `https://openweathermap.org/img/wn/{ICON_CODE}@4x.png`

---

## 🔒 Security Best Practices

- The API Key is accessed exclusively via Vite environment variables: `import.meta.env.VITE_OPENWEATHER_API_KEY`.
- `.env` and `.env.local` files are included in `.gitignore` to prevent secret leaks to source control repositories.

---

## 📜 License

This project is open-source under the MIT License.
