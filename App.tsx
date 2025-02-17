import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { setupDatabase } from './src/database/database'; // 📌 Importamos la BD correctamente
import InventoryScreen from './src/components/screens/InventoryScreen';
import HomeScreen from './src/components/screens/HomeScreen';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// 📌 1. Definir correctamente los parámetros de navegación
type RootStackParamList = {
  Home: undefined;
  Inventory: undefined;
};

// 📌 2. Tipar `Stack` correctamente para evitar errores
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    const initializeDatabase = async () => {
      console.log('📌 Inicializando base de datos...');
      await setupDatabase();
    };
    initializeDatabase();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Inventory" component={InventoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
