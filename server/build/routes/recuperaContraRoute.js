"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recuperacionController_1 = require("../controllers/recuperacionController");
const router = (0, express_1.Router)();
router.post('/enviar', recuperacionController_1.enviarCodigo);
router.post('/cambiar', recuperacionController_1.cambiarContrasena);
exports.default = router;
