import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/homeScreen.styles';
import { SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

// Definir tipos
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<{ route: HomeScreenRouteProp }> = ({ route }) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = route.params || {}; // ✅ Ahora `user` está bien definido

  // Definir menú base
  const baseMenuItems = [
    { id: '1', name: 'POS', icon: 'cart-outline', screen: 'POS' },
    { id: '2', name: 'Inventario', icon: 'clipboard-outline', screen: 'Inventory' },
    { id: '3', name: 'Reportes', icon: 'bar-chart-outline', screen: 'Reports' },
  ];

  // Agregar opción Usuarios solo si el usuario es SuperAdmin
  const menuItems = user?.role === 'admin'
    ? [...baseMenuItems, { id: '4', name: 'Usuarios', icon: 'person-outline', screen: 'UserManagement' }]
    : baseMenuItems;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>El pumita abarrotero</Text>

        <View style={styles.grid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => {
                if (item.screen === 'UserManagement' && user?.role !== 'admin') {
                  Alert.alert('Acceso denegado', 'No tienes permisos para acceder a esta sección.');
                } else {
                  navigation.navigate(
                    item.screen as keyof RootStackParamList,
                    item.screen === 'UserManagement' ? ({ user } as any) : undefined
                  );
                }
              }}
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
