const DButils = require("./DButils");

async function markAsFavorite(username, recipe_id){
    await DButils.execQuery(`insert into favoriterecipes values ('${recipe_id}',${username})`);
}

async function getFavoriteRecipes(username){
    const recipes_id = await DButils.execQuery(`select recipeid from favoriterecipes where username='${username}'`);
    return recipes_id;
}

async function getCreatorRecipes(username){
    const recipes_id = await DButils.execQuery(`select id from recipes where username='${username}'`);
    return recipes_id;
}

async function getFamilyRecipes(username){
    const recipes_id = await DButils.execQuery(`select id from familyrecipes where username='${username}'`);
    return recipes_id;
}



exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getCreatorRecipes = getCreatorRecipes;
exports.getFamilyRecipes = getFamilyRecipes;


