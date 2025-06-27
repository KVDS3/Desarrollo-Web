"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clubesController_1 = require("../controllers/clubesController");
const router = (0, express_1.Router)();
// Ruta para obtener un club por su ID
router.get('/:id', clubesController_1.getClubById);
exports.default = router;
