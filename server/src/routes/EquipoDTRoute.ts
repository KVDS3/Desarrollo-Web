import { Router } from 'express';
import { createTeamAndAssignDT } from '../controllers/EquipoDT';
import { obtenerCategoriasConEquipo } from '../controllers/EquipoDT';
import { editarEquipoPorCyC } from '../controllers/EquipoDT';

const router = Router();

// Ruta para crear equipo y asignar DT
router.post('/create-team', createTeamAndAssignDT);
router.get('/categorias/:clubId', obtenerCategoriasConEquipo);
router.put('/edit', editarEquipoPorCyC);

export default router;