import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import InventoryScreen from '../screens/InventoryScreen';
import PosScreen from '../screens/PosScreen';
// Aquí puedes agregar más pantallas

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Inventory" component={InventoryScreen} />
        <Stack.Screen name="POS" component={PosScreen} />
        {/* Otras pantallas como POS, Reportes, etc */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
