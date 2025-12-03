import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true برای پورت 465
  auth: {
    user: process.env.EMAIL_USER, // ایمیل
    pass: process.env.EMAIL_PASS, // App Password
  },
});

const sendEmail = async ({ to, subject, text }) => {
  await transporter.sendMail({
    from: `"PharmaPlus" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};

export default sendEmail;
