const express = require('express')
const router = express.Router()
const Recipe = require('../models/Recipe')
const {
  addRecipe,
  getMyRecipes,
  getRecipes,
  getAllRecipes,
  deleteRecipe,
  getSingleRecipe,
  toggleLike,
  getRecipesByIngredient,
  getRecipesByCuisine
} = require('../controllers/RecipeController')
const verifyToken = require('../middleware/auth.js')
const multer = require('multer')

// Image Upload cheyadaniki ididididi
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
})

const upload = multer({ storage })


router.post('/addRecipe', verifyToken, upload.single('image'), addRecipe)
router.get('/get/my-recipes', verifyToken, getMyRecipes)

router.get('/getRecipes/:id', getRecipes)
router.get('/getAllRecipes', getAllRecipes)
router.delete('/recipes/:id', verifyToken, deleteRecipe)
router.get('/:id', getSingleRecipe)
router.put('/:id/like', verifyToken, toggleLike)

router.get('/search/by-ingredient', getRecipesByIngredient)
router.get('/search/by-cuisine', getRecipesByCuisine)

module.exports = router
