const express = require('express')
const router = express.Router()
const Recipe = require('../models/Recipe')
const {addRecipe,getMyRecipes,getRecipes} = require('../controllers/RecipeController')
const verifyToken = require('../middleware/auth.js')

router.post('/addRecipe',verifyToken,addRecipe)//to add a recipe
router.get('/get/my-recipes',verifyToken,getMyRecipes)//to get all the users recipes
router.get('/getRecipes/:id',getRecipes)
module.exports = router