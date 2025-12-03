// models/RefreshToken.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const RefreshToken = sequelize.define("RefreshToken", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  revoked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});
