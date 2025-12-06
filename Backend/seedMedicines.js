// seedMedicines.js
import { sequelize } from "./db.js"; // ✅ notice the curly braces
import { Medicine, Category } from "./models/index.js";
import { generateUPCA } from "./utils/barcode.js";

// Example: Seed 80 medicines
(async () => {
  try {
    await sequelize.sync(); // ensure tables exist

    const categories = await Category.findAll();
    if (!categories.length) {
      console.log("No categories found. Please add categories first.");
      return;
    }

    for (let i = 1; i <= 80; i++) {
      await Medicine.create({
        name: `Medicine ${i}`,
        company: `Company ${i}`,
        category_id: categories[i % categories.length].id,
        qty: Math.floor(Math.random() * 100),
        cost_price: Math.floor(Math.random() * 50) + 10,
        sale_price: Math.floor(Math.random() * 100) + 20,
        expiry_date: new Date(2026, 0, 1),
        barcode: generateUPCA(),
      });
    }

    console.log("80 medicines added successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
