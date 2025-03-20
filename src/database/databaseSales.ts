// 📌 databaseSales.ts - Manejo de la tabla 'sales' (ventas realizadas)
import * as SQLite from 'expo-sqlite';

// 📌 Definir la estructura de la información de la tabla SQLite
interface TableInfo {
    cid: number;
    name: string;
    type: string;
    notnull: number;
    dflt_value: any;
    pk: number;
}

// 📌 Abrir la base de datos con `openDatabaseSync`
const db = SQLite.openDatabaseSync('posapp.db');

// 📌 Crear o actualizar la tabla sales
export const setupDatabaseSales = async () => {
    try {
        console.log('📌 Inicializando base de datos de ventas...');

        // Obtener información de la tabla
        const tableInfo: TableInfo[] = await db.getAllAsync('PRAGMA table_info(sales);');
        const columns = tableInfo.map((col: TableInfo) => col.name);

        // Si la tabla no existe, crearla
        if (columns.length === 0) {
            await db.execAsync(`CREATE TABLE IF NOT EXISTS sales (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL,
                totalPrice REAL NOT NULL,
                saleDate TEXT DEFAULT (datetime('now', 'localtime')),
                user_id INTEGER NOT NULL
            );`);
            console.log('✅ Tabla de ventas creada correctamente.');
        } else {
            // Si la tabla existe pero no tiene las nuevas columnas, añadirlas
            if (!columns.includes('saleDate')) {
                await db.execAsync(`ALTER TABLE sales ADD COLUMN saleDate TEXT DEFAULT (datetime('now', 'localtime'));`);
                console.log('✅ Columna saleDate añadida.');
            }
        }
    } catch (error: any) {
        console.error('❌ Error en setupDatabaseSales:', error);
    }
};

// 📌 Insertar una venta
export const insertSale = async (product_id: number, quantity: number, totalPrice: number, user_id: number) => {
    try {
        await db.runAsync(
            `INSERT INTO sales (product_id, quantity, totalPrice, user_id) VALUES (?, ?, ?, ?);`,
            [product_id, quantity, totalPrice, user_id]
        );
        console.log(`✅ Venta registrada: Producto ${product_id}, Cantidad: ${quantity}, Total: ${totalPrice}, Usuario: ${user_id}`);
        return true;
    } catch (error) {
        console.error('Error al insertar venta:', error);
        return false;
    }
};
/*
const verifyTables = async () => {
    try {
        const tables = await db.getAllAsync("SELECT name FROM sqlite_master WHERE type='table';");
        console.log('📌 Tablas actuales en la BD:', tables);
    } catch (error) {
        console.error("❌ Error al obtener las tablas:", error);
    }
};

// 📌 Ejecutar la verificación
verifyTables();
*/

// 📌 Obtener todas las ventas con filtros opcionales
export const getAllSales = async (startDate: string | null = null, endDate: string | null = null) => {
    let query = `
        SELECT sales.id, products.name AS product_name, sales.quantity,
               sales.saleDate, sales.totalPrice, sales.user_id, users.name AS user_name
        FROM sales
        JOIN users ON sales.user_id = users.id
        JOIN products ON sales.product_id = products.id
        WHERE 1=1`;

    const params: any[] = [];

    if (startDate) {
        query += " AND sales.saleDate >= ?";
        params.push(startDate);
    }
    if (endDate) {
        query += " AND sales.saleDate <= ?";
        params.push(endDate);
    }

    query += " ORDER BY sales.saleDate DESC";

    return await db.getAllAsync(query, params);
};

// 📌 Obtener ventas por usuario con filtros opcionales
export const getSalesByUser = async (user_id: number, filters: { product_id?: number; startDate?: string; endDate?: string } = {}) => {
    try {
        console.log(`📌 Ejecutando consulta de ventas para el usuario ${user_id} con filtros...`, filters);
        const { product_id = null, startDate = null, endDate = null } = filters;
        console.log(`📌 Filtros recibidos - product_id: ${product_id}, startDate: ${startDate}, endDate: ${endDate}`);
        
        let query = `
            SELECT sales.id, sales.product_id, products.name AS product_name, sales.quantity, 
                   sales.saleDate, sales.totalPrice, sales.user_id, users.name AS user_name
            FROM sales
            JOIN users ON sales.user_id = users.id
            JOIN products ON sales.product_id = products.id
            WHERE sales.user_id = ?`;
        
        const params: any[] = [user_id];
        
        if (product_id !== null) {
            query += ` AND sales.product_id = ?`;
            params.push(product_id);
        }
        if (startDate !== null) {
            query += ` AND sales.saleDate >= ?`;
            params.push(startDate);
        }
        if (endDate !== null) {
            query += ` AND sales.saleDate <= ?`;
            params.push(endDate);
        }
        query += ` ORDER BY sales.saleDate DESC;`;
        
        console.log(`📌 Consulta SQL generada: ${query}`);
        
        const result = await db.getAllAsync(query, params);
        console.log('✅ Ventas obtenidas para el usuario con filtros:', result);
        return result;
    } catch (error) {
        console.error('❌ Error al obtener ventas del usuario con filtros:', error);
        return [];
    }
};

// 📌 Obtener los productos más vendidos
export const getTopSellingProducts = async () => {
    try {
        console.log("📊 Ejecutando consulta de productos más vendidos...");
        const result = await db.getAllAsync(`
            SELECT p.id, p.name AS product_name, SUM(s.quantity) AS total_quantity
            FROM sales s
            JOIN products p ON s.product_id = p.id
            GROUP BY p.id
            ORDER BY total_quantity DESC
            LIMIT 10;
        `);
        console.log("✅ Productos más vendidos obtenidos:", result);
        return result;
    } catch (error) {
        console.error('❌ Error al obtener los productos más vendidos:', error);
        return [];
    }
};

// 📌 Obtener los productos menos vendidos
export const getLowSellingProducts = async () => {
    try {
        console.log("📊 Ejecutando consulta de productos menos vendidos...");
        const result = await db.getAllAsync(`
            SELECT p.id, p.name AS product_name, 
                   SUM(s.quantity) AS total_quantity,
                   SUM(s.totalPrice) AS total_price
            FROM sales s
            JOIN products p ON s.product_id = p.id
            GROUP BY p.id
            ORDER BY total_quantity ASC
            LIMIT 10;
        `);
        console.log("✅ Productos menos vendidos obtenidos:", result);
        return result;
    } catch (error) {
        console.error('❌ Error al obtener los productos menos vendidos:', error);
        return [];
    }
};

// 📌 Obtener ventas filtradas por usuario y/o fechas
export const getSalesByFilters = async (filters: { user_id?: number | null, startDate?: string | null, endDate?: string | null }) => {
    try {
        let query = `
            SELECT sales.id, sales.product_id, products.name AS product_name, sales.quantity,
                   sales.saleDate, sales.totalPrice, sales.user_id, users.name AS user_name
            FROM sales
            JOIN users ON sales.user_id = users.id
            JOIN products ON sales.product_id = products.id
            WHERE 1=1
        `;
        const params: any[] = [];

        if (filters.user_id) {
            query += " AND sales.user_id = ?";
            params.push(filters.user_id);
        }
        if (filters.startDate && filters.endDate) {
            query += " AND sales.saleDate BETWEEN ? AND ?";
            params.push(filters.startDate, filters.endDate);
        } else if (filters.startDate) {
            query += " AND sales.saleDate >= ?";
            params.push(filters.startDate);
        } else if (filters.endDate) {
            query += " AND sales.saleDate <= ?";
            params.push(filters.endDate);
        }

        query += " ORDER BY sales.saleDate DESC;";

        const result = await db.getAllAsync(query, params);
        return result;
    } catch (error) {
        console.error('❌ Error al obtener ventas con filtros:', error);
        return [];
    }
};
