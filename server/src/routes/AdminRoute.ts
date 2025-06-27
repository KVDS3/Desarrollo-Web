import { Router } from 'express';
import ClubController from '../controllers/Admin';

const router = Router();

// Ruta para listar solicitudes de clubes
router.get('/solicitudes', ClubController.listarSolicitudes);

// Ruta para aprobar un club
router.post('/aprobar/:id_club', ClubController.aprobarClub);

// Ruta para eliminar un club
router.delete('/eliminar/:id_club', ClubController.eliminarClub);

export default router;
