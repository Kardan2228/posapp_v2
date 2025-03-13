import React from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import InventoryScreen from '../screens/InventoryScreen';
import PosScreen from '../screens/PosScreen';
import LoginScreen from '../screens/LoginScreen';
import UserManagementScreen from '../screens/UserManagementScreen';
import ReportsScreen from '../screens/ReportsScreen';

// 🛠️ Definir tipos para cada pantalla
export type RootStackParamList = {
  Home: { user: { id: number; name: string; role: string } } | undefined;
  Inventory: { user: { id: number; name: string; role: string } } | undefined;
  POS: { user: { id: number; name: string; role: string } } | undefined;
  Login: undefined;
  UserManagement: { user: { id: number; name: string; role: string } } | undefined;
  Reports: { user: { id: number; name: string; role: string } } | undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Inventory" component={InventoryScreen} options={{ headerShown: false }} />
        <Stack.Screen name="POS" component={PosScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UserManagement" component={UserManagementScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Reports" component={ReportsScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;