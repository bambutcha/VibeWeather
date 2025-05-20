import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Menu, X } from 'lucide-react';

const Header = ({ isAuthenticated, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header>
      <nav className="container py-4">
        <div className="flex justify-between items-center">
          <div className="logo">
            <Sun size={24} />
            <span>VibeWeather</span>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden-mobile">
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <button 
                  onClick={handleLogout} 
                  className="btn btn-secondary"
                >
                  Выйти
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/login')} 
                  className="btn btn-primary"
                >
                  Войти
                </button>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="hidden-desktop">
            <button
              type="button"
              onClick={toggleMenu}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {isMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="mobile-menu hidden-desktop">
            <div className="flex flex-col">
              {isAuthenticated ? (
                <button 
                  onClick={handleLogout} 
                  className="btn btn-secondary"
                >
                  Выйти
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/login')} 
                  className="btn btn-primary"
                >
                  Войти
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
