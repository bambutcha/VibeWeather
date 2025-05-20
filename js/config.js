// Конфигурационные параметры приложения
const CONFIG = {
    // API ключ для OpenWeatherMap
    // В реальном приложении этот ключ должен быть защищен и не должен быть доступен в клиентском коде
    // Для тестового задания используем открытый ключ, но в продакшене следует использовать серверную прокси-прослойку
    WEATHER_API_KEY: '2f19be1cc96323b6c886c09507a62395', // Бесплатный тестовый ключ
    
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