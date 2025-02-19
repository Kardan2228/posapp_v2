import React, { useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text } from 'react-native';
import { getProducts } from '../../database/database';
import { styles } from '../../styles/posScreen.styles';

const ProductSearch = ({ onAddToCart }) => {
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState([]);

    const handleSearch = async () => {
        getProducts((result) => {
            setProducts(result.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())));
        });
    };

    return (
        <View style={styles.searchContainer}>
            <TextInput 
                style={styles.searchInput} 
                placeholder="Buscar producto..."
                value={query} 
                onChangeText={setQuery}
                onSubmitEditing={handleSearch}
            />

            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.productItem} 
                        onPress={() => onAddToCart(item)}
                    >
                        <Text style={styles.productName}>{item.name}</Text>
                        <Text style={styles.productPrice}>${item.price}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default ProductSearch;
