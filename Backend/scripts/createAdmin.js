import bcrypt from "bcryptjs";
import { sequelize } from "../config/db.js";
import { User } from "../models/User.js"; // named export
import readline from "readline";

// تابع گرفتن ورودی از کاربر
const askQuestion = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    })
  );
};

const createAdmin = async () => {
  try {
    await sequelize.sync({ force: false, alter: true });

    const email = await askQuestion("Enter admin email: ");
    const password = await askQuestion("Enter admin password: ");

    const adminExists = await User.findOne({ where: { role: "superadmin" } });
    if (adminExists) {
      console.log("❌ Super Admin already exists!");
      process.exit(0);
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name: "Super Admin",
      email,
      password: hashedPass,
      role: "superadmin", // role ثابت
    });

    console.log("✔ Super Admin created successfully:");
    console.log(admin.toJSON());

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
