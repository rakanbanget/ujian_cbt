import apiClient from './apiClient';
import { AUTH_ENDPOINTS } from '../constants/apiEndpoints';
import { tokenStorage, userStorage } from '../utils/storage';

export const authApi = {
  // Login
  login: async (email, password, deviceName = 'web_browser') => {
    try {
      const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, {
        email: email,
        password: password,
        device_name: deviceName,
      });

      const { token, user } = response.data;

      // Save to storage
      tokenStorage.set(token);
      userStorage.set(user);

      return { success: true, data: { token, user } };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  },

  // Logout
  logout: async () => {
    try {
      await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      // Clear storage regardless of API response
      tokenStorage.remove();
      userStorage.remove();
    }
  },

  // Get current user
  getUser: async () => {
    try {
      const response = await apiClient.get(AUTH_ENDPOINTS.USER);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!tokenStorage.get();
  },

  // Get current user from storage
  getCurrentUser: () => {
    return userStorage.get();
  },
};
