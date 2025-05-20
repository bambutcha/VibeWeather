// Функционал для работы с погодным API и отображения погоды
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, что мы на странице погоды
    if (window.location.pathname.endsWith('weather.html')) {
        // Инициализируем загрузку данных о погоде
        initWeatherPage();
        
        // Добавляем обработчик для кнопки обновления
        const refreshButton = document.getElementById('refresh-button');
        if (refreshButton) {
            refreshButton.addEventListener('click', initWeatherPage);
        }
    }
});

/**
 * Инициализирует страницу погоды
 */
/**
 * Инициализирует страницу погоды
 */
async function initWeatherPage() {
    // Если пользователь не авторизован, перенаправляем на страницу входа
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }
    
    // Получаем элементы страницы
    const weatherContainer = document.getElementById('weather-container');
    const loader = document.getElementById('loader');
    const errorElement = document.getElementById('error-message');
    const refreshButton = document.getElementById('refresh-button');
    
    // Сохраняем исходный текст кнопки
    let originalButtonText = '';
    if (refreshButton) {
        originalButtonText = refreshButton.textContent;
        refreshButton.innerHTML = '<span class="refresh-spinner"></span> Обновление...';
        refreshButton.disabled = true;
    }
    
    try {
        // Показываем индикатор загрузки при первой загрузке
        if (!document.getElementById('temperature').textContent.trim() || 
            document.getElementById('temperature').textContent === '--°C') {
            showElement('loader');
            hideElement('weather-container');
        } else {
            // Если данные уже были загружены, просто добавляем класс loading-state
            weatherContainer.classList.add('loading-state');
        }
        
        hideElement('error-message');
        
        // Получаем данные о погоде
        const weatherData = await getWeather();
        
        // Отображаем данные
        displayWeatherData(weatherData);
        
        // Обновляем время последнего обновления
        updateLastUpdatedTime();
    } catch (error) {
        // Если произошла ошибка, показываем сообщение
        console.error('Ошибка при получении данных о погоде:', error);
        showError('error-message', error.message || 'Не удалось получить данные о погоде. Пожалуйста, проверьте подключение к интернету и попробуйте снова.');
    } finally {
        // Скрываем индикатор загрузки
        hideElement('loader');
        showElement('weather-container');
        weatherContainer.classList.remove('loading-state');
        
        // Восстанавливаем кнопку
        if (refreshButton) {
            refreshButton.textContent = originalButtonText;
            refreshButton.disabled = false;
        }
    }
}

/**
 * Получает данные о погоде с API
 * @param {string} city - Город, для которого нужно получить погоду
 * @returns {Promise<Object>} - Данные о погоде
 */
/**
 * Получает данные о погоде с API
 * @param {string} city - Город, для которого нужно получить погоду
 * @returns {Promise<Object>} - Данные о погоде
 */
async function getWeather(city = CONFIG.DEFAULTS.CITY) {
    const apiKey = CONFIG.WEATHER_API_KEY;
    const language = CONFIG.DEFAULTS.LANGUAGE;
    const units = CONFIG.DEFAULTS.UNITS;
    
    try {
        // Формируем URL для запроса
        const url = `${CONFIG.ENDPOINTS.WEATHER}?q=${city}&appid=${apiKey}&units=${units}&lang=${language}`;
        
        // Выполняем запрос
        const response = await fetch(url);
        
        // Проверяем статус ответа
        if (!response.ok) {
            const errorData = await response.json();
            
            // Обрабатываем различные коды ошибок
            switch (errorData.cod) {
                case '401':
                    throw new Error('Неверный API ключ. Пожалуйста, проверьте настройки приложения.');
                case '404':
                    throw new Error('Город не найден. Пожалуйста, проверьте название города.');
                case '429':
                    throw new Error('Превышен лимит запросов к API. Пожалуйста, попробуйте позже.');
                default:
                    throw new Error(errorData.message || 'Ошибка при получении данных о погоде');
            }
        }
        
        // Возвращаем данные
        return await response.json();
    } catch (error) {
        // Обрабатываем ошибки сети
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            throw new Error('Не удалось подключиться к серверу погоды. Пожалуйста, проверьте подключение к интернету.');
        }
        
        throw error;
    }
}

/**
 * Отображает данные о погоде на странице
 * @param {Object} data - Данные о погоде
 */
function displayWeatherData(data) {
    // Устанавливаем название города
    document.getElementById('city-name').textContent = data.name;
    
    // Устанавливаем текущую дату
    document.getElementById('current-date').textContent = formatDate(new Date());
    
    // Устанавливаем температуру
    document.getElementById('temperature').textContent = formatTemperature(data.main.temp);
    
    // Устанавливаем описание погоды
    document.getElementById('weather-description').textContent = 
        data.weather[0].description.charAt(0).toUpperCase() + 
        data.weather[0].description.slice(1);
    
    // Устанавливаем иконку погоды
    setWeatherIcon(data.weather[0].icon);
    
    // Устанавливаем ощущаемую температуру
    document.getElementById('feels-like').textContent = formatTemperature(data.main.feels_like);
    
    // Устанавливаем скорость и направление ветра
    document.getElementById('wind-speed').textContent = 
        `${data.wind.speed} м/с, ${formatWindDirection(data.wind.deg)}`;
    
    // Устанавливаем влажность
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    
    // Устанавливаем атмосферное давление
    document.getElementById('pressure').textContent = formatPressure(data.main.pressure);
}

/**
 * Устанавливает иконку погоды
 * @param {string} iconCode - Код иконки от API
 */
function setWeatherIcon(iconCode) {
    const iconElement = document.getElementById('weather-icon');
    iconElement.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    iconElement.alt = 'Иконка погоды';
}

/**
 * Обновляет время последнего обновления данных
 */
function updateLastUpdatedTime() {
    document.getElementById('update-time').textContent = formatTime(new Date());
}

/**
 * Форматирует температуру
 * @param {number} temp - Температура
 * @returns {string} - Отформатированная температура
 */
function formatTemperature(temp) {
    return `${Math.round(temp)}°C`;
}

/**
 * Форматирует давление из гПа в мм рт.ст.
 * @param {number} hPa - Давление в гектопаскалях
 * @returns {string} - Отформатированное давление
 */
function formatPressure(hPa) {
    // Конвертация из гПа в мм рт.ст.
    return `${Math.round(hPa * 0.75)} мм рт.ст.`;
}

/**
 * Форматирует направление ветра из градусов в текстовое обозначение
 * @param {number} degrees - Направление ветра в градусах
 * @returns {string} - Текстовое направление ветра
 */
function formatWindDirection(degrees) {
    // Определяем направление ветра по градусам
    const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}