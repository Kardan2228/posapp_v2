import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal';
import ProductForm from '../inventory/ProductForm';
import { Product } from '../../types/product';
import { styles } from '../../styles/inventory.styles';
import { getProducts, insertProduct, updateProduct, deleteProduct, setupDatabase } from '../../database/database';

const InventoryScreen: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        setupDatabase();
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        getProducts(setProducts);
    };

    const handleSaveProduct = async (product: Omit<Product, "id">) => {
        if ("id" in product) {
            // Si tiene ID, es una actualización
            await updateProduct(product as Product);
        } else {
            // Si no tiene ID, se genera uno nuevo
            const newProduct: Product = {
                id: Date.now(), // Generar un ID único
                name: product.name,
                price: Number(product.price),
                stock: Number(product.stock),
                image: product.image || '',
                expirationDate: product.expirationDate || '',
                categoryId: product.categoryId || 1, // Valor por defecto
            };

            await insertProduct(newProduct, () => console.log("✅ Producto insertado correctamente"));
        }

        setModalVisible(false);
    };


    const handleDeleteProduct = async (productId: number) => {
        await deleteProduct(productId);
        fetchProducts();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Inventario</Text>
            <Text style={styles.subtitle}>Gestión de productos y stock</Text>

            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()} // Convertir ID a string
                renderItem={({ item }) => (
                    <View style={styles.productCard}>
                        {item.image ? (
                            <Image source={{ uri: item.image }} style={styles.productImage} />
                        ) : (
                            <View style={styles.placeholderImage} />
                        )}
                        <View style={styles.productInfo}>
                            <Text style={styles.productName}>{item.name}</Text>
                            <Text style={styles.productDetails}>Precio: ${item.price}</Text>
                            <Text style={styles.productDetails}>Stock: {item.stock}</Text>
                        </View>
                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => {
                                    setSelectedProduct(item);
                                    setModalVisible(true);
                                }}
                            >
                                <Text style={styles.buttonText}>Editar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDeleteProduct(item.id)}
                            >
                                <Text style={styles.buttonText}>Eliminar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                    setSelectedProduct(null);
                    setModalVisible(true);
                }}
            >
                <Text style={styles.buttonText}>+ Agregar Producto</Text>
            </TouchableOpacity>

            <ProductForm
                product={selectedProduct}
                onSave={handleSaveProduct}
                onClose={() => setModalVisible(false)}  // ✅ Pasa correctamente la función
                visible={modalVisible}
            />
        </View>
    );
};

export default InventoryScreen;
