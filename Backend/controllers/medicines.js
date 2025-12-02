// controllers/medicines.js
import db from '../models/index.js';
import { generateBarcodePng } from '../utils/barcode.js';

export const createMedicine = async (req, res) => {
  try {
    const { name, brand, unitPrice, stock, expiryDate, type } = req.body;
    const sku = /* uuid or generated */;
    const barcode = sku;
    const med = await db.Medicine.create({ sku, barcode, name, brand, unitPrice, stock, expiryDate, type });

    // تولید و ذخیره تصویر بارکد در سرور (اختیاری)
    const png = await generateBarcodePng(barcode);
    // save to /uploads/barcodes/<sku>.png
    fs.writeFileSync(`uploads/barcodes/${sku}.png`, png);

    res.status(201).json(med);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
