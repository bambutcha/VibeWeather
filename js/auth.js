// Функционал авторизации
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, авторизован ли пользователь
    if (isAuthenticated()) {
        // Если мы на странице авторизации, но пользователь уже вошел в систему,
        // перенаправляем его на страницу с погодой
        if (window.location.pathname.endsWith('index.html') || 
            window.location.pathname === '/' || 
            window.location.pathname.endsWith('/')) {
            window.location.href = 'weather.html';
        }
    } else {
        // Если мы на странице погоды, но пользователь не авторизован,
        // перенаправляем его на страницу авторизации
        if (window.location.pathname.endsWith('weather.html')) {
            window.location.href = 'index.html';
        }
    }

    // Получаем форму авторизации
    const loginForm = document.getElementById('login-form');
    
    // Если форма существует, добавляем обработчик события
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Получаем кнопку выхода
    const logoutButton = document.getElementById('logout-button');
    
    // Если кнопка существует, добавляем обработчик события
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
});

/**
 * Обрабатывает процесс авторизации
 * @param {Event} event - Событие отправки формы
 */
/**
 * Обрабатывает процесс авторизации
 * @param {Event} event - Событие отправки формы
 */
async function handleLogin(event) {
    // Предотвращаем стандартное поведение формы
    event.preventDefault();
    
    // Получаем данные из формы
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    
    console.log("Попытка входа с:", { email, password });
    
    // Получаем элемент для отображения ошибок
    const errorElement = document.getElementById('error-message');
    
    // Проверяем, что поля заполнены
    if (!email || !password) {
        showError('error-message', 'Пожалуйста, заполните все поля');
        return;
    }
    
    // Скрываем сообщение об ошибке, если оно было показано ранее
    errorElement.style.display = 'none';
    
    try {
        // Показываем, что идет процесс
        const submitButton = document.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Выполняется вход...';
        submitButton.disabled = true;
        
        // Отправляем запрос к API
        console.log("Отправка запроса к", CONFIG.ENDPOINTS.LOGIN);
        const response = await login(email, password);
        console.log("Ответ от сервера:", response);
        
        // Проверяем, есть ли токен в ответе
        if (response.token) {
            // Сохраняем токен
            saveToken(response.token);
            
            // Перенаправляем на страницу с погодой
            window.location.href = 'weather.html';
        } else if (response.error) {
            // Если API вернуло ошибку, показываем ее
            showError('error-message', response.error);
        } else {
            // Если что-то пошло не так, но мы не получили конкретную ошибку
            showError('error-message', 'Произошла ошибка при попытке входа');
        }
    } catch (error) {
        // Обрабатываем ошибки сети или другие исключения
        console.error("Ошибка входа:", error);
        showError('error-message', 'Не удалось подключиться к серверу. Пожалуйста, проверьте подключение к интернету.');
    } finally {
        // Восстанавливаем состояние кнопки
        const submitButton = document.querySelector('button[type="submit"]');
        submitButton.textContent = 'Войти';
        submitButton.disabled = false;
    }
}

/**
 * Выполняет запрос к API для авторизации
 * @param {string} email - Email пользователя
 * @param {string} password - Пароль пользователя
 * @returns {Promise<Object>} - Ответ от API
 */
/**
 * Выполняет запрос к API для авторизации
 * @param {string} email - Email пользователя
 * @param {string} password - Пароль пользователя
 * @returns {Promise<Object>} - Ответ от API
 */
async function login(email, password) {
    try {
        console.log('Отправляемые данные:', { email, password });
        
        const response = await fetch(CONFIG.ENDPOINTS.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'reqres-free-v1'
            },
            body: JSON.stringify({ 
                email: email, 
                password: password 
            })
        });
        
        console.log('Ответ от сервера:', response);
        console.log('Статус ответа:', response.status);
        
        // Проверяем статус ответа
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Ошибка API:', errorData);
            return { 
                error: errorData.error || 'Ошибка авторизации. Пожалуйста, проверьте данные и попробуйте снова.' 
            };
        }
        
        // Возвращаем данные ответа
        const data = await response.json();
        console.log('Данные ответа:', data);
        return data;
    } catch (error) {
        console.error('Ошибка при запросе к API:', error);
        return { error: 'Не удалось подключиться к серверу. Пожалуйста, проверьте подключение к интернету.' };
    }
}

/**
 * Обрабатывает выход из системы
 */
function handleLogout() {
    // Удаляем токен
    removeToken();
    
    // Перенаправляем на страницу входа
    window.location.href = 'index.html';
}
