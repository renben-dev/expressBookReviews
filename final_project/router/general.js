const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
   
    return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    let booksExist = false;
    for (let key in books) {
        if (books.hasOwnProperty(key)) {
            booksExist =true;
            break;  
        }
    }
    if(booksExist) {
        //this is to preserve identation and stringify formatting
        res.setHeader('Content-Type', 'text/plain');
        return res.send(JSON.stringify(books,null,4));
    } else {
        return res.send("We are revamping our store, book list will be available soon.");
    }

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if(isbn) {
    isbn = isbn.trim();
    const selBook = books[isbn];
    if(selBook){
        return res.send(selBook);
    } else {
        return res.status(404).send("No books exist with ISBN = " + isbn);
    }
  }
  else {
    return res.status(400).send("No ISBN provided. Please send ISBN in GET request.");
  }
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  if(author) {
    author = author.trim();
    //const selBooks = const book = Object.values(books).filter(book => book.author === author);
    //case insensitive search and 'contains' search
    const selBooks = Object.values(books).filter(book =>
        book.author.toLowerCase().includes(author.toLowerCase())
      );
    if(selBooks){
        return res.send(selBooks);
    } else {
        return res.status(404).send("No books exist with author containing '" + author+"'");
    }
  }
  else {
    return res.status(400).send("No author provided. Please send author in GET request.");
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
