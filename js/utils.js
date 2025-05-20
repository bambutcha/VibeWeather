// Вспомогательные функции

// Работа с токеном авторизации
/**
 * Сохраняет токен авторизации в localStorage
 * @param {string} token - Токен авторизации
 */
function saveToken(token) {
    localStorage.setItem('token', token);
    // Дополнительно сохраняем время создания токена
    localStorage.setItem('tokenTimestamp', Date.now().toString());
}

/**
 * Получает токен из localStorage
 * @returns {string|null} - Токен авторизации или null, если его нет
 */
function getToken() {
    return localStorage.getItem('token');
}

/**
 * Удаляет токен и связанные с ним данные из localStorage
 */
function removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenTimestamp');
}

/**
 * Проверяет, авторизован ли пользователь
 * @returns {boolean} - true, если пользователь авторизован, иначе false
 */
function isAuthenticated() {
    const token = getToken();
    const tokenTimestamp = localStorage.getItem('tokenTimestamp');
    
    // Если нет токена, пользователь не авторизован
    if (!token) {
        return false;
    }
    
    // Если нет временной метки, но есть токен, считаем пользователя авторизованным
    if (!tokenTimestamp) {
        return true;
    }
    
    // Проверяем, не истек ли токен (предполагаем, что токен действителен 24 часа)
    // Примечание: в реальном приложении срок действия токена должен определяться сервером
    const tokenAge = Date.now() - parseInt(tokenTimestamp);
    const tokenMaxAge = 24 * 60 * 60 * 1000; // 24 часа в миллисекундах
    
    return tokenAge < tokenMaxAge;
}

// Вспомогательные функции для работы с UI
/**
 * Показывает элемент по ID
 * @param {string} elementId - ID элемента
 */
function showElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'block';
    }
}

/**
 * Скрывает элемент по ID
 * @param {string} elementId - ID элемента
 */
function hideElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
    }
}

/**
 * Показывает сообщение об ошибке
 * @param {string} elementId - ID элемента для отображения ошибки
 * @param {string} message - Текст ошибки
 */
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

/**
 * Форматирует дату в удобный для чтения формат
 * @param {Date} date - Объект даты
 * @returns {string} - Отформатированная дата
 */
function formatDate(date) {
    // Форматирование даты в стиле "21 мая 2025"
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('ru-RU', options);
}

/**
 * Форматирует время в удобный для чтения формат
 * @param {Date} date - Объект даты
 * @returns {string} - Отформатированное время
 */
function formatTime(date) {
    // Форматирование времени в стиле "15:30"
    const options = { hour: '2-digit', minute: '2-digit' };
    return date.toLocaleTimeString('ru-RU', options);
}
