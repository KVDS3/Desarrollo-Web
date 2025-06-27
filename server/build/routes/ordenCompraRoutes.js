"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ordenCompraController_1 = __importDefault(require("../controllers/ordenCompraController"));
const ordenCompraController_2 = __importDefault(require("../controllers/ordenCompraController"));
class OrdenCompraRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/outOfStock', ordenCompraController_1.default.getOutOfStockProducts); // Productos agotados
        this.router.get('/orders', ordenCompraController_1.default.getOrders); // Consultar órdenes
        this.router.post('/order', ordenCompraController_1.default.create); // Crear nueva orden
        this.router.delete('/order/:id_orden', ordenCompraController_1.default.delete); // Eliminar orden
        this.router.put('/order/:id_orden', ordenCompraController_1.default.update); // Actualizar orden
        this.router.post('/send-order-email', ordenCompraController_2.default.sendOrderEmail); // Ruta para enviar el correo con la orden de compra
    }
}
exports.default = new OrdenCompraRoutes().router;
