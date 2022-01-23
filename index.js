var express = require("express");
var app = express();

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017";

const heroRes = require("./heros");
heros = heroRes.getHeros();

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

app.get("/login", (req, res, next) => {
  console.log(JSON.stringify(req.headers));
  var username = req.headers.username;
  var password = req.headers.password;

  MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
      if (err) {
        return console.log(err);
      }
      const db = client.db("admin");
      console.log(`MongoDB Connected: ${url}`);

      const users = db.collection("users");

      users.findOne({ username: username }, (err, result) => {
        console.log("Result:", result);
        if (result && result.password === password) {
          console.log("Login Match");
          res.json("Login Successful");
        } else {
          res.status(404).json("Login Failed");
        }
      });
    }
  );
});

app.get("/user", (req, res, next) => {
  console.log(JSON.stringify(req.headers));
  var username = req.headers.username;

  MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
      if (err) {
        return console.log(err);
      }
      const db = client.db("admin");
      console.log(`MongoDB Connected: ${url}`);

      const users = db.collection("users");

      users.findOne({ username: username }, (err, result) => {
        console.log("Result:", result);
        if (result) {
          console.log("User Found");
          res.json(result);
        } else {
          console.log("User not found");
          res.status(404).json("Login Failed");
        }
      });
    }
  );
});

app.post("/register", (req, res, next) => {
  console.log(JSON.stringify(req.headers));
  var username = req.headers.username;
  var password = req.headers.password;

  MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
      if (err) {
        return console.log(err);
      }
      const db = client.db("admin");
      console.log(`MongoDB Connected: ${url}`);

      const users = db.collection("users");

      users.findOne({ username: username }, (err, result) => {
        console.log("Result:", result);
        if (result) {
          res.json("Username Taken");
        } else {
          users.insertOne({
            username: username,
            password: password,
            accountLevel: 1,
            accountExp: 0,
            accountExpCap: 5,
            gems: 50,
            gold: 1000,
            heros: [],
          });
          res.json("Registration Successful");
        }
      });
    }
  );
});

app.post("/purchase", (req, res, next) => {
  console.log(JSON.stringify(req.headers));
  var username = req.headers.username;
  var amount = req.headers.amount;

  MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
      if (err) {
        return console.log(err);
      }
      const db = client.db("admin");
      console.log(`MongoDB Connected: ${url}`);

      const users = db.collection("users");

      users.findOne({ username: username }, (err, result) => {
        console.log("Result:", result);
        if (result) {
          var newGems = parseInt(result.gems) + parseInt(amount);
          result.gems = newGems.toString();
          users.updateOne(
            { username: username },
            {
              $set: { gems: newGems.toString() },
              $currentDate: { lastModified: true },
            }
          );

          res.json(result);
        } else {
          res.json("Not valid user");
        }
      });
    }
  );
});

app.get("/roll", (req, res, next) => {
  console.log(JSON.stringify(req.headers));
  var username = req.headers.username;

  //check sufficient gems

  //decrement gems

  //roll random character

  //add character to user list

  //return character

  MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
      if (err) {
        return console.log(err);
      }
      const db = client.db("admin");
      console.log(`MongoDB Connected: ${url}`);

      const users = db.collection("users");

      users.findOne({ username: username }, (err, result) => {
        console.log("Result:", result);
        if (result) {
          if (result.gems >= 5) {
            var hero = heros[Math.floor(Math.random() * heros.length)];
            result.gems = result.gems - 5;
            result.heros.push(hero);
            users.updateOne(
              { username: username },
              {
                $set: { gems: result.gems, heros: result.heros },
                $currentDate: { lastModified: true },
              }
            );
            var newUser = users.findOne();
            res.json({
              hero: hero,
              userData: result,
            });
          } else {
            res.json("Not enough gems");
          }
        } else {
          res.json("Invalid User");
        }
      });
    }
  );
});
