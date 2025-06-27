import { Router } from 'express';
import { updateJugador, getJugadores, createJugador, deleteJugador, upload } from '../controllers/EquipoJugador';
import { getIdEquipoByIdUsuario } from '../controllers/EquipoJugador';
import { getJugadorByPosicionYEquipo } from '../controllers/EquipoJugador';
const router = Router();

router.put('/Ujugador', updateJugador);
router.get('/Gjugadores', getJugadores);

// Aquí debes agregar `upload.single('foto')` como middleware antes de `createJugador`
router.post('/Cjugador', upload.single('foto'), createJugador);

router.delete('/Djugador', deleteJugador);

router.get('/:id_usuario', getIdEquipoByIdUsuario);

router.get('/jugador/:posicion/:id_equipo', getJugadorByPosicionYEquipo);



export default router;
