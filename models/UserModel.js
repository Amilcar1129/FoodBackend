import { DataTypes } from "sequelize";
import { sequelize } from "../db/conexion.js";

export const UserModel = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
     typeusers_id: { 
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'typeusers',
        key: 'id'
      }
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