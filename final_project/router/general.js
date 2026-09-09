const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(201).json({
    message: "User successfully registered"
  });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn], null, 2));
  });

// Get book details based on author

public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let result = [];
  
    let keys = Object.keys(books);
  
    keys.forEach((isbn) => {
      if (books[isbn].author === author) {
        result.push(books[isbn]);
      }
    });
  
    res.send(JSON.stringify(result, null, 2));
  });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  const result = Object.values(books).filter(
    book => book.title.toLowerCase() === title.toLowerCase()
  );

  if (result.length === 0) {
    return res.status(404).json({
      message: "No books found with this title."
    });
  }

  return res.status(200).json(result);
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  if (Object.keys(books[isbn].reviews).length === 0) {
    return res.status(200).json({
      message: "No reviews found for this book."
    });
  }

  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;