import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import SearchBar from '../components/pos/SearchBar';
import { styles } from '../styles/posScreen.styles';
import ProductGrid from '../components/pos/ProductGrid';
import { getProducts } from '../database/database';
import { Product } from '../types/product';
import Icon from 'react-native-vector-icons/Ionicons';
import { updateProduct } from '../database/database';
import { Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator'; // Importa los tipos
import { useNavigation } from '@react-navigation/native'; // Importa navegación

interface CartItem extends Product {
    quantity: number;
}

const PosScreen: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        getProducts(setProducts);
        setFilteredProducts(products);
    };

    const handleSearch = (query: string) => {
        if (query.trim() === '') {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    };

    const handleAddToCart = (product: Product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });

        setProducts((prevProducts) =>
            prevProducts.map((p) =>
                p.id === product.id ? { ...p, stock: p.stock - 1 } : p
            )
        );

        setFilteredProducts((prevFiltered) =>
            prevFiltered.map((p) =>
                p.id === product.id ? { ...p, stock: p.stock - 1 } : p
            )
        );
    };

    const handleIncreaseQuantity = (productId: number) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
            )
        );

        setProducts((prevProducts) =>
            prevProducts.map((p) =>
                p.id === productId ? { ...p, stock: p.stock - 1 } : p
            )
        );

        setFilteredProducts((prevFiltered) =>
            prevFiltered.map((p) =>
                p.id === productId ? { ...p, stock: p.stock - 1 } : p
            )
        );
    };

    const handleDecreaseQuantity = (productId: number) => {
        setCart((prevCart) =>
            prevCart
                .map((item) =>
                    item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter((item) => item.quantity > 0)
        );

        setProducts((prevProducts) =>
            prevProducts.map((p) =>
                p.id === productId ? { ...p, stock: p.stock + 1 } : p
            )
        );

        setFilteredProducts((prevFiltered) =>
            prevFiltered.map((p) =>
                p.id === productId ? { ...p, stock: p.stock + 1 } : p
            )
        );
    };

    const handleRemoveFromCart = (productId: number) => {
        const removedItem = cart.find((item) => item.id === productId);

        if (!removedItem) return;

        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));

        setProducts((prevProducts) =>
            prevProducts.map((p) =>
                p.id === productId ? { ...p, stock: p.stock + removedItem.quantity } : p
            )
        );

        setFilteredProducts((prevFiltered) =>
            prevFiltered.map((p) =>
                p.id === productId ? { ...p, stock: p.stock + removedItem.quantity } : p
            )
        );
    };

    type NavigationProps = StackNavigationProp<RootStackParamList, 'POS'>;

    const navigation = useNavigation<NavigationProps>();

    const handlePayment = async () => {
        if (cart.length === 0) {
            Alert.alert('Carrito vacío', 'No hay productos en el carrito.');
            return;
        }
    
        for (const item of cart) {
            const updatedProduct = {
                ...item,
                stock: item.stock - item.quantity, // Reducir el stock
            };
    
            await updateProduct(updatedProduct); // 🔹 Llamada para actualizar la BD
        }
    
        Alert.alert(
            'Venta completada',
            '¿Deseas realizar otra venta?',
            [
                {
                    text: 'Menú Principal',
                    onPress: () => navigation.navigate('Home'),
                },
                {
                    text: 'Nueva Venta',
                    onPress: () => setCart([]),
                    style: 'cancel',
                },
            ],
            { cancelable: false }
        );
    };    

    const totalParcial = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Punto de Venta</Text>
            <SearchBar onSearch={handleSearch} />

            {/* 🛍️ Contenedor de productos con desplazamiento y distribución correcta */}
            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2} // Mantiene dos columnas
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={styles.productRow} // Mantiene alineación simétrica
                renderItem={({ item }) => (
                    <ProductGrid products={[item]} onSelectProduct={handleAddToCart} />
                )}
            />

            {/* 🛒 Carrito fijo */}
            <View style={styles.cartContainer}>
                <Text style={styles.cartTitle}>Carrito</Text>
                <FlatList
                    data={cart}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.cartItem}>
                            <Text style={styles.cartItemText}>
                                {item.name} ({item.quantity}) - ${item.price.toFixed(2)}
                            </Text>
                            <View style={styles.cartActions}>
                                <TouchableOpacity onPress={() => handleDecreaseQuantity(item.id)}>
                                    <Icon name="remove-circle-outline" size={24} color="#FF3B30" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleIncreaseQuantity(item.id)}>
                                    <Icon name="add-circle-outline" size={24} color="#007AFF" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleRemoveFromCart(item.id)}>
                                    <Icon name="trash-outline" size={24} color="#FF3B30" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    style={styles.cartList}
                />
                <Text style={styles.totalText}>Total: ${totalParcial.toFixed(2)}</Text>
                <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
                    <Text style={styles.paymentButtonText}>Realizar Pago</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PosScreen;
