var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");


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
    recipes_id.map((element) => recipes_id_array.push(element.recipeid)); //extracting the recipe ids into array
    let promises = [];
    recipes_id_array.map((id) => {
        promises.push(recipe_utils.getRecipeDetails(id));
    });
    let results = await Promise.all(promises);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

router.get('/created', async (req,res,next) => {
  try{
    const username = req.session.username;
    const recipes_id = await user_utils.getCreatorRecipes(username);
    // let recipes_id_array = [];
    // recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    // const results = await recipe_utils.getRecipeDetails(recipes_id_array);
    res.status(200).send(recipes_id);
  } catch(error){
    next(error); 
  }
});

router.get('/family', async (req,res,next) => {
  try{
    const username = req.session.username;
    const recipes_id = await user_utils.getFamilyRecipes(username);
    // let recipes_id_array = [];
    // recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    // const results = await recipe_utils.getRecipeDetails(recipes_id_array);
    res.status(200).send(recipes_id);
  } catch(error){
    next(error); 
  }
});

router.post("/family", async (req, res, next) => {
  let lastId = await DButils.execQuery('SELECT id FROM familyrecipes ORDER BY id DESC LIMIT 1')
  if (lastId==undefined){
    lastId= -1
  }
  try {

    let recipe_details = {
        id: lastId+1,
        creatorUserName: req.session.username,
        writer: req.body.writer,
        customaryTime: req.body.customaryTime,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        image: req.body.image,
        title: req.body.title,
        
    }

    await DButils.execQuery(
      `INSERT INTO familyrecipes VALUES ('${recipe_details.id}', '${recipe_details.creatorUserName}', '${recipe_details.writer}',
      '${recipe_details.customaryTime}', '${recipe_details.ingredients}', '${recipe_details.instructions}', '${recipe_details.image}', 
      '${recipe_details.title}')`
    );
    res.status(201).send({ message: "recipe created", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/addNewRecipe", async (req, res, next) => {
  let lastId = await DButils.execQuery('SELECT id FROM recipes ORDER BY id DESC LIMIT 1')
  let id;
  if (lastId[0]==undefined){
    id= 0;
  }
  else{
    id = lastId[0]["id"] + 1;
  }  

  try {

    let recipe_details = {
        id: id, 
        title: req.body.title,
        readyInMinutes: req.body.readyInMinutes,
        image: req.body.image,
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
      '${recipe_details.image}', '${recipe_details.vegan}', '${recipe_details.vegetarian}', 
      '${recipe_details.glutenFree}', '${recipe_details.servings}', '${recipe_details.ingredients}', '${recipe_details.instructions}', '${recipe_details.creatorUserName}')`
    );
    res.status(201).send({ message: "recipe created", success: true });
  } catch (error) {
    next(error);
  }
});



module.exports = router;
