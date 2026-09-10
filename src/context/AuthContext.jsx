import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authApi from '../api/authApi';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const userInfo = localStorage.getItem('cinematix_user');
      if (userInfo) {
        try {
          const { data } = await authApi.getProfile();
          setUser({ ...JSON.parse(userInfo), ...data });
        } catch (error) {
          console.error('Session expired or invalid', error);
          localStorage.removeItem('cinematix_user');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await authApi.loginUser({ email, password });
      setUser(data);
      localStorage.setItem('cinematix_user', JSON.stringify(data));
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await authApi.registerUser(userData);
      setUser(data);
      localStorage.setItem('cinematix_user', JSON.stringify(data));
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cinematix_user');
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
