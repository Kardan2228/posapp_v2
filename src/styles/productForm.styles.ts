import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 5,
    },
    input: {
        height: 40,  // 🔹 Reducimos la altura del input
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 8,  // 🔹 Reducimos el espacio entre inputs
        backgroundColor: '#fff',
    },
    imagePreview: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginBottom: 10,
    },
    imageButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
    },
    iconButton: {
        width: 40,  // 🔹 Reducimos el tamaño para mayor estética
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E5E5E5',  // 🔹 Color más sutil
        borderWidth: 1,
        borderColor: '#ccc',
    },
    saveButton: {
        backgroundColor: "green",
    },
    cancelButton: {
        backgroundColor: "red",
    },
    dateButton: {
        backgroundColor: '#FFA500',
        padding: 8,
        borderRadius: 5,
        alignItems: 'center',
    },
    dateButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    selectedDate: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginTop: 5,
    },
    buttonContainer: {
        marginTop: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center', // 🔹 Centra los botones horizontalmente
        alignItems: 'center',
        marginTop: 15, // 🔹 Ajusta el espaciado con los demás elementos
        gap: 20, // 🔹 Reduce el espacio entre los botones (antes era mayor)
    },
    dateContainer: {

        marginTop: 10,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // 🔹 Separa la fecha y el icono de calendario
        backgroundColor: '#f5f5f5',
        padding: 8,
        borderRadius: 5,
        marginTop: 5,
    },
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center', // 🔹 Asegura que el texto y el ícono estén alineados
        justifyContent: 'space-between',
        paddingVertical: 12, // 🔹 Asegura buena altura
        paddingHorizontal: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        width: '100%',
        marginBottom: 15,
    },
});
