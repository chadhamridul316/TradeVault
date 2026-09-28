import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('tradevault_token');
      const storedUser = localStorage.getItem('tradevault_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Failed to restore auth session:', err);
      localStorage.removeItem('tradevault_token');
      localStorage.removeItem('tradevault_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    // data is { email, token }
    localStorage.setItem('tradevault_token', data.token);
    localStorage.setItem('tradevault_user', JSON.stringify({ email: data.email }));
    setToken(data.token);
    setUser({ email: data.email });
    return data;
  };

  const signup = async (email, password) => {
    const data = await authService.signup(email, password);
    localStorage.setItem('tradevault_token', data.token);
    localStorage.setItem('tradevault_user', JSON.stringify({ email: data.email }));
    setToken(data.token);
    setUser({ email: data.email });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('tradevault_token');
    localStorage.removeItem('tradevault_user');
    localStorage.removeItem('tradevault_active_challenge_id');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
