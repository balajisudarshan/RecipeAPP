require('dotenv').config();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const User = require('./models/User.js'); // update path if needed

const MONGO_URI = process.env.MONGO_URI;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// 1️⃣ Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// 2️⃣ Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// 3️⃣ Notification HTML template
function getNotificationEmailTemplate(userName) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">🍽️ DishCovery</h1>
          <p style="margin: 10px 0 0 0; color: #f0e6ff; font-size: 16px;">Discover Your Next Favorite Dish</p>
        </div>
        <div style="padding: 40px 30px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 20px; border-radius: 8px; display: inline-block; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 24px; font-weight: bold;">✨ What's New!</h2>
          </div>
          <p style="margin: 0 0 20px 0; color: #555; font-size: 16px; line-height: 1.6;">
            Hello ${userName || 'User'}, we're excited to share some amazing updates to DishCovery! We've been working hard to make your recipe discovery experience even better.
          </p>
          <div style="margin: 30px 0;">
            <div style="background: #f9fafb; border-left: 4px solid #667eea; padding: 20px; margin-bottom: 20px; border-radius: 6px;">
              <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <span style="font-size: 28px; margin-right: 12px;">🔍</span>
                <h3 style="margin: 0; color: #333; font-size: 20px; font-weight: bold;">Filter by Cuisine</h3>
              </div>
              <p style="margin: 0; color: #666; font-size: 15px; line-height: 1.5;">
                Now you can easily filter recipes by cuisine type! Whether you're craving Punjabi, Italian, Chinese, or any other cuisine, finding your perfect recipe is just a click away.
              </p>
            </div>
            <div style="background: #f9fafb; border-left: 4px solid #764ba2; padding: 20px; margin-bottom: 20px; border-radius: 6px;">
              <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <span style="font-size: 28px; margin-right: 12px;">📸</span>
                <h3 style="margin: 0; color: #333; font-size: 20px; font-weight: bold;">Image Upload</h3>
              </div>
              <p style="margin: 0; color: #666; font-size: 15px; line-height: 1.5;">
                Share your culinary creations with beautiful images! Upload photos directly from your device to showcase your delicious recipes to the community.
              </p>
            </div>
          </div>
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://dishcoveryy.vercel.app" style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
              Explore DishCovery Now
            </a>
          </div>
        </div>
        <div style="padding: 30px; text-align: center; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Happy cooking! 🎉</p>
          <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px;">The DishCovery Team</p>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
              You're receiving this email because you're a valued member of DishCovery.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// 4️⃣ Send notification to all registered users
async function sendNotificationToAll() {
  try {
    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      const htmlContent = getNotificationEmailTemplate(user.fullName || user.username);

      await transporter.sendMail({
        from: EMAIL_USER,
        to: user.email,
        subject: '🎉 DishCovery Has New Features!',
        html: htmlContent,
      });

      console.log(`Email sent to ${user.email}`);

      // Delay 1 second to avoid Gmail rate limits
      await new Promise(r => setTimeout(r, 1000));
    }

    console.log('All emails sent!');
    process.exit(0);
  } catch (err) {
    console.error('Error sending notifications:', err);
    process.exit(1);
  }
}


sendNotificationToAll();
