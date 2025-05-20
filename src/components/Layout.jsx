import { Outlet } from 'react-router-dom';
import Header from './ui/Header';

const Layout = ({ isAuthenticated, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header isAuthenticated={isAuthenticated} onLogout={onLogout} />
      <main className="flex-grow container py-8">
        <Outlet />
      </main>
      <footer className="py-4">
        <div className="container text-center text-sm">
          <p>© 2025 VibeWeather. Тестовое задание.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
