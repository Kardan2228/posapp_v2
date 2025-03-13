import React from 'react';
import { View, Text } from 'react-native';
import { Appbar } from 'react-native-paper'; // 📌 Barra superior
import UserBadgeMenu from '../components/UserBadgeMenu'; // 📌 Importamos el Badge de usuario
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { styles } from '../styles/reportsScreen.styles';
import { stylesBadge } from '../styles/userBadgeMenu.styles';

// 📌 Definir tipos para la navegación
type ReportsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Reports'>;
type ReportsScreenRouteProp = RouteProp<RootStackParamList, 'Reports'>;

const ReportsScreen: React.FC<{ route: ReportsScreenRouteProp }> = ({ route }) => {
    const navigation = useNavigation<ReportsScreenNavigationProp>();
    const { user } = route.params || {}; // ✅ Extraemos el usuario si existe

    return (
        <View style={styles.container}>
            {/* 📌 Barra superior con título y Badge */}
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content
                    title="Reportes"
                    titleStyle={stylesBadge.appbarTitle}
                />
                {user && <UserBadgeMenu userId={user.id} />}
            </Appbar.Header>

            {/* 📌 Contenido principal */}
            <Text style={styles.title}>Reportes y análisis</Text>
        </View>
    );
};

export default ReportsScreen;
