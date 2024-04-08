const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => user.username === username);
  return userswithsamename.length > 0;
}

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username": username, "password": password});
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  } 
  return res.status(404).json({ message: "Unable to register user." });
});

public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

public_users.get('/isbn/:isbn', function (req, res) {
  const ISBN = req.params.isbn;
  res.send(books[ISBN]);
});

public_users.get('/author/:author', function (req, res) {
  let ans = [];
  for (const [key, values] of Object.entries(books)) {
    if (values.author === req.params.author) {
      ans.push(values);
    }
  }
  if (ans.length === 0) {
    return res.status(300).json({ message: "Author not found" });
  }
  res.send(ans);
});

public_users.get('/title/:title', function (req, res) {
  let ans = [];
  for (const [key, values] of Object.entries(books)) {
    if (values.title === req.params.title) {
      ans.push(values);
    }
  }
  if (ans.length === 0) {
    return res.status(300).json({ message: "Title not found" });
  }
  res.send(ans);
});

public_users.get('/review/:isbn', function (req, res) {
  const ISBN = req.params.isbn;
  res.send(books[ISBN].reviews);
});

module.exports.general = public_users;