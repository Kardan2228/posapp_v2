import * as SQLite from 'expo-sqlite';

// 📌 Asegurar que la BD se abre correctamente
const db = SQLite.openDatabaseSync('posapp.db');

// 📌 Función para configurar la base de datos
export const setupDatabase = async () => {
    try {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                stock INTEGER NOT NULL,
                image TEXT,
                expirationDate TEXT,
                categoryId INTEGER NOT NULL
            );
        `);
        console.log("✅ Base de datos configurada correctamente.");
    } catch (error) {
        console.error("❌ Error al configurar la base de datos:", error);
    }
};

// 📌 Función para insertar un producto de prueba
export const insertProduct = async () => {
    try {
        await db.runAsync(
            `INSERT INTO products (name, price, stock, image, expirationDate, categoryId)
            VALUES (?, ?, ?, ?, ?, ?);`,
            ["Producto de prueba", 10.99, 100, "", "", 1]
        );
        console.log("✅ Producto insertado correctamente.");
    } catch (error) {
        console.error("❌ Error al insertar el producto:", error);
    }
};

// 📌 Función para obtener los productos
export const getProducts = async () => {
    try {
        const result = await db.getAllAsync("SELECT * FROM products;");
        console.log("📦 Productos obtenidos:", result);
    } catch (error) {
        console.error("❌ Error al obtener los productos:", error);
    }
};
