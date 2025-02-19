import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles } from "../../styles/productGrid.styles";
import { Product } from "../../types/product";

interface ProductGridProps {
    products: Product[];
    onSelectProduct: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onSelectProduct }) => {
    return (
        <View style={styles.gridContainer}>
            {products.map((item) => (
                <TouchableOpacity
                    key={item.id}
                    style={[
                        styles.productCard,
                        item.stock === 0 && styles.disabledProductCard // Deshabilita productos sin stock
                    ]}
                    onPress={() => item.stock > 0 && onSelectProduct(item)}
                    disabled={item.stock === 0} // Evita que se puedan seleccionar
                >
                    <Image source={{ uri: item.image }} style={styles.productImage} />
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
                    <Text
                        style={[
                            styles.productStock,
                            item.stock === 0 ? styles.outOfStockText : { color: "#000" } // Negro si hay stock
                        ]}
                    >
                        {item.stock === 0 ? "Sin stock" : `Stock: ${item.stock}`}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default ProductGrid;
