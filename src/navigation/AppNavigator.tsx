import React from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import InventoryScreen from '../screens/InventoryScreen';
import PosScreen from '../screens/PosScreen';
import LoginScreen from '../screens/LoginScreen';

// 🛠️ Definir tipos para cada pantalla
export type RootStackParamList = {
  Home: undefined;
  Inventory: undefined;
  POS: undefined;
  Login: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Inventory" component={InventoryScreen} />
        <Stack.Screen name="POS" component={PosScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;