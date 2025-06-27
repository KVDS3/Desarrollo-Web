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
const database_1 = __importDefault(require("../database"));
const nodemailer_1 = __importDefault(require("nodemailer"));
class OrderController {
    // Obtener todas las órdenes con el nombre del proveedor
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield database_1.default.query(`
            SELECT ocp.*, p.nombre_proveedor, prod.precio AS precio_producto
            FROM orden_compra_productos AS ocp
            JOIN proveedor AS p ON ocp.id_proveedor = p.id_proveedor
            JOIN producto AS prod ON ocp.id_producto = prod.id_producto

            `);
                res.json(orders);
            }
            catch (error) {
                res.status(500).json({ message: 'Error al obtener órdenes', error });
            }
        });
    }
    // Obtener una orden específica por ID
    getOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Realizamos la consulta para obtener todas las órdenes de compra
                const orders = yield database_1.default.query('SELECT * FROM orden_compra_productos');
                // Verificamos si se encontraron órdenes
                if (orders.length > 0) {
                    res.json(orders); // Devolvemos las órdenes encontradas en formato JSON
                }
                else {
                    res.status(404).json({ message: 'No se encontraron órdenes de compra' });
                }
            }
            catch (error) {
                console.error('Error al obtener las órdenes de compra:', error);
                res.status(500).json({ message: 'Error al obtener las órdenes de compra' });
            }
        });
    }
    // Crear una nueva orden de compra
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_producto, id_proveedor, fecha, cantidad } = req.body;
                yield database_1.default.query('INSERT INTO orden_compra_productos (id_producto, id_proveedor, fecha, cantidad, estado) VALUES (?, ?, ?, ?, "pendiente")', [id_producto, id_proveedor, fecha, cantidad]);
                res.json({ message: 'Orden creada correctamente' });
            }
            catch (error) {
                res.status(500).json({ message: 'Error al crear la orden' });
            }
        });
    }
    // Actualizar una orden de compra
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_orden } = req.params;
                const { cantidad, estado } = req.body;
                yield database_1.default.query('UPDATE orden_compra_productos SET cantidad = ?, estado = ? WHERE id_orden = ?', [cantidad, estado, id_orden]);
                res.json({ message: 'Orden actualizada correctamente' });
            }
            catch (error) {
                res.status(500).json({ message: 'Error al actualizar la orden' });
            }
        });
    }
    // Eliminar una orden de compra
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_orden } = req.params;
                yield database_1.default.query('DELETE FROM orden_compra_productos WHERE id_orden = ?', [id_orden]);
                res.json({ message: 'Orden eliminada correctamente' });
            }
            catch (error) {
                res.status(500).json({ message: 'Error al eliminar la orden' });
            }
        });
    }
    // Consultar productos agotados por estado
    getOutOfStockProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Se asume que el campo 'estado' en la tabla 'producto' se usa para indicar si el producto está agotado
                const products = yield database_1.default.query(`
          SELECT p.id_producto, p.nombre, p.precio, pp.id_proveedor
          FROM producto p
          JOIN producto_proveedor pp ON p.id_producto = pp.id_producto
          WHERE p.estado = 'agotado'
      `);
                res.json(products);
            }
            catch (error) {
                res.status(500).json({ message: 'Error al consultar productos agotados' });
            }
        });
    }
    // Enviar correo con la orden de compra
    sendOrderEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_orden, id_proveedor } = req.body;
            try {
                // Obtener los datos de la orden de compra y los productos asociados
                const orden = yield database_1.default.query(`
            SELECT o.id_orden, o.fecha, p.nombre_proveedor AS proveedor_nombre, p.email AS proveedor_email
            FROM orden_compra_productos o
            JOIN proveedor p ON o.id_proveedor = p.id_proveedor
            WHERE o.id_orden = ? AND p.id_proveedor = ?
        `, [id_orden, id_proveedor]);
                if (orden.length === 0) {
                    res.status(404).json({ message: 'Orden de compra no encontrada o proveedor no asociado.' });
                }
                const productos = yield database_1.default.query(`
SELECT op.id_producto, pr.nombre AS producto_nombre, op.cantidad, pr.precio, (op.cantidad * pr.precio) AS subtotal
FROM orden_compra_productos op
JOIN producto pr ON op.id_producto = pr.id_producto
WHERE op.id_orden = ?;

        `, [id_orden]);
                // Generar el HTML de la orden
                let orderDetailsHTML = `
            <h2>Detalles de la Orden de Compra</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th style="border: 1px solid #ddd; padding: 8px;">Producto</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Cantidad</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
        `;
                productos.forEach((producto) => {
                    orderDetailsHTML += `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">${producto.producto_nombre}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${producto.cantidad}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${producto.subtotal}</td>
                </tr>
            `;
                });
                orderDetailsHTML += `
                </tbody>
            </table>
            <h3 style="text-align: right;">Total de la orden: $${productos.reduce((sum, prod) => sum + prod.subtotal, 0)}</h3>
            <p><strong>Fecha:</strong> ${orden[0].fecha}</p>
            <p>Gracias por su atención. Si tiene alguna pregunta, no dude en contactarnos.</p>
        `;
                // Configurar el transporte de correo
                const transporter = nodemailer_1.default.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'fnafbray67@gmail.com', // correo
                        pass: 'vmrf ndap ylum iflr' // contraseña de la aplicación
                    }
                });
                const mailOptions = {
                    from: 'fnafbray67@gmail.com',
                    to: orden[0].proveedor_email,
                    subject: `Orden de Compra #${orden[0].id_orden}`,
                    html: orderDetailsHTML
                };
                // Enviar el correo
                yield transporter.sendMail(mailOptions);
                console.log('Correo enviado a:', orden[0].proveedor_email);
                res.status(200).json({ message: 'Correo de la orden enviado exitosamente' });
            }
            catch (error) {
                console.error('Error al enviar el correo:', error);
                res.status(500).json({ message: 'Error al enviar el correo', error }); // Asegúrate de que siempre haya un return
            }
        });
    }
}
const orderController = new OrderController();
exports.default = orderController;
