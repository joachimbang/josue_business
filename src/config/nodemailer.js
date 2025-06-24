import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey", // IMPORTANT : c'est littéralement le mot "apikey"
    pass: process.env.SENDGRID_API_KEY, // La clé API que tu as copiée
  },
});

export default transporter;
