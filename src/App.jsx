import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import WeatherPage from './pages/WeatherPage';

// Компонент защищенного маршрута
const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  // В будущем это состояние будет управляться через AuthContext
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };
  
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={<Layout isAuthenticated={isAuthenticated} onLogout={handleLogout} />}
        >
          <Route 
            index 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <WeatherPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="login" 
            element={<LoginPage />} 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
