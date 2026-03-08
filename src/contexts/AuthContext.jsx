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
      // Check if token exists in localStorage
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
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
    // DEMO MODE: Mock login
    const mockUser = {
      nama: email.split('@')[0] || 'Demo User',
      email: email,
      role: 'pendaftar'
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    
    return { success: true, data: { user: mockUser } };
    
    /* REAL API (uncomment when backend ready):
    const result = await authApi.login(email, password, 'web_browser');
    
    if (result.success) {
      setUser(result.data.user);
      setIsAuthenticated(true);
    }
    
    return result;
    */
  };

  const logout = async () => {
    // DEMO MODE: Clear localStorage
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    /* REAL API (uncomment when backend ready):
    await authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
    clearAllStorage();
    */
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
