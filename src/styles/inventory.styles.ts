import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
        color: '#6c757d',
    },
    productCard: {
        flexDirection: 'row', // 🔹 Alinear en fila: imagen + contenido
        alignItems: 'center', // 🔹 Centrar verticalmente
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    productImage: {
        width: 80,  // 🔹 Ajustar tamaño de imagen
        height: 80,
        borderRadius: 10,
        marginRight: 10,  // 🔹 Espacio entre imagen y texto
    },
    productContent: {
        flex: 1, // 🔹 Para que ocupe el resto del espacio
        flexDirection: 'row', // 🔹 Distribuir info y botones en fila
        justifyContent: 'space-between', // 🔹 Info a la izquierda, botones a la derecha
        alignItems: 'center',
    },
    placeholderImage: {
        width: 100,
        height: 100,
        backgroundColor: '#dfe6e9',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    productDetails: {
        fontSize: 14,
        color: '#6c757d',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    editButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    addButton: {
        backgroundColor: '#28a745',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    iconButton: {
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 50,
        backgroundColor: '#f5f5f5', // Fondo gris claro para los botones
        alignItems: 'center',
        justifyContent: 'center',
    },
});

