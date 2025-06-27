"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const empleadoController_1 = require("../controllers/empleadoController");
const router = (0, express_1.Router)();
// Ruta para iniciar sesión
router.post('/login', empleadoController_1.loginEmpleado);
exports.default = router;
