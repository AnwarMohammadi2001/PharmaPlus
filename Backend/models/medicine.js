import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Category from "./Category.js";
import { v4 as uuidv4 } from "uuid"; // For unique barcode

const Medicine = sequelize.define(
  "Medicine",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    barcode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    qty: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    cost_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    sale_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    hooks: {
      beforeCreate: (medicine) => {
        // Generate unique barcode automatically
        medicine.barcode = `MED-${uuidv4().slice(0, 8).toUpperCase()}`;
      },
    },
  }
);

// Relation → Medicine belongs to Category
Medicine.belongsTo(Category, {
  foreignKey: "category_id",
  onDelete: "SET NULL",
});

Category.hasMany(Medicine, {
  foreignKey: "category_id",
});

export default Medicine;
