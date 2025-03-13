import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert, Image } from 'react-native';
import { styles } from '../../styles/userForm.styles';
import { registerUser, updateUser } from '../../database/databaseUsers';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

// Definir los tipos de propiedades
interface UserFormProps {
  isEditing: boolean;
  userData?: { id: number; name: string; email: string; role: string; profile_image?: string; status?: string };
  onClose: () => void;
  onRefresh: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ isEditing, userData, onClose, onRefresh }) => {
  const [name, setName] = useState(userData?.name || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'vendedor' | 'admin'>(userData?.role === 'admin' ? 'admin' : 'vendedor');
  const [profileImage, setProfileImage] = useState(userData?.profile_image || '');
  const [status, setStatus] = useState<'active' | 'inactive' | 'banned'>(userData?.status as 'active' | 'inactive' | 'banned' || 'active');

  // Función para optimizar imágenes antes de guardarlas
  const optimizeImage = async (uri: string) => {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 300 } }], // Redimensionamos la imagen a 300px de ancho
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Comprimimos la imagen al 70%
    );
    return result.uri;
  };

  // 📸 Función para seleccionar imagen desde la galería
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1, // Cargamos la imagen con máxima calidad
    });

    if (!result.canceled) {
      const optimizedUri = await optimizeImage(result.assets[0].uri);
      setProfileImage(optimizedUri); // Guardamos la imagen optimizada
    }
  };

  // 📸 Función para capturar imagen desde la cámara
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const optimizedUri = await optimizeImage(result.assets[0].uri);
      setProfileImage(optimizedUri);
    }
  };

  const handleSaveUser = async () => {
    if (!name || !email || (!isEditing && !password)) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    if (isEditing) {
      const success = await updateUser(userData!.id, name, email, role, profileImage, status);
      if (success) {
        Alert.alert('✅ Usuario actualizado correctamente.');
        onRefresh();
        onClose();
      } else {
        Alert.alert('❌ No se pudo actualizar el usuario.');
      }
    } else {
      const success = await registerUser(name, email, password, role, profileImage, status);
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
              mode="dropdown"
            >
              <Picker.Item label="Vendedor" value="vendedor" />
              <Picker.Item label="Admin" value="admin" />
            </Picker>
          </View>

          <Text style={styles.label}>Estado</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={status}
              onValueChange={setStatus}
              style={styles.picker}
              mode="dropdown"
            >
              <Picker.Item label="Activo" value="active" />
              <Picker.Item label="Inactivo" value="inactive" />
              <Picker.Item label="Baneado" value="banned" />
            </Picker>
          </View>

          <Text style={styles.label}>Imagen de Perfil</Text>
          {profileImage ? <Image source={{ uri: profileImage }} style={styles.imagePreview} /> : null}
          <View style={styles.imageButtonContainer}>
            <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
              <Icon name="image-outline" size={28} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={takePhoto} style={styles.iconButton}>
              <Icon name="camera-outline" size={28} color="#007AFF" />
            </TouchableOpacity>
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