// 📌 reportsSales.ts - Módulo para reportes de ventas con expo-sqlite
// Contiene funciones para obtener reportes de ventas por período (día, semana, mes).

import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('posapp.db'); // ✅ Se mantiene openDatabaseSync

// 📌 Obtener reporte de ventas
export const getSalesReport = async (
    startDate: string,
    endDate: string,
    groupBy: 'day' | 'week' | 'month',
    callback: (data: any) => void
) => {
    let groupFormat = "%Y-%m-%d"; // Por defecto, agrupado por día
    if (groupBy === 'week') groupFormat = "%Y-%W";
    if (groupBy === 'month') groupFormat = "%Y-%m";

    try {
        const result = await db.getAllAsync(
            `SELECT strftime(?, saleDate) AS period, SUM(totalPrice) AS total_ventas, COUNT(id) AS total_transacciones 
             FROM sales 
             WHERE saleDate BETWEEN ? AND ? 
             GROUP BY period 
             ORDER BY period DESC;`,
            [groupFormat, startDate, endDate]
        );
        
        callback(result);
    } catch (error: any) {
        console.error('Error al obtener reporte de ventas', error);
        callback([]);
    }
};