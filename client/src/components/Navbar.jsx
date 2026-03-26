import { Link } from 'react-router-dom';

export default function Navbar() {
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
      <span style={{ fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '1px' }}>
        NeuroTrace
      </span>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
          Dashboard
        </Link>
        <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>
          Login
        </Link>
      </div>
    </nav>
  );
}
