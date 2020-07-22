var express = require("express");
var router = express.Router();
var pool = require("../queries");
const passport = require("passport");

router.get("/", (req, res) => {
  if (req.query.id) {
    pool
      .query(`SELECT * FROM playlist WHERE id = $1`, [req.query.id])
      .then((dbRes) => {
        dbRes.rows[0].playlistinfo.reviews = dbRes.rows[0].playlistinfo.reviews.reverse();
        res.json(dbRes.rows[0]);
      })
      .catch((e) => res.status(500).end());
    return;
  }
  var itemsPerPage = 9;
  var page = req.query.page || 1;

  pool
    .query(
      `SELECT *, CEILING((count(*) OVER()) / 9.0) AS totalPages
    FROM playlist
    ORDER BY rating desc
    LIMIT $1 OFFSET $2;`,
      [itemsPerPage, (page - 1) * itemsPerPage]
    )
    .then((dbRes) => {
      res.json(dbRes.rows);
    })
    .catch((e) => res.status(500).end());
});

router.post("/", passport.authenticate("jwt", { session: false }), function (
  req,
  res
) {
  let { title, description, playlistinfo } = req.body;
  let { username } = req.user;
  let user_picture = req.user.picture;
  playlistinfo.reviews = [];
  playlistinfo.tags = [];
  playlistinfo.comments = [];
  pool
    .query(
      `INSERT INTO playlist(title, description, username, user_picture, pub_date, playlistinfo)
            VALUES($1, $2, $3, $4, $5, $6);`,
      [
        title.trim(),
        description.trim(),
        username,
        user_picture,
        new Date(Date.now()),
        playlistinfo,
      ]
    )
    .then(() => res.status(200).end())
    .catch((e) => res.status(500).end());
});

router.post(
  "/:id/review",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    pool
      .query(
        `SELECT playlistinfo, rating, rating_count from playlist where id = $1`,
        [req.params.id]
      )
      .then((dbResp) => {
        let { reviews } = dbResp.rows[0].playlistinfo;
        let { username } = req.user;
        let { rating, rating_count } = dbResp.rows[0];
        rating = parseFloat(rating);
        let doesExist = false;
        for (let i = 0; i < reviews.length; i++) {
          if (reviews[i].username === username) {
            rating =
              rating + (req.body.rating - reviews[i].rating) / rating_count;
            reviews[i].rating = req.body.rating;
            reviews[i].review = req.body.review;
            reviews[i].date_written = new Date(Date.now());
            doesExist = true;
            break;
          }
        }
        if (doesExist) {
          dbResp.rows[0].playlistinfo.reviews = reviews;
          pool
            .query(
              `UPDATE playlist
          SET rating = $3, playlistinfo = $2
          WHERE id = $1;`,
              [
                req.params.id,
                JSON.stringify(dbResp.rows[0].playlistinfo),
                rating,
              ]
            )
            .then(() => res.json({ rating }))
            .catch((e) => {
              console.log(e);
              res.status(500).end();
            });
        } else {
          pool
            .query(
              `UPDATE playlist
          SET rating = $3, rating_count = $4, playlistinfo = jsonb_set(
            playlistinfo::jsonb,
            array['reviews'],
            (playlistinfo->'reviews')::jsonb || $2::jsonb)
          WHERE id = $1;`,
              [
                req.params.id,
                `${[
                  JSON.stringify({
                    username: req.user.username,
                    rating: req.body.rating,
                    review: req.body.review,
                    date_written: new Date(Date.now()),
                  }),
                ]}`,
                (rating * rating_count + req.body.rating) / (rating_count + 1),
                rating_count + 1,
              ]
            )
            .then(() =>
              res.json({
                rating:
                  (rating * rating_count + req.body.rating) /
                  (rating_count + 1),
              })
            )
            .catch((e) => {
              res.status(500).end();
            });
        }
      });
  }
);

router.get("/:id/reviews", function (req, res) {
  pool
    .query(`SELECT playlistinfo from playlist where id = $1`, [req.params.id])
    .then((dbResp) => {
      res.json(dbResp.rows[0].playlistinfo.reviews.reverse());
    })
    .catch((e) => {
      res.status(500).end();
    });
});

module.exports = router;
