import React from 'react';
import { SafeAreaView } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { setupDatabaseInventory } from './src/database/databaseInventory';
import { setupDatabaseUsers } from './src/database/databaseUsers';
import { setupDatabaseSales } from './src/database/databaseSales';
import { Provider as PaperProvider } from 'react-native-paper';  // ✅ Importar Provider de react-native-paper

setupDatabaseUsers();
setupDatabaseInventory();
setupDatabaseSales();

const App: React.FC = () => {
  return (
    <PaperProvider> {/* 🔹 Envolver la aplicación con Provider */}
      <SafeAreaView style={{ flex: 1 }}>
        <AppNavigator />
      </SafeAreaView>
    </PaperProvider>
  );
};

export default App;