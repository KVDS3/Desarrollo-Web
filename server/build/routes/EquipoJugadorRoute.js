"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const EquipoJugador_1 = require("../controllers/EquipoJugador");
const EquipoJugador_2 = require("../controllers/EquipoJugador");
const EquipoJugador_3 = require("../controllers/EquipoJugador");
const router = (0, express_1.Router)();
router.put('/Ujugador', EquipoJugador_1.updateJugador);
router.get('/Gjugadores', EquipoJugador_1.getJugadores);
// Aquí debes agregar `upload.single('foto')` como middleware antes de `createJugador`
router.post('/Cjugador', EquipoJugador_1.upload.single('foto'), EquipoJugador_1.createJugador);
router.delete('/Djugador', EquipoJugador_1.deleteJugador);
router.get('/:id_usuario', EquipoJugador_2.getIdEquipoByIdUsuario);
router.get('/jugador/:posicion/:id_equipo', EquipoJugador_3.getJugadorByPosicionYEquipo);
exports.default = router;
