import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
//import Modal from 'react-native-modal';
import ProductForm from '../components/inventory/ProductForm';
import { Product } from '../types/product';
import { styles } from '../styles/inventory.styles';
import { stylesBadge } from '../styles/userBadgeMenu.styles';
import { getProducts, insertProduct, updateProduct, deleteProduct, setupDatabase } from '../database/database';
import Icon from 'react-native-vector-icons/Ionicons'; // 📌 Íconos
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { Appbar } from 'react-native-paper';
import UserBadgeMenu from '../components/UserBadgeMenu';

type InventoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Inventory'>;
type InventoryScreenRouteProp = RouteProp<RootStackParamList, 'Inventory'>;

const InventoryScreen: React.FC<{ route: InventoryScreenRouteProp }> = ({ route }) => {
    const navigation = useNavigation<InventoryScreenNavigationProp>();
    const { user } = route.params || {};
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        setupDatabase();
        fetchProducts();
    }, []); // ✅ Solo se ejecuta una vez al montar el componente

    const fetchProducts = async () => {
        getProducts(setProducts);
    };

    const handleSaveProduct = async (product: Omit<Product, 'id'>) => {
        if (selectedProduct) {
            // Si el producto ya existe, se actualiza
            await updateProduct({ ...product, id: selectedProduct.id });
        } else {
            // Insertar y obtener el ID automáticamente
            insertProduct(product, (newId) => {
                console.log("📌 Nuevo producto insertado con ID:", newId);
                fetchProducts(); // 🔄 Refresca la lista de productos en pantalla
            });
        }

        setModalVisible(false);
    };

    const handleDeleteProduct = async (productId: number) => {
        await deleteProduct(productId);
        fetchProducts();
    };

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content
                    title="Inventario"
                    titleStyle={stylesBadge.appbarTitle}
                />
                {user && <UserBadgeMenu userId={user.id} />}
            </Appbar.Header>

            <Text style={styles.subtitle}>Gestión de productos y stock</Text>

            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 100 }} // 🛠 Espacio para que el botón de agregar producto no se oculte
                renderItem={({ item }) => (
                    <View style={styles.productCard}>
                        {/* 📌 Imagen alineada a la izquierda */}
                        {item.image ? (
                            <Image source={{ uri: item.image }} style={styles.productImage} />
                        ) : (
                            <View style={styles.placeholderImage} />
                        )}

                        {/* 📌 Información del producto alineada a la derecha */}
                        <View style={styles.productInfo}>
                            <Text style={styles.productName}>{item.name}</Text>
                            <Text style={styles.productDetails}>ID: {item.id}</Text>
                            <Text style={styles.productDetails}>Precio: ${item.price}</Text>
                            <Text style={styles.productDetails}>Stock: {item.stock}</Text>
                        </View>

                        {/* 📌 Íconos de acción (Editar y Eliminar) */}
                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => {
                                    setSelectedProduct(item); // ✅ Guarda el producto seleccionado
                                    setModalVisible(true); // ✅ Abre el modal correctamente
                                }}
                            >
                                <Icon name="create-outline" size={24} color="#007AFF" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => handleDeleteProduct(item.id)}
                            >
                                <Icon name="trash-outline" size={24} color="#FF3B30" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            {/* ✅ Botón "+ Agregar Producto" (Ahora sí se muestra siempre) */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                    setSelectedProduct(null); // ✅ Reiniciar selección de producto
                    setModalVisible(true);
                }}
            >
                <Text style={styles.buttonText}>+ Agregar Producto</Text>
            </TouchableOpacity>

            {/* ✅ Modal de formulario para agregar o editar productos */}
            <ProductForm
                product={selectedProduct}
                onSave={handleSaveProduct}
                onClose={() => setModalVisible(false)}
                visible={modalVisible}
            />
        </View>
    );

};

export default InventoryScreen;
