const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const port = 3000;

const newsSources = [
  {
    name: "times",
    url: "https://www.thetimes.co.uk/environment/climate-change",
    baseUrl: "",
  },
  {
    name: "telegraph",
    url: "https://www.telegraph.co.uk/climate-change",
    baseUrl: "https://www.telegraph.co.uk",
  },
];

let articles = [];
let index = 1;

newsSources.forEach((newspaper) => {
  axios
    .get(newspaper.url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $('a:contains("climate")').each(function () {
        const title = $(this).text();
        const link = $(this).attr("href");
        articles.push({ title, link: newspaper.baseUrl + link, id: index });
        index++;
      });

      $('a:contains("Climate")').each(function () {
        const title = $(this).text();
        const link = $(this).attr("href");
        articles.push({ title, link: newspaper.baseUrl + link, id: index });
        index++;
      });
    })
    .catch((error) => {
      console.error(error);
    });
});

app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/news/:newsId", (req, res) => {
  index = 0;
  articles = [];
  const newsId = req.params.newsId;
  newsSources.forEach((newsSource) => {
    if (newsSource.name == newsId) {
      axios
        .get(newsSource.url)
        .then((response) => {
          const html = response.data;
          const $ = cheerio.load(html);
          $('a:contains("climate")').each(function () {
            const title = $(this).text();
            const link = $(this).attr("href");
            articles.push({
              title,
              link: newsSource.baseUrl + link,
              id: index,
            });
            index++;
          });
          $('a:contains("Climate")').each(function () {
            const title = $(this).text();
            const link = $(this).attr("href");
            articles.push({
              title,
              link: newsSource.baseUrl + link,
              id: index,
            });
            index++;
          });
          res.json(articles);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  });

  // if(articles.length === 0) {
  //   res.json("news source not found");
  // }
});

app.get("/", (req, res) => {
  res.json("Welcome to the api, go to /news to fetch news");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
