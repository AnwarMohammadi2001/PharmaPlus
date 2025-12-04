import { generateUPCA } from "../utils/barcode.js";

const med = await Medicine.create({
  name,
  company,
  category_id,
  qty: qty || 0,
  cost_price,
  sale_price,
  expiry_date: expiry_date || null,
  barcode: generateUPCA(),
});
