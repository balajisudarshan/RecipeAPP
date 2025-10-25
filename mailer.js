// const nodemailer = require('nodemailer');
// require('dotenv').config();

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER, 
//     pass: process.env.EMAIL_PASS  
//   }
// });

// async function sendEmail(to, subject, html) {
//   try {
//     const info = await transporter.sendMail({
//       from: `"DishCovery" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html
//     });
//     console.log("✅ Email sent to", to, info.messageId);
//     return info;
//   } catch (err) {
//     console.error("❌ Failed to send email to", to, err.message);
//   }
// }

// module.exports = { sendEmail };
