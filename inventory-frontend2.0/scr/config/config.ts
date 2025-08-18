// src/config/config.ts

const NGROK_URL = 'https://5f3fea910a11.ngrok-free.app'; // Sin espacios
const LOCAL_URL = 'http://192.168.1.17:5000'; // <-- Tu IP local

export const USE_NGROK = false; // <--- Pon 'true' para la escuela, 'false' para tu casa

export const API_URL = USE_NGROK ? NGROK_URL : LOCAL_URL;