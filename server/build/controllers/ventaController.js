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
const nodemailer_1 = __importDefault(require("nodemailer"));
class VentaController {
    // Listar todas las ventas
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ventas = yield database_1.default.query(`
                SELECT v.*, e.nombre AS nombre_empleado, s.nombre AS nombre_sucursal 
                FROM venta v
                JOIN empleado e ON v.id_empleado = e.id_empleado
                JOIN sucursal s ON v.id_sucursal = s.id_sucursal
            `);
                console.log('Ventas listadas:', ventas); // Log para las ventas listadas
                res.json(ventas);
            }
            catch (error) {
                console.error('Error al listar ventas:', error);
                res.status(500).json({ message: 'Error al listar ventas', error });
            }
        });
    }
    // Obtener una venta por ID
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log('Obteniendo venta con ID:', id); // Log para ID de la venta
            try {
                const venta = yield database_1.default.query('SELECT * FROM venta WHERE id_venta = ?', [id]);
                if (venta.length > 0) {
                    console.log('Venta encontrada:', venta[0]); // Log para la venta encontrada
                    res.json(venta[0]);
                }
                else {
                    res.status(404).json({ message: 'Venta no encontrada' });
                }
            }
            catch (error) {
                console.error('Error al obtener la venta:', error);
                res.status(500).json({ message: 'Error al obtener la venta', error });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado, id_sucursal, productos, metodo_pago, num_tarjeta, nip } = req.body;
            const fecha_hora = new Date();
            const total = productos.reduce((sum, prod) => sum + prod.subtotal, 0);
            const connection = yield database_1.default.getConnection(); // Obtener conexión de db
            try {
                yield connection.beginTransaction();
                let cliente = null;
                // Validar solo si el método de pago es tarjeta
                if (metodo_pago === 'tarjeta') {
                    // Obtener el saldo y correo del cliente
                    [cliente] = yield connection.query('SELECT saldo, correo_electronico FROM cliente WHERE num_tarjeta = ? AND nip = ?', [num_tarjeta, nip]);
                    if (!cliente) {
                        throw new Error('Número de tarjeta o NIP incorrecto');
                    }
                    if (cliente.saldo < total) {
                        throw new Error('Saldo insuficiente');
                    }
                    // Restar el total del saldo del cliente
                    yield connection.query('UPDATE cliente SET saldo = saldo - ? WHERE num_tarjeta = ?', [total, num_tarjeta]);
                }
                // Insertar la venta
                const ventaResult = yield connection.query('INSERT INTO venta (id_empleado, id_sucursal, fecha_hora, total, metodo_pago) VALUES (?, ?, ?, ?, ?)', [id_empleado, id_sucursal, fecha_hora, total, metodo_pago]);
                const id_venta = ventaResult.insertId;
                // Insertar los detalles de la venta y actualizar inventario
                for (const producto of productos) {
                    // Verificar si hay suficiente cantidad en inventario
                    const [inventario] = yield connection.query('SELECT cantidad FROM inventario WHERE id_producto = ? AND id_sucursal = ?', [producto.id_producto, id_sucursal]);
                    if (!inventario || inventario.cantidad < producto.cantidad) {
                        throw new Error(`No hay suficiente cantidad para el producto ${producto.id_producto}`);
                    }
                    // Insertar el detalle de la venta
                    yield connection.query('INSERT INTO detalle_venta (id_producto, id_venta, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)', [producto.id_producto, id_venta, producto.cantidad, producto.precio_unitario, producto.subtotal]);
                    // Actualizar el inventario
                    yield connection.query('UPDATE inventario SET cantidad = cantidad - ? WHERE id_producto = ? AND id_sucursal = ?', [producto.cantidad, producto.id_producto, id_sucursal]);
                }
                yield connection.query('CALL actualizar_estado_producto();');
                yield connection.commit();
                // Crear el mensaje con los detalles de la compra
                let detallesCompraHTML = `
            <h2>Detalle de la compra</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th style="border: 1px solid #ddd; padding: 8px;">Producto</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Cantidad</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Precio Unitario</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
        `;
                productos.forEach((producto) => {
                    detallesCompraHTML += `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">${producto.nombre}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${producto.cantidad}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${producto.precio_unitario}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${producto.subtotal}</td>
                </tr>
            `;
                });
                detallesCompraHTML += `
                </tbody>
            </table>
            <h3 style="text-align: right;">Total de la compra: $${total}</h3>
            <p><strong>Fecha y hora:</strong> ${fecha_hora}</p>
            <p>Gracias por tu compra. Si tienes alguna pregunta, no dudes en contactarnos.</p>
        `;
                // Enviar correo solo si el método de pago es tarjeta
                if (metodo_pago === 'tarjeta' && cliente && cliente.correo_electronico) {
                    // Configurar nodemailer y enviar correo al cliente
                    const transporter = nodemailer_1.default.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'mitsimy@gmail.com', // correo
                            pass: 'nxkl umfw mmho geaa' // contraseña de la aplicación
                        }
                    });
                    const mailOptions = {
                        from: 'mitsimy@gmail.com',
                        to: cliente.correo_electronico,
                        subject: 'Confirmación de Compra',
                        html: detallesCompraHTML // Cambiamos `text` a `html` para usar el formato HTML
                    };
                    yield transporter.sendMail(mailOptions);
                    console.log('Correo enviado a:', cliente.correo_electronico);
                }
                res.status(201).json({ message: 'Venta registrada con éxito', id_venta });
            }
            catch (error) {
                yield connection.rollback();
                console.error('Error al registrar la venta:', error);
                res.status(500).json({ message: 'Error al registrar la venta', error });
            }
            finally {
                connection.release();
            }
        });
    }
    // Procesar pago en efectivo
    pagoEfectivo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_venta, monto_recibido } = req.body;
            console.log('Procesando pago en efectivo para la venta:', { id_venta, monto_recibido }); // Log para el pago en efectivo
            try {
                const [venta] = yield database_1.default.query('SELECT total FROM venta WHERE id_venta = ?', [id_venta]);
                if (!venta || venta.total > monto_recibido) {
                    res.status(400).json({ message: 'Monto insuficiente' });
                    return; // Finaliza el flujo aquí
                }
                const cambio = monto_recibido - venta.total;
                res.status(200).json({ message: 'Pago exitoso', cambio });
            }
            catch (error) {
                console.error('Error al procesar el pago en efectivo:', error);
                res.status(500).json({ message: 'Error al procesar el pago en efectivo', error });
            }
        });
    }
    // Procesar pago con tarjeta
    pagoTarjeta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_venta, num_tarjeta, nip } = req.body;
            console.log('Procesando pago con tarjeta:', { id_venta, num_tarjeta, nip }); // Log para el pago con tarjeta
            try {
                const [cliente] = yield database_1.default.query('SELECT saldo FROM cliente WHERE num_tarjeta = ? AND nip = ?', [num_tarjeta, nip]);
                if (!cliente) {
                    res.status(400).json({ message: 'Tarjeta o NIP incorrecto' });
                    return;
                }
                const [venta] = yield database_1.default.query('SELECT total FROM venta WHERE id_venta = ?', [id_venta]);
                if (!venta || cliente.saldo < venta.total) {
                    res.status(400).json({ message: 'Saldo insuficiente' });
                    return;
                }
                yield database_1.default.query('UPDATE cliente SET saldo = saldo - ? WHERE num_tarjeta = ?', [venta.total, num_tarjeta]);
                res.status(200).json({ message: 'Pago con tarjeta exitoso' });
            }
            catch (error) {
                console.error('Error al procesar el pago con tarjeta:', error);
                res.status(500).json({ message: 'Error al procesar el pago con tarjeta', error });
            }
        });
    }
    // Validar tarjeta
    validarTarjeta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { num_tarjeta, nip, total } = req.body;
            console.log('Validando tarjeta:', { num_tarjeta, nip, total }); // Log para validación de tarjeta
            try {
                const [cliente] = yield database_1.default.query('SELECT saldo FROM cliente WHERE num_tarjeta = ? AND nip = ?', [num_tarjeta, nip]);
                // Validación si la tarjeta no existe o el NIP es incorrecto
                if (!cliente) {
                    res.status(400).json({ message: 'Tarjeta o NIP incorrecto', valido: false, motivoError: 'datos incorrectos' });
                    return;
                }
                // Validación de saldo
                if (cliente.saldo < total) {
                    res.status(400).json({ message: 'Saldo insuficiente', valido: false, motivoError: 'saldo insuficiente' });
                    return;
                }
                // Respuesta exitosa cuando la tarjeta es válida y tiene saldo suficiente
                res.status(200).json({ message: 'Tarjeta válida y saldo suficiente', valido: true });
            }
            catch (error) {
                console.error('Error en la validación de tarjeta:', error);
                res.status(500).json({ message: 'Error en el servidor', valido: false, motivoError: 'error en servidor' });
            }
        });
    }
    //////////pendiente
    abrirCaja(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado, id_sucursal } = req.body;
            let { monto_inicial } = req.body;
            const fecha_hora_apertura = new Date();
            try {
                // Consulta el último monto_cierre para establecer el monto_inicial
                const [lastCaja] = yield database_1.default.query(`SELECT monto_cierre FROM estado_caja 
                     WHERE id_empleado = ? AND id_sucursal = ? 
                     ORDER BY fecha_hora_cierre DESC LIMIT 1`, [id_empleado, id_sucursal]);
                if (lastCaja && lastCaja.monto_cierre !== null) {
                    monto_inicial = lastCaja.monto_cierre;
                }
                // Insertar nuevo registro en estado_caja con el monto_inicial ajustado
                const result = yield database_1.default.query(`INSERT INTO estado_caja (id_empleado, id_sucursal, fecha_hora_apertura, monto_inicial)
                     VALUES (?, ?, ?, ?)`, [id_empleado, id_sucursal, fecha_hora_apertura, monto_inicial]);
                res.status(201).json({ message: 'Caja abierta exitosamente', id_estado_caja: result.insertId });
            }
            catch (error) {
                console.error('Error al abrir la caja:', error);
                res.status(500).json({ message: 'Error al abrir la caja', error });
            }
        });
    }
    // Método para cerrar caja
    cerrarCaja(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_estado_caja, monto_cierre, total_ventas } = req.body;
            const fecha_hora_cierre = new Date();
            try {
                // Obtener el monto_inicial del registro actual
                const [caja] = yield database_1.default.query(`SELECT monto_inicial FROM estado_caja WHERE id_estado_caja = ?`, [id_estado_caja]);
                if (!caja) {
                    res.status(404).json({ message: 'Registro de caja no encontrado' });
                    return;
                }
                const monto_inicial = caja.monto_inicial;
                // Calcular diferencia de manera correcta
                const diferencia = monto_cierre - (monto_inicial + total_ventas);
                // Actualizar el registro en estado_caja con los datos de cierre y la diferencia calculada
                yield database_1.default.query(`UPDATE estado_caja 
                     SET fecha_hora_cierre = ?, monto_cierre = ?, diferencia = ?, total_ventas = ?
                     WHERE id_estado_caja = ?`, [fecha_hora_cierre, monto_cierre, diferencia, total_ventas, id_estado_caja]);
                res.status(200).json({ message: 'Caja cerrada exitosamente', diferencia });
            }
            catch (error) {
                console.error('Error al cerrar la caja:', error);
                res.status(500).json({ message: 'Error al cerrar la caja', error });
            }
        });
    }
}
exports.default = new VentaController();
