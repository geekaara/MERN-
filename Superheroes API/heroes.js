const http = require("http");
const fs = require("fs");
const url = require("url");

const heroList = fs.readFileSync("heroes.json", "utf-8");
const heroes = JSON.parse(heroList);

const server = http
  .createServer((req, res) => {
    const path = url.parse(req.url, true);
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE, PATCH",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "application/json",
    });
    if (path.pathname == "/" || path.pathname == "/superheroes") {
      res.end(heroList);
    } else if (path.pathname == "/superhero") {
      if (req.method == "GET") {
        const id = path.query.id;
        const singleHero = heroes.filter((element) => {
          return element.id == id;
        });
        res.end(JSON.stringify(singleHero));
      } else if (req.method == "POST") {
        let body = "";
        req.on("data", (data) => {
          body += data;
        });
        req.on("end", () => {
          let hero = JSON.parse(body);
          heroes.push(hero);
          fs.writeFile("heroes.json", JSON.stringify(heroes), (err) => {
            res.end();
          });
        });
      } else if (req.method == "PUT") {
        const id = path.query.id;
        let body = "";
        req.on("data", (data) => {
          body += data;
        });
        req.on("end", () => {
          let hero = JSON.parse(body);
          heroes.forEach((ele) => {
            if (ele.id == id) {
              ele.name = hero.name;
              ele.age = hero.age;
              ele.plannet = hero.plannet;
              ele.weapons = hero.weapons;
            }
          });
          fs.writeFile("heroes.json", JSON.stringify(heroes), (err) => {
            res.end();
          });
        });
      } else if (req.method == "DELETE") {
        const id = path.query.id;
        heroes.forEach((ele, index) => {
          if (ele.id == id) {
            heroes.splice(index, 1);
          }
        });
        fs.writeFile("heroes.json", JSON.stringify(heroes), (err) => {
          res.end();
        });
      } else {
        res.writeHead(404, {
          "Content-Type": "text/html",
        });
        res.end('<h1 style="text-align:center">Oops Resource Not Found!</h1>');
      }
    }
  })
  .listen(8087, () => {
    console.log("up");
  });
