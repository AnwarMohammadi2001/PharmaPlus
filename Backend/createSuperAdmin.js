// createSuperAdmin.js
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const name = "Admin";
const email = "admin@gmail.com";
const password = "open 123";

const createSuperAdmin = async () => {
  try {
    // ✅ اتصال به دیتابیس و سینک جدول‌ها
    await sequelize.authenticate();
    console.log("✅ Database connected successfully via Sequelize!");

    await sequelize.sync(); // می‌توانید { alter: true } هم اضافه کنید
    console.log("✅ Tables synced successfully!");

    // ✅ بررسی اینکه سوپرادمین قبلاً ساخته شده یا نه
    const existingAdmin = await User.findOne({ where: { email } });
    if (existingAdmin) {
      console.log("⚠️ Superadmin already exists!");
      process.exit(0);
    }

    // ✅ هش کردن پسورد
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ ایجاد سوپرادمین
    const superAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "superadmin",
    });

    console.log("✅ Superadmin created successfully!");
    console.log(superAdmin.toJSON());
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating superadmin:", error);
    process.exit(1);
  }
};

createSuperAdmin();
