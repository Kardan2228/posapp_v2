import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/homeScreen.styles';
import { SafeAreaView } from 'react-native';

// Definimos las tarjetas de navegación
const menuItems = [
  { id: '1', name: 'POS', icon: 'cart-outline', screen: 'POS' },
  { id: '2', name: 'Inventario', icon: 'clipboard-outline', screen: 'Inventory' },
  { id: '3', name: 'Reportes', icon: 'bar-chart-outline', screen: 'Reports' },
  { id: '4', name: 'Usuarios', icon: 'person-outline', screen: 'Users' }, // Futuro módulo
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>El pumita abarrotero</Text>

        {/* 📌 Contenedor de tarjetas en formato grid */}
        <View style={styles.grid}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.card} 
              onPress={() => navigation.navigate(item.screen as never)}
            >
              <Icon name={item.icon} size={40} color="#007AFF" />
              <Text style={styles.cardText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

