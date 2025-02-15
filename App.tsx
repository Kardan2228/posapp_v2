import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { setupDatabase, insertProduct, getProducts } from "./src/database"; // Ajusta la ruta según tu proyecto

// 📌 1. Definir los nombres de las pantallas (para TypeScript)
type RootStackParamList = {
  Home: undefined;
  Details: undefined;
  Settings: undefined;
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
type DetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'Details'>;
type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const Stack = createNativeStackNavigator<RootStackParamList>();

// 📌 2. Implementar cada pantalla con tipado correcto
function HomeScreen({ navigation }: HomeScreenProps) {
  useEffect(() => {
      const initializeDatabase = async () => {
          await setupDatabase(); // 📌 Crear tabla si no existe
          await insertProduct(); // 📌 Insertar producto de prueba
          await getProducts(); // 📌 Mostrar productos en consola
      };
      initializeDatabase();
  }, []);

  return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Pantalla de Inicio</Text>
          <Button title="Ir a Detalles" onPress={() => navigation.navigate('Details')} />
          <Button title="Ir a Configuración" onPress={() => navigation.navigate('Settings')} />
          <Button title="Ver Productos en Consola" onPress={getProducts} color="green" />
      </View>
  );
}

function DetailsScreen({ navigation }: DetailsScreenProps) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Pantalla de Detalles</Text>
            <Button title="Volver a Inicio" onPress={() => navigation.navigate('Home')} />
        </View>
    );
}

function SettingsScreen({ navigation }: SettingsScreenProps) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Pantalla de Configuración</Text>
            <Button title="Volver a Inicio" onPress={() => navigation.navigate('Home')} />
        </View>
    );
}

// 📌 3. Registrar las pantallas en el Stack.Navigator
export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Details" component={DetailsScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
