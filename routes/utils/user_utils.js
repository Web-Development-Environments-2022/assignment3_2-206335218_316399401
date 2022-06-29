const DButils = require("./DButils");

async function markAsFavorite(username, recipe_id){
    await DButils.execQuery(`insert into favoritesrecipes values ('${recipe_id}','${username}')`);
}

async function getFavoriteRecipes(username){
    const recipes_id = await DButils.execQuery(`select recipeid from favoritesrecipes where username='${username}'`);
    return recipes_id;
}

async function getCreatorRecipes(username){
    const recipes_id = await DButils.execQuery(`select title, readyInMinutes, image, vegan, vegetarian, glutenFree from recipes where creatorUserName='${username}'`);
    return recipes_id;
}

async function getFamilyRecipes(username){
    const recipes_id = await DButils.execQuery(`select title, customaryTime, image, writer, ingredients, instructions from familyrecipes where creatorUserName='${username}'`);
    return recipes_id;
}

async function markAsViewed(username, recipeid){
    // TODO if recipeid already exist - update the time to current time
    await DButils.execQuery(`insert into viewedrecipes values ('${username}','${recipeid}', now())`);

}

async function getThreeLastViewed(username){
    const recipes_id = await DButils.execQuery(`select recipeid from viewedrecipes where username='${username}' order by datetime desc limit 3`);
    return recipes_id;
}


exports.markAsViewed = markAsViewed;
exports.getThreeLastViewed = getThreeLastViewed;

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getCreatorRecipes = getCreatorRecipes;
exports.getFamilyRecipes = getFamilyRecipes;


