var createError = require("http-errors");
var express = require("express");
var cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
var bookRouter = require("./routes/books");
var courseRouter = require("./routes/courses");
var playlistRouter = require("./routes/playlists");
let discussionRouter = require("./routes/discussions");
let favouritesRouter = require("./routes/favourites");
let searchRouter = require("./routes/search");
let recommendRouter = require("./routes/recommendations");
const passportSetup = require("./config/passport-setup");

var app = express();
const corsOptions = {
  origin: true,
  credentials: true,
};
app.options("*", cors(corsOptions));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/books", bookRouter);
app.use("/courses", courseRouter);
app.use("/playlists", playlistRouter);
app.use("/discussions", discussionRouter);
app.use("/favourites", favouritesRouter);
app.use("/search", searchRouter);
app.use("/recommend", recommendRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
