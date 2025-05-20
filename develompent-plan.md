# План разработки VibeWeather (HTML/CSS/JS)

## Обзор проекта
**VibeWeather** - веб-приложение для просмотра прогноза погоды в Москве. Включает авторизацию пользователя и отображение текущих погодных условий. Реализация на чистом HTML, CSS и JavaScript без использования фреймворков.

## Sprint #1: Проектирование и настройка проекта

### Шаг 1: Анализ требований
- Изучение требований тестового задания
- Определение функциональных элементов:
  - Страница авторизации
  - Страница прогноза погоды
  - Защита страницы погоды от неавторизованного доступа
- Изучение API-документации:
  - ReqRes.in для авторизации
  - OpenWeatherMap для данных о погоде

### Шаг 2: Создание базовой структуры проекта
- Настройка структуры директорий:
  ```
  project/
  ├── index.html        # Страница авторизации
  ├── weather.html      # Страница прогноза погоды
  ├── css/
  │   ├── style.css     # Основные стили
  │   └── responsive.css # Адаптивные стили
  ├── js/
  │   ├── auth.js       # Логика авторизации
  │   ├── weather.js    # Логика получения и отображения погоды
  │   └── utils.js      # Вспомогательные функции
  └── assets/
      └── icons/        # Иконки для интерфейса
  ```

### Шаг 3: Настройка стилей и темы
- Создание основного файла стилей style.css
- Определение переменных CSS для:
  - Цветовой схемы
  - Шрифтов
  - Размеров и отступов
- Создание базовых компонентов:
  - Кнопки
  - Карточки
  - Поля ввода
  - Сообщения об ошибках
- Настройка файла responsive.css для адаптации под различные устройства

### Шаг 4: Создание HTML-страниц
- Создание шаблона страницы авторизации (index.html)
- Создание шаблона страницы погоды (weather.html)
- Подключение CSS и JavaScript файлов

## Sprint #2: Реализация авторизации

### Шаг 1: Создание страницы авторизации
- Разработка HTML-структуры формы:
  ```html
  <form id="login-form">
      <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" required>
      </div>
      
      <div class="form-group">
          <label for="password">Пароль</label>
          <input type="password" id="password" required>
      </div>
      
      <div id="error-message" class="error-message"></div>
      
      <button type="submit" class="btn btn-primary">Войти</button>
  </form>
  ```
- Добавление подсказки с тестовыми данными для входа

### Шаг 2: Настройка валидации
- Создание функций для валидации формы:
  - Проверка заполнения обязательных полей
  - Валидация email-формата
  - Минимальная длина пароля
- Добавление визуального отображения ошибок

### Шаг 3: Интеграция с API авторизации
- Реализация функции отправки запроса к ReqRes.in:
  ```javascript
  async function login(email, password) {
      try {
          const response = await fetch('https://reqres.in/api/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email, password })
          });
          
          return await response.json();
      } catch (error) {
          throw error;
      }
  }
  ```
- Обработка ответа от сервера
- Сохранение токена в localStorage при успешной авторизации

### Шаг 4: Управление состоянием авторизации
- Создание функций для работы с токеном:
  ```javascript
  function saveToken(token) {
      localStorage.setItem('token', token);
  }
  
  function getToken() {
      return localStorage.getItem('token');
  }
  
  function removeToken() {
      localStorage.removeItem('token');
  }
  
  function isAuthenticated() {
      return !!getToken();
  }
  ```
- Проверка авторизации при загрузке страниц

### Шаг 5: Реализация защиты страницы погоды
- Добавление проверки авторизации при загрузке страницы погоды:
  ```javascript
  document.addEventListener('DOMContentLoaded', function() {
      if (!isAuthenticated()) {
          window.location.href = 'index.html';
      }
  });
  ```
- Добавление редиректа авторизованного пользователя со страницы логина на страницу погоды

## Sprint #3: Интеграция с API погоды

### Шаг 1: Получение API-ключа
- Регистрация на сайте OpenWeatherMap
- Получение API-ключа
- Подготовка к использованию ключа в приложении

### Шаг 2: Создание функций для работы с API погоды
- Реализация функции получения данных о погоде:
  ```javascript
  async function getWeather(city = 'Moscow') {
      const API_KEY = 'ваш_API_ключ';
      
      try {
          const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
          );
          
          if (!response.ok) {
              throw new Error('Ошибка получения данных о погоде');
          }
          
          return await response.json();
      } catch (error) {
          throw error;
      }
  }
  ```

### Шаг 3: Реализация загрузки данных о погоде
- Создание функции для инициализации загрузки:
  ```javascript
  async function initWeatherPage() {
      const weatherContainer = document.getElementById('weather-container');
      const loader = document.getElementById('loader');
      const errorElement = document.getElementById('error-message');
      
      try {
          loader.style.display = 'block';
          weatherContainer.style.display = 'none';
          
          const weatherData = await getWeather();
          displayWeatherData(weatherData);
          
      } catch (error) {
          errorElement.textContent = error.message;
          errorElement.style.display = 'block';
      } finally {
          loader.style.display = 'none';
          weatherContainer.style.display = 'block';
      }
  }
  ```
- Добавление обработки ошибок и состояния загрузки

### Шаг 4: Обработка и преобразование данных
- Создание функций для форматирования данных погоды:
  ```javascript
  function formatTemperature(temp) {
      return `${Math.round(temp)}°C`;
  }
  
  function formatPressure(hPa) {
      return `${Math.round(hPa * 0.75)} мм рт.ст.`;
  }
  
  function formatWindDirection(degrees) {
      const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
      const index = Math.round(degrees / 45) % 8;
      return directions[index];
  }
  ```
- Реализация функций для форматирования даты и времени

## Sprint #4: Разработка интерфейса и доработка приложения

### Шаг 1: Создание HTML-структуры для отображения погоды
- Реализация структуры для карточки погоды:
  ```html
  <div class="weather-card">
      <div class="weather-header">
          <div>
              <h2 id="city-name"></h2>
              <p id="current-date"></p>
          </div>
          <div class="temperature" id="temperature"></div>
      </div>
      
      <div class="weather-main">
          <img id="weather-icon" alt="Погода" class="weather-icon">
          <p id="weather-description" class="weather-description"></p>
      </div>
      
      <div class="weather-details">
          <!-- Детали погоды: ветер, влажность, давление, и т.д. -->
      </div>
  </div>
  ```

### Шаг 2: Отображение иконок погоды
- Использование иконок OpenWeatherMap API:
  ```javascript
  function setWeatherIcon(iconCode) {
      const iconElement = document.getElementById('weather-icon');
      iconElement.src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }
  ```
- Альтернативно: подготовка собственных SVG-иконок для лучшего визуального соответствия дизайну

### Шаг 3: Создание функции отображения данных погоды
- Реализация функции для вывода всех данных на страницу:
  ```javascript
  function displayWeatherData(data) {
      // Установка основных данных
      document.getElementById('city-name').textContent = data.name;
      document.getElementById('temperature').textContent = formatTemperature(data.main.temp);
      document.getElementById('weather-description').textContent = data.weather[0].description;
      setWeatherIcon(data.weather[0].icon);
      
      // Установка дополнительных данных
      document.getElementById('wind-speed').textContent = `${data.wind.speed} м/с, ${formatWindDirection(data.wind.deg)}`;
      document.getElementById('humidity').textContent = `${data.main.humidity}%`;
      document.getElementById('pressure').textContent = formatPressure(data.main.pressure);
      document.getElementById('feels-like').textContent = formatTemperature(data.main.feels_like);
      
      // Установка текущей даты
      document.getElementById('current-date').textContent = formatDate(new Date());
  }
  ```

### Шаг 4: Реализация функции выхода
- Добавление кнопки выхода в хедер страницы погоды:
  ```html
  <header class="header">
      <h1>VibeWeather</h1>
      <button id="logout-button" class="btn btn-outline">Выйти</button>
  </header>
  ```
- Реализация обработчика для кнопки выхода:
  ```javascript
  document.getElementById('logout-button').addEventListener('click', function() {
      removeToken();
      window.location.href = 'index.html';
  });
  ```

### Шаг 5: Тестирование и отладка
- Проверка работы авторизации:
  - Успешный вход
  - Обработка ошибок
  - Сохранение состояния авторизации
- Тестирование отображения погоды:
  - Загрузка данных
  - Корректное отображение всех параметров
  - Обработка ошибок API
- Проверка адаптивности:
  - Мобильный вид (320px-768px)
  - Планшетный вид (768px-1024px)
  - Десктопный вид (>1024px)

### Шаг 6: Деплой приложения
- Подготовка приложения к деплою:
  - Проверка путей к файлам
  - Оптимизация изображений
- Выбор платформы для хостинга:
  - GitHub Pages
  - Netlify
  - Vercel
- Деплой приложения на выбранную платформу
- Тестирование работоспособности на продакшене

## Дополнительные улучшения (если останется время)
- Добавление темной темы с использованием CSS-переменных
- Реализация переключения единиц измерения (°C/°F)
- Добавление анимаций для улучшения пользовательского опыта
- Сохранение последнего времени обновления данных о погоде
- Добавление возможности обновить данные о погоде вручную
- Кеширование данных о погоде для уменьшения количества запросов к API