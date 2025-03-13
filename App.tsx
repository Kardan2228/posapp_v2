import React from 'react';
import { SafeAreaView } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { setupDatabase } from './src/database/database';
import { setupDatabaseUsers } from './src/database/databaseUsers';
import { Provider as PaperProvider } from 'react-native-paper';  // ✅ Importar Provider de react-native-paper

setupDatabaseUsers();
setupDatabase();

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