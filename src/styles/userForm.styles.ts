import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: "row",  // 🔹 Alinear los íconos en fila
        justifyContent: "center", // 🔹 Centrar en la pantalla
        marginTop: 10, 
      },
      iconButton: {
        marginHorizontal: 15, // 🔹 Espaciado entre los iconos
      },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    pickerContainer: {
        width: "100%",  // 🔹 Ajusta el ancho completo
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: "white",
    },

    picker: {
        width: "100%", // 🔹 Expande el Picker
        height: 50,
    },
});
