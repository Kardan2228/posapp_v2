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

// 📌 Crear o actualizar la tabla users
export const setupDatabaseUsers = async () => {
    try {
        console.log('📌 Inicializando base de datos de usuarios...');

        // Obtener información de la tabla
        const tableInfo: TableInfo[] = await db.getAllAsync('PRAGMA table_info(users);');
        const columns = tableInfo.map((col: TableInfo) => col.name);

        // Si la tabla no existe, crearla
        if (columns.length === 0) {
            await db.execAsync(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL CHECK(role IN ('admin', 'vendedor')),
                profile_image TEXT DEFAULT NULL,
                status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'banned')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`);
            console.log('✅ Tabla de usuarios creada correctamente.');
        } else {
            // Si la tabla existe pero no tiene las nuevas columnas, añadirlas
            if (!columns.includes('profile_image')) {
                await db.execAsync(`ALTER TABLE users ADD COLUMN profile_image TEXT DEFAULT NULL;`);
                console.log('✅ Columna profile_image añadida.');
            }
            if (!columns.includes('status')) {
                await db.execAsync(`ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'banned'));`);
                console.log('✅ Columna status añadida.');
            }
        }

        // 🔹 Verificar si SuperAdmin ya existe
        const users: any[] = await db.getAllAsync('SELECT * FROM users;');
        if (users.length === 0) {
            console.log('⚠️ No hay usuarios, creando SuperAdmin...');
            const defaultPassword = 'admin123'; // Sin hashing
            await db.runAsync(
                `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?);`,
                ['SuperAdmin', 'admin@posapp.com', defaultPassword, 'admin']
            );
            console.log('✅ SuperAdmin creado.');
        }

    } catch (error: any) {
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
export const registerUser = async (
    name: string,
    email: string,
    password: string,
    role: 'admin' | 'vendedor',
    profile_image: string | null,
    status: 'active' | 'inactive' | 'banned'
  ) => {
    try {
      await db.runAsync(
        `INSERT INTO users (name, email, password, role, profile_image, status) VALUES (?, ?, ?, ?, ?, ?);`,
        [name, email, password, role, profile_image, status]
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
export const getUsers = async (): Promise<{ 
    id: number; 
    name: string; 
    email: string; 
    role: string; 
    profile_image?: string 
}[]> => {
    try {
        const users = await db.getAllAsync('SELECT id, name, email, role, profile_image FROM users;');
        return users as { id: number; name: string; email: string; role: string; profile_image?: string }[];
    } catch (error) {
        console.error('❌ Error al obtener usuarios:', error);
        return [];
    }
};

// 📌 Obtener un usuario por ID con `profile_image`
export const getUserById = async (id: number) => {
    try {
        const user = await db.getFirstAsync(`
            SELECT id, name, email, role, profile_image, created_at
            FROM users WHERE id = ?;
        `, [id]);

        // 🔹 Si el usuario no existe, devolver un objeto con valores por defecto
        if (!user) {
            return { id: -1, name: 'Usuario desconocido', email: '', role: 'vendedor', profile_image: null, created_at: '' };
        }

        return user;
    } catch (error) {
        console.error('❌ Error al obtener usuario:', error);
        return null;
    }
};

// 📌 Actualizar un usuario (Solo Admin puede modificar)
export const updateUser = async (
    id: number,
    name: string,
    email: string,
    role: 'admin' | 'vendedor',
    profile_image: string | null,
    status: 'active' | 'inactive' | 'banned'
) => {
    try {
        await db.runAsync(
            `UPDATE users SET name = ?, email = ?, role = ?, profile_image = ?, status = ? WHERE id = ?`,
            [name, email, role, profile_image, status, id]
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