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
exports.registerClub = exports.upload = void 0;
const database_1 = __importDefault(require("../database"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Configuración de Multer para almacenar logotipos y certificados
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const { nombre } = req.body;
        if (!nombre) {
            cb(new Error('El nombre del club es obligatorio para definir la carpeta.'), '');
            return;
        }
        // Sanear el nombre para evitar problemas en el sistema de archivos
        const sanitizedNombre = nombre.replace(/[^a-zA-Z0-9]/g, '_');
        const baseDir = path_1.default.join(__dirname, '../../uploads', sanitizedNombre);
        const specificDir = path_1.default.join(baseDir, file.fieldname); // Crear subcarpeta según el tipo de archivo
        // Crear la estructura de carpetas si no existe
        if (!fs_1.default.existsSync(specificDir)) {
            fs_1.default.mkdirSync(specificDir, { recursive: true });
        }
        cb(null, specificDir); // Define la subcarpeta para "certificado" o "logotipo"
    },
    filename: (req, file, cb) => {
        const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, sanitizedFileName); // Guardar con el nombre original, pero saneado
    },
});
// Configuración de Multer para manejar múltiples archivos
exports.upload = (0, multer_1.default)({ storage });
// Controlador para registrar un nuevo club
const registerClub = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { nombre, correo } = req.body;
    // Asegúrate de que req sea del tipo MulterRequest para que TypeScript lo reconozca
    const files = req.files;
    // Transformar la ruta almacenada en path relativo a '/uploads/'
    // Transformar la ruta almacenada en path relativo a '/uploads/'
    const transformPath = (filePath) => '/' + filePath.replace(path_1.default.join(__dirname, '../../'), '').replace(/\\/g, '/');
    const certificadoPath = ((_b = (_a = files === null || files === void 0 ? void 0 : files['certificado']) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path)
        ? transformPath(files['certificado'][0].path)
        : null;
    const logotipoPath = ((_d = (_c = files === null || files === void 0 ? void 0 : files['logotipo']) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.path)
        ? transformPath(files['logotipo'][0].path)
        : null;
    if (!nombre || !correo || !certificadoPath || !logotipoPath) {
        res.status(400).json({ success: false, message: 'Todos los campos y archivos son obligatorios.' });
        return;
    }
    try {
        // Insertar el club en la base de datos con estado "pendiente"
        const result = yield database_1.default.query('INSERT INTO club (nombre, correo, certificado, logotipo, estado) VALUES (?, ?, ?, ?, ?)', [nombre, correo, certificadoPath, logotipoPath, 'pendiente']);
        const clubId = result.insertId;
        // Responder con éxito y enviar detalles del club registrado
        res.status(201).json({
            success: true,
            message: 'Registro exitoso. El club está en estado pendiente de aprobación.',
            club: { id_club: clubId, nombre, correo, certificado: certificadoPath, logotipo: logotipoPath, estado: 'pendiente' },
        });
    }
    catch (error) {
        console.error('Error al registrar el club:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ success: false, message: 'El correo ya está registrado.' });
        }
        else {
            res.status(500).json({ success: false, message: 'Error en el servidor.' });
        }
    }
});
exports.registerClub = registerClub;
