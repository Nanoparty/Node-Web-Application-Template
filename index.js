var express = require("express");
var app = express();

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017";

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
          });
          res.json("Registration Successful");
        }
      });
    }
  );
});
