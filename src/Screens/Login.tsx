import { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TextUI from '../components/TextUI';
import TextFieldUI from '../components/TextFieldUI';
import ButtonBlue from '../components/ButtonBlue';
import DatabaseServices from '../db/DatabaseServices';
import { RootStackParamList } from '../AppMain';



const Login = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initDatabase();
DatabaseServices.getAllUsers()

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
console.log(success)
      if (success=='admin') {
        Alert.alert('Success', 'Login successful!', [
          {
            text: 'OK',
            
            onPress: () => {
              navigation.navigate('AdminDashboard')
            },
          },
        ]);
        
        setUsername('');
        setPassword('');
      } 
      else if(success=='user'){
         Alert.alert('Success', 'Login successful!', [
          {
            text: 'OK',
            
            onPress: () => {
              navigation.navigate('ContractsScreen')
            },
          },
        ]);
           
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

  const handleRegister = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const success = await DatabaseServices.registerUser(username, password);

      if (success) {
        Alert.alert('Success', 'Registration successful! You can now login.');
        setPassword('');
      } else {
        Alert.alert('Error', 'Username already exists or registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during registration');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', marginTop: '30%' }}>
      <View>
        <TextUI text="Login Form" style={{ fontSize: 20 }} />
      </View>

      <View style={{ marginTop: '20%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <TextFieldUI 
          pholder="Username" 
          securePassword={false} 
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={{ marginTop: '10%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <TextFieldUI 
          pholder="Password" 
          securePassword 
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={{ marginTop: '10%', width: '80%', justifyContent: 'center', alignItems: 'center' }}>
        <ButtonBlue 
          text={loading ? 'Loading...' : 'Login'} 
          onNext={handleLogin}
          disabled={loading}
        />
      </View>

      <View style={{ marginTop: '5%', width: '80%', justifyContent: 'center', alignItems: 'center' }}>
        <ButtonBlue 
          text={loading ? 'Loading...' : 'Register'} 
          onNext={()=>navigation.navigate('AddUser',{
            userRegister:true
          })}
          disabled={loading}
        />
      </View>
    </View>
  );
};

export default Login;