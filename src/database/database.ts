import * as SQLite from 'expo-sqlite';
import { Product } from '../types/product';

// 📌 Abrir la base de datos (Se deja una sola vez)
const db = SQLite.openDatabaseSync('posapp.db');

// 📌 Crear las tablas (Usuarios + Productos)
export const setupDatabase = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('admin', 'vendedor')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

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

    console.log('📌 Tablas creadas correctamente.');
  } catch (error) {
    console.error('❌ Error al configurar la base de datos:', error);
  }
};

// 📌 Registrar un nuevo usuario
export const registerUser = async (name: string, email: string, password: string, role: 'admin' | 'vendedor') => {
  try {
    await db.runAsync(
      `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?);`,
      [name, email, password, role]
    );
    console.log('✅ Usuario registrado correctamente.');
    return true;
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    return false;
  }
};

// 📌 Verificar credenciales de login
export const loginUser = async (email: string, password: string) => {
  try {
    const result = await db.getFirstAsync<{ id: number; name: string; role: string }>(
      'SELECT id, name, role FROM users WHERE email = ? AND password = ?;',
      [email, password]
    );

    if (result) {
      console.log(`✅ Usuario autenticado: ${result.name}`);
      return result;
    } else {
      console.log('❌ Credenciales incorrectas');
      return null;
    }
  } catch (error) {
    console.error('❌ Error en la autenticación:', error);
    return null;
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
