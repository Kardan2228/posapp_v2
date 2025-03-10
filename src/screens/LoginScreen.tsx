import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { styles } from '../styles/loginScreen.styles';
import { loginUser, registerUser } from '../database/databaseUsers';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { debugDatabaseUsers } from '../database/databaseUsers';

type NavigationProps = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation<NavigationProps>();
    const [isAdmin, setIsAdmin] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'vendedor' });

    const handleLogin = async () => {
        const user = await loginUser(email, password);
        if (user) {
            Alert.alert('Inicio de sesión exitoso', `Bienvenido, ${user.name}`);
            setIsAdmin(user.role === 'admin');
            navigation.navigate('Home', { user });
        } else {
            Alert.alert('Error', 'Credenciales incorrectas');
        }
    };

    const handleRegisterUser = async () => {
        const { name, email, password, role } = newUser;
        if (!name || !email || !password) {
            Alert.alert('Error', 'Todos los campos son obligatorios.');
            return;
        }

        // ✅ Asegurar que role sea 'admin' o 'vendedor'
        const validRole: 'admin' | 'vendedor' = role === 'admin' ? 'admin' : 'vendedor';

        const success = await registerUser(name, email, password, validRole);
        if (success) {
            Alert.alert('Usuario Registrado', 'El usuario fue creado exitosamente.');
            setModalVisible(false);
            setNewUser({ name: '', email: '', password: '', role: 'vendedor' });
        } else {
            Alert.alert('Error', 'No se pudo registrar el usuario.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Inicio de Sesión</Text>
            <TextInput
                style={styles.input}
                placeholder="Correo Electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Ingresar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={debugDatabaseUsers}>
                <Text style={styles.buttonText}>Ver Usuarios</Text>
            </TouchableOpacity>

            {isAdmin && (
                <TouchableOpacity style={styles.adminButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.adminButtonText}>Registrar Usuario</Text>
                </TouchableOpacity>
            )}

            {/* 🔽 MODAL PARA REGISTRAR USUARIOS 🔽 */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Registrar Usuario</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Nombre"
                            value={newUser.name}
                            onChangeText={(text) => setNewUser({ ...newUser, name: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Correo Electrónico"
                            value={newUser.email}
                            onChangeText={(text) => setNewUser({ ...newUser, email: text })}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña"
                            value={newUser.password}
                            onChangeText={(text) => setNewUser({ ...newUser, password: text })}
                            secureTextEntry
                        />
                        <TouchableOpacity style={styles.button} onPress={handleRegisterUser}>
                            <Text style={styles.buttonText}>Registrar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default LoginScreen;
