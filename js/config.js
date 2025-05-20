// Конфигурационные параметры приложения
const CONFIG = {
    // API ключ для OpenWeatherMap
    // В реальном приложении этот ключ должен быть защищен и не должен быть доступен в клиентском коде
    // Для тестового задания используем открытый ключ, но в продакшене следует использовать серверную прокси-прослойку
    WEATHER_API_KEY: '91afd90c89632c7fb9087d19a700c547', // Мой ключ
    
    // API endpoints
    ENDPOINTS: {
        LOGIN: 'https://reqres.in/api/login',
        WEATHER: 'https://api.openweathermap.org/data/2.5/weather'
    },
    
    // Настройки по умолчанию
    DEFAULTS: {
        CITY: 'Moscow',
        LANGUAGE: 'ru',
        UNITS: 'metric' // метрическая система (градусы Цельсия)
    }
};