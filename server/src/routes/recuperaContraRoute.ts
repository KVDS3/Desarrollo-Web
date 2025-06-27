import { Router } from 'express';
import {enviarCodigo, cambiarContrasena} from '../controllers/recuperacionController';


const router = Router();

router.post('/enviar', enviarCodigo);
router.post('/cambiar', cambiarContrasena);

export default router;
