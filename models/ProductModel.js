import { DataTypes } from "sequelize";
import { sequelize } from "../db/conexion.js";

export const ProductModel = sequelize.define(
    "products",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,

    },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true, 
        },
        price: {
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true, 
        },
        state: {
            type: DataTypes.BOOLEAN,    
            defaultValue: true,
        },
    }, 
 {
    timestamps: false,
    }
);          
    