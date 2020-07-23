var express = require("express");
var router = express.Router();
var pool = require("../queries");
const passport = require("passport");

router.get("/username", (req, res) => {
  if (
    !(
      req.query.username &&
      req.query.username.length > 3 &&
      /^[a-zA-Z0-9]+$/.test(req.query.username)
    )
  ) {
    console.log(req.query);
    res.json({
      isAvailable: false,
    });
    return;
  }
  pool.query(
    "SELECT * from profile where username = $1",
    [req.query.username],
    (error, results) => {
      if (error) {
        res.status(500).end();
        throw error;
      }
      if (results.rows.length > 0) {
        res.json({
          isAvailable: false,
        });
      } else {
        res.json({
          isAvailable: true,
        });
      }
    }
  );
});

router.get("/email", (req, res) => {
  if (
    !(
      req.query.email &&
      /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(
        req.query.email
      )
    )
  ) {
    console.log(req.query);
    res.json({
      isAvailable: false,
    });
    return;
  }
  pool.query(
    "SELECT * from profile where email = $1",
    [req.query.email],
    (error, results) => {
      if (error) {
        res.status(500).end();
        throw error;
      }
      if (results.rows.length > 0) {
        res.json({
          isAvailable: false,
        });
      } else {
        res.json({
          isAvailable: true,
        });
      }
    }
  );
});

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

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async function (req, res) {
    res.json(req.user);
  }
);

router.get(
  "/home",
  passport.authenticate("jwt", { session: false }),
  async function (req, res) {
    let out = req.user;
    let {
      favouriteBooks,
      favouriteCourses,
      favouritePlaylists,
    } = req.user.profileinfo;
    out.profileinfo.favouriteBooks = await convertFavourites(
      "book",
      favouriteBooks
    );
    out.profileinfo.favouriteCourses = await convertFavourites(
      "course",
      favouriteCourses
    );
    out.profileinfo.favouritePlaylists = await convertFavourites(
      "playlist",
      favouritePlaylists
    );
    res.json(out);
  }
);

module.exports = router;
