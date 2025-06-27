import { Router } from 'express';

import {indexController} from '../controllers/indexController'

class IndexRoutes {

    public router: Router;

    constructor() {
        this.router = Router();
        this.config();
    }

    config(): void {
        this.router.get('/', indexController.index);
        }
    }


// Inicializa la clase para asegurarte de que se configuren las rutas
const indexRoutes = new IndexRoutes();
export default indexRoutes.router;
