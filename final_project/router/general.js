const express = require('express');
const axios = require('axios');

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

// Task 1 - Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 2));
});

// Task 10 - Get all books using Axios and async/await
public_users.get('/async-books', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');

    res.send(JSON.stringify(response.data, null, 2));
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving books"
    });
  }
});

// Task 2 - Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  res.send(JSON.stringify(books[isbn], null, 2));
});

// Task 11 - Get book details based on ISBN using Axios and async/await
public_users.get('/async-isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;

    const response = await axios.get(
      'http://localhost:5000/isbn/' + isbn
    );

    res.send(JSON.stringify(response.data, null, 2));
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving book by ISBN"
    });
  }
});

// Task 3 - Get book details based on author
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

// Task 4 - Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let result = [];

  let keys = Object.keys(books);

  keys.forEach((isbn) => {
    if (books[isbn].title === title) {
      result.push(books[isbn]);
    }
  });

  res.send(JSON.stringify(result, null, 2));
});
// Task 12 - Get book details based on author using Axios and async/await
public_users.get('/async-author/:author', async function (req, res) {
    try {
      const author = req.params.author;
  
      const response = await axios.get(
        'http://localhost:5000/author/' + encodeURIComponent(author)
      );
  
      res.send(JSON.stringify(response.data, null, 2));
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving books by author"
      });
    }
  });

// Task 5 - Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  return res.send(JSON.stringify(books[isbn].reviews, null, 2));
});

module.exports.general = public_users;