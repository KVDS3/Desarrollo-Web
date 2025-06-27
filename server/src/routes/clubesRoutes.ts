import { Router } from 'express';
import { getClubById } from '../controllers/clubesController';

const router = Router();

// Ruta para obtener un club por su ID
router.get('/:id', getClubById);

export default router;
