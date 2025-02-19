import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    searchContainer: {
        marginBottom: 20,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#CCC',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#FFF',
    },
    productItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#DDD',
    },
    productName: {
        fontSize: 18,
    },
    productPrice: {
        fontSize: 16,
        color: '#007AFF',
    },
    cartContainer: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        marginTop: 15, // 📌 Separación visual
        elevation: 3, // 📌 Sombra para destacarlo
    },
    cartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    cartActions: {
        flexDirection: 'row',
        gap: 10, // 📌 Espacio entre los botones
        alignItems: 'center',
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#DDD',
    },
    cartItemText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cartSummary: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "#fff",
        padding: 15,
        borderTopWidth: 1,
        borderColor: "#ddd",
        alignItems: "center",
    },
    removeButton: {
        fontSize: 18,
        color: '#FF3B30',
        fontWeight: 'bold',
    },
    totalContainer: {
        padding: 15,
        alignItems: 'center',
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    checkoutButton: {
        backgroundColor: '#28A745',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    paymentButton: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10, // 📌 Espaciado antes del botón
    },
    paymentButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
