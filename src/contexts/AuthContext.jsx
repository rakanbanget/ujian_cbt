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

  const login = async (nomorPeserta, password) => {
    // TEMPORARY: Mock login untuk demo
    // TODO: Uncomment untuk real API
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockUser = {
      id: 1,
      nomor_peserta: nomorPeserta,
      nama: 'Demo User'
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    
    return { success: true, data: { user: mockUser } };
    
    /* REAL API (uncomment when backend ready):
    const result = await authApi.login(nomorPeserta, password);
    
    if (result.success) {
      setUser(result.data.user);
      setIsAuthenticated(true);
    }
    
    return result;
    */
  };

  const logout = async () => {
    // TEMPORARY: Mock logout untuk demo
    // TODO: Uncomment untuk real API
    
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('cbt_auth_token');
    sessionStorage.removeItem('cbt_user_data');
    
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
