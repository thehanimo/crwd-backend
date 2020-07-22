const Pool = require("pg").Pool;
const pool = new Pool({
  user: "root",
  host: "localhost",
  database: "crwd",
  password: "password",
  port: 5432,
});
pool.query(`
CREATE TABLE if not exists book (
  id serial not null primary key,
  title varchar(10000),
  link varchar(10000),
  author varchar(10000),
  picture varchar(10000),
  pub_date date,
  rating decimal default 0,
  rating_count int default 0,
  bookinfo jsonb
  );

  CREATE TABLE if not exists course (
    id serial not null primary key,
    title varchar(10000),
    link varchar(10000),
    professor varchar(10000),
    picture varchar(10000),
    rating decimal default 0,
    rating_count int default 0,
    courseinfo jsonb
    );

    CREATE TABLE if not exists playlist (
      id serial not null primary key,
      title varchar(10000),
      description varchar(10000),
      username varchar(10000),
      user_picture varchar(10000),
      pub_date date,
      rating decimal default 0,
      rating_count int default 0,
      playlistinfo jsonb
      );

CREATE TABLE if not exists profile (
  id serial not null primary key,
  username varchar(10000),
  email varchar(10000) unique,
  is_verified varchar(10000),
  password varchar(10000),
  picture varchar(10000) default 'https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg',
  date_created date,
  profileinfo jsonb
  );

CREATE TABLE if not exists oauth (
  id serial not null primary key,
  provider_id varchar(10000),
  provider varchar(10000),
  email varchar(10000),
  FOREIGN KEY (email) REFERENCES profile(email)
  );`);

module.exports = pool;
