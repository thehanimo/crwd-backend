var express = require("express");
var router = express.Router();
var pool = require("../queries");
const passport = require("passport");

// INSERT COURSES FROM test-courses.json
var inputData = require("../test-courses.json");
const { getCourseReviews, getRandomDiscussions } = require("../test-reviews");

setTimeout(() => {
  pool.query("SELECT * from course LIMIT 2;").then((res) => {
    if (res.rows.length == 0) {
      for (let i = 0; i < inputData.length; i++) {
        var temp = inputData[i];
        let { reviews, rating, rating_count } = getCourseReviews();
        let comments = getRandomDiscussions();
        pool
          .query(
            "INSERT INTO course(title, link, professor, picture, courseinfo, rating, rating_count, description) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
            [
              temp.title,
              `https://www.amazon.com/dp/${temp.isbn}`,
              temp.professor,
              temp.picture,
              {
                tags: temp.tags,
                reviews,
                comments,
              },
              rating,
              rating_count,
              temp.description,
            ]
          )
          .then((res) => console.log(res.rows[0]))
          .catch((e) => console.error(e.stack));
      }
    }
  });
}, 2000);

router.get("/", (req, res) => {
  if (req.query.id) {
    pool
      .query(`SELECT * FROM course WHERE id = $1`, [req.query.id])
      .then((dbRes) => {
        dbRes.rows[0].courseinfo.reviews = dbRes.rows[0].courseinfo.reviews.reverse();
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
    FROM course
    ORDER BY rating desc, id
    LIMIT $1 OFFSET $2;`,
      [itemsPerPage, (page - 1) * itemsPerPage]
    )
    .then((dbRes) => {
      console.log(dbRes.rows);
      res.json(dbRes.rows);
    })
    .catch((e) => res.status(500).end());
});

router.post(
  "/:id/review",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    pool
      .query(
        `SELECT courseinfo, rating, rating_count from course where id = $1`,
        [req.params.id]
      )
      .then((dbResp) => {
        let { reviews } = dbResp.rows[0].courseinfo;
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
          dbResp.rows[0].courseinfo.reviews = reviews;
          pool
            .query(
              `UPDATE course
        SET rating = $3, courseinfo = $2
        WHERE id = $1;`,
              [req.params.id, JSON.stringify(dbResp.rows[0].courseinfo), rating]
            )
            .then(() => res.json({ rating }))
            .catch((e) => {
              console.log(e);
              res.status(500).end();
            });
        } else {
          pool
            .query(
              `UPDATE course
        SET rating = $3, rating_count = $4, courseinfo = jsonb_set(
          courseinfo::jsonb,
          array['reviews'],
          (courseinfo->'reviews')::jsonb || $2::jsonb)
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
    .query(`SELECT courseinfo from course where id = $1`, [req.params.id])
    .then((dbResp) => {
      res.json(dbResp.rows[0].courseinfo.reviews.reverse());
    })
    .catch((e) => {
      res.status(500).end();
    });
});

module.exports = router;
