const passport = require("passport");
const pool = require("../queries");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"),
  secretOrKey: "nodeauthsecret",
};
passport.use(
  "jwt",
  new JwtStrategy(opts, function (jwt_payload, done) {
    pool.query(
      "SELECT * from profile where email = $1",
      [jwt_payload.email],
      (error, results) => {
        if (error) {
          throw error;
        }
        if (results.rows[0]) {
          pool.query(
            "SELECT * from auth where email = $1",
            [jwt_payload.email],
            (error, aresults) => {
              if (error) {
                throw error;
              }
              return done(null, { ...results.rows[0], ...aresults.rows[0] });
            }
          );
        } else return done(null, null);
      }
    );
  })
);
