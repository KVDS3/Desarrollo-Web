"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ventaController_1 = __importDefault(require("../controllers/ventaController"));
class VentaRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', ventaController_1.default.list); // Listar todas las ventas
        this.router.get('/:id', ventaController_1.default.getOne); // Obtener una venta específica por ID
        this.router.post('/ventas', ventaController_1.default.create);
        this.router.post('/pago-efectivo', ventaController_1.default.pagoEfectivo); // Procesar pago en efectivo
        this.router.post('/pago-tarjeta', ventaController_1.default.pagoTarjeta); // Procesar pago con tarjeta
        this.router.post('/validar-tarjeta', ventaController_1.default.validarTarjeta);
        this.router.post('/abrir', ventaController_1.default.abrirCaja);
        this.router.post('/cerrar', ventaController_1.default.cerrarCaja);
    }
}
const ventaRoutes = new VentaRoutes();
exports.default = ventaRoutes.router;
