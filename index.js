var express = require("express");
var app = express();
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

app.get("/url", (req, res, next) => {
  res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
});

app.get("/login", (req, res, next) => {
  console.log(JSON.stringify(req.headers));
  var username = req.headers.username;
  var password = req.headers.password;
  if (username === "nfoote" && password === "password") {
    res.json("Login Successful");
  } else {
    res.json("Login Failed");
  }
});
