import { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import TextUI from '../components/TextUI';
import TextFieldUI from '../components/TextFieldUI';
import ButtonBlue from '../components/ButtonBlue';
import DatabaseServices from '../backend/DatabaseServices';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faLock, 
  faUser, 
  faUserPlus, 
  faComments, 
  faBolt, 
  faCheckCircle,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';


const Login = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    initDatabase();
    DatabaseServices.getAllUsers();
  }, []);

  const initDatabase = async () => {
    await DatabaseServices.init();
  };

 

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setLoading(true);

    try {
      const success = await DatabaseServices.loginUser(username, password);
      console.log(success);

      if (success === 'admin') {
        Alert.alert('Success', 'Login successful!', [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('AdminDashboard');
            },
          },
        ]);

        setUsername('');
        setPassword('');
      } else if (success === 'user') {
        Alert.alert('Success', 'Login successful!', [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('ContractsScreen');
            },
          },
        ]);
      }
      else if (success == 'not active'){
        Alert.alert('Failed','User is inactive')
      }
      else {
        Alert.alert('Error', 'Invalid username or password');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during login');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.formSection}>
            <TextUI text="Login" style={styles.cardTitle} />

            <View style={styles.inputWrapper}>
              <View style={styles.inputLabelContainer}>
                <FontAwesomeIcon icon={faUser} size={14} color="#4a5568" />
                <Text style={styles.inputLabel}>Username</Text>
              </View>
              <TextFieldUI
                pholder="Enter your username"
                securePassword={false}
                value={username}
                onChangeText={setUsername}
                style={{width:'100%'}}
              />
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.inputLabelContainer}>
                <FontAwesomeIcon icon={faLock} size={14} color="#4a5568" />
                <Text style={styles.inputLabel}>Password</Text>
              </View>
              <TextFieldUI
                pholder="Enter your password"
                securePassword
                value={password}
                                style={{width:'100%'}}

                onChangeText={setPassword}
              />
            </View>

            <View style={styles.buttonWrapper}>
              <ButtonBlue
                text={loading ? 'Loading...' : 'Login'}
                onNext={handleLogin}
                disabled={loading}
              />
            </View>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate('AddUser', { userRegister: true })}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faUserPlus} size={16} color="#667eea" style={{ marginRight: 8 }} />
              <Text style={styles.registerButtonText}>
                Create New Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: '30%', justifyContent: 'flex-end' }}>
          <TouchableOpacity
            style={styles.chatAppButton}
            onPress={() => {navigation.navigate('ChatMenu')}}
            disabled={loading}
          >
            <FontAwesomeIcon icon={faComments} size={28} color="#ffffff" style={{ marginRight: 16 }} />
            <View style={styles.chatAppTextContainer}>
              <Text style={styles.chatAppTitle}>Quick Access</Text>
              <Text style={styles.chatAppSubtitle}>Go to Chat App →</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.footer}>
            <FontAwesomeIcon icon={faShieldAlt} size={12} color="#718096" />
            <Text style={styles.footerText}> Secure</Text>
            <Text style={styles.footerDot}> • </Text>
            <FontAwesomeIcon icon={faBolt} size={12} color="#718096" />
            <Text style={styles.footerText}> Fast</Text>
            <Text style={styles.footerDot}> • </Text>
            <FontAwesomeIcon icon={faCheckCircle} size={12} color="#718096" />
            <Text style={styles.footerText}> Reliable</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
  },
  
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
  },
  formSection: {
    width: '100%',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a5568',
    marginLeft: 8,
  },
  buttonWrapper: {
    marginTop: 10,
   
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#a0aec0',
    fontSize: 14,
    fontWeight: '500',
  },
  registerButton: {
    backgroundColor: '#f7fafc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#667eea',

    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  chatAppButton: {
    width: '100%',
    backgroundColor: '#667eea',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatAppTextContainer: {
    flex: 1,
  },
  chatAppTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    marginBottom: 4,
  },
  chatAppSubtitle: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: '#718096',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  footerDot: {
    color: '#718096',
    fontSize: 12,
  },
});

export default Login;