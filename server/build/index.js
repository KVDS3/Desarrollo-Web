"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const serve_index_1 = __importDefault(require("serve-index"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
const clubRoutes_1 = __importDefault(require("./routes/clubRoutes"));
const UsuarioRoutes_1 = __importDefault(require("./routes/UsuarioRoutes"));
const AdminRoute_1 = __importDefault(require("./routes/AdminRoute"));
const EquipoDTRoute_1 = __importDefault(require("./routes/EquipoDTRoute"));
const clubesRoutes_1 = __importDefault(require("./routes/clubesRoutes"));
const categoriaRoute_1 = __importDefault(require("./routes/categoriaRoute"));
const EquipoJugadorRoute_1 = __importDefault(require("./routes/EquipoJugadorRoute"));
const recuperaContraRoute_1 = __importDefault(require("./routes/recuperaContraRoute"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
    }
    config() {
        // Configuración general
        this.app.set('port', process.env.PORT || 3000);
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        // Hacer pública la carpeta uploads y habilitar listado de directorios
        const uploadsPath = path_1.default.join(__dirname, '../uploads');
        this.app.use('/uploads', express_1.default.static(uploadsPath), (0, serve_index_1.default)(uploadsPath, { icons: true }));
    }
    routes() {
        // Configuración de rutas
        this.app.use('/', indexRoutes_1.default);
        this.app.use('/api/auth', UsuarioRoutes_1.default); // Añadir la ruta de autenticación
        this.app.use('/api/club', clubRoutes_1.default);
        this.app.use('/api/Usuario', UsuarioRoutes_1.default);
        this.app.use('/api/Admin', AdminRoute_1.default);
        this.app.use('/api/team', EquipoDTRoute_1.default);
        this.app.use('/api/clubes', clubesRoutes_1.default);
        this.app.use('/api/Ecategoria', categoriaRoute_1.default);
        this.app.use('/api/juga', EquipoJugadorRoute_1.default);
        this.app.use('/api/recupera', recuperaContraRoute_1.default);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
