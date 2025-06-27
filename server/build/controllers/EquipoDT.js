"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editarEquipoPorCyC = exports.obtenerCategoriasConEquipo = exports.createTeamAndAssignDT = void 0;
const database_1 = __importDefault(require("../database"));
const crypto_1 = require("crypto");
const nodemailer_1 = __importDefault(require("nodemailer"));
// Controlador para crear un equipo y asignar un DT
// Controlador para crear un equipo y asignar un DT
const createTeamAndAssignDT = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const existingTeam = yield database_1.default.query('SELECT * FROM equipo WHERE categoria = ? AND id_club = ?', [categoria, idClub]);
        if (existingTeam.length > 0) {
            res.status(400).json({
                success: false,
                message: `Ya existe un equipo en la categoría "${categoria}" para este club.`,
            });
            return;
        }
        // Generar una contraseña aleatoria para el DT
        const contraseña_dt = (0, crypto_1.randomBytes)(8).toString('hex');
        // Crear un nuevo DT
        const dtResult = yield database_1.default.query('INSERT INTO usuario (nombre, correo, contraseña, rol, id_club) VALUES (?, ?, ?, ?, ?)', [nombre_dt, correo_dt, contraseña_dt, 'dt', idClub]);
        const idDT = dtResult.insertId;
        // Obtener el nombre del club
        const club = yield database_1.default.query('SELECT nombre FROM club WHERE id_club = ?', [idClub]);
        if (club.length === 0) {
            res.status(400).json({
                success: false,
                message: 'El club asociado al usuario no existe.',
            });
            return;
        }
        const nombreClub = club[0].nombre;
        // Crear el equipo
        const equipoResult = yield database_1.default.query('INSERT INTO equipo (nombre, colores, categoria, id_club, id_dt) VALUES (?, ?, ?, ?, ?)', [nombreClub, colores || null, categoria, idClub, idDT]);
        // Enviar correo con las credenciales generadas
        yield enviarCorreoDT(correo_dt, contraseña_dt);
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
    }
    catch (error) {
        console.error('Error al crear equipo y asignar DT:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ success: false, message: 'El correo del DT ya está registrado.' });
        }
        else {
            res.status(500).json({ success: false, message: 'Error en el servidor.' });
        }
    }
});
exports.createTeamAndAssignDT = createTeamAndAssignDT;
// Función para enviar un correo con las credenciales del DT
const enviarCorreoDT = (correo, contraseña) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
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
    yield transporter.sendMail(mensaje);
});
const obtenerCategoriasConEquipo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clubId } = req.params;
    try {
        const result = yield database_1.default.query('SELECT DISTINCT categoria FROM equipo WHERE id_club = ?', [clubId]);
        const categorias = result.map((row) => row.categoria);
        res.status(200).json({ categorias });
    }
    catch (error) {
        console.error('Error al obtener categorías con equipos:', error);
        res.status(500).json({ success: false, message: 'Error al obtener categorías.' });
    }
});
exports.obtenerCategoriasConEquipo = obtenerCategoriasConEquipo;
const editarEquipoPorCyC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_club, categoria } = req.body; // Parámetros para identificar el equipo
    const { colores, id_dt, nombre_dt, correo_dt, contraseña_dt } = req.body;
    try {
        // Verificar si el equipo existe basado en id_club y categoría
        const equipo = yield database_1.default.query('SELECT * FROM equipo WHERE id_club = ? AND categoria = ?', [id_club, categoria]);
        if (equipo.length === 0) {
            res.status(404).json({ success: false, message: 'Equipo no encontrado.' });
            return;
        }
        const id_equipo = equipo[0].id_equipo;
        // Actualizar colores del equipo, si se proporciona
        if (colores) {
            yield database_1.default.query('UPDATE equipo SET colores = ? WHERE id_equipo = ?', [colores, id_equipo]);
        }
        // Verificar y actualizar los datos del DT
        if (id_dt) {
            const dt = yield database_1.default.query('SELECT * FROM usuario WHERE id_usuario = ? AND rol = "dt"', [id_dt]);
            if (dt.length === 0) {
                res.status(404).json({ success: false, message: 'Director técnico no encontrado o inválido.' });
                return;
            }
            // Actualizar los datos del DT
            const updates = [];
            const params = [];
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
                const hashedPassword = yield bcrypt.hash(contraseña_dt, 10);
                updates.push('contraseña = ?');
                params.push(hashedPassword);
            }
            if (updates.length > 0) {
                yield database_1.default.query(`UPDATE usuario SET ${updates.join(', ')} WHERE id_usuario = ?`, [...params, id_dt]);
            }
            // Asociar el equipo con el nuevo DT, si no es el mismo ID
            if (equipo[0].id_dt !== id_dt) {
                yield database_1.default.query('UPDATE equipo SET id_dt = ? WHERE id_equipo = ?', [id_dt, id_equipo]);
            }
        }
        res.status(200).json({
            success: true,
            message: 'Equipo y DT actualizados exitosamente.',
        });
    }
    catch (error) {
        console.error('Error al editar equipo y DT:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
});
exports.editarEquipoPorCyC = editarEquipoPorCyC;
