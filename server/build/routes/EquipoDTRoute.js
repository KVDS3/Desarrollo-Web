"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const EquipoDT_1 = require("../controllers/EquipoDT");
const EquipoDT_2 = require("../controllers/EquipoDT");
const EquipoDT_3 = require("../controllers/EquipoDT");
const router = (0, express_1.Router)();
// Ruta para crear equipo y asignar DT
router.post('/create-team', EquipoDT_1.createTeamAndAssignDT);
router.get('/categorias/:clubId', EquipoDT_2.obtenerCategoriasConEquipo);
router.put('/edit', EquipoDT_3.editarEquipoPorCyC);
exports.default = router;
