const Mailjet = require('node-mailjet');
const dotenv = require('dotenv');
dotenv.config();

const client = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

function getLoginEmailTemplate(userName) {
  return `
  <div style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f5f5f5;">
    <div style="max-width:600px;margin:20px auto;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
      <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px 30px;text-align:center;">
        <h1 style="margin:0;color:#ffffff;font-size:32px;font-weight:bold;">🍽️ DishCovery</h1>
        <p style="margin:10px 0 0 0;color:#f0e6ff;font-size:16px;">Discover Your Next Favorite Dish</p>
      </div>
      <div style="padding:40px 30px;">
        <h2 style="margin:0 0 20px 0;color:#333;font-size:24px;">Welcome Back, ${userName}! 👋</h2>
        <p style="margin:0 0 15px 0;color:#555;font-size:16px;line-height:1.6;">You've successfully logged in to your DishCovery account. We're excited to help you discover amazing recipes and culinary adventures!</p>
        <div style="text-align:center;margin-top:30px;">
          <a href="https://dishcoveryy.vercel.app" style="display:inline-block;padding:15px 40px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;">Start Exploring</a>
        </div>
      </div>
      <div style="padding:30px;text-align:center;background-color:#f9fafb;border-top:1px solid #e5e7eb;">
        <p style="margin:0 0 10px 0;color:#6b7280;font-size:14px;">Happy cooking! 🎉</p>
        <p style="margin:0 0 15px 0;color:#6b7280;font-size:14px;">The DishCovery Team</p>
      </div>
    </div>
  </div>
  `;
}

function getLikeNotificationTemplate(recipeName, likerName) {
  return `
  <div style="font-family:Arial,sans-serif;background:#f9f9f9;padding:20px;">
    <div style="max-width:600px;margin:auto;background:#fff;padding:30px;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
      <h2 style="color:#333;">🍽️ Someone liked your recipe!</h2>
      <p><strong>${likerName}</strong> liked your recipe: <strong>${recipeName}</strong></p>
      <a href="https://dishcoveryy.vercel.app" style="display:inline-block;padding:12px 25px;background:#667eea;color:#fff;border-radius:5px;text-decoration:none;">View Recipe</a>
    </div>
  </div>
  `;
}

async function sendLoginNotification(userEmail, userName) {
  try {
    const request = await client
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: { Email: process.env.MJ_SENDER_EMAIL, Name: 'DishCovery' },
            To: [{ Email: userEmail, Name: userName }],
            Subject: '🍽️ Welcome Back to DishCovery!',
            HTMLPart: getLoginEmailTemplate(userName),
          },
        ],
      });
    console.log(`✅ Login email sent to ${userEmail}`, request.body);
    return { success: true };
  } catch (err) {
    console.error('❌ Error sending login email:', err);
    return { success: false, error: err.message };
  }
}

async function sendLikeNotification(toEmail, recipeName, likerName) {
  try {
    const request = await client
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: { Email: process.env.MJ_SENDER_EMAIL, Name: 'DishCovery' },
            To: [{ Email: toEmail, Name: 'User' }],
            Subject: '🍽️ Your recipe got a new like!',
            HTMLPart: getLikeNotificationTemplate(recipeName, likerName),
          },
        ],
      });
    console.log(`✅ Like notification sent to ${toEmail}`, request.body);
  } catch (err) {
    console.error('❌ Error sending like notification:', err);
  }
}

module.exports = { sendLoginNotification, sendLikeNotification };
