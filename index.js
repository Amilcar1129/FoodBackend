import express from 'express';
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';   
import { PORT } from './config/config.js';
import rotuerTypeUsers from './router/TypeUsersRouter.js';
import { RouterUsuer } from './router/UserRouter.js';
import ProductRouter from './router/ProductRouter.js';  
import { sequelize } from "./db/conexion.js";
import './models/associations.js';
import uploadRouter from './router/UploadRouter.js';
import OrderRouter from './router/OrderRouter.js';
// Definir __filename y __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const _PORT = PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors());

// SERVIR ARCHIVOS ESTÁTICOS DE LA CARPETA UPLOADS
app.use(express.static('public'));
// RUTAS
app.use('/api', rotuerTypeUsers);
app.use('/api', RouterUsuer);
app.use('/api', ProductRouter);
app.use('/api', uploadRouter);
app.use('/api', OrderRouter);

const main = async () => {
    try {
        await sequelize.authenticate();
        console.log('Base de datos conectada.');

        await sequelize.sync({ alter: false });
        app.listen(_PORT, () => {
            console.log(`Servidor corriendo en el puerto => ${_PORT}`);
        });
    } catch (error) {
        console.log(`Error ${error}`);
    }

    
};

main();