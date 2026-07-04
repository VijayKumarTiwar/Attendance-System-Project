import { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  ImageBackground,
  Alert,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';

export default function LoginScreen() {
  const [username, setUsername] = useState('EMP001');
  const [password, setPassword] = useState('Vijay123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!username) {
      Alert.alert('Validation Error', 'Please enter your Employee Code.');
      return;
    }
    if (!password) {
      Alert.alert('Validation Error', 'Please enter your Password.');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await api.login(username.trim(), password);
      // Success
      console.log('Login success:', response);
      // We can pass the employee_code as a global state or params.
      // For now, simple navigation since dashboard will fetch profile.
      router.push({ pathname: '/dashboard', params: { employee_code: response.employee.employee_code } });
    } catch (error: any) {
      Alert.alert('Login Failed', error?.message || 'Invalid credentials or server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={require('../../assets/images/login_bg.png')} 
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.cardContainer}>
              <LinearGradient
                colors={['#e58c0c', '#1b7a2d']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
              >
                {/* Custom Logo Box */}
                <View style={styles.logoBox}>
                  <Image 
                    source={require('../../assets/images/rsgl_logo.png')} 
                    style={styles.logoImage} 
                    resizeMode="contain" 
                  />
                </View>

                <Text style={styles.welcomeText}>WELCOME!</Text>
                <Text style={styles.companyTitle}>RAJASTHAN STATE GAS LIMITED</Text>

                <View style={styles.divider} />

                {/* Email / Username Input */}
                <View style={styles.inputUnderlineRow}>
                  <Ionicons name="person" size={20} color="#fff" style={styles.inputIcon} />
                  <TextInput
                    style={styles.underlineInput}
                    placeholder="employee@rsgl.in"
                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {/* Password Input */}
                <View style={styles.passwordBoxRow}>
                  <Ionicons name="lock-closed" size={20} color="#8e9aa8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.boxInput}
                    placeholder="•••••••••"
                    placeholderTextColor="#95a5a6"
                    value={password === '•••••••••' ? '' : password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>

                {/* Remember Me Checkbox */}
                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  onPress={() => setRememberMe(!rememberMe)}
                  activeOpacity={0.8}
                >
                  <View style={styles.checkbox}>
                    {rememberMe && <Ionicons name="checkmark" size={14} color="#2c3e50" />}
                  </View>
                  <Text style={styles.checkboxLabel}>Remember me?</Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity 
                  style={styles.loginButton} 
                  onPress={handleLogin}
                  disabled={loading}
                  activeOpacity={0.9}
                >
                  {loading ? (
                    <ActivityIndicator color="#2c3e50" />
                  ) : (
                    <Text style={styles.loginButtonText}>Log in</Text>
                  )}
                </TouchableOpacity>

              </LinearGradient>
            </View>

            {/* Footer Credits */}
            <Text style={styles.footerText}>
              POWERED BY RAJASTHAN STATE GAS LIMITED
            </Text>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: 40,
  },
  card: {
    width: '100%',
    padding: 30,
    alignItems: 'center',
  },
  logoBox: {
    width: 65,
    height: 65,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoImage: {
    width: 55,
    height: 55,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1.5,
    marginBottom: 4,
    textAlign: 'center',
  },
  companyTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    opacity: 0.95,
    letterSpacing: 1,
    marginBottom: 20,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    width: '100%',
    marginBottom: 28,
  },
  inputUnderlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.8)',
    width: '100%',
    marginBottom: 24,
    paddingBottom: 8,
  },
  inputIcon: {
    marginRight: 10,
  },
  underlineInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    paddingVertical: 4,
  },
  passwordBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f0fe',
    borderRadius: 6,
    width: '100%',
    height: 52,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  boxInput: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    height: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: '#2c3e50',
    borderRadius: 3,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#2c3e50',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    width: '65%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 8,
  },
  loginButtonText: {
    color: '#2c3e50',
    fontSize: 18,
    fontWeight: '700',
  },
  footerText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#60a5fa',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
