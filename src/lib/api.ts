// src/lib/api.ts
import axios from 'axios';

// Use the environment variable or a default URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
});

apiClient.interceptors.request.use((config) => {
  // This code runs on the client-side. For server-side requests, token handling would differ.
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Exporting as default, as suggested by the error message format "Did you mean to use 'import api from "@/lib/api"' instead?"
export default apiClient;