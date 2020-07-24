var express = require("express");
var router = express.Router();
var pool = require("../queries");
const passport = require("passport");
const recommend = require("collaborative-filter");

function createRecommendFunction(tableName, favouriteName) {
    return async function (userId) {
        let favourites = await pool.query(
            `SELECT id, profileinfo->'${favouriteName}' as models from profile ORDER BY id`
        );

        let models = await pool.query(
            `SELECT id from ${tableName}`
        );
        
        console.log(favouriteName)
        
        models = models.rows.map(obj => obj.id);
        favourites = favourites.rows;

        const userIndex = favourites.findIndex(element => element.id == userId);
    
        let allFavouriteArray = [];

        console.log(models, favourites, allFavouriteArray);

        favourites.forEach(element => {
            allFavouriteArray.push( 
                models.map(modelID => 
                    element.models.includes(modelID.toString()) ? 1 : 0)
            );
        });

        const coMatrix = recommend.coMatrix(allFavouriteArray, 
            favourites.len, models.len);
        const result = recommend.getRecommendations(allFavouriteArray, coMatrix, userIndex)
            .map(modelIndex => models[modelIndex]);
        return result;
    };
}


module.exports = {
    recommendCourse: createRecommendFunction("course", "favouriteCourses"),
    recommendBooks: createRecommendFunction("book", "favouriteBooks"),
    recommendPlaylist: createRecommendFunction("playlist", "favouritePlaylists"),
};