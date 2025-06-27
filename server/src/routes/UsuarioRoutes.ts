import { Router } from 'express';
import { loginUsuario } from '../controllers/UsuarioController';

const router = Router();

// Ruta para iniciar sesión
router.post('/login', loginUsuario);

export default router;
