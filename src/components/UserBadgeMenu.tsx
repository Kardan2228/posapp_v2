import React, { useState, useEffect } from 'react';
import { Menu, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { getUserById } from '../database/databaseUsers';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { stylesBadge } from '../styles/userBadgeMenu.styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const UserBadgeMenu = ({ userId }: { userId: number }) => {
    const navigation = useNavigation<NavigationProp>(); // ✅ Corrección aquí
    const [menuVisible, setMenuVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState<{ name: string; profile_image: string | null } | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                //console.log(`🔹 Buscando usuario con ID: ${userId}`);
                const user = (await getUserById(userId)) as { name: string; profile_image: string | null } | null;

                if (user) {
                    //console.log("✅ Usuario obtenido:", user);
                    setCurrentUser(user);
                } else {
                    console.log("⚠️ Usuario no encontrado, asignando valores por defecto.");
                    setCurrentUser({ name: 'Usuario desconocido', profile_image: null });
                }
            } catch (error) {
                console.error("❌ Error en fetchUser:", error);
                setCurrentUser({ name: 'Error al cargar', profile_image: null });
            }
        };

        fetchUser();
    }, [userId]);

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const handleLogout = () => {
        closeMenu();
        navigation.navigate('Login'); // ✅ Esto ahora debe funcionar correctamente
    };

    const handleExitApp = () => {
        closeMenu();
        BackHandler.exitApp();
    };

    //console.log("📌 Renderizando avatar con usuario:", currentUser);

    return (
        <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
                <Avatar.Image
                    size={40}
                    source={currentUser?.profile_image ? { uri: currentUser.profile_image } : require('../../assets/default_avatar.png')}
                    style={stylesBadge?.avatarContainer ?? {}}
                    onTouchEnd={openMenu}
                />
            }
        >
            <Menu.Item
                onPress={handleLogout}
                title="Cerrar Sesión"
                leadingIcon={(props) => <Icon name="logout" {...props} color="#333" size={24} />}
            />

            <Menu.Item
                onPress={handleExitApp}
                title="Salir"
                leadingIcon={(props) => <Icon name="exit-to-app" {...props} color="#333" size={24} />}
            />
        </Menu>
    );
};

export default UserBadgeMenu;