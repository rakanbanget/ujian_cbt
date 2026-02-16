import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { clearAllStorage } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      // Check if token exists in sessionStorage
      const token = sessionStorage.getItem('cbt_auth_token');
      const userData = sessionStorage.getItem('cbt_user_data');

      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const result = await authApi.login(email, password);

      if (result.success) {
        setUser(result.data.user);
        setIsAuthenticated(true);
        // Token is already stored by authApi.login
      }

      return result;
    } catch (error) {
      console.error("Login context error:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      clearAllStorage();
      sessionStorage.removeItem('cbt_auth_token');
      sessionStorage.removeItem('cbt_user_data');
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
