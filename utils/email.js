const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

function getLoginEmailTemplate(userName) {
    return `
    <div style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">🍽️ DishCovery</h1>
                <p style="margin: 10px 0 0 0; color: #f0e6ff; font-size: 16px;">Discover Your Next Favorite Dish</p>
            </div>
            
            <div style="padding: 40px 30px;">
                <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px;">Welcome Back, ${userName}! 👋</h2>
                <p style="margin: 0 0 15px 0; color: #555555; font-size: 16px; line-height: 1.6;">You've successfully logged in to your DishCovery account. We're excited to help you discover amazing recipes and culinary adventures!</p>
                
                <div style="text-align: center; margin-top: 30px;">
                    <a href="https://dishcoveryy.vercel.app" style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Start Exploring</a>
                </div>
            </div>
            
            <div style="padding: 30px; text-align: center; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Happy cooking! 🎉</p>
                <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px;">The DishCovery Team</p>
            </div>
        </div>
    </div>
    `;
}

async function sendLoginNotification(userEmail, userName) {
    const mailOptions = {
        from: `"DishCovery" <${process.env.GMAIL_USER}>`,
        to: userEmail,
        subject: '🍽️ Welcome Back to DishCovery!',
        html: getLoginEmailTemplate(userName),
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Login email sent to ${userEmail}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Error sending login email:', error);
        return { success: false, error: error.message };
    }
}
function getLikeNotificationTemplate(recipeName, likerName) {
    return `
        <div style="font-family: Arial, sans-serif; background:#f9f9f9; padding:20px;">
      <div style="max-width:600px; margin:auto; background:#fff; padding:30px; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        <h2 style="color:#333;">🍽️ Someone liked your recipe!</h2>
        <p><strong>${likerName}</strong> liked your recipe: <strong>${recipeName}</strong></p>
        <a href="https://dishcoveryy.vercel.app" style="display:inline-block; padding:12px 25px; background:#667eea; color:#fff; border-radius:5px; text-decoration:none;">View Recipe</a>
      </div>
    </div>
    `
}

async function sendLikeNotification(toEmail, recipeName, likerName) {
    const mailOptions = {
        from: `"DishCovery" <${process.env.GMAIL_USER}>`,
        to: toEmail,
        subject: '🍽️ Your recipe got a new like!',
        html: getLikeNotificationTemplate(recipeName, likerName),
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Like notification sent to ${toEmail}`);
      } catch (err) {
        console.error('❌ Error sending like notification:', err);
      }
    
}
module.exports = {sendLikeNotification,sendLoginNotification};
