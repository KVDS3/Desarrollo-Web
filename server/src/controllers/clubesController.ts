import { Request, Response } from 'express';
import pool from '../database';

// Obtener información de un club por su ID
export const getClubById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const club = await pool.query('SELECT * FROM club WHERE id_club = ?', [id]);

    if (club.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Club no encontrado',
      });
      return;
    }

    const { id_club, nombre, correo, certificado, estado, logotipo } = club[0];
    res.json({
      success: true,
      club: {
        id_club,
        nombre,
        correo,
        certificado,
        estado,
        logotipo,
      },
    });
  } catch (error) {
    console.error('Error al obtener el club:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor al obtener el club',
    });
  }
};
