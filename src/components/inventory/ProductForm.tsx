import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Modal, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { Product } from '../../types/product';
import { styles } from '../../styles/productForm.styles';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons'; // 📌 Íconos para los botones

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
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price.toString());
            setStock(product.stock.toString());
            setImage(product.image);
            setExpirationDate(product.expirationDate);
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
    };

    const handleSave = () => {
        if (!name || !price || !stock) {
            alert('Por favor, completa todos los campos obligatorios.');
            return;
        }

        const newProduct: Omit<Product, 'id'> = {
            name,
            price: parseFloat(price),
            stock: parseInt(stock, 10),
            image,
            expirationDate,
            categoryId: 1, // ✅ Agregamos un valor por defecto o un estado si es dinámico
        };

        console.log("Producto a guardar:", newProduct);
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
                        {product && (
                            <>
                                <Text style={styles.label}>ID del Producto</Text>
                                <TextInput style={styles.input} value={product.id.toString()} editable={false} />
                            </>
                        )}
                        <Text style={styles.label}>Nombre</Text>
                        <TextInput style={styles.input} placeholder="Nombre del producto" value={name} onChangeText={setName} />

                        <Text style={styles.label}>Precio</Text>
                        <TextInput style={styles.input} placeholder="Precio" value={price} onChangeText={setPrice} keyboardType="numeric" />

                        <Text style={styles.label}>Stock</Text>
                        <TextInput style={styles.input} placeholder="Stock" value={stock} onChangeText={setStock} keyboardType="numeric" />

                        <Text style={styles.label}>Imagen del Producto</Text>
                        {image ? <Image source={{ uri: image }} style={styles.imagePreview} /> : null}
                        <View style={styles.imageButtonContainer}>
                            <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
                                <Icon name="image-outline" size={28} color="#007AFF" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={takePhoto} style={styles.iconButton}>
                                <Icon name="camera-outline" size={28} color="#007AFF" />
                            </TouchableOpacity>
                        </View>

                        {/* 📅 Selector de fecha con icono */}
                        <View style={[styles.dateContainer, { marginBottom: 15 }]}>
                            <Text style={styles.label}>Fecha de Caducidad</Text>
                            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
                                <Text style={styles.selectedDate}>{expirationDate ? expirationDate : "Selecciona una fecha"}</Text>
                                <Icon name="calendar" size={24} color="#888" />
                            </TouchableOpacity>
                        </View>
                        {showDatePicker && (
                            <DateTimePicker
                                value={expirationDate ? new Date(expirationDate) : new Date()}
                                mode="date"
                                display="default"
                                onChange={onChangeDate}
                            />
                        )}

                        <View style={styles.buttonRow}>
                            <TouchableOpacity onPress={handleSave} style={[styles.iconButton, styles.saveButton]}>
                                <Icon name="checkmark" size={30} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onClose} style={[styles.iconButton, styles.cancelButton]}>
                                <Icon name="close" size={30} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default ProductForm;
