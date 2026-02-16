import apiClient from './apiClient';
import { EXAM_ENDPOINTS } from '../constants/apiEndpoints';

export const examApi = {
  // Get list of available ujians
  getUjians: async () => {
    try {
      const response = await apiClient.get(EXAM_ENDPOINTS.LIST_UJIANS);
      // Handle cases where data is in response.data.data (Laravel Resource) 
      // or directly in response.data (Direct Array)
      const examData = response.data.data || response.data;
      return { success: true, data: Array.isArray(examData) ? examData : [] };
    } catch (error) {
      console.error('API Error in getUjians:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Get soal for specific ujian
  getSoal: async (ujianId) => {
    try {
      const response = await apiClient.get(EXAM_ENDPOINTS.GET_SOAL, {
        params: { ujian_id: ujianId }
      });
      return {
        success: true,
        data: {
          ujian: response.data.ujian,
          questions: response.data.data
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Submit all answers
  submitJawaban: async (ujianId, answers) => {
    try {
      const response = await apiClient.post(EXAM_ENDPOINTS.SUBMIT_JAWABAN, {
        ujian_id: ujianId,
        answers: answers
      });
      return {
        success: true,
        data: response.data.results
      };
    } catch (error) {
      // Handle case where user already submitted
      if (error.response?.status === 400) {
        return {
          success: false,
          error: error.response.data.message,
          alreadySubmitted: true,
          score: error.response.data.score
        };
      }
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },
};
