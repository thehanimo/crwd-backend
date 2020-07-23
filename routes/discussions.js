var express = require("express");
var router = express.Router();
var pool = require("../queries");
const passport = require("passport");



function createDiscussionPostRoute(tablename, infoname) {
  return function (req, res) {
    console.log(req.params.id, req.user.username, req.body.comment);
      console.log(req.body);
    pool
      .query(
        `UPDATE ${tablename} SET
      ${infoname} = jsonb_set(
      ${infoname}::jsonb,
      array['comments'],
      (${infoname}->'comments')::jsonb || $2::jsonb)
    WHERE id = $1;`,
          [
            req.params.id,
            `${[
              JSON.stringify({
                username: req.user.username,
                comment: req.body.comment,
                date_written: new Date(Date.now()),
              }),
            ]}`,
          ]
        )
        .then(() => {
          res.json({
            username: req.user.username,
            comment: req.body.comment,
            date_written: new Date(Date.now()),
          });
        })
        .catch((e) => {
          console.log("error", e);
          res.status(500).end();
        });
   }
}

function createDiscussionGetRoute(tablename, infoname) {
  return function(req, res) {
    pool
    .query(`SELECT title, ${infoname} FROM ${tablename} WHERE id = $1`, [req.params.id])
    .then((dbRes) => {
      console.log(dbRes);
      res.json({
        posts: dbRes.rows[0][infoname].comments,
        topic: dbRes.rows[0].title
      });
    })
    .catch((e) => {console.log(e); return res.status(500).end()});  
  }
}

router.post(
  "/course/:id",
  passport.authenticate("jwt", { session: false }),
  createDiscussionPostRoute("course", "courseinfo")
);
router.get("/course/:id", createDiscussionGetRoute("course", "courseinfo"));

router.post(
  "/playlist/:id",
  passport.authenticate("jwt", { session: false }),
  createDiscussionPostRoute("playlist", "playlistinfo")
);
router.get("/playlist/:id", createDiscussionGetRoute("playlist", "playlistinfo"));

router.post(
  "/book/:id",
  passport.authenticate("jwt", { session: false }),
  createDiscussionPostRoute("book", "bookinfo")
);
router.get("/book/:id", createDiscussionGetRoute("book", "bookinfo"));



module.exports = router;
