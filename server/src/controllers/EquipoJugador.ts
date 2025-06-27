import { Request, Response } from 'express';
import pool from '../database';
import multer from 'multer';
import path from 'path';
import fs from 'fs';



// Configuración de Multer para almacenar fotos de jugadores
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { nombreClub, categoria, posicion } = req.body;
console.log('Nombre del club:', nombreClub);
console.log('Categoría:', categoria);
    console.log('Datos recibidos en req.body (Multer):', req.body);

    if (!nombreClub || !categoria || !posicion) {
      cb(new Error('El nombre del club y la categoría son obligatorios.'), '');
      return;
    }

    // Sanear nombres para evitar problemas en el sistema de archivos
    const sanitizedClub = nombreClub.replace(/[^a-zA-Z0-9]/g, '_');
    const sanitizedCategory = categoria.replace(/[^a-zA-Z0-9]/g, '_');
    const baseDir = path.join(__dirname, '../../uploads', nombreClub, 'fotos', categoria, posicion);

    // Crear la estructura de carpetas si no existe
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }

    cb(null, baseDir); // Define la carpeta donde se guardarán las fotos
  },
  filename: (req, file, cb) => {
    const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, file.originalname); // Guardar con el nombre original, pero saneado
  },
});

// Configuración de Multer
export const upload = multer({ storage });

// Tipo de solicitud extendida para Multer
interface MulterRequest extends Request {
  file: Express.Multer.File;
}

// Obtener todos los jugadores
export const getJugadores = async (req: Request, res: Response): Promise<void> => {
  try {
    const jugadores = await pool.query('SELECT * FROM jugador');
    res.json({ success: true, jugadores });
  } catch (error) {
    console.error('Error al obtener jugadores:', error);
    res.status(500).json({ success: false, message: 'Error al obtener jugadores.' });
  }
};
export const createJugador = async (req: Request, res: Response): Promise<void> => {
  const { 
    nombre_completo, 
    sexo, 
    fecha_nacimiento, 
    id_equipo, 
    posicion, 
    correo, 
    anios_experiencia,
    ciudad_nacimiento, 
    peso, 
    estatura, 
    amonestaciones, 
    puntos_acumulados,
    nombreClub, 
    categoria,
    pasatiempos, 
    musica_favorita, 
    apodo,
    redes_sociales // Nuevo campo
  } = req.body;

  const file = (req as MulterRequest).file;

  console.log('Datos recibidos en req.body:', req.body);
  console.log('Archivo recibido:', file);

  // Verificar campos obligatorios
  if (!nombre_completo || !sexo || !fecha_nacimiento || !id_equipo || !posicion || !correo || !file || !nombreClub || !categoria) {
    res.status(400).json({ success: false, message: 'Todos los campos obligatorios deben ser proporcionados.' });
    return;
  }

  // Generar la ruta completa del archivo guardado
  const filePath = path.join('/uploads', nombreClub, 'fotos', categoria, posicion, file.filename);

  try {
    // Insertar los datos del jugador en la base de datos
    const result = await pool.query(
      `INSERT INTO jugador 
        (nombre_completo, sexo, fecha_nacimiento, peso, estatura, posicion, foto, ciudad_nacimiento, anios_experiencia, 
         amonestaciones, puntos_acumulados, correo, id_equipo, pasatiempos, musica_favorita, apodo, redes_sociales) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

      [
        nombre_completo, 
        sexo, 
        fecha_nacimiento, 
        peso, 
        estatura, 
        posicion, 
        filePath, 
        ciudad_nacimiento, 
        anios_experiencia, 
        amonestaciones || 0, 
        puntos_acumulados || 0, 
        correo, 
        id_equipo,
        pasatiempos || null, 
        musica_favorita || null, 
        apodo || null,
        redes_sociales || null // Nuevo campo
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Jugador creado exitosamente.',
      jugador: { 
        id_jugador: result.insertId, 
        nombre_completo, 
        sexo, 
        fecha_nacimiento, 
        id_equipo,
        correo, 
        pasatiempos,
        musica_favorita,
        apodo,
        redes_sociales // Incluir el nuevo campo en la respuesta
      },
    });
  } catch (error) {
    console.error('Error al crear el jugador:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor.' });
  }
};


// Actualizar un jugador
export const updateJugador = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { nombre_completo, sexo, fecha_nacimiento, id_equipo } = req.body;

  if (!nombre_completo || !sexo || !fecha_nacimiento || !id_equipo) {
    res.status(400).json({ success: false, message: 'Todos los campos son obligatorios.' });
    return;
  }

  try {
    await pool.query(
      'UPDATE jugador SET nombre_completo = ?, sexo = ?, fecha_nacimiento = ?, id_equipo = ? WHERE id_jugador = ?',
      [nombre_completo, sexo, fecha_nacimiento, id_equipo, id]
    );
    res.json({ success: true, message: 'Jugador actualizado con éxito.' });
  } catch (error) {
    console.error('Error al actualizar jugador:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar el jugador.' });
  }
};

// Eliminar un jugador
export const deleteJugador = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM jugador WHERE id_jugador = ?', [id]);
    res.json({ success: true, message: 'Jugador eliminado con éxito.' });
  } catch (error) {
    console.error('Error al eliminar jugador:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar el jugador.' });
  }


  
};

// Obtener id_equipo basado en id_usuario
export const getIdEquipoByIdUsuario = async (req: Request, res: Response): Promise<void> => {
  const { id_usuario } = req.params;

  if (!id_usuario) {
    res.status(400).json({ success: false, message: 'El id_usuario es obligatorio.' });
    return;
  }

  try {
    // Consulta para obtener el id_equipo basado en el id_usuario
    const result = await pool.query(
      `SELECT e.id_equipo 
       FROM equipo e 
       JOIN usuario u ON e.id_dt = u.id_usuario 
       WHERE u.id_usuario = ?`,
      [id_usuario]
    );

    if (result.length > 0) {
      res.json({ success: true, id_equipo: result[0].id_equipo });
    } else {
      res.status(404).json({ success: false, message: 'No se encontró el equipo para el usuario proporcionado.' });
    }
  } catch (error) {
    console.error('Error al obtener el id_equipo:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor.' });
  }
};

export const getJugadorByPosicionYEquipo = async (req: Request, res: Response): Promise<void> => {
  const { posicion, id_equipo } = req.params;

  if (!posicion || !id_equipo) {
    res.status(400).json({ success: false, message: 'La posición y el id_equipo son obligatorios.' });
    return;
  }

  try {
    const result = await pool.query(
      'SELECT * FROM jugador WHERE posicion = ? AND id_equipo = ?',
      [posicion, id_equipo]
    );

    if (result.length > 0) {
      res.json({ success: true, jugador: result });
    } else {
      res.status(404).json({ success: false, message: 'No se encontraron jugadores con esa posición y equipo.' });
    }
  } catch (error) {
    console.error('Error al obtener el jugador:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor.' });
  }
};
