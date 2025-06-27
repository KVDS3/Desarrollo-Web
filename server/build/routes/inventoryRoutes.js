"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inventoryController_1 = __importDefault(require("../controllers/inventoryController"));
class InventoryRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/products', inventoryController_1.default.listProducts); // Listar todos los productos
        this.router.get('/categories', inventoryController_1.default.listCategories); // Listar todas las categorías
        this.router.get('/precio/:id', inventoryController_1.default.getPrecio); // Obtener precio por ID
        this.router.get('/estado/:id', inventoryController_1.default.getEstado); // Obtener estado por ID
        this.router.get('/listado', inventoryController_1.default.listProducts);
        this.router.get('/filter', inventoryController_1.default.filterProducts);
        this.router.get('/', inventoryController_1.default.list);
        this.router.get('/:id', inventoryController_1.default.getOne);
        this.router.post('/', inventoryController_1.default.create);
        this.router.put('/:id', inventoryController_1.default.update);
        this.router.delete('/:id', inventoryController_1.default.deleate);
    }
}
// Inicializa la clase para asegurarte de que se configuren las rutas
const inventoryRoutes = new InventoryRoutes();
exports.default = inventoryRoutes.router;
