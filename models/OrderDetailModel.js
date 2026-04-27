import { DataTypes } from "sequelize";  
import { sequelize } from "../db/conexion.js";

export const OrderDetailModel = sequelize.define(
    "order_details",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: false,
        },
        subtotal: {
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: false,   
        },
    },
    {
        timestamps: false,
    }
);