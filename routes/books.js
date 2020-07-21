var express = require("express");
var router = express.Router();
var pool = require("../queries");
const passport = require("passport");

// var inputData = require("../test-books.json");

// for (let i = 0; i < inputData.length; i++) {
//   var temp = inputData[i];
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
        console.log(dbRes.rows);
        res.json(dbRes.rows);
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
    LIMIT $1 OFFSET $2`,
      [itemsPerPage, (page - 1) * itemsPerPage]
    )
    .then((dbRes) => {
      res.json(dbRes.rows);
    })
    .catch((e) => res.status(500).end());
});

router.post(
  "/review/:id/",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    console.log(req.user);
    pool
      .query(
        `UPDATE book
    SET bookinfo = jsonb_set(
      bookinfo::jsonb,
      array['reviews'],
      (bookinfo->'reviews')::jsonb || $2::jsonb)
    WHERE id = $1;`,
        [
          req.params.id,
          `${[
            JSON.stringify({
              email: req.user.email,
              rating: req.body.rating,
              review: req.body.review,
            }),
          ]}`,
        ]
      )
      .then(() => res.status(200).end())
      .catch((e) => {
        console.log(e);
        res.status(500).end();
      });
  }
);

module.exports = router;
