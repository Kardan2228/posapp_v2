// 📌 SalesReportScreen.styles.ts - Estilos para la pantalla de Reporte de Ventas
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    filterButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center',
    },
    filterButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    actionButton: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    dateContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    dateButton: {
        padding: 10,
        backgroundColor: "#6200ee",
        borderRadius: 5,
        alignItems: "center",
    },
    dateText: {
        color: "#fff",
        fontWeight: "bold",
    },
    clearButton: {
        backgroundColor: "#d32f2f",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,  // Para que ocupe el espacio adecuado
    },
    reportHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 16,
        marginTop: 10,
    },
    reportTitle: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    dateIcon: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
