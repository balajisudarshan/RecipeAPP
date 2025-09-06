const Recipe = require('../models/Recipe');
const mongoose = require('mongoose')

const getSingleRecipe = async(req,res)=>{
  const {id} = req.params
  try {
    const recipe = await Recipe.findById(id)
    if(!recipe) {
      return res.status(404).json({message:"Recipe not found"})
    }
    return res.status(200).json(recipe)
  } catch (error) {
    return res.status(500).json({message:"internal server error",error})
  }
}

const addRecipe = async (req, res) => {
  const { title, description, ingredients, image, foodType } = req.body;

  try {
    const newRecipe = new Recipe({
      title,
      description,
      ingredients,
       image: image || "https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/quick_flatbreads_43123_16x9.jpg",//"https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      createdBy: req.user.id,
      creatorName: req.user.username,
      foodType, 
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

const getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.user.id })
    res.status(200).json({ recipes })
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
    console.error("Error fetching recipes:", err.message);
  }
}
const getRecipes = async (req, res) => {
  const { id } = req.params;
  try {
    const recipes = await Recipe.find({ createdBy: id })
    if (!recipes || recipes.length === 0) {
      return res.status(404).json({ message: "No recipes found for this user" })
    }
    res.status(200).json({ recipes })
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
    console.error("Error fetching recipes:", err.message);
  }
}

const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find()
    if (!recipes || recipes.length === 0) {
      return res.status(404).json({ message: "No recipes found" })
    }
    res.status(200).json({ recipes });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
    console.error("Error fetching all recipes:", err.message);
  }
}
const deleteRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id
    const userId = req.user.id

    const recipe = await Recipe.findById(recipeId)
    if (!mongoose.isValidObjectId(recipeId)) {
      return res.status(400).json({ message: "Invalid recipe ID format" });
    }
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" })
    }
    if (!recipe.createdBy.equals(userId)) {
      return res.status(403).json({ message: "No rights to delete the data" })
    }

    await Recipe.findByIdAndDelete(recipeId)

    return res.status(200).json({ message: "Recipe deleted successfully" })
  } catch (err) {
    console.error("Error deleting recipe", err)
    res.status(500).json({ message: "server error" })

  }
}
module.exports = { addRecipe, getMyRecipes, getRecipes, getAllRecipes, deleteRecipe , getSingleRecipe};
