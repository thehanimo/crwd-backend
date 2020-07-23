var express = require("express");
var router = express.Router();
var pool = require("../queries");
const passport = require("passport");

function createFavouritePostRoute(infoname) {
  return function (req, res) {
    pool
      .query(
        `UPDATE profile SET
      profileinfo = jsonb_set(
      profileinfo::jsonb,
      array['${infoname}'],
      (profileinfo->'${infoname}')::jsonb || $2::jsonb)
    WHERE id = $1;`,
        [req.user.id, `${[JSON.stringify(req.params.id)]}`]
      )
      .then(() => {
        res.status(200).end();
      })
      .catch((e) => {
        console.log("error", e);
        res.status(500).end();
      });
  };
}

function createFavouriteDeleteRoute(infoname) {
  return function (req, res) {
    pool
      .query(
        `UPDATE profile SET
        profileinfo = jsonb_set(
            profileinfo::jsonb,
            array['${infoname}'],
            (profileinfo->'${infoname}') - $2
        )
      WHERE id = $1;`,
        [req.user.id, `${req.params.id}`]
      )
      .then(() => {
        res.status(200).end();
      })
      .catch((e) => {
        console.log("error", e);
        res.status(500).end();
      });
  };
}

router.post(
  "/course/:id",
  passport.authenticate("jwt", { session: false }),
  createFavouritePostRoute("favouriteCourses")
);

router.post(
  "/playlist/:id",
  passport.authenticate("jwt", { session: false }),
  createFavouritePostRoute("favouritePlaylists")
);

router.post(
  "/book/:id",
  passport.authenticate("jwt", { session: false }),
  createFavouritePostRoute("favouriteBooks")
);

router.delete(
  "/course/:id",
  passport.authenticate("jwt", { session: false }),
  createFavouriteDeleteRoute("favouriteCourses")
);

router.delete(
  "/playlist/:id",
  passport.authenticate("jwt", { session: false }),
  createFavouriteDeleteRoute("favouritePlaylists")
);

router.delete(
  "/book/:id",
  passport.authenticate("jwt", { session: false }),
  createFavouriteDeleteRoute("favouriteBooks")
);

module.exports = router;
