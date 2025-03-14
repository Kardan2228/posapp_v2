import React from 'react';
import { View, Text, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { Appbar } from 'react-native-paper'; // 📌 Importamos Appbar para la barra superior
import UserBadgeMenu from '../components/UserBadgeMenu'; // 📌 Importamos el Badge de usuario
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/homeScreen.styles';
import { stylesBadge } from '../styles/userBadgeMenu.styles';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

// 📌 Definir tipos para la navegación
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
      {/* 📌 Agregamos la barra de navegación con el UserBadgeMenu */}
      <Appbar.Header>
        <Appbar.Content
          title="El pumita abarrotero"
          titleStyle={stylesBadge.appbarTitle} // 🎨 Aplica el estilo desde el archivo de estilos
        />
        {user && <UserBadgeMenu userId={user.id} />}
      </Appbar.Header>

      <View style={styles.container}>
        <Text style={styles.title}>Página principal</Text>

        <View style={styles.grid}>
          {menuItems.map((item) => (
            <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => {
              if (item.screen === 'UserManagement' && user?.role !== 'admin') {
                Alert.alert('Acceso denegado', 'No tienes permisos para acceder a esta sección.');
              } else {
                const params = item.screen !== 'Login' ? { user } : undefined;
                navigation.navigate(item.screen as keyof RootStackParamList, params as never);
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
