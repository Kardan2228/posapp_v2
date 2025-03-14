import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Appbar, Card, Title, Paragraph } from 'react-native-paper'; // 📌 Barra superior y tarjetas
import UserBadgeMenu from '../components/UserBadgeMenu';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { styles } from '../styles/reportsScreen.styles';
import { stylesBadge } from '../styles/userBadgeMenu.styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// 📌 Definir tipos para la navegación
type ReportsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Reports'>;
type ReportsScreenRouteProp = RouteProp<RootStackParamList, 'Reports'>;

const ReportsScreen: React.FC<{ route: ReportsScreenRouteProp }> = ({ route }) => {
    const navigation = useNavigation<ReportsScreenNavigationProp>();
    const { user } = route.params || {}; // ✅ Extraemos el usuario si existe

    // 📌 Definir los reportes disponibles
    const reports = [
        { id: 'SalesReport', title: 'Ventas', description: 'Consulta ventas diarias, semanales y mensuales', icon: 'chart-bar', role: ['admin', 'superuser'] },
        { id: 'InventoryReport', title: 'Inventario', description: 'Productos con bajo stock y próximos a vencer', icon: 'package-variant', role: ['admin', 'superuser'] },
        { id: 'ExpirationReport', title: 'Caducidades', description: 'Productos ya caducados', icon: 'calendar-alert', role: ['admin', 'superuser'] },
        { id: 'UserLogsReport', title: 'Actividad de Usuarios', description: 'Accesos, altas, bajas y modificaciones', icon: 'account-clock', role: ['superuser'] }
    ];

    // 📌 Filtrar reportes según el rol del usuario
    const userReports = reports.filter(report => user && report.role.includes(user.role));

    return (
        <View style={styles.container}>
            {/* 📌 Barra superior con título y Badge */}
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Reportes" titleStyle={stylesBadge.appbarTitle} />
                {user && <UserBadgeMenu userId={user.id} />}
            </Appbar.Header>
    
            {/* 📌 Lista de reportes disponibles */}
            {userReports.length === 0 ? (
                <Text style={styles.noReportsText}>No tienes reportes disponibles</Text>
            ) : (
                <FlatList
                    data={userReports}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => navigation.navigate(item.id as keyof RootStackParamList)}>
                            <Card style={styles.card}>
                                <Card.Content>
                                    <Icon name={item.icon} size={30} style={styles.icon} />
                                    <Title>{item.title}</Title>
                                    <Paragraph>{item.description}</Paragraph>
                                </Card.Content>
                            </Card>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View> 
    );    
};

export default ReportsScreen;
