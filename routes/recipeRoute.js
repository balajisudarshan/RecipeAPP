const express = require('express')
const router = express.Router()
const Recipe = require('../models/Recipe')
const {addRecipe,getMyRecipes,getRecipes,getAllRecipes,deleteRecipe,getSingleRecipe} = require('../controllers/RecipeController')
const verifyToken = require('../middleware/auth.js')

router.post('/addRecipe',verifyToken,addRecipe)
router.get('/get/my-recipes',verifyToken,getMyRecipes)

router.get('/getRecipes/:id',getRecipes)
router.get('/getAllRecipes',getAllRecipes)
router.delete('/recipes/:id',verifyToken,deleteRecipe)
router.get('/:id',getSingleRecipe)
module.exports = router