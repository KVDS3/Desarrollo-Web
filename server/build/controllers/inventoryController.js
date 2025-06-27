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
const database_1 = __importDefault(require("../database")); // Ajusta la ruta según la estructura de tu proyecto
const database_2 = __importDefault(require("../database")); // Asegúrate de que la ruta sea correcta
class AlmacenController {
    // Listar todos los productos
    listProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productos = yield database_1.default.query('SELECT * FROM producto');
                res.json(productos);
            }
            catch (error) {
                res.status(500).json({ message: 'Error al obtener los productos', error });
            }
        });
    }
    // Listar todas las categorías
    listCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categorias = yield database_1.default.query('SELECT * FROM categoria_producto');
                res.json(categorias);
            }
            catch (error) {
                res.status(500).json({ message: 'Error al obtener las categorías', error });
            }
        });
    }
    // Obtener el precio de un producto por su ID
    getPrecio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const precio = yield database_1.default.query('SELECT precio FROM producto WHERE id_producto = ?', [id]);
                if (precio.length > 0) {
                    res.json(precio[0]);
                }
                else {
                    res.status(404).json({ message: 'Producto no encontrado' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Error al obtener el precio', error });
            }
        });
    }
    // Obtener el estado de un producto por su ID
    getEstado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const estado = yield database_1.default.query('SELECT estado FROM producto WHERE id_producto = ?', [id]);
                if (estado.length > 0) {
                    res.json(estado[0]);
                }
                else {
                    res.status(404).json({ message: 'Producto no encontrado' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Error al obtener el estado', error });
            }
        });
    }
    filterProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoria, precio, estado } = req.query;
                // Consulta SQL básica con filtros opcionales
                let query = 'SELECT * FROM producto WHERE 1=1';
                const params = [];
                if (categoria) {
                    query += ' AND id_categoria = ?';
                    params.push(categoria);
                }
                if (precio) {
                    query += ' AND precio <= ?';
                    params.push(precio);
                }
                if (estado) {
                    query += ' AND estado = ?';
                    params.push(estado);
                }
                const productos = yield database_1.default.query(query, params);
                res.json(productos);
            }
            catch (error) {
                res.status(500).json({ message: 'Error al filtrar los productos', error });
            }
        });
    }
    //CRUD
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productos = yield database_1.default.query('SELECT * FROM producto');
            res.json(productos);
        });
    }
    getOne(req, res) {
        res.json({ text: 'This is the game' + req.params.id });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query('INSERT INTO producto set ?', [req.body]);
            res.json({ messsage: 'Product saved' });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { nombre, descripcion, id_categoria, precio, estado, qr } = req.body; // Asegúrate de que solo sean campos válidos de la tabla producto
                // Actualiza solo los campos de producto
                const updatedProduct = { nombre, descripcion, id_categoria, precio, estado, qr };
                yield database_2.default.query('UPDATE producto SET ? WHERE id_producto = ?', [updatedProduct, id]);
                res.json({ message: 'Product updated' });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error updating product' });
            }
        });
    }
    deleate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield database_2.default.query('DELETE FROM producto WHERE id_producto = ?', [id]);
                res.json({ message: 'Product deleted' });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error deleting product' });
            }
        });
    }
}
const almacenController = new AlmacenController();
exports.default = almacenController;
