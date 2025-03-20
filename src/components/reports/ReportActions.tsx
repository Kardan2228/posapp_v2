import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { styles } from '../../styles/ReportActions.styles';

const screenWidth = Dimensions.get("window").width;

interface ReportActionsProps {
    sales: any[];
}

const ReportActions: React.FC<ReportActionsProps> = ({ sales }) => {
    const [showChart, setShowChart] = useState(false);

    // 📌 Función para exportar el reporte en CSV
    const exportReport = async () => {
        if (!sales.length) {
            Alert.alert("No hay datos para exportar.");
            return;
        }

        let csvContent = "Producto,Cantidad,Usuario,Total,Fecha\n";
        sales.forEach(sale => {
            csvContent += `${sale.product_name},${sale.quantity},${sale.user_name || "N/A"},${sale.totalPrice || "N/A"},${sale.saleDate || "N/A"}\n`;
        });

        const fileUri = FileSystem.documentDirectory + "Reporte_Ventas.csv";
        await FileSystem.writeAsStringAsync(fileUri, csvContent, { encoding: FileSystem.EncodingType.UTF8 });

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
        } else {
            Alert.alert("Compartir archivos no está soportado en este dispositivo.");
        }
    };

    // 📌 Función para mostrar gráficos de ventas
    const generateChart = () => {
        if (!sales.length) {
            Alert.alert("No hay datos para graficar.");
            return;
        }

        setShowChart(true); // Muestra el modal con el gráfico
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.exportButton} onPress={exportReport}>
                    <Text style={styles.buttonText}>📄 Exportar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chartButton} onPress={generateChart}>
                    <Text style={styles.buttonText}>📊 Gráficos</Text>
                </TouchableOpacity>
            </View>

            {/* 📌 Modal para mostrar el gráfico */}
            <Modal visible={showChart} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.chartTitle}>📊 Ventas por Producto</Text>
                        <ScrollView horizontal>
                            <BarChart
                                data={{
                                    labels: sales.map(sale => sale.product_name),
                                    datasets: [{ data: sales.map(sale => sale.quantity) }],
                                }}
                                width={sales.length * 60} // Ajusta el ancho según la cantidad de productos
                                height={250}
                                yAxisLabel=""
                                yAxisSuffix=""
                                chartConfig={{
                                    backgroundColor: "#ffffff",
                                    backgroundGradientFrom: "#ffffff",
                                    backgroundGradientTo: "#ffffff",
                                    decimalPlaces: 0,
                                    color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    style: { borderRadius: 16 },
                                    propsForLabels: {
                                        fontSize: 10, // Reduce el tamaño de las etiquetas
                                        rotation: -45, // Gira las etiquetas del eje X
                                    },
                                }}
                                style={{ marginVertical: 8, borderRadius: 16 }}
                            />
                        </ScrollView>
                        <TouchableOpacity onPress={() => setShowChart(false)} style={styles.closeButton}>
                            <Text style={styles.buttonText}>❌ Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ReportActions;