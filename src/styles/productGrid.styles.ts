import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        padding: 10,
    },
    productCard: {
        width: "48%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        alignItems: "center",
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    productImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    productName: {  
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
        marginTop: 5,
    },
    productPrice: {
        color: "#007AFF",
        fontWeight: "bold",
        marginTop: 5,
    },
    productStock: {
        color: "#FF3B30",
        fontWeight: "bold",
        marginTop: 5,
    },
    disabledProductCard: {
        opacity: 0.5,
    },
    outOfStockText: {
        color: "#FF3B30",
        fontWeight: "bold",
    },
});
