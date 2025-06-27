import { Request, Response } from 'express';
import pool from '../database';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuración de Multer para almacenar logotipos y certificados
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { nombre } = req.body;

    if (!nombre) {
      cb(new Error('El nombre del club es obligatorio para definir la carpeta.'), '');
      return;
    }

    // Sanear el nombre para evitar problemas en el sistema de archivos
    const sanitizedNombre = nombre.replace(/[^a-zA-Z0-9]/g, '_');
    const baseDir = path.join(__dirname, '../../uploads', sanitizedNombre);
    const specificDir = path.join(baseDir, file.fieldname); // Crear subcarpeta según el tipo de archivo

    // Crear la estructura de carpetas si no existe
    if (!fs.existsSync(specificDir)) {
      fs.mkdirSync(specificDir, { recursive: true });
    }

    cb(null, specificDir); // Define la subcarpeta para "certificado" o "logotipo"
  },
  filename: (req, file, cb) => {
    const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, sanitizedFileName); // Guardar con el nombre original, pero saneado
  },
});

// Configuración de Multer para manejar múltiples archivos
export const upload = multer({ storage });

// Define el tipo específico para los archivos en `req.files`
interface MulterRequest extends Request {
  files: {
    [fieldname: string]: Express.Multer.File[];
  };
}

// Controlador para registrar un nuevo club
export const registerClub = async (req: Request, res: Response): Promise<void> => {
  const { nombre, correo } = req.body;

  // Asegúrate de que req sea del tipo MulterRequest para que TypeScript lo reconozca
  const files = (req as MulterRequest).files;

  // Transformar la ruta almacenada en path relativo a '/uploads/'
// Transformar la ruta almacenada en path relativo a '/uploads/'
const transformPath = (filePath: string) =>
  '/' + filePath.replace(path.join(__dirname, '../../'), '').replace(/\\/g, '/');


  const certificadoPath = files?.['certificado']?.[0]?.path
    ? transformPath(files['certificado'][0].path)
    : null;

  const logotipoPath = files?.['logotipo']?.[0]?.path
    ? transformPath(files['logotipo'][0].path)
    : null;

  if (!nombre || !correo || !certificadoPath || !logotipoPath) {
    res.status(400).json({ success: false, message: 'Todos los campos y archivos son obligatorios.' });
    return;
  }

  try {
    // Insertar el club en la base de datos con estado "pendiente"
    const result = await pool.query(
      'INSERT INTO club (nombre, correo, certificado, logotipo, estado) VALUES (?, ?, ?, ?, ?)',
      [nombre, correo, certificadoPath, logotipoPath, 'pendiente']
    );

    const clubId = result.insertId;

    // Responder con éxito y enviar detalles del club registrado
    res.status(201).json({
      success: true,
      message: 'Registro exitoso. El club está en estado pendiente de aprobación.',
      club: { id_club: clubId, nombre, correo, certificado: certificadoPath, logotipo: logotipoPath, estado: 'pendiente' },
    });
  } catch (error) {
    console.error('Error al registrar el club:', error);
    if ((error as any).code === 'ER_DUP_ENTRY') {
      res.status(400).json({ success: false, message: 'El correo ya está registrado.' });
    } else {
      res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
  }
};
