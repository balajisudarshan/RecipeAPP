const mongoose = require('mongoose');
const Recipe = require('./models/Recipe');
const User = require('./models/User');
require('dotenv').config()
mongoose.connect(process.env.MONGO_URI);

async function updateOwnerEmails() {
  try {
    const recipes = await Recipe.find().populate('createdBy', 'email username');
    for (const recipe of recipes) {
      if (recipe.createdBy && recipe.createdBy.email) {
        const cuisine = recipe.cuisine || "Other";
        await Recipe.updateOne(
          { _id: recipe._id },
          {
            $set: {
              ownerEmail: recipe.createdBy.email,
              creatorName: recipe.createdBy.username || recipe.creatorName,
              cuisine,
            },
          },
          { runValidators: false }
        );
      }
    }
    console.log("✅ All recipes updated successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error updating recipes:", err);
    mongoose.connection.close();
  }
}

updateOwnerEmails();
