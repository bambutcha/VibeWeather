// Конфигурационные параметры приложения
const CONFIG = {
    // API ключ для OpenWeatherMap - будет заменен на реальный при настройке
    WEATHER_API_KEY: 'YOUR_API_KEY',
    
    // API endpoints
    ENDPOINTS: {
        LOGIN: 'https://reqres.in/api/login',
        WEATHER: 'https://api.openweathermap.org/data/2.5/weather'
    },
    
    // Настройки по умолчанию
    DEFAULTS: {
        CITY: 'Moscow',
        LANGUAGE: 'ru',
        UNITS: 'metric'
    }
};