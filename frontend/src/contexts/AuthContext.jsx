// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await api.post('/auth/login', { email, password }, {
        withCredentials: true // Important for sending/receiving cookies
      });
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);
      const response = await api.post('/auth/register', { name, email, password }, {
        withCredentials: true // Important for sending/receiving cookies
      });
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {}, {
        withCredentials: true // Important for sending/receiving cookies
      });
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still set user to null even if logout API fails
      setUser(null);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/me', {
          withCredentials: true // Important for sending cookies
        });
        setUser(response.data);
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error,
      login, 
      register, 
      logout,
      isAuthenticated: !!user 
    }}>
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