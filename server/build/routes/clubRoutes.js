"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clubController_1 = require("../controllers/clubController");
const router = (0, express_1.Router)();
// Ruta para registrar un nuevo club (con carga de certificado)
router.post('/register', clubController_1.upload.fields([
    { name: 'certificado', maxCount: 1 },
    { name: 'logotipo', maxCount: 1 }
]), clubController_1.registerClub);
exports.default = router;
