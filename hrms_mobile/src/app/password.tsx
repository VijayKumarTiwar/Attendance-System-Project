import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { api } from '../services/api';

export default function PasswordScreen() {
  const { employeeCode } = useLocalSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    if (!password) {
      alert('Please enter your password.');
      return;
    }
    
    setLoading(true);
    try {
      const codeStr = String(employeeCode || '').trim();
      const response = await api.login(codeStr, password);
      // Success
      console.log('Login success:', response);
      router.push({ pathname: '/dashboard', params: { employee_code: response.employee.employee_code } });
    } catch (error: any) {
      alert(`Login Failed: ${error?.message || 'Invalid credentials'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.innerContainer}>
          
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={{fontSize: 24}}>←</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.mainHeading}>Enter your password</Text>
            <Text style={styles.subHeading}>for {employeeCode}</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#95a5a6"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon} 
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleSignIn} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  innerContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  backButton: {
    position: 'absolute',
    top: -40,
    left: 0,
    padding: 8,
  },
  header: {
    marginBottom: 40,
  },
  mainHeading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subHeading: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 8,
  },
  passwordContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    padding: 16,
    paddingRight: 50,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#2c3e50',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
  },
  primaryButton: {
    backgroundColor: '#1a365d',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#1a365d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
