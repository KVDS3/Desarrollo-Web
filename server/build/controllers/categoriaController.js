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
exports.obtenerEquipoPorUsuario = exports.validarJugadores = exports.verificarEstadoEquipo = exports.verificarNombreUsuarioEnEquipo = exports.obtenerIdEquipoPorUsuario = exports.obtenerCategoriaPorUsuario = exports.obtenerCategoriaYClub = exports.obtenerCategoriaPorDT = void 0;
const database_1 = __importDefault(require("../database"));
const obtenerCategoriaPorDT = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_dt } = req.params;
    console.log('ID recibido:', id_dt);
    try {
        // Ejecutar consulta a la base de datos
        const rows = yield database_1.default.query('SELECT categoria FROM equipo WHERE id_dt = ? LIMIT 1', [id_dt]);
        console.log('Resultados de la consulta:', rows);
        // Verificar si hay resultados
        if (rows.length > 0) {
            res.status(200).json({ categoria: rows[0].categoria });
        }
        else {
            console.log('No se encontró la categoría para el ID proporcionado.');
            res.status(404).json({ message: 'Categoría no encontrada.' });
        }
    }
    catch (error) {
        console.error('Error al obtener categoría:', error);
        res.status(500).json({ message: 'Error del servidor.' });
    }
});
exports.obtenerCategoriaPorDT = obtenerCategoriaPorDT;
// Controlador para obtener la categoría y nombre del club basado en el DT
const obtenerCategoriaYClub = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_usuario } = req.params;
    try {
        // Verificar si el usuario existe y es un DT
        const usuario = yield database_1.default.query('SELECT id_club FROM usuario WHERE id_usuario = ? AND rol = "dt"', [id_usuario]);
        if (usuario.length === 0) {
            res.status(404).json({ success: false, message: 'Usuario no encontrado o no es un DT.' });
            return;
        }
        const idClub = usuario[0].id_club;
        // Obtener el nombre del club y la categoría del equipo asociado al DT
        const result = yield database_1.default.query(`SELECT c.nombre AS nombre_club, e.categoria 
       FROM club c 
       INNER JOIN equipo e ON c.id_club = e.id_club 
       WHERE e.id_dt = ?`, [id_usuario]);
        if (result.length === 0) {
            res.status(404).json({
                success: false,
                message: 'No se encontró equipo asociado al DT.',
            });
            return;
        }
        const { nombre_club, categoria } = result[0];
        res.status(200).json({
            success: true,
            nombre_club,
            categoria,
        });
    }
    catch (error) {
        console.error('Error al obtener categoría y club:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
});
exports.obtenerCategoriaYClub = obtenerCategoriaYClub;
const obtenerCategoriaPorUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombreUsuario } = req.params;
    console.log('Nombre de usuario recibido:', nombreUsuario);
    try {
        // Consulta para obtener la categoría del equipo basado en el nombre del usuario
        const query = `
      SELECT 
        equipo.categoria
      FROM 
        usuario
      INNER JOIN 
        club ON usuario.id_club = club.id_club
      INNER JOIN 
        equipo ON club.id_club = equipo.id_club
      WHERE 
        usuario.nombre = ?;
    `;
        const rows = yield database_1.default.query(query, [nombreUsuario]);
        console.log('Resultados de la consulta:', rows);
        if (rows.length > 0) {
            res.status(200).json({
                success: true,
                categoria: rows[0].categoria,
            });
        }
        else {
            console.log('No se encontró el usuario o no tiene un equipo asociado.');
            res.status(404).json({
                success: false,
                message: 'No se encontró el usuario o no tiene un equipo asociado.',
            });
        }
    }
    catch (error) {
        console.error('Error al obtener la categoría del equipo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la categoría del equipo.',
        });
    }
});
exports.obtenerCategoriaPorUsuario = obtenerCategoriaPorUsuario;
const obtenerIdEquipoPorUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombreUsuario } = req.params;
    console.log('Nombre de usuario recibido:', nombreUsuario);
    try {
        // Consulta para obtener el id_equipo basado en el nombre del usuario (que es el nombre del equipo)
        const query = `
        SELECT e.id_equipo
        FROM equipo e
        INNER JOIN usuario u ON e.nombre = u.nombre
        WHERE u.nombre = ?;
      `;
        const rows = yield database_1.default.query(query, [nombreUsuario]);
        console.log('Resultados de la consulta:', rows);
        if (rows.length > 0) {
            res.status(200).json({
                success: true,
                id_equipo: rows[0].id_equipo,
            });
        }
        else {
            console.log('No se encontró el equipo asociado al usuario.');
            res.status(404).json({
                success: false,
                message: 'No se encontró el equipo asociado al usuario.',
            });
        }
    }
    catch (error) {
        console.error('Error al obtener el id_equipo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el id_equipo.',
        });
    }
});
exports.obtenerIdEquipoPorUsuario = obtenerIdEquipoPorUsuario;
const verificarNombreUsuarioEnEquipo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombreUsuario } = req.params;
    console.log('Nombre de usuario recibido:', nombreUsuario);
    try {
        // Consulta para verificar si el nombre de usuario existe en la tabla equipo
        const query = `
          SELECT COUNT(*) AS count
          FROM equipo
          WHERE nombre = ?;
        `;
        const rows = yield database_1.default.query(query, [nombreUsuario]);
        console.log('Resultados de la consulta:', rows);
        if (rows[0].count > 0) {
            res.status(200).json({
                success: true,
                message: 'El nombre de usuario existe como nombre de equipo.',
            });
        }
        else {
            console.log('No se encontró un equipo con el nombre de usuario.');
            res.status(404).json({
                success: false,
                message: 'No se encontró un equipo con el nombre de usuario.',
            });
        }
    }
    catch (error) {
        console.error('Error al verificar nombre de usuario en equipo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al verificar nombre de usuario en equipo.',
        });
    }
});
exports.verificarNombreUsuarioEnEquipo = verificarNombreUsuarioEnEquipo;
const verificarEstadoEquipo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield database_1.default.query('SELECT estado FROM equipo WHERE id_equipo = ?', [id]);
        if (result.length === 0) {
            res.status(404).json({
                success: false,
                message: 'Equipo no encontrado',
            });
            return;
        }
        const { estado } = result[0];
        const esPendiente = estado === 'pendiente';
        res.json({
            success: true,
            esPendiente,
        });
    }
    catch (error) {
        console.error('Error al verificar el estado del equipo:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al verificar el estado del equipo',
        });
    }
});
exports.verificarEstadoEquipo = verificarEstadoEquipo;
const nodemailer_1 = __importDefault(require("nodemailer"));
const validarJugadores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params; // id del equipo
    try {
        // Llamar al procedimiento almacenado para validar los jugadores y actualizar el estado
        yield database_1.default.query('CALL ValidarJugadoresRegistrados(?);', [id]);
        // Verificar el estado del equipo
        const [equipo] = yield database_1.default.query('SELECT estado FROM equipo WHERE id_equipo = ?', [id]);
        const estado = (_a = equipo[0]) === null || _a === void 0 ? void 0 : _a.estado; // Obtener el estado del equipo
        if (estado === 'pendiente') {
            res.status(400).json({ success: false, message: 'El equipo no cumple con los requisitos mínimos.' });
            return;
        }
        // Si el equipo es aprobado, generar los folios y enviar correos
        const jugadores = yield database_1.default.query('SELECT id_jugador, nombre_completo, correo FROM jugador WHERE id_equipo = ?', [id]);
        const equipoData = yield database_1.default.query('SELECT nombre FROM equipo WHERE id_equipo = ?', [id]);
        const nombreEquipo = equipoData[0].nombre;
        const equipoId = id.toString().padStart(3, '0'); // Convertir el ID del equipo a 3 dígitos
        const folios = [];
        jugadores.forEach((jugador, index) => {
            const primerNombre = jugador.nombre_completo.split(' ')[0];
            const consecutivoJugador = (index + 1).toString().padStart(3, '0');
            const folio = `${nombreEquipo}-${equipoId}-${primerNombre}-${consecutivoJugador}`;
            folios.push({
                id_jugador: jugador.id_jugador,
                folio,
                correo: jugador.correo,
            });
        });
        // Guardar los folios en la base de datos
        for (const { id_jugador, folio } of folios) {
            yield database_1.default.query('INSERT INTO folio_jugador (folio, id_jugador) VALUES (?, ?)', [folio, id_jugador]);
        }
        // Configurar el transporte para enviar correos
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: 'mitsimy@gmail.com', // Cambiar por tu correo
                pass: 'nxkl umfw mmho geaa', // Cambiar por tu contraseña
            },
        });
        // Enviar correos a los jugadores
        for (const { correo, folio } of folios) {
            const mensaje = {
                from: 'mitsimy@gmail.com',
                to: correo,
                subject: 'Folio de Participación en la Liga Deportiva',
                html: `
              <h2>¡Gracias por registrarte!</h2>
              <p>Tu participación ha sido confirmada con el siguiente folio:</p>
              <p><b>${folio}</b></p>
              <p>Este folio es único y será utilizado para identificarte dentro de la liga.</p>
            `,
            };
            yield transporter.sendMail(mensaje);
        }
        res.json({
            success: true,
            message: 'El equipo es válido y se generaron los folios. Correos enviados exitosamente.',
        });
    }
    catch (error) {
        console.error('Error al validar jugadores:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al validar jugadores',
        });
    }
});
exports.validarJugadores = validarJugadores;
const obtenerEquipoPorUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombreUsuario } = req.params; // nombre del usuario que corresponde al nombre del equipo
    try {
        // Consultar la información del equipo y el nombre del DT
        const resultado = yield database_1.default.query(`SELECT 
            e.id_equipo, 
            e.nombre AS nombre_equipo, 
            e.colores, 
            e.categoria, 
            e.juegos_ganados, 
            e.juegos_perdidos, 
            e.cantidad_amonestaciones, 
            e.estado,
            dt.nombre AS nombre_dt
          FROM 
            equipo e
          JOIN 
            usuario u ON e.id_club = u.id_club
          LEFT JOIN 
            usuario dt ON e.id_dt = dt.id_usuario
          WHERE 
            u.nombre = ?`, [nombreUsuario]);
        // Verificar la estructura de los resultados
        console.log('Resultado de la consulta:', resultado);
        if (resultado.length === 0) {
            res.status(404).json({ success: false, message: 'Equipo no encontrado para el usuario proporcionado.' });
            return;
        }
        // Retornamos los datos del equipo obtenidos
        res.json({
            success: true,
            equipo: resultado[0], // Devolvemos la primera fila de los resultados
            mensaje: 'Equipo encontrado correctamente',
        });
    }
    catch (error) {
        console.error('Error al obtener el equipo:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al obtener la información del equipo',
        });
    }
});
exports.obtenerEquipoPorUsuario = obtenerEquipoPorUsuario;
