import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'student'
      });
      
      const { token, user } = response.data;
      login(token, user);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.error || 'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '95vh',
      backgroundColor: '#f8f9fa'
    },
    card: {
      width: '100%',
      maxWidth: '400px',
      padding: '2rem',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    title: {
      textAlign: 'center',
      marginBottom: '1.5rem',
      color: '#333'
    },
    formGroup: {
      marginBottom: '10px'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
      color: '#555',
      fontSize: '0.9rem'
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '1rem'
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#28a745',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      fontSize: '1rem',
      cursor: 'pointer',
      marginTop: '15px',
      transition: 'background-color 0.2s'
    },
    buttonDisabled: {
      backgroundColor: '#6c757d',
      cursor: 'not-allowed'
    },
    footer: {
      marginTop: '1.5rem',
      textAlign: 'center',
      fontSize: '0.9rem',
      color: '#666'
    },
    link: {
      color: '#007bff',
      textDecoration: 'none'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Join NeuroTrace</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input 
              name="name"
              type="text" 
              style={styles.input} 
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              name="email"
              type="email" 
              style={styles.input} 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input 
              name="password"
              type="password" 
              style={styles.input} 
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input 
              name="confirmPassword"
              type="password" 
              style={styles.input} 
              value={formData.confirmPassword}
              onChange={handleChange}
              required 
            />
          </div>
          <button 
            type="submit" 
            style={{...styles.button, ...(loading ? styles.buttonDisabled : {})}}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <div style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Login</Link>
        </div>
      </div>
    </div>
  );
}
