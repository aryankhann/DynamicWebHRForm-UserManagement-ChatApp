import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Screens/Login';
import FormScreen from './Screens/FormScreen';
import DatabaseServices from './backend/DatabaseServices';
import AddForm from './Screens/AddForm';
import EditForm from './Screens/EditForm';
import ContractScreen from './Screens/ContractsScreen';
import ViewForm from './Screens/ViewForm';
import AdminDashboard from './Screens/AdminDashboard';
import UserManagementScreen from './Screens/UserManagement';
import { AddUserScreen, EditUserScreen } from './Screens/AddEditUser';
import ChatApp from './Screens/ChatApp';
import ChatMenu from './Screens/ChatMenu';
export type RootStackParamList = {
  Login: undefined;
  FormScreen: { username: string };
  AddForm: any
  EditForm:undefined,
  ViewForm:undefined,
  ContractsScreen:undefined,
  AddUser:undefined,
  UserManagement:undefined,
  AdminDashboard:undefined
EditUser:undefined
ChatApp:undefined
ChatMenu:undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppMain = () => {
  useEffect(() => {
    const setupDatabase = async () => {
      await DatabaseServices.init();
    
    
      // try {
      //   await DatabaseServices.registerUser('testuser', 'password123');
      // } catch (error) {
      //   console.log('Test user already exists or error:', error);
      // }
    };
    
    setupDatabase();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0C64AE',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
  name="AdminDashboard" 
  component={AdminDashboard}
  options={{ headerShown:false }}
/>
<Stack.Screen 
  name="UserManagement" 
  component={UserManagementScreen}
  options={{headerShown:false}}
/>
<Stack.Screen 
  name="AddUser" 
  component={AddUserScreen}
  options={{ headerShown:false }}
/>
<Stack.Screen 
  name="EditUser" 
  component={EditUserScreen}
  options={{ headerShown:false }}
/>
<Stack.Screen 
  name="ChatApp" 
  component={ChatApp}
  options={{ headerShown:false }}
/>
<Stack.Screen 
  name="ChatMenu" 
  component={ChatMenu}
  options={{ headerShown:false }}
/>
        <Stack.Screen 
          name="Login" 
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        
          <Stack.Screen 
          name="EditForm" 
          component={EditForm}
          options={{
            headerShown: false,
          }}
        />
           
           
        <Stack.Screen 
          name="FormScreen" 
          component={FormScreen}
options={{
            headerShown: false, 
          }}
        />
        <Stack.Screen 
          name="ContractsScreen" 
          component={ContractScreen}
options={{
            headerShown: false, 
          }}
        />
         <Stack.Screen 
          name="ViewForm" 
          component={ViewForm}
options={{
            headerShown: false, 
          }}
        />
        <Stack.Screen 
          name="AddForm" 
          component={AddForm}
options={{
            headerShown: false, 
          }}
        />


          


      </Stack.Navigator>
      
    </NavigationContainer>
  );
};

export default AppMain;