const express = require('express')
const router = express.Router()

const {
  addRecipe,
  getMyRecipes,
  getRecipes,
  getAllRecipes,
  deleteRecipe,
  getSingleRecipe,
  toggleLike,
  getRecipesByIngredient,
  getRecipesByCuisine,
  getTopRecipes
} = require('../controllers/RecipeController')

const verifyToken = require('../middleware/auth')
const upload = require('../middleware/upload')

router.post('/addRecipe', verifyToken, upload.single('image'), addRecipe)
router.get('/get/my-recipes', verifyToken, getMyRecipes)

router.get('/getRecipes/:id', getRecipes)
router.get('/getRecipes/:category',getTopRecipes)


router.get('/getAllRecipes', getAllRecipes)
router.delete('/recipes/:id', verifyToken, deleteRecipe)
router.get('/:id', getSingleRecipe)
router.put('/:id/like', verifyToken, toggleLike)

router.get('/search/by-ingredient', getRecipesByIngredient)
router.get('/search/by-cuisine', getRecipesByCuisine)

module.exports = router
