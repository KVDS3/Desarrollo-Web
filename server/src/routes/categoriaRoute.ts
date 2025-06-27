import { Router } from 'express';
import { obtenerCategoriaPorDT, obtenerCategoriaYClub } from '../controllers/categoriaController';
import { obtenerCategoriaPorUsuario } from '../controllers/categoriaController';
import { obtenerIdEquipoPorUsuario } from '../controllers/categoriaController';
import { verificarNombreUsuarioEnEquipo } from '../controllers/categoriaController';
import { verificarEstadoEquipo } from '../controllers/categoriaController';
import { validarJugadores } from '../controllers/categoriaController';
import { obtenerEquipoPorUsuario} from '../controllers/categoriaController'
const router = Router();

// Ruta para obtener la categoría del equipo basado en el id_dt
router.get('/:id_dt', obtenerCategoriaPorDT);
router.get('/categoria-club/:id_usuario', obtenerCategoriaYClub);
router.get('/categoria-usuario/:nombreUsuario', obtenerCategoriaPorUsuario);
router.get('/id-equipo/:nombreUsuario', obtenerIdEquipoPorUsuario);
router.get('/Equipo/:nombreUsuario', verificarNombreUsuarioEnEquipo);
router.get('/estadoEquipo/:id', verificarEstadoEquipo);
router.get('/equipoCompleto/:id', validarJugadores);
router.get('/equipoXU/:nombreUsuario', obtenerEquipoPorUsuario)

export default router;
