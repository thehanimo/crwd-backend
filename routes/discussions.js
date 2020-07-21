var express = require("express");
var router = express.Router();
var pool = require("../queries");
const passport = require("passport");

router.post(
  "/book/:id",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    pool
      .query(
        `UPDATE book
  SET bookinfo = jsonb_set(
    bookinfo::jsonb,
    array['reviews'],
    (bookinfo->'reviews')::jsonb || '[$2]'::jsonb)
  WHERE id = $1;`,
        [
          req.params.id,
          {
            email: req.user.email,
            rating: req.body.rating,
            review: req.body.review,
          },
        ]
      )
      .then(() => res.status(200).end())
      .catch(() => res.status(500).end());
  }
);

module.exports = router;
