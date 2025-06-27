import { Request, Response } from 'express';
import pool from '../database';
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';

// Controlador para crear un equipo y asignar un DT
// Controlador para crear un equipo y asignar un DT
export const createTeamAndAssignDT = async (req: Request, res: Response): Promise<void> => {
  const { nombre_dt, correo_dt, categoria, colores, usuario } = req.body;

  if (!usuario || !usuario.id_club) {
    res.status(400).json({
      success: false,
      message: 'Usuario no autenticado o no tiene un club asignado.',
    });
    return;
  }

  const idClub = usuario.id_club;

  if (!nombre_dt || !correo_dt || !categoria) {
    res.status(400).json({
      success: false,
      message: 'Todos los campos (nombre_dt, correo_dt, categoria) son obligatorios.',
    });
    return;
  }

  try {
    // Verificar si ya existe un equipo en esa categoría para el club
    const existingTeam = await pool.query(
      'SELECT * FROM equipo WHERE categoria = ? AND id_club = ?',
      [categoria, idClub]
    );

    if (existingTeam.length > 0) {
      res.status(400).json({
        success: false,
        message: `Ya existe un equipo en la categoría "${categoria}" para este club.`,
      });
      return;
    }

    // Generar una contraseña aleatoria para el DT
    const contraseña_dt = randomBytes(8).toString('hex');

    // Crear un nuevo DT
    const dtResult = await pool.query(
      'INSERT INTO usuario (nombre, correo, contraseña, rol, id_club) VALUES (?, ?, ?, ?, ?)',
      [nombre_dt, correo_dt, contraseña_dt, 'dt', idClub]
    );
    const idDT = dtResult.insertId;

    // Obtener el nombre del club
    const club = await pool.query('SELECT nombre FROM club WHERE id_club = ?', [idClub]);
    if (club.length === 0) {
      res.status(400).json({
        success: false,
        message: 'El club asociado al usuario no existe.',
      });
      return;
    }
    const nombreClub = club[0].nombre;

    // Crear el equipo
    const equipoResult = await pool.query(
      'INSERT INTO equipo (nombre, colores, categoria, id_club, id_dt) VALUES (?, ?, ?, ?, ?)',
      [nombreClub, colores || null, categoria, idClub, idDT]
    );

    // Enviar correo con las credenciales generadas
    await enviarCorreoDT(correo_dt, contraseña_dt);

    res.status(201).json({
      success: true,
      message: 'Equipo y DT creados exitosamente. Credenciales enviadas al correo.',
      equipo: {
        id_equipo: equipoResult.insertId,
        nombre: nombreClub,
        categoria,
        colores: colores || null,
        id_club: idClub,
        id_dt: idDT,
      },
      dt: {
        id_dt: idDT,
        nombre: nombre_dt,
        correo: correo_dt,
      },
    });
  } catch (error) {
    console.error('Error al crear equipo y asignar DT:', error);

    if ((error as any).code === 'ER_DUP_ENTRY') {
      res.status(400).json({ success: false, message: 'El correo del DT ya está registrado.' });
    } else {
      res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
  }
};

// Función para enviar un correo con las credenciales del DT
const enviarCorreoDT = async (correo: string, contraseña: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mitsimy@gmail.com', // Cambiar por tu correo
      pass: 'nxkl umfw mmho geaa', // Cambiar por tu contraseña o app password
    },
  });

  const mensaje = {
    from: 'mitsimy@gmail.com',
    to: correo,
    subject: 'Cuenta de Director Técnico Creada',
    html: `
      <h2>Bienvenido a la plataforma</h2>
      <p>Su cuenta de Director Técnico ha sido creada con éxito. Aquí están sus credenciales:</p>
      <ul>
        <li><b>Correo:</b> ${correo}</li>
        <li><b>Contraseña:</b> ${contraseña}</li>
      </ul>
      <p>Por favor, cambie su contraseña después de iniciar sesión.</p>
    `,
  };

  await transporter.sendMail(mensaje);
};

export const obtenerCategoriasConEquipo = async (req: Request, res: Response): Promise<void> => {
  const { clubId } = req.params;

  try {
    const result = await pool.query(
      'SELECT DISTINCT categoria FROM equipo WHERE id_club = ?',
      [clubId]
    );
    const categorias = result.map((row: any) => row.categoria);

    res.status(200).json({ categorias });
  } catch (error) {
    console.error('Error al obtener categorías con equipos:', error);
    res.status(500).json({ success: false, message: 'Error al obtener categorías.' });
  }

  
};  


export const editarEquipoPorCyC = async (req: Request, res: Response): Promise<void> => {
  const { id_club, categoria } = req.body; // Parámetros para identificar el equipo
  const { colores, id_dt, nombre_dt, correo_dt, contraseña_dt } = req.body;

  try {
    // Verificar si el equipo existe basado en id_club y categoría
    const equipo = await pool.query(
      'SELECT * FROM equipo WHERE id_club = ? AND categoria = ?',
      [id_club, categoria]
    );

    if (equipo.length === 0) {
      res.status(404).json({ success: false, message: 'Equipo no encontrado.' });
      return;
    }

    const id_equipo = equipo[0].id_equipo;

    // Actualizar colores del equipo, si se proporciona
    if (colores) {
      await pool.query('UPDATE equipo SET colores = ? WHERE id_equipo = ?', [colores, id_equipo]);
    }

    // Verificar y actualizar los datos del DT
    if (id_dt) {
      const dt = await pool.query('SELECT * FROM usuario WHERE id_usuario = ? AND rol = "dt"', [id_dt]);
      if (dt.length === 0) {
        res.status(404).json({ success: false, message: 'Director técnico no encontrado o inválido.' });
        return;
      }

      // Actualizar los datos del DT
      const updates: string[] = [];
      const params: any[] = [];

      if (nombre_dt) {
        updates.push('nombre = ?');
        params.push(nombre_dt);
      }
      if (correo_dt) {
        updates.push('correo = ?');
        params.push(correo_dt);
      }
      if (contraseña_dt) {
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(contraseña_dt, 10);
        updates.push('contraseña = ?');
        params.push(hashedPassword);
      }

      if (updates.length > 0) {
        await pool.query(`UPDATE usuario SET ${updates.join(', ')} WHERE id_usuario = ?`, [...params, id_dt]);
      }

      // Asociar el equipo con el nuevo DT, si no es el mismo ID
      if (equipo[0].id_dt !== id_dt) {
        await pool.query('UPDATE equipo SET id_dt = ? WHERE id_equipo = ?', [id_dt, id_equipo]);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Equipo y DT actualizados exitosamente.',
    });
  } catch (error) {
    console.error('Error al editar equipo y DT:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor.' });
  }
};
