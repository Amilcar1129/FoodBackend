import { Sequelize } from 'sequelize';
import {DB_CONNECTION, DB_USERNAME, DB_PASSWORD,DB_HOST,DB_DATABASE, DB_PORT} from '../config/config.js';

// Parse port to number if provided, otherwise undefined so Sequelize uses defaults per dialect
const portNumber = DB_PORT ? parseInt(DB_PORT, 10) : undefined;

export const sequelize = new Sequelize(
    DB_DATABASE,
    DB_USERNAME,
    DB_PASSWORD,
    {
        host: DB_HOST,
        port: portNumber,
        dialect: DB_CONNECTION,
    }
);
















