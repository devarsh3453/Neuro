import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NotFound() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGoHome = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '80vh',
      textAlign: 'center',
      padding: '20px'
    },
    errorCode: {
      fontSize: '8rem',
      fontWeight: 'bold',
      color: '#3498db',
      margin: '0',
      lineHeight: '1'
    },
    message: {
      fontSize: '2rem',
      color: '#333',
      marginBottom: '30px'
    },
    button: {
      padding: '12px 30px',
      fontSize: '1.1rem',
      backgroundColor: '#3498db',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'background-color 0.2s'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.errorCode}>404</h1>
      <p style={styles.message}>Oops! The page you're looking for doesn't exist.</p>
      <button style={styles.button} onClick={handleGoHome}>
        Go Home
      </button>
    </div>
  );
}
