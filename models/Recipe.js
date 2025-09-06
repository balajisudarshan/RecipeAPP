const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String],
    required: true,
  },

  image: {
    type: String,
    default: "", // leave blank, we’ll set conditionally in pre-save
  },
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  creatorName: {
    type: String,
  },
  foodType: {
    type: String,
    enum: ["veg", "non-veg"],
    required: true,
  },
});

// Pre-save hook for defaults
recipeSchema.pre("save", async function (next) {
  try {
    // Assign creator name
    if (!this.creatorName && this.createdBy) {
      const User = mongoose.model("User");
      const user = await User.findById(this.createdBy).select("username");
      if (user) {
        this.creatorName = user.username;
      }
    }

    // Assign image if not provided
    if (!this.image || this.image.trim() === "") {
      if (this.foodType === "veg") {
        this.image =
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"; // veg default
      } else {
        this.image =
          "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80"; // non-veg default
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Recipe", recipeSchema);
