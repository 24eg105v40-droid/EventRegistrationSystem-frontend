import axios from 'axios';

// Base API URL: uses Vite proxy '/api' or direct backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor to format errors into user-friendly messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (error.response) {
      const data = error.response.data;
      if (data && data.validationErrors) {
        // Collect validation messages
        const fieldErrors = Object.values(data.validationErrors).join(', ');
        errorMessage = fieldErrors || data.message || errorMessage;
      } else if (data && data.message) {
        errorMessage = data.message;
      } else if (typeof data === 'string') {
        errorMessage = data;
      }
    } else if (error.request) {
      errorMessage = 'Cannot connect to the backend server. Make sure the Spring Boot service is running on port 8080.';
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
