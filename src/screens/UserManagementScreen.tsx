import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { Appbar } from 'react-native-paper';
import { getUsers, deleteUser } from '../database/databaseUsers';
import { styles } from '../styles/userManagementScreen.styles';
import { stylesBadge } from '../styles/userBadgeMenu.styles';
import { RootStackParamList } from '../navigation/AppNavigator';
import UserForm from '../components/users/UserForm';
import UserBadgeMenu from '../components/UserBadgeMenu';
import Icon from 'react-native-vector-icons/Ionicons';

type UserManagementRouteProp = RouteProp<RootStackParamList, 'UserManagement'>;

const UserManagementScreen: React.FC<{ route: UserManagementRouteProp }> = ({ route }) => {
    const navigation = useNavigation();
    const { user } = route.params || {};
    const [users, setUsers] = useState<{ id: number; name: string; email: string; role: string; profile_image?: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<{ id: number; name: string; email: string; role: string } | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const userList = await getUsers();
            setUsers(userList);
        } catch (error) {
            console.error('❌ Error al obtener usuarios:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = (id: number, name: string) => {
        Alert.alert(
            "Eliminar Usuario",
            `¿Seguro que deseas eliminar a ${name}?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        const success = await deleteUser(id);
                        if (success) {
                            Alert.alert("✅ Usuario eliminado correctamente.");
                            fetchUsers();
                        } else {
                            Alert.alert("❌ No se pudo eliminar el usuario.");
                        }
                    },
                },
            ]
        );
    };

    const handleEditUser = (user: { id: number; name: string; email: string; role: string }) => {
        setSelectedUser(user);
        setModalVisible(true);
    };

    const handleAddUser = () => {
        setSelectedUser(null);
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content
                    title="Gestión de Usuarios"
                    titleStyle={stylesBadge.appbarTitle}
                />
                {user && <UserBadgeMenu userId={user.id} />}
            </Appbar.Header>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.userCard}>
                            <Image
                                source={item.profile_image ? { uri: item.profile_image } : require('../../assets/default_avatar.png')}
                                style={styles.userImage}
                            />
                            <Text style={styles.userText}>{item.name} - {item.role}</Text>

                            {user?.role === 'admin' && (
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={[styles.iconButton, styles.editButton]} onPress={() => handleEditUser(item)}>
                                        <Icon name="pencil-outline" size={20} color="white" />
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[styles.iconButton, styles.deleteButton]} onPress={() => handleDeleteUser(item.id, item.name)}>
                                        <Icon name="trash-outline" size={20} color="white" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}
                />
            )}

            {user?.role === 'admin' && (
                <TouchableOpacity onPress={handleAddUser} style={styles.addButton}>
                    <Icon name="person-add-outline" size={24} color="white" />
                    <Text style={styles.addButtonText}>Agregar Usuario</Text>
                </TouchableOpacity>
            )}

            {modalVisible && (
                <UserForm
                    isEditing={!!selectedUser}
                    userData={selectedUser ? { ...selectedUser, email: selectedUser.email || '' } : undefined}
                    onClose={() => setModalVisible(false)}
                    onRefresh={fetchUsers}
                />
            )}
        </View>
    );
};

export default UserManagementScreen;
