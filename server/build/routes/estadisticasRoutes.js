"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const estadisticasController_1 = __importDefault(require("../controllers/estadisticasController"));
class EstadisticasRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        // Rutas con parámetros opcionales para filtrar por método de pago y fecha
        this.router.get('/metodo', estadisticasController_1.default.obtenerVentasPorMetodo);
        this.router.get('/dia', estadisticasController_1.default.obtenerVentasPorDia);
        this.router.get('/historialCaja', estadisticasController_1.default.obtenerHistorialCaja);
        this.router.get('/id-empleado', estadisticasController_1.default.obtenerIdEmpleadoPorNombre);
    }
}
const estadisticasRoutes = new EstadisticasRoutes();
exports.default = estadisticasRoutes.router;
