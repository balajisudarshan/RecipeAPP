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
    default:"https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
  },
  likes:[{
    type:mongoose.Schema.ObjectId,
    ref:'User'
  }],
  createdBy:{
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required:true
  }
})

module.exports = mongoose.model('Recipe',recipeSchema)