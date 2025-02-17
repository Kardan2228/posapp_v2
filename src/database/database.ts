import * as SQLite from 'expo-sqlite';
import { Product } from '../types/product';

// 📌 Mantener openDatabaseSync como en tu código original
const db = SQLite.openDatabaseSync('posapp.db');

// 📌 1. Crear la tabla si no existe
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
    console.log('📌 Base de datos configurada correctamente.');
  } catch (error) {
    console.error('❌ Error al configurar la base de datos:', error);
  }
};

// 📌 2. Obtener todos los productos
export const getProducts = async (callback: (products: Product[]) => void) => {
  try {
    const result = await db.getAllAsync<Product>('SELECT * FROM products;');
    callback(result);
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
  }
};

// 📌 3. Insertar un producto
export const insertProduct = async (product: Omit<Product, 'id'>, callback: () => void) => {
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
    console.log('✅ Producto insertado correctamente.');
    callback();
  } catch (error) {
    console.error('❌ Error al insertar producto:', error);
  }
};

// 📌 4. Actualizar un producto (AGREGADO)
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

// 📌 5. Eliminar un producto (AGREGADO)
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
