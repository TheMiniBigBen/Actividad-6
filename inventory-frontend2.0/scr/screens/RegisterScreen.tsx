import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { registerUser } from '../services/authService';

const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      return Alert.alert('Datos incompletos', 'Por favor completa todos los campos');
    }

    if (!email.includes('@') || !email.includes('.')) {
      return Alert.alert('Email inválido', 'Por favor ingresa un email válido');
    }

    if (password.length < 6) {
      return Alert.alert('Contraseña débil', 'La contraseña debe tener al menos 6 caracteres');
    }

    setIsLoading(true);
    try {
      await registerUser(name, email, password);
      Alert.alert('¡Registro exitoso!', 'Tu cuenta ha sido creada correctamente');
      navigation.navigate('Login');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'No se pudo completar el registro. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Crear Cuenta</Text>
        <Text style={styles.subtitle}>Completa tus datos para comenzar</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.label}>Nombre Completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Juan Pérez"
          placeholderTextColor="#999"
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: tu@email.com"
          placeholderTextColor="#999"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Mínimo 6 caracteres"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity 
        style={styles.registerButton}
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.registerButtonText}>Registrarme</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.loginLink}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginLinkText}>
          ¿Ya tienes cuenta? <Text style={styles.loginLinkBold}>Inicia Sesión</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 25,
    backgroundColor: '#F5F7FA',
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  registerButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#7F8C8D',
    fontSize: 16,
  },
  loginLinkBold: {
    fontWeight: 'bold',
    color: '#4A90E2',
  },
});

export default RegisterScreen;