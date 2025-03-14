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
