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
class EstadisticasController {
    // Obtener ventas agrupadas por método de pago, con opción de filtrar por fecha
    obtenerVentasPorMetodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { year, month, day } = req.query;
                let query = `
        SELECT metodo_pago, COUNT(*) AS cantidad, SUM(total) AS total
        FROM venta
      `;
                const conditions = [];
                if (year)
                    conditions.push(`YEAR(fecha_hora) = ${database_1.default.escape(year)}`);
                if (month)
                    conditions.push(`MONTH(fecha_hora) = ${database_1.default.escape(month)}`);
                if (day)
                    conditions.push(`DAY(fecha_hora) = ${database_1.default.escape(day)}`);
                if (conditions.length > 0) {
                    query += ' WHERE ' + conditions.join(' AND ');
                }
                query += ' GROUP BY metodo_pago';
                const ventasPorMetodo = yield database_1.default.query(query);
                res.json(ventasPorMetodo);
            }
            catch (error) {
                res.status(500).json({ message: 'Error al obtener ventas por método de pago', error });
            }
        });
    }
    // Obtener ventas agrupadas por día, con opción de filtrar por mes y año
    obtenerVentasPorDia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { year, month } = req.query;
                let query = `
        SELECT DATE(fecha_hora) AS fecha, SUM(total) AS total
        FROM venta
      `;
                const conditions = [];
                if (year)
                    conditions.push(`YEAR(fecha_hora) = ${database_1.default.escape(year)}`);
                if (month)
                    conditions.push(`MONTH(fecha_hora) = ${database_1.default.escape(month)}`);
                if (conditions.length > 0) {
                    query += ' WHERE ' + conditions.join(' AND ');
                }
                query += ' GROUP BY DATE(fecha_hora)';
                const ventasPorDia = yield database_1.default.query(query);
                res.json(ventasPorDia);
            }
            catch (error) {
                res.status(500).json({ message: 'Error al obtener ventas por día', error });
            }
        });
    }
    obtenerHistorialCaja(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_empleado } = req.query;
                const query = `
        SELECT fecha_hora_apertura, monto_inicial, fecha_hora_cierre, monto_cierre, diferencia, total_ventas
        FROM estado_caja
        WHERE id_empleado = ${database_1.default.escape(id_empleado)}
        ORDER BY fecha_hora_apertura DESC  -- Ordenar por fecha de apertura descendente
        LIMIT 3                         -- Limitar a las últimas 3 entradas
      `;
                const historialCaja = yield database_1.default.query(query);
                res.json(historialCaja);
            }
            catch (error) {
                res.status(500).json({ message: 'Error al obtener historial de caja', error });
            }
        });
    }
    obtenerIdEmpleadoPorNombre(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nombre } = req.query;
                const query = `
      SELECT id_empleado
      FROM empleado
      WHERE nombre = ${database_1.default.escape(nombre)}
      LIMIT 1
    `;
                const result = yield database_1.default.query(query);
                if (result.length > 0) {
                    res.json({ id_empleado: result[0].id_empleado });
                }
                else {
                    res.status(404).json({ message: 'Empleado no encontrado' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Error al obtener el id del empleado', error });
            }
        });
    }
}
const estadisticasController = new EstadisticasController();
exports.default = estadisticasController;
