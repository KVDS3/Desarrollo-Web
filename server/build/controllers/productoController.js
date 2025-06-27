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
const database_1 = __importDefault(require("../database")); // Asegúrate de que la ruta sea correcta
class ProductoController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productos = yield database_1.default.query(`
            SELECT p.*, c.nombre_categoria
            FROM producto p
            JOIN categoria_producto c ON p.id_categoria = c.id_categoria
        `);
            res.json(productos);
        });
    }
    getOne(req, res) {
        res.json({ text: 'This is the game ' + req.params.id });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Datos recibidos en el POST:', req.body); // Esto imprime los datos recibidos
                const { nombre, descripcion, id_categoria, precio, estado, qr } = req.body;
                const newProduct = { nombre, descripcion, id_categoria, precio, estado, qr };
                yield database_1.default.query('INSERT INTO producto SET ?', [newProduct]);
                res.json({ message: 'Product saved' });
            }
            catch (error) {
                console.error(error); // Esto imprimirá errores si algo falla
                res.status(500).json({ message: 'Error saving product' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { nombre, descripcion, id_categoria, precio, estado, qr } = req.body; // Asegúrate de que solo sean campos válidos de la tabla producto
                // Actualiza solo los campos de producto
                const updatedProduct = { nombre, descripcion, id_categoria, precio, estado, qr };
                yield database_1.default.query('UPDATE producto SET ? WHERE id_producto = ?', [updatedProduct, id]);
                res.json({ message: 'Product updated' });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error updating product' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield database_1.default.query('DELETE FROM producto WHERE id_producto = ?', [id]);
                res.json({ message: 'Product deleted' });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error deleting product' });
            }
        });
    }
    buscarProductoPorQr(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { qr } = req.params; // Obtenemos el QR de los parámetros de la solicitud
                const productos = yield database_1.default.query(`
                SELECT p.*, c.nombre_categoria
                FROM producto p
                JOIN categoria_producto c ON p.id_categoria = c.id_categoria
                WHERE p.qr = ?`, [qr]);
                if (productos.length > 0) {
                    res.json(productos[0]); // Retornamos el primer producto encontrado
                }
                else {
                    res.status(404).json({ message: 'Producto no encontrado' });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error al buscar producto por QR' });
            }
        });
    }
}
const productoController = new ProductoController();
exports.default = productoController;
