"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoriaProductoController_1 = __importDefault(require("../controllers/categoriaProductoController"));
class CategoriaProductoRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        // Rutas para productos
        this.router.get('/', categoriaProductoController_1.default.list);
        this.router.get('/:id', categoriaProductoController_1.default.getOne);
        this.router.post('/', categoriaProductoController_1.default.create);
        this.router.put('/:id', categoriaProductoController_1.default.update);
        this.router.delete('/:id', categoriaProductoController_1.default.delete); // Corregido 'delete'
    }
}
const categoriaProductoRoutes = new CategoriaProductoRoutes();
exports.default = categoriaProductoRoutes.router;
