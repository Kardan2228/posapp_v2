import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import { styles } from '../../styles/userForm.styles';
import { registerUser, updateUser } from '../../database/databaseUsers';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';

// Definir los tipos de propiedades
interface UserFormProps {
  isEditing: boolean;
  userData?: { id: number; name: string; email: string; role: string };
  onClose: () => void;
  onRefresh: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ isEditing, userData, onClose, onRefresh }) => {
  const [name, setName] = useState(userData?.name || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'vendedor' | 'admin'>(userData?.role === 'admin' ? 'admin' : 'vendedor');

  const handleSaveUser = async () => {
    if (!name || !email || (!isEditing && !password)) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    if (isEditing) {
      const success = await updateUser(userData!.id, name, email, role);
      if (success) {
        Alert.alert('✅ Usuario actualizado correctamente.');
        onRefresh();
        onClose();
      } else {
        Alert.alert('❌ No se pudo actualizar el usuario.');
      }
    } else {
      const success = await registerUser(name, email, password, role);
      if (success) {
        Alert.alert('✅ Usuario registrado exitosamente.');
        onRefresh();
        onClose();
      } else {
        Alert.alert('❌ No se pudo registrar el usuario.');
      }
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{isEditing ? 'Editar Usuario' : 'Registrar Usuario'}</Text>

          <TextInput style={styles.input} placeholder="Nombre" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Correo Electrónico" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

          {!isEditing && <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />}

          <Text style={styles.label}>Rol</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={role}
              onValueChange={(itemValue: 'vendedor' | 'admin') => setRole(itemValue)}
              style={styles.picker}
              mode="dropdown" // 🔹 Asegura que se muestre correctamente en Android
            >
              <Picker.Item label="Vendedor" value="vendedor" />
              <Picker.Item label="Admin" value="admin" />
            </Picker>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={handleSaveUser}>
              <Icon name="checkmark-circle-outline" size={32} color="#007AFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={onClose}>
              <Icon name="close-circle-outline" size={32} color="#FF3B30" />
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default UserForm;
