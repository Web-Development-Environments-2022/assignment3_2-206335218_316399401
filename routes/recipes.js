var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));


/**
 * This path returns a full details of a recipe by its id
 */
router.get("/PrevDetails/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

router.get("/FullDetails/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetailsExtended(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

router.get("/searchRecipe", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getFoundedRecipesDetails(req.query.query, req.query.number, req.query.cuisine, req.query.diet, req.query.intolerances);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});






module.exports = router;
