import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getBrandRoute = () => {
    if (!isAuthenticated) return '/login';
    return user?.role === 'admin' ? '/admin' : '/dashboard';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px',
        backgroundColor: '#1a1a2e',
        color: '#fff',
      }}
    >
      <Link to={getBrandRoute()} style={{ fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '1px', color: '#fff', textDecoration: 'none' }}>
        NeuroTrace
      </Link>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <Link 
              to="/dashboard" 
              style={{ 
                color: (location.pathname === '/' || location.pathname === '/dashboard') ? '#3498db' : '#fff', 
                textDecoration: 'none',
                fontWeight: (location.pathname === '/' || location.pathname === '/dashboard') ? 'bold' : 'normal'
              }}
            >
              Dashboard
            </Link>
            {user?.role === 'admin' && (
              <Link 
                to="/admin" 
                style={{ 
                  color: location.pathname === '/admin' ? '#3498db' : '#fff', 
                  textDecoration: 'none',
                  fontWeight: location.pathname === '/admin' ? 'bold' : 'normal'
                }}
              >
                Admin
              </Link>
            )}
            <button 
              onClick={handleLogout}
              style={{ 
                backgroundColor: 'transparent', 
                border: '1px solid #fff', 
                color: '#fff', 
                padding: '5px 12px', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>
              Login
            </Link>
            <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
