"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UsuarioController_1 = require("../controllers/UsuarioController");
const router = (0, express_1.Router)();
// Ruta para iniciar sesión
router.post('/login', UsuarioController_1.loginUsuario);
exports.default = router;
