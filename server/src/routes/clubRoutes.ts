import { Router } from 'express';
import { registerClub, upload } from '../controllers/clubController';

const router = Router();

// Ruta para registrar un nuevo club (con carga de certificado)
router.post('/register', upload.fields([
    { name: 'certificado', maxCount: 1 },
    { name: 'logotipo', maxCount: 1 }
  ]), registerClub);

export default router;
