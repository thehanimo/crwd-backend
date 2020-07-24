var express = require("express");
var router = express.Router();
var pool = require("../queries");
const passport = require("passport");

const recommendations = require("../utils/recommendation"); 

async function convertFavourites(table, arr) {
  if (arr.length == 0) return [];
  let params = [];
  for (let i = 1; i <= arr.length; i++) {
    params.push("$" + i);
  }

  let results = await pool.query(
    `SELECT * from ${table} where id IN (${params.join(",")})`,
    arr
  );
  return results.rows;
}

function createRecommendationRoute(tableName, recommendationFunction) {
    return function(req, res) {
        const recommended = recommendationFunction(req.user.id).then((recs => {
          if (recs.len == 0) {
            res.json([]);
            return;
          }
          convertFavourites(tableName, recs).then(converted => {
            console.log(converted);
            res.json(converted);
          });
        }));
    };
}

router.get(
    "/course",
    passport.authenticate("jwt", { session: false }),
    createRecommendationRoute("course", recommendations.recommendCourse)
  );

router.get(
    "/book",
    passport.authenticate("jwt", { session: false }),
    createRecommendationRoute("book", recommendations.recommendBooks)
  );

router.get(
    "/playlist",
    passport.authenticate("jwt", { session: false }),
    createRecommendationRoute("playlist", recommendations.recommendPlaylist)
  );

module.exports = router;
