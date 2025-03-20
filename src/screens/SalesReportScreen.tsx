import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
import { Appbar, DataTable } from 'react-native-paper';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import UserBadgeMenu from '../components/UserBadgeMenu';
import { getAllSales, getSalesByUser, getTopSellingProducts, getLowSellingProducts } from '../database/databaseSales';
import { styles } from '../styles/SalesReportScreen.styles';
import FilterMenu from '../components/reports/FilterMenu';
import DateRangePicker from '../components/reports/DateRangePicker';

type SalesReportScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SalesReport'>;
type SalesReportScreenRouteProp = RouteProp<RootStackParamList, 'SalesReport'>;

const SalesReportScreen: React.FC<{ route: SalesReportScreenRouteProp }> = ({ route }) => {
    const navigation = useNavigation<SalesReportScreenNavigationProp>();
    const { user } = route.params || {};

    const [sales, setSales] = useState<any[]>([]);
    const [selectedFilter, setSelectedFilter] = useState('Todas las Ventas');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    useEffect(() => {
        fetchSales();
    }, [selectedFilter, startDate, endDate]);

    const fetchSales = async () => {
        try {
            let data = [];

            switch (selectedFilter) {
                case 'Todas las Ventas':
                    data = await getAllSales(
                        startDate ? startDate.toISOString().split('T')[0] : undefined,
                        endDate ? endDate.toISOString().split('T')[0] : undefined
                    );
                    break;

                case 'Mis Ventas':
                    data = user
                        ? await getSalesByUser(user.id, {
                            startDate: startDate ? startDate.toISOString().split('T')[0] : undefined,
                            endDate: endDate ? endDate.toISOString().split('T')[0] : undefined,
                        })
                        : [];
                    break;

                case 'Más Vendidos':
                    data = await getTopSellingProducts();
                    break;

                case 'Menos Vendidos':
                    data = await getLowSellingProducts();
                    break;

                default:
                    data = await getAllSales(
                        startDate ? startDate.toISOString().split('T')[0] : undefined,
                        endDate ? endDate.toISOString().split('T')[0] : undefined
                    );
                    break;
            }

            setSales(data);
        } catch (error) {
            console.error("❌ Error al obtener ventas:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Reporte de Ventas" />
                {user && <UserBadgeMenu userId={user.id} />}
                <FilterMenu selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />
            </Appbar.Header>

            {/* 📌 Título del reporte sobre la tabla */}
            <View style={styles.reportHeader}>
                <Text style={styles.reportTitle}>{selectedFilter}</Text>
                <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    onConfirm={fetchSales}  // Esto actualiza el reporte cuando se confirman las fechas
                />
            </View>

            {/* 📌 Tabla de ventas con Scroll */}
            <ScrollView horizontal>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title style={{ width: 120 }}>Producto</DataTable.Title>
                        <DataTable.Title style={{ width: 80 }}>Cantidad</DataTable.Title>
                        {selectedFilter !== "Más Vendidos" && selectedFilter !== "Menos Vendidos" && (
                            <>
                                <DataTable.Title style={{ width: 100 }}>Usuario</DataTable.Title>
                                <DataTable.Title style={{ width: 100 }}>Total</DataTable.Title>
                                <DataTable.Title style={{ width: 140 }}>Fecha</DataTable.Title>
                            </>
                        )}
                    </DataTable.Header>

                    <FlatList
                        data={sales}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <DataTable.Row>
                                <DataTable.Cell style={{ width: 120 }}>{item.product_name}</DataTable.Cell>
                                <DataTable.Cell style={{ width: 80 }}>{item.total_quantity ?? item.quantity}</DataTable.Cell>
                                {selectedFilter !== "Más Vendidos" && selectedFilter !== "Menos Vendidos" && (
                                    <>
                                        <DataTable.Cell style={{ width: 100 }}>{item.user_name}</DataTable.Cell>
                                        <DataTable.Cell style={{ width: 100 }}>{item.totalPrice ? `$${item.totalPrice.toFixed(2)}` : "N/A"}</DataTable.Cell>
                                        <DataTable.Cell style={{ width: 140 }}>{item.saleDate}</DataTable.Cell>
                                    </>
                                )}
                            </DataTable.Row>
                        )}
                    />
                </DataTable>
            </ScrollView>
        </View>
    );
};

export default SalesReportScreen;
