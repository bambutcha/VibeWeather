# План разработки VibeWeather

## Обзор проекта
**VibeWeather** - веб-приложение для просмотра прогноза погоды в Москве. Включает авторизацию пользователя и отображение текущих погодных условий.

## Sprint #1: Проектирование и настройка проекта

### Шаг 1: Анализ требований
- Изучение требований тестового задания
- Определение функциональных элементов:
  - Страница авторизации
  - Страница прогноза погоды
  - Роутинг и защищенные маршруты
- Изучение API-документации:
  - ReqRes.in для авторизации
  - OpenWeatherMap для данных о погоде

### Шаг 2: Создание базовой структуры проекта
- Инициализация проекта с использованием React
- Установка необходимых зависимостей:
  - `react-router-dom` для роутинга
  - `tailwindcss` для стилизации
  - `axios` для HTTP-запросов
- Настройка структуры директорий:
  ```
  src/
  ├── components/       # UI компоненты
  ├── pages/            # Страницы приложения
  ├── services/         # Сервисы для работы с API
  ├── context/          # React Context для управления состоянием
  ├── hooks/            # Пользовательские хуки
  ├── assets/           # Статические ресурсы
  ├── utils/            # Вспомогательные функции
  └── App.js            # Главный компонент приложения
  ```

### Шаг 3: Настройка стилей и темы
- Установка и конфигурация Tailwind CSS
- Создание основных переменных темы:
  - Цветовая схема
  - Шрифты
  - Размеры
- Настройка базовых стилей для мобильной и десктопной версий

### Шаг 4: Создание макетов страниц
- Разработка прототипа страницы авторизации
- Разработка прототипа страницы погоды
- Создание общего шаблона layout для приложения

## Sprint #2: Реализация авторизации

### Шаг 1: Создание компонента формы авторизации
- Разработка UI-компонентов:
  - Текстовые поля для логина и пароля
  - Кнопка входа
  - Элементы отображения ошибок
- Реализация хука `useForm` для управления состоянием формы

### Шаг 2: Настройка валидации
- Создание схемы валидации для формы авторизации:
  - Проверка обязательных полей
  - Валидация email-формата
  - Минимальная длина пароля
- Реализация отображения ошибок валидации

### Шаг 3: Интеграция с API авторизации
- Создание сервиса `authService.js` для работы с ReqRes.in API:
  ```javascript
  // Пример функции авторизации
  const login = async (email, password) => {
    try {
      const response = await axios.post('https://reqres.in/api/login', { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  ```
- Подключение сервиса к форме авторизации
- Обработка успешной и неуспешной авторизации

### Шаг 4: Управление состоянием авторизации
- Создание контекста авторизации:
  ```javascript
  // AuthContext.js
  const AuthContext = createContext();
  
  const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    
    // Функции для работы с авторизацией
    
    return (
      <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  ```
- Реализация хука `useAuth`:
  ```javascript
  const useAuth = () => {
    return useContext(AuthContext);
  };
  ```

### Шаг 5: Настройка защищенных маршрутов
- Создание компонента `ProtectedRoute`:
  ```javascript
  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    return children;
  };
  ```
- Настройка роутинга с защищенными маршрутами:
  ```javascript
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/" element={
      <ProtectedRoute>
        <WeatherPage />
      </ProtectedRoute>
    } />
  </Routes>
  ```

## Sprint #3: Интеграция с API погоды

### Шаг 1: Получение API-ключа
- Регистрация на сайте OpenWeatherMap
- Получение API-ключа
- Настройка переменных окружения для хранения ключа

### Шаг 2: Создание сервиса для работы с API погоды
- Реализация модуля `weatherService.js`:
  ```javascript
  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
  const CITY = 'Moscow';
  
  const getWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  ```

### Шаг 3: Реализация загрузки данных о погоде
- Создание хука `useWeather` для получения и обработки данных:
  ```javascript
  const useWeather = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const data = await weatherService.getWeather();
        setWeather(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    useEffect(() => {
      fetchWeather();
    }, []);
    
    return { weather, loading, error, fetchWeather };
  };
  ```

### Шаг 4: Обработка и преобразование данных
- Создание утилиты для преобразования данных погоды:
  ```javascript
  const formatWeatherData = (data) => {
    return {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      wind: {
        speed: data.wind.speed,
        direction: getWindDirection(data.wind.deg),
      },
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      cityName: data.name,
    };
  };
  ```
- Разработка функций для форматирования единиц измерения

## Sprint #4: Разработка интерфейса и доработка приложения

### Шаг 1: Создание компонентов отображения погоды
- Разработка компонента `WeatherCard`:
  ```jsx
  const WeatherCard = ({ weatherData }) => {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{weatherData.cityName}</h2>
            <p className="text-gray-500">{getCurrentDate()}</p>
          </div>
          <div className="text-5xl font-bold">{weatherData.temperature}°C</div>
        </div>
        
        <div className="flex items-center mt-4">
          <img 
            src={`http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`} 
            alt={weatherData.description} 
          />
          <p className="text-xl capitalize">{weatherData.description}</p>
        </div>
        
        {/* Дополнительная информация */}
      </div>
    );
  };
  ```

### Шаг 2: Добавление иконок погоды
- Создание компонента `WeatherIcon`:
  ```jsx
  const WeatherIcon = ({ iconCode }) => {
    return (
      <img 
        src={`http://openweathermap.org/img/wn/${iconCode}@2x.png`} 
        alt="Weather icon" 
        className="w-16 h-16"
      />
    );
  };
  ```
- Альтернативно: использование набора SVG-иконок для лучшего визуального соответствия дизайну

### Шаг 3: Добавление дополнительной информации
- Создание компонента `WeatherDetails`:
  ```jsx
  const WeatherDetails = ({ weatherData }) => {
    return (
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="flex items-center">
          <WindIcon className="w-6 h-6 mr-2 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Ветер</p>
            <p>{weatherData.wind.speed} м/с, {weatherData.wind.direction}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <DropletIcon className="w-6 h-6 mr-2 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Влажность</p>
            <p>{weatherData.humidity}%</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <GaugeIcon className="w-6 h-6 mr-2 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Давление</p>
            <p>{weatherData.pressure} гПа</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <ThermometerIcon className="w-6 h-6 mr-2 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Ощущается как</p>
            <p>{weatherData.feelsLike}°C</p>
          </div>
        </div>
      </div>
    );
  };
  ```

### Шаг 4: Реализация функции выхода
- Добавление кнопки выхода в хедер приложения
- Имплементация функции logout:
  ```javascript
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    navigate('/login');
  };
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
  - Оптимизация сборки
  - Настройка переменных окружения
- Выбор платформы для хостинга:
  - Vercel
  - Netlify
  - GitHub Pages
- Деплой приложения на выбранную платформу
- Тестирование работоспособности на продакшене

## Дополнительные улучшения (если останется время)
- Добавление темной темы
- Реализация переключения единиц измерения (°C/°F)
- Анимации загрузки и переходов
- Локализация на русский и английский языки
- Добавление прогноза на несколько дней
- Поддержка выбора города
