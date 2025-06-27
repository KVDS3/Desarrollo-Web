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
exports.loginEmpleado = void 0;
const database_1 = __importDefault(require("../database"));
const loginEmpleado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { usuario, contrasena } = req.body;
    try {
        // Realizamos la consulta con el pool de conexiones
        const results = yield database_1.default.query('SELECT * FROM empleado WHERE usuario = ? AND contrasena = ?', [usuario, contrasena]);
        if (results.length > 0) {
            // Si las credenciales son correctas, devolvemos la información del empleado
            const empleado = results[0];
            res.json({ success: true, empleado });
        }
        else {
            res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
        }
    }
    catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});
exports.loginEmpleado = loginEmpleado;
