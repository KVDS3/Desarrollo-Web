import mysql from 'promise-mysql';
import keys from './keys';

const pool = mysql.createPool(keys.database);

async function connectToDatabase() {
    try {
        const connection = await pool.getConnection(); // Obtener la conexión del pool
        pool.releaseConnection(connection); // Liberar la conexión de vuelta al pool
        console.log('DB is connected');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

connectToDatabase(); // Llamar a la función de conexión

export default pool;
