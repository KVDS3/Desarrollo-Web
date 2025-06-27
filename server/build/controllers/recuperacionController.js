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
exports.cambiarContrasena = exports.enviarCodigo = void 0;
const database_1 = __importDefault(require("../database"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const codigos = new Map();
const enviarCodigo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo } = req.body;
    const usuarios = yield database_1.default.query('SELECT * FROM usuario WHERE correo = ?', [correo]);
    if (!usuarios || usuarios.length === 0) {
        res.json({ success: false, message: 'Correo no registrado' });
        return;
    }
    const codigo = Math.floor(1000 + Math.random() * 9000).toString();
    codigos.set(correo, codigo);
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: 'mitsimy@gmail.com',
            pass: 'nxkl umfw mmho geaa',
        },
    });
    const mensaje = {
        from: 'mitsimy@gmail.com',
        to: correo,
        subject: 'Recuperación de Contraseña',
        html: `<p>Tu código de verificación es: <b>${codigo}</b></p>`,
    };
    yield transporter.sendMail(mensaje);
    res.json({ success: true, codigo });
});
exports.enviarCodigo = enviarCodigo;
const cambiarContrasena = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, contrasena } = req.body;
    yield database_1.default.query('UPDATE usuario SET contraseña = ? WHERE correo = ?', [contrasena, correo]);
    res.json({ success: true, message: 'Contraseña actualizada' });
});
exports.cambiarContrasena = cambiarContrasena;
