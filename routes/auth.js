var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");
var request = require("request");
var pool = require("../queries");
const jwt = require("jsonwebtoken");
const passport = require("passport");
var bcrypt = require("bcryptjs");
var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: "crwdtechinc@gmail.com",
    pass: "crwdinc123",
  },
});

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
router.get("/verify", (req, res) => {
  const { id } = req.query;
  const { email } = jwt.verify(id, "nodeauthsecret");
  pool.query(
    "UPDATE profile SET is_verified = $1 WHERE email = $2",
    [true, email],
    (error, results) => {
      if (error) {
        res.status(500).end();
        throw error;
      }
      var token = jwt.sign(
        JSON.parse(JSON.stringify({ email })),
        "nodeauthsecret",
        {
          expiresIn: 365 * 24 * 60 * 60 * 1000,
        }
      );
      res.render("verified", { title: "Email Verified", email });
    }
  );
});

router.post("/login", (req, res) => {
  var { username, password } = req.body;
  pool.query(
    "SELECT * from profile where username = $1 and is_verified = $2",
    [username, true],
    (error, results) => {
      if (error) {
        res.status(500).end();
        throw error;
      }
      if (results.rows[0]) {
        if (bcrypt.compareSync(password, results.rows[0].password)) {
          var token = jwt.sign(
            JSON.parse(JSON.stringify({ email: results.rows[0].email })),
            "nodeauthsecret",
            {
              expiresIn: 365 * 24 * 60 * 60 * 1000,
            }
          );
          res.json({
            JWT: "JWT " + token,
          });
        } else {
          res.status(401).end();
        }
      } else {
        res.status(401).end();
      }
    }
  );
});

router.post("/register", (req, res) => {
  var { email, username, password } = req.body;
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);
  pool.query(
    "SELECT * from profile where email = $1",
    [email],
    (error, results) => {
      if (error) {
        res.status(500).end();
        throw error;
      }
      if (results.rows[0]) {
        var token = jwt.sign(
          JSON.parse(JSON.stringify({ email })),
          "nodeauthsecret",
          {
            expiresIn: 365 * 24 * 60 * 60 * 1000,
          }
        );
        res.json({
          JWT: "JWT " + token,
        });
      } else {
        pool.query(
          "INSERT INTO profile (email, password, username, is_verified) VALUES ($1, $2, $3, $4)",
          [email, hash, username, false],
          (error, results) => {
            if (error) {
              res.status(500).end();
              throw error;
            }
            var token = jwt.sign(
              JSON.parse(JSON.stringify({ email })),
              "nodeauthsecret",
              {
                expiresIn: 365 * 24 * 60 * 60 * 1000,
              }
            );
            link = "http://" + req.get("host") + "/auth/verify?id=" + token;
            mailOptions = {
              to: email,
              subject: "Please confirm your Email account",
              html:
                "Hello,<br> Please Click on the link to verify your email.<br><a href=" +
                link +
                ">Click here to verify</a>",
            };
            console.log(mailOptions);
            smtpTransport.sendMail(mailOptions, function (error, response) {
              if (error) {
                console.log(error);
                res.end("error");
              } else {
                console.log("Message sent: " + response.message);
                res.end("sent");
              }
            });
          }
        );
      }
    }
  );
});

router.post("/google", async function (req, res, next) {
  fetch(
    `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${req.body.tokenId}`
  )
    .then((res) => res.json())
    .then(async (json) => {
      var { email, picture } = json;
      var id = json.sub;
      console.log({
        email,
        id,
        picture,
      });
      pool.query(
        "SELECT * from profile where email = $1",
        [email],
        async (error, results) => {
          if (error) {
            res.status(500).end();
            throw error;
          }
          if (results.rows[0]) {
            var token = jwt.sign(
              JSON.parse(JSON.stringify({ email })),
              "nodeauthsecret",
              {
                expiresIn: 365 * 24 * 60 * 60 * 1000,
              }
            );
            res.json({
              JWT: "JWT " + token,
            });
          } else {
            let username = email.split("@")[0].replace(/[^a-zA-Z]/gi, "");
            let count = 0;
            let isUsernameAvailable = false;
            while (!isUsernameAvailable) {
              let dbResp = await pool.query(
                "SELECT * from profile where username = $1",
                [count ? username + count : username]
              );
              if (dbResp.rows.length == 0) {
                isUsernameAvailable = true;
              } else {
                count += Math.floor(100 + Math.random() * 900);
              }
            }
            username = count ? username + count : username;
            pool.query(
              "INSERT INTO profile (email, username, picture) VALUES ($1, $2, $3)",
              [email, username, picture],
              (error, results) => {
                if (error) {
                  res.status(500).end();
                  throw error;
                }
                pool.query(
                  "INSERT INTO oauth (provider, provider_id, email) VALUES ($1, $2, $3)",
                  ["Google", id, email],
                  (error, results) => {
                    if (error) {
                      res.status(500).end();
                      throw error;
                    }
                    var token = jwt.sign(
                      JSON.parse(JSON.stringify({ email })),
                      "nodeauthsecret",
                      {
                        expiresIn: 365 * 24 * 60 * 60 * 1000,
                      }
                    );
                    res.json({
                      JWT: "JWT " + token,
                    });
                  }
                );
              }
            );
          }
        }
      );
    });
});

router.post("/linkedin", (req, res) => {
  request(
    {
      url: `https://www.linkedin.com/oauth/v2/accessToken?client_id=81jojxryre3jo3&grant_type=authorization_code&code=${req.body.code}&redirect_uri=http://localhost:3000/linkedin&client_secret=bvH0HsKn8bZl0Ak8`,
      method: "POST",
      headers: {
        "Content-Type": "x-www-form-urlencoded",
      },
    },
    (err, response, body) => {
      fetch(
        "https://api.linkedin.com/v2/me?projection=(id,profilePicture(displayImage~:playableStreams))",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${JSON.parse(body).access_token}`,
            Connection: "Keep-Alive",
          },
        }
      )
        .then(function (res) {
          return res.json();
        })
        .then(function (json) {
          var id = json.id;
          try {
            var picture =
              json.profilePicture["displayImage~"].elements[0].identifiers[0]
                .identifier;
          } catch (error) {
            var picture = "";
          }
          fetch(
            "https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${JSON.parse(body).access_token}`,
                Connection: "Keep-Alive",
              },
            }
          )
            .then(function (res) {
              return res.json();
            })
            .then(async function (json) {
              try {
                var email = json.elements[0]["handle~"].emailAddress;
              } catch (error) {
                res.status(401).end();
                return;
              }
              console.log({
                email,
                id,
                picture,
              });
              pool.query(
                "SELECT * from profile where email = $1",
                [email],
                async (error, results) => {
                  if (error) {
                    res.status(500).end();
                    throw error;
                  }
                  if (results.rows[0]) {
                    var token = jwt.sign(
                      JSON.parse(JSON.stringify({ email })),
                      "nodeauthsecret",
                      {
                        expiresIn: 365 * 24 * 60 * 60 * 1000,
                      }
                    );
                    res.json({
                      JWT: "JWT " + token,
                    });
                  } else {
                    let username = email
                      .split("@")[0]
                      .replace(/[^a-zA-Z]/gi, "");
                    let count = 0;
                    let isUsernameAvailable = false;
                    while (!isUsernameAvailable) {
                      let dbResp = await pool.query(
                        "SELECT * from profile where username = $1",
                        [count ? username + count : username]
                      );
                      if (dbResp.rows.length == 0) {
                        isUsernameAvailable = true;
                      } else {
                        count += Math.floor(100 + Math.random() * 900);
                      }
                    }
                    username = count ? username + count : username;
                    pool.query(
                      "INSERT INTO profile (email, picture, username) VALUES ($1, $2, $3)",
                      [email, picture, username],
                      (error, results) => {
                        if (error) {
                          res.status(500).end();
                          throw error;
                        }
                        pool.query(
                          "INSERT INTO oauth (provider, provider_id, email) VALUES ($1, $2, $3)",
                          ["Linkedin", id, email],
                          (error, results) => {
                            if (error) {
                              res.status(500).end();
                              throw error;
                            }
                            var token = jwt.sign(
                              JSON.parse(JSON.stringify({ email })),
                              "nodeauthsecret",
                              {
                                expiresIn: 365 * 24 * 60 * 60 * 1000,
                              }
                            );
                            res.json({
                              JWT: "JWT " + token,
                            });
                          }
                        );
                      }
                    );
                  }
                }
              );
            });
        });
    }
  );
});

router.post(
  "/test",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    res.status(200).end();
  }
);

module.exports = router;
