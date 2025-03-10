import * as SQLite from 'expo-sqlite';

// 📌 Abrir la base de datos
const db = SQLite.openDatabaseSync('posapp.db');

// 📌 Crear la tabla users
export const setupDatabaseUsers = async () => {
  try {
    console.log('📌 Inicializando base de datos de usuarios...');

    //await db.execAsync(`DROP TABLE IF EXISTS users;`); // Eliminamos la tabla si existe
    console.log('✅ Tabla users eliminada (si existía).');

    await db.execAsync(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'vendedor')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);

    console.log('✅ Tabla de usuarios creada correctamente.');

    // 🔹 Verificar si SuperAdmin ya existe
    const users: any[] = await db.getAllAsync('SELECT * FROM users;');
    if (users.length === 0) {
      console.log('⚠️ No hay usuarios, creando SuperAdmin...');

      try {
        const defaultPassword = 'admin123'; // Sin hashing
        await db.runAsync(
          `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?);`,
          ['SuperAdmin', 'admin@posapp.com', defaultPassword, 'admin']
        );
        console.log('✅ SuperAdmin creado.');
      } catch (error) {
        console.error('❌ Error al crear SuperAdmin:', error);
      }
    }
  } catch (error) {
    console.error('❌ Error en setupDatabaseUsers:', error);
  }
};

// 📌 Depuración de la base de datos de usuarios
export const debugDatabaseUsers = async () => {
  try {
    const users = await db.getAllAsync('SELECT * FROM users;');
    console.log('📌 Usuarios en la base de datos:', users);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
  }
};

// 📌 Registrar usuario (Solo para Admins)
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

// 📌 Login sin hashing (comparación directa de texto plano)
export const loginUser = async (email: string, password: string) => {
  try {
    const user = await db.getFirstAsync<{ id: number; name: string; role: string; password: string }>(
      'SELECT id, name, role, password FROM users WHERE email = ?;',
      [email]
    );

    if (!user) {
      console.log('❌ Usuario no encontrado');
      return null;
    }

    console.log('🔹 Contraseña ingresada:', password);
    console.log('🔹 Contraseña en BD:', user.password);

    // Comparación directa sin hashing
    if (password === user.password) {
      console.log(`✅ Usuario autenticado: ${user.name}`);
      return { id: user.id, name: user.name, role: user.role };
    } else {
      console.log('❌ Contraseña incorrecta');
      return null;
    }

  } catch (error) {
    console.error('❌ Error en autenticación:', error);
    return null;
  }
};

// 📌 Obtener todos los usuarios
export const getUsers = async () => {
  try {
    const users = await db.getAllAsync('SELECT id, name, email, role, created_at FROM users;');
    return users;
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    return []; // ✅ Ahora devuelve un array vacío en caso de error
  }
};

// 📌 Obtener un usuario por ID
export const getUserById = async (id: number) => {
  try {
    const user = await db.getFirstAsync('SELECT id, name, email, role, created_at FROM users WHERE id = ?;', [id]);
    return user;
  } catch (error) {
    console.error('❌ Error al obtener usuario:', error);
    return null;
  }
};

// 📌 Actualizar un usuario (Solo Admin puede modificar)
export const updateUser = async (id: number, name: string, email: string, role: 'admin' | 'vendedor') => {
  try {
    await db.runAsync(
      `UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?`,
      [name, email, role, id]
    );
    console.log('✅ Usuario actualizado correctamente.');
    return true;
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    return false;
  }
};

// 📌 Eliminar un usuario (Solo Admin puede eliminar)
export const deleteUser = async (id: number) => {
  try {
    await db.runAsync(`DELETE FROM users WHERE id = ?`, [id]);
    console.log('✅ Usuario eliminado correctamente.');
    return true;
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);
    return false;
  }
};
