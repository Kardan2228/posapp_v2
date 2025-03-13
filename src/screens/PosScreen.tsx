import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, TextInput } from 'react-native';
import SearchBar from '../components/pos/SearchBar';
import { styles } from '../styles/posScreen.styles';
import { stylesBadge } from '../styles/userBadgeMenu.styles';
import ProductGrid from '../components/pos/ProductGrid';
import { getProducts, updateProduct } from '../database/database';
import { Product } from '../types/product';
import Icon from 'react-native-vector-icons/Ionicons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { Appbar } from 'react-native-paper';
import UserBadgeMenu from '../components/UserBadgeMenu';

interface CartItem extends Product {
    quantity: number;
}

type PosScreenNavigationProp = StackNavigationProp<RootStackParamList, 'POS'>;
type PosScreenRouteProp = RouteProp<RootStackParamList, 'POS'>;

const PosScreen: React.FC<{ route: PosScreenRouteProp }> = ({ route }) => {
    console.log('User en POS Screen antes de destructuring:', route.params?.user);
    const navigation = useNavigation<PosScreenNavigationProp>();
    const { user } = route.params || {}; // ✅ Ahora `user` está bien definido
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [manualEntry, setManualEntry] = useState('');
    
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        getProducts((productList) => {
            setProducts(productList);
            setFilteredProducts(productList);
        });
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
    };

    const handleIncreaseQuantity = (productId: number) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const handleDecreaseQuantity = (productId: number) => {
        setCart((prevCart) =>
            prevCart
                .map((item) =>
                    item.id === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const handleRemoveFromCart = (productId: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const handlePayment = async () => {
        if (cart.length === 0) {
            Alert.alert('Carrito vacío', 'No hay productos en el carrito.');
            return;
        }

        for (const item of cart) {
            const updatedProduct = {
                ...item,
                stock: item.stock - item.quantity,
            };

            await updateProduct(updatedProduct);
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

    console.log("User en POS Screen:", user);

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content 
                title="Punto de Venta" 
                titleStyle={stylesBadge.appbarTitle}
                />
                {user && <UserBadgeMenu userId={user.id} />}
            </Appbar.Header>

            <Text style={styles.title}>Agrega al carrito</Text>
            <SearchBar onSearch={handleSearch} />

            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={styles.productRow}
                renderItem={({ item }) => (
                    <ProductGrid products={[item]} onSelectProduct={handleAddToCart} />
                )}
            />

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
                                {/* Botón para disminuir cantidad */}
                                <TouchableOpacity onPress={() => handleDecreaseQuantity(item.id)}>
                                    <Icon name="remove-circle-outline" size={24} color="#FF3B30" />
                                </TouchableOpacity>
                                {/* Botón para aumentar cantidad */}
                                <TouchableOpacity onPress={() => handleIncreaseQuantity(item.id)}>
                                    <Icon name="add-circle-outline" size={24} color="#007AFF" />
                                </TouchableOpacity>
                                {/* Botón para eliminar del carrito */}
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
