var express = require("express");
var router = express.Router();
var pool = require("../queries");
const passport = require("passport");

router.get("/", async function (req, res) {
  let books = await pool.query(
    `
    SELECT * FROM book WHERE title ILIKE $1 OR author ILIKE $1;`,
    ["%" + req.query.q + "%"]
  );

  let booksByTag = await pool.query(
    `
      select * from book, jsonb_array_elements_text(bookinfo->'tags') where value ILIKE $1;
      `,
    ["%" + req.query.q + "%"]
  );

  let courses = await pool.query(
    `
    SELECT * FROM course WHERE title ILIKE $1 OR professor ILIKE $1;`,
    ["%" + req.query.q + "%"]
  );

  let coursesByTag = await pool.query(
    `
      select * from course, jsonb_array_elements_text(courseinfo->'tags') where value ILIKE $1;
      `,
    ["%" + req.query.q + "%"]
  );

  let playlists = await pool.query(
    `
    SELECT * FROM playlist WHERE title ILIKE $1 OR username ILIKE $1;`,
    ["%" + req.query.q + "%"]
  );

  let playlistsByTag = await pool.query(
    `
      select * from playlist, jsonb_array_elements_text(playlistinfo->'tags') where value ILIKE $1;
      `,
    ["%" + req.query.q + "%"]
  );

  books = books.rows.map((x) => {
    x.type = "book";
    return x;
  });
  booksByTag = booksByTag.rows.map((x) => {
    x.type = "book";
    return x;
  });
  courses = courses.rows.map((x) => {
    x.type = "course";
    return x;
  });
  coursesByTag = coursesByTag.rows.map((x) => {
    x.type = "course";
    return x;
  });
  playlists = playlists.rows.map((x) => {
    x.type = "playlist";
    return x;
  });
  playlistsByTag = playlistsByTag.rows.map((x) => {
    x.type = "playlist";
    return x;
  });

  let out = [
    ...books,
    ...courses,
    ...playlists,
    ...booksByTag,
    ...coursesByTag,
    ...playlistsByTag,
  ];
  if (req.query.autofill) {
    out = out
      .splice(0, 10)
      .map((x, i) => ({ title: x.title, link: x.type + "/" + x.id }));
  } else {
    out = out.splice(0, 100);
  }
  res.json(
    out.sort((a, b) => (parseFloat(a.rating) > parseFloat(b.rating) ? -1 : 1))
  );
});

module.exports = router;
