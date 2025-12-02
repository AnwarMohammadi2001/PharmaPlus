import { v4 as uuidv4 } from "uuid";
export default (sequelize, DataTypes) => {
  const Medicine = sequelize.define("Medicine", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sku: { type: DataTypes.STRING, unique: true, defaultValue: () => uuidv4() },
    name: DataTypes.STRING,
    brand: DataTypes.STRING,
    unitPrice: DataTypes.DECIMAL(10, 2),
    stock: DataTypes.INTEGER,
    expiryDate: DataTypes.DATE,
    type: DataTypes.STRING,
    barcode: { type: DataTypes.STRING, unique: true }, // مقدار بارکد (مثلاً sku)
  });
  return Medicine;
};
