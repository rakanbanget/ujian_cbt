import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { tokenStorage, userStorage, clearAllStorage } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      // Baca dari localStorage via helper (bukan hardcoded sessionStorage)
      const token = tokenStorage.get();
      const userData = userStorage.get();

      if (token && userData) {
        setIsAuthenticated(true);
        setUser(userData);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (nomorPeserta, password) => {
    // REAL API INTEGRATION
    try {
      const result = await authApi.login(nomorPeserta, password);
      
      if (result.success) {
        setUser(result.data.user);
        setIsAuthenticated(true);
      }
      
      return result;
    } catch (error) {
      console.error('Login error in context:', error);
      return { success: false, error: 'Terjadi kesalahan saat login.' };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      // Bersihkan semua storage (token, user, exam state, timer)
      clearAllStorage();
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
