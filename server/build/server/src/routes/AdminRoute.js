"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Admin_1 = __importDefault(require("../controllers/Admin"));
const router = (0, express_1.Router)();
// Ruta para listar solicitudes de clubes
router.get('/solicitudes', Admin_1.default.listarSolicitudes);
// Ruta para aprobar un club
router.post('/aprobar/:id_club', Admin_1.default.aprobarClub);
// Ruta para eliminar un club
router.delete('/eliminar/:id_club', Admin_1.default.eliminarClub);
exports.default = router;
