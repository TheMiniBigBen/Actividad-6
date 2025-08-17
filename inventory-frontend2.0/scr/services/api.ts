// src/services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, USE_NGROK } from '../config/config';

// 1. Determina la URL base para Axios de manera segura y una sola vez
const BASE_URL = USE_NGROK ? `${API_URL}/api` : `${API_URL}/api`;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Interceptor para adjuntar el token automáticamente
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error al obtener el token de AsyncStorage:', error);
  }
  return config;
});

export default api;