var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");
var recipe_id = 0;
var famRecipe_id = 0;

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.username) {
    DButils.execQuery("SELECT username FROM users").then((users) => {
      if (users.find((x) => x.username === req.session.username)) {
        req.username = req.session.username;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const username = req.session.username;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(username,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const username = req.session.username;
    const recipes_id = await user_utils.getFavoriteRecipes(username);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipeDetails(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

router.get('/created', async (req,res,next) => {
  try{
    const username = req.session.username;
    const recipes_id = await user_utils.getCreatorRecipes(username);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipeDetails(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

router.get('/family', async (req,res,next) => {
  try{
    const username = req.session.username;
    const recipes_id = await user_utils.getFamilyRecipes(username);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipeDetails(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

router.post("/family", async (req, res, next) => {
  try {

    let recipe_details = {
        id: famRecipe_id++,//TODO add id !!
        creatorUserName: req.session.username,
        writer: req.body.writer,
        customaryTime: req.body.customaryTime,
        ingrediants: req.body.ingrediants,
        instructions: req.body.instructions,
        image: req.body.image,
        title: req.body.title,
        
    }

    await DButils.execQuery(
      `INSERT INTO familyrecipes VALUES ('${recipe_details.id}', '${recipe_details.creatorUserName}', '${recipe_details.writer}',
      '${recipe_details.customaryTime}', '${recipe_details.ingrediants}', '${recipe_details.instructions}', '${recipe_details.image}', 
      '${recipe_details.title}')`
    );
    res.status(201).send({ message: "recipe created", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/addNewRecipe", async (req, res, next) => {
  try {

    let recipe_details = {
        id: recipe_id++, //TODO add id
        title: req.body.title,
        readyInMinutes: req.body.readyInMinutes,
        image: req.body.image,
        popularity: req.body.aggregateLikes,
        vegan: req.body.vegan,
        vegetarian: req.body.vegetarian,
        glutenFree: req.body.glutenFree,
        servings: req.body.servings,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        creatorUserName: req.session.username,
    }
    await DButils.execQuery(
      `INSERT INTO recipes VALUES ('${recipe_details.id}', '${recipe_details.title}', '${recipe_details.readyInMinutes}',
      '${recipe_details.image}', '${recipe_details.popularity}', '${recipe_details.vegan}', '${recipe_details.vegetarian}', 
      '${recipe_details.glutenFree}', '${recipe_details.servings}', '${recipe_details.ingredients}', '${recipe_details.instructions}', '${recipe_details.creatorUserName}')`
    );
    res.status(201).send({ message: "recipe created", success: true });
  } catch (error) {
    next(error);
  }
});



module.exports = router;
