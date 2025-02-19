import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/posScreen.styles';

const CartList = ({ cart, onRemoveFromCart }) => {
    return (
        <View style={styles.cartContainer}>
            <FlatList
                data={cart}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                        <Text style={styles.cartItemText}>{item.name} - ${item.price}</Text>
                        <TouchableOpacity onPress={() => onRemoveFromCart(item.id)}>
                            <Text style={styles.removeButton}>X</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

export default CartList;
