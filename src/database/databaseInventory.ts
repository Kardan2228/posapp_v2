import * as SQLite from 'expo-sqlite';
import { Product } from '../types/product';

// 📌 Abrir la base de datos
const db = SQLite.openDatabaseSync('posapp.db');

// 📌 Crear la tabla products
export const setupDatabaseInventory = async () => {
  try {
    console.log('📌 Inicializando base de datos de productos...');

    await db.execAsync(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        stock INTEGER NOT NULL,
        image TEXT,
        expirationDate TEXT,
        categoryId INTEGER NOT NULL
    );`);

    console.log('✅ Tabla de productos creada correctamente.');
  } catch (error) {
    console.error('❌ Error en setupDatabase:', error);
  }
};

// 📌 Obtener todos los productos
export const getProducts = async (callback: (products: Product[]) => void) => {
  try {
    const result = await db.getAllAsync<Product>('SELECT * FROM products;');
    callback(result);
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
  }
};

// 📌 Insertar un producto
export const insertProduct = async (product: Omit<Product, 'id'>, callback: (id: number) => void) => {
  try {
    await db.runAsync(
      `INSERT INTO products (name, price, stock, image, expirationDate, categoryId)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [
        product.name,
        Number(product.price) || 0,
        Number(product.stock) || 0,
        product.image || '',
        product.expirationDate || '',
        Number(product.categoryId) || 1
      ]
    );

    const result = await db.getFirstAsync<{ lastId: number }>('SELECT last_insert_rowid() AS lastId;');
    const newId = result?.lastId || 0;

    console.log(`✅ Producto insertado correctamente con ID: ${newId}`);
    callback(newId);
  } catch (error) {
    console.error('❌ Error al insertar producto:', error);
  }
};

// 📌 Actualizar un producto
export const updateProduct = async (product: Product) => {
  try {
    await db.runAsync(
      `UPDATE products SET name = ?, price = ?, stock = ?, image = ?, expirationDate = ?, categoryId = ? WHERE id = ?`,
      [
        product.name,
        Number(product.price) || 0,
        Number(product.stock) || 0,
        product.image || '',
        product.expirationDate || '',
        Number(product.categoryId) || 1,
        product.id
      ]
    );
    console.log('✅ Producto actualizado correctamente.');
    return true;
  } catch (error) {
    console.error('❌ Error al actualizar producto:', error);
    return false;
  }
};

// 📌 Eliminar un producto
export const deleteProduct = async (id: number) => {
  try {
    await db.runAsync(`DELETE FROM products WHERE id = ?`, [id]);
    console.log('✅ Producto eliminado correctamente.');
    return true;
  } catch (error) {
    console.error('❌ Error al eliminar producto:', error);
    return false;
  }
};
