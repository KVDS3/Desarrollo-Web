import { Request, Response } from 'express';
import pool from '../database';

interface Usuario {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: string;
  id_club: number | null;
}

export const loginUsuario = async (req: Request, res: Response) => {
  const { correo, contraseña } = req.body;

  try {
    const results: Usuario[] = await pool.query(
      'SELECT id_usuario, nombre, correo, rol, id_club FROM usuario WHERE correo = ? AND contraseña = ?',
      [correo, contraseña]
    );

    if (results.length > 0) {
      const usuario = results[0];
      res.json({ success: true, usuario });
    } else {
      res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error en la consulta:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
