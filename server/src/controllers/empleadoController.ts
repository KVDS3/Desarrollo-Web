import { Request, Response } from 'express';
import pool from '../database';

interface Empleado {
  id_empleado: number;
  nombre: string;
  apellidos: string;
  id_puesto: number;
  id_sucursal: number;
  usuario: string;
  contrasena: string;
}

export const loginEmpleado = async (req: Request, res: Response) => {
  const { usuario, contrasena } = req.body;

  try {
    // Realizamos la consulta con el pool de conexiones
    const results: Empleado[] = await pool.query(
      'SELECT * FROM empleado WHERE usuario = ? AND contrasena = ?',
      [usuario, contrasena]
    );

    if (results.length > 0) {
      // Si las credenciales son correctas, devolvemos la información del empleado
      const empleado = results[0];
      res.json({ success: true, empleado });
    } else {
      res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
  } catch (error) {
    console.error('Error en la consulta:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
