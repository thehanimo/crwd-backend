var express = require("express");
var router = express.Router();
var pool = require("../queries");
const passport = require("passport");

// INSERT BOOKS FROM test-books.json

// var inputData = require("../test-books.json");
// for (let i = 0; i < inputData.length; i++) {
//   var temp = inputData[i];
//   if (!temp.publishedDate) continue;
//   pool
//     .query(
//       "INSERT INTO book(title, link, author, picture, pub_date, bookinfo) VALUES($1, $2, $3, $4, $5, $6)",
//       [
//         temp.title,
//         `https://www.amazon.com/dp/${temp.isbn}`,
//         temp.authors.join(),
//         temp.thumbnailUrl,
//         new Date(temp.publishedDate.$date),
//         {
//           tags: temp.categories,
//           reviews: [],
//           comments: [],
//         },
//       ]
//     )
//     .then((res) => console.log(res.rows[0]))
//     .catch((e) => console.error(e.stack));
// }

router.get("/", (req, res) => {
  if (req.query.id) {
    pool
      .query(`SELECT * FROM book WHERE id = $1`, [req.query.id])
      .then((dbRes) => {
        dbRes.rows[0].bookinfo.reviews = dbRes.rows[0].bookinfo.reviews.reverse();
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
    FROM book
    ORDER BY rating desc
    LIMIT $1 OFFSET $2;`,
      [itemsPerPage, (page - 1) * itemsPerPage]
    )
    .then((dbRes) => {
      res.json(dbRes.rows);
    })
    .catch((e) => res.status(500).end());
});

router.post(
  "/:id/review",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    pool
      .query(`SELECT bookinfo, rating, rating_count from book where id = $1`, [
        req.params.id,
      ])
      .then((dbResp) => {
        let { reviews } = dbResp.rows[0].bookinfo;
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
          dbResp.rows[0].bookinfo.reviews = reviews;
          pool
            .query(
              `UPDATE book
        SET rating = $3, bookinfo = $2
        WHERE id = $1;`,
              [req.params.id, JSON.stringify(dbResp.rows[0].bookinfo), rating]
            )
            .then(() => res.status(200).end())
            .catch((e) => {
              console.log(e);
              res.status(500).end();
            });
        } else {
          pool
            .query(
              `UPDATE book
        SET rating = $3, rating_count = $4, bookinfo = jsonb_set(
          bookinfo::jsonb,
          array['reviews'],
          (bookinfo->'reviews')::jsonb || $2::jsonb)
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
            .then(() => res.status(200).end())
            .catch((e) => {
              res.status(500).end();
            });
        }
      });
  }
);

router.get("/:id/reviews", function (req, res) {
  pool
    .query(`SELECT bookinfo from book where id = $1`, [req.params.id])
    .then((dbResp) => {
      res.json(dbResp.rows[0].bookinfo.reviews.reverse());
    })
    .catch((e) => {
      res.status(500).end();
    });
});

module.exports = router;
