var express = require("express");
var router = express.Router();
var pool = require("../queries");
const passport = require("passport");

router.get("/username", (req, res) => {
  if (
    !(
      req.query.username &&
      req.query.username.length > 3 &&
      /^[a-zA-Z]+$/.test(req.query.username)
    )
  ) {
    console.log(req.query);
    res.json({
      isAvailable: false,
    });
    return;
  }
  pool.query(
    "SELECT * from auth where username = $1",
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
    "SELECT * from auth where email = $1",
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

router.get("/", passport.authenticate("jwt", { session: false }), function (
  req,
  res
) {
  res.json({
    username: req.user.username,
    email: req.user.email,
    picture: req.user.picture,
  });
  // pool.query(
  //   "SELECT * from auth where email = $1",
  //   [req.query.email],
  //   (error, results) => {
  //     if (error) {
  //       res.status(500).end();
  //       throw error;
  //     }
  //     if (results.rows.length > 0) {
  //       res.json({
  //         isAvailable: false
  //       });
  //     } else {
  //       res.json({
  //         isAvailable: true
  //       });
  //     }
  //   }
  // );
});

module.exports = router;
