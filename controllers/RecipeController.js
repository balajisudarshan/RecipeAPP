const Recipe = require('../models/Recipe');

const addRecipe = async (req, res) => {
  const { title, description, ingredients, image } = req.body;

  try {
    const newRecipe = new Recipe({
      title,
      description,
      ingredients,
      image: image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      createdBy: req.user.id,
      creatorName:req.user.username
    });

    await newRecipe.save();

    res.status(201).json({
      message: "Recipe added successfully",
      recipe: newRecipe,
    });
  } catch (err) {
    console.error("Error adding recipe:", err.message);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

const getMyRecipes = async(req,res)=>{
  try{
    const recipes = await Recipe.find({createdBy: req.user.id})
    res.status(200).json({recipes})
  }catch(err){
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
    console.error("Error fetching recipes:", err.message);
  }
}
const getRecipes = async(req,res)=>{
  const {id} = req.params;
  try{
    const recipes = await Recipe.find({createdBy:id})
    if(!recipes || recipes.length === 0){
      return res.status(404).json({message:"No recipes found for this user"})
    }
    res.status(200).json({recipes})
  }catch(err){
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
    console.error("Error fetching recipes:", err.message);
  }
}

const getAllRecipes = async(req,res)=>{
  try{
    const recipes =await Recipe.find()
    if(!recipes || recipes.length === 0){
      return res.status(404).json({message:"No recipes found"})
    }
    res.status(200).json({recipes});
  }catch(err){
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
    console.error("Error fetching all recipes:", err.message);
  }
}
module.exports = { addRecipe,getMyRecipes,getRecipes,getAllRecipes };
