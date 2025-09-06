const mongoose =require('mongoose')

const recipeSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true,
  },
  description:{
    type:String,
    required:true,
  },
  ingredients:{
    type:[String],
    required:true,
  },
  
  image:{
    type:String,
    default:"https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/quick_flatbreads_43123_16x9.jpg"
  },
  likes:[{
    type:mongoose.Schema.ObjectId,
    ref:'User'
  }],
  createdBy:{
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required:true
  },
  creatorName:{
    type:String,
    // ref:'User',
    // required:true
  },
  foodType: {
    type: String,
    enum: ["veg", "non-veg"], // only allow these values
    required: true,
  },
})


recipeSchema.pre("save", async function (next) {
  try {
    if (!this.creatorName && this.createdBy) {
      const User = mongoose.model("User");
      const user = await User.findById(this.createdBy).select("username");

      if (user) {
        this.creatorName = user.username;
      }
    }
    next(); 
  } catch (error) {
    next(error); 
  }
});

module.exports = mongoose.model('Recipe',recipeSchema)