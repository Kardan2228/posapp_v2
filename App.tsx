import React from 'react';
import { SafeAreaView } from 'react-native';
import AppNavigator from './/src/navigation/AppNavigator';

const App: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppNavigator />
    </SafeAreaView>
  );
};

export default App;
