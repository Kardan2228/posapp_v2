import React from 'react';
import { SafeAreaView } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { setupDatabase } from './src/database/database';
import { setupDatabaseUsers } from './src/database/databaseUsers'; // ✅ Importar la inicialización de usuarios

setupDatabaseUsers(); // ✅ Ahora inicializa la base de datos de usuarios
setupDatabase(); // Inicializa la base de datos de productos

const App: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppNavigator />
    </SafeAreaView>
  );
};

export default App;
