import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('neurotrace_token'));

  useEffect(() => {
    if (token) {
      try {
        // Decode JWT payload (middle part)
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        setUser(decoded);
      } catch (err) {
        console.error('Invalid token', err);
        logout();
      }
    }
  }, [token]);

  const login = (tokenString, userData) => {
    localStorage.setItem('neurotrace_token', tokenString);
    setToken(tokenString);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('neurotrace_token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
