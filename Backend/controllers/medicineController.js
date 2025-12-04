import Medicine from "../models/Medicine.js";
import Category from "../models/Category.js";

// ✅ تابع تولید بارکد UPC-A
// utils/barcode.js
export const generateUPCA = () => {
  let digits = '';
  for (let i = 0; i < 11; i++) {
    digits += Math.floor(Math.random() * 10);
  }

  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    sum += i % 2 === 0 ? digits[i] * 3 : +digits[i];
  }
  const checkDigit = (10 - (sum % 10)) % 10;

  return digits + checkDigit; // 12-digit UPC-A
};

// Add Medicine
export const createMedicine = async (req, res) => {
  try {
    const {
      name,
      company,
      category_id,
      qty,
      cost_price,
      sale_price,
      expiry_date,
    } = req.body;

    // Check required fields
    if (!name || !company || !category_id || !cost_price || !sale_price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const category = await Category.findByPk(category_id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    const med = await Medicine.create({
      name,
      company,
      category_id,
      qty: qty || 0,
      cost_price,
      sale_price,
      expiry_date: expiry_date || null,
      barcode: generateUPCA(), // ✅ تولید خودکار بارکد
    });

    res.status(201).json(med);
  } catch (err) {
    console.error(err); // مهم برای دیباگ
    res.status(500).json({ message: err.message });
  }
};

// Get All Medicines
export const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.findAll({
      include: [{ model: Category }],
    });

    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Medicine
export const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    const med = await Medicine.findByPk(id);
    if (!med) return res.status(404).json({ message: "Medicine not found" });

    await med.update(req.body);

    res.json(med);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Delete Medicine
export const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    const med = await Medicine.findByPk(id);
    if (!med) return res.status(404).json({ message: "Medicine not found" });

    await med.destroy();

    res.json({ message: "Medicine deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
