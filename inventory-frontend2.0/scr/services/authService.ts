// src/services/authService.ts
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loginUser = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  const { token, user } = response.data;
  await AsyncStorage.setItem('token', token);
  return user;
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role?: string
) => {
  const response = await api.post('/auth/register', { name, email, password, role });
  const { token, user } = response.data;
  await AsyncStorage.setItem('token', token);
  return user;
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem('token');
};