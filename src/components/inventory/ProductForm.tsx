import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { Product } from '../../types/product';
import { styles } from '../../styles/productForm.styles';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

interface ProductFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id'>) => void;
  product?: Product | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ visible, onClose, onSave, product }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price.toString());
      setStock(product.stock.toString());
      setImage(product.image);
      setExpirationDate(product.expirationDate);
      setCategoryId(product.categoryId.toString());
    } else {
      resetForm();
    }
  }, [product]);

  const resetForm = () => {
    setName('');
    setPrice('');
    setStock('');
    setImage('');
    setExpirationDate('');
    setCategoryId('');
  };

  const handleSave = () => {
    if (!name || !price || !stock || !categoryId) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const newProduct: Omit<Product, 'id'> = {
      name,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      image,
      expirationDate,
      categoryId: parseInt(categoryId, 10),
    };

    onSave(newProduct);
    resetForm();
  };

  // 📸 Función para seleccionar imagen desde la galería
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
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
      setImage(result.assets[0].uri);
    }
  };

  // 📅 Función para manejar la selección de fecha
  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setExpirationDate(selectedDate.toISOString().split('T')[0]); // Formato YYYY-MM-DD
    }
    setShowDatePicker(Platform.OS === 'ios');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <Text style={styles.title}>{product ? 'Editar Producto' : 'Agregar Producto'}</Text>

            <TextInput style={styles.input} placeholder="Nombre del producto" value={name} onChangeText={setName} />

            {/* Controles ➕➖ para precio */}
            <View style={styles.numericContainer}>
              <TouchableOpacity onPress={() => setPrice((prev) => Math.max(0, parseFloat(prev) - 1).toString())} style={styles.numericButton}>
                <Text style={styles.numericButtonText}>-</Text>
              </TouchableOpacity>
              <TextInput style={styles.numericInput} placeholder="Precio" value={price} onChangeText={setPrice} keyboardType="numeric" />
              <TouchableOpacity onPress={() => setPrice((prev) => (parseFloat(prev) + 1).toString())} style={styles.numericButton}>
                <Text style={styles.numericButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Controles ➕➖ para stock */}
            <View style={styles.numericContainer}>
              <TouchableOpacity onPress={() => setStock((prev) => Math.max(0, parseInt(prev, 10) - 1).toString())} style={styles.numericButton}>
                <Text style={styles.numericButtonText}>-</Text>
              </TouchableOpacity>
              <TextInput style={styles.numericInput} placeholder="Stock" value={stock} onChangeText={setStock} keyboardType="numeric" />
              <TouchableOpacity onPress={() => setStock((prev) => (parseInt(prev, 10) + 1).toString())} style={styles.numericButton}>
                <Text style={styles.numericButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            {/* 📸 Imagen del producto */}
            {image ? <Image source={{ uri: image }} style={styles.imagePreview} /> : null}
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Text style={styles.imageButtonText}>Seleccionar Imagen</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
              <Text style={styles.imageButtonText}>Tomar Foto</Text>
            </TouchableOpacity>

            {/* 📅 Selector de fecha */}
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
              <Text style={styles.dateButtonText}>Seleccionar Fecha</Text>
            </TouchableOpacity>
            {showDatePicker && <DateTimePicker value={expirationDate ? new Date(expirationDate) : new Date()} mode="date" display="default" onChange={onChangeDate} />}

            <TextInput style={styles.input} placeholder="ID de la categoría" value={categoryId} onChangeText={setCategoryId} keyboardType="numeric" />

            {/* Botones de acción */}
            <View style={styles.buttonContainer}>
              <Button title="Guardar" onPress={handleSave} />
              <Button title="Cancelar" onPress={onClose} color="red" />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ProductForm;
