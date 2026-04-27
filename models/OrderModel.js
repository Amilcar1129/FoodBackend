import { DataTypes } from "sequelize";      
import { sequelize } from "../db/conexion.js";

export const OrderModel = sequelize.define(
  "orders",
  {         
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,       
      autoIncrement: true,          
    },
    total : {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false, 
    },
    status : {
      type: DataTypes.ENUM('pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'),
        defaultValue: 'pendiente',

    },
    order_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    state: {        
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },  
    },
    {timestamps: false,}
);  