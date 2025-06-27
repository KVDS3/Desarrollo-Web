import { Router } from 'express';
import {loginEmpleado} from '../controllers/empleadoController'

const router = Router();

// Ruta para iniciar sesión
router.post('/login', loginEmpleado);

export default router;
