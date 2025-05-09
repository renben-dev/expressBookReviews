const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let isValidPassword = require("./auth_users.js").isValidPassword;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    let msg = "";
    
    if(!password){
        msg +="Please provide password.\n"        
    } else if(!isValidPassword(password)) {
        msg += "Password is not valid.\n";
    }

    if(!username){
        msg +="Please provide username.\n"        
    } else if(!isValid(username)) {
        msg += "Username is not valid.\n";
    } else if(users.filter((user) => user.username.toLowerCase() === username.toLowerCase()).length !==0){
        msg += "Username " + username + " is already registered or not available\n";
    }

    if(msg!=="") {
        return res.status(400).send(msg)
    } 
    else {
        users.push({"username": username, "password": password});
        return res.send("User " + username + " was succesfully registed, and can login.");
    }

   
    //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/books',function (req, res) {
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
        //res.setHeader('Content-Type', 'text/plain');
        return res.send(JSON.stringify(books,null,4));
    } else {
        return res.send("We are revamping our store, book list will be available soon.");
    }

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Local endpoint to fetch books
public_users.get('/books', (req, res) => {
    //simulates tdelay in retrieving data
    setTimeout(() => {
        console.log("This will be logged after 5 seconds");
    }, 5000);

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(books, null, 4));
});



// GET route to fetch book list from the root endpoint '/'
public_users.get('/', async (req, res) => {
  try {
    const books = await retrieveBooks();

    let booksExist = false;
    for (let key in books) {
      if (books.hasOwnProperty(key)) {
        booksExist = true;
        break;
      }
    }
    if (booksExist) {
      //res.setHeader('Content-Type', 'text/plain');
      res.send(JSON.stringify(books, null, 4));
    } else {
      res.status(204).send("We are revamping our store, book list will be available soon.");
    }
  } catch (error) {
    res.status(500).send("An error occurred: " + error.message);
  }
});



// public_users.get('/isbn/:isbn?',function (req, res) {
//   //Write your code here
//   let isbn = req.params.isbn;
//   isbn = (isbn || '').trim();
//   if(isbn) {
//     const selBook = books[isbn];
//     if(selBook){
//         return res.send(JSON.stringify(selBook, null, 4));
//     } else {
//         return res.status(404).send("No books exist with ISBN = " + isbn);
//     }
//   }
//   else {
//     return res.status(400).send("No ISBN provided. Please send ISBN in GET request.");
//   }
//   //return res.status(300).json({message: "Yet to be implemented"});
//  });

// Get book details based on ISBN using Async/Await
public_users.get('/isbn/:isbn?',async (req, res) => {
    try {
        let isbn = req.params.isbn;
        isbn = (isbn || '').trim();
        const books = await retrieveBooks();        
        if(isbn) {
            const selBook = books[isbn];
            if(selBook){
                return res.send(JSON.stringify(selBook, null, 4));
            } else {
                return res.status(404).send("No books exist with ISBN = " + isbn);
            }
        } else {
            return res.status(400).send("No ISBN provided. Please send ISBN in GET request.");
        }
    } catch(error) {
        return res.status(500).send("An error occured while retrieving ISBN book data");
    }  
});



//Async/await API endpoint to GET books by author
public_users.get('/author/:author?',async (req, res) => {
    try {
        let author = req.params.author;
        author = (author || '').trim();
        const books = await retrieveBooks();        
        if(author) { //case insensitive search and 'contains' search
            const selBooks = Object.values(books).filter(book =>
                book.author.toLowerCase().includes(author.toLowerCase()));
            if(selBooks.length > 0){
                return res.send(JSON.stringify(selBooks, null, 4));
            } else {
                return res.status(404).send("No books exist with author containing '" + author+"'");
            }
        } else {
            return res.status(400).send("No author provided. Please send author or substring of author in GET request.");
        }
    } catch(error) {
        return res.status(500).send("An error occured while retrieving book data ny author");
    }  
});
  
// Get book details based on author
// public_users.get('/author/:author?',function (req, res) {
//   //Write your code here
//   let author = req.params.author;
//   author = (author || '').trim();
//   if(author) {
//     //case insensitive search and 'contains' search
//     const selBooks = Object.values(books).filter(book =>
//         book.author.toLowerCase().includes(author.toLowerCase())
//       );
//     if(selBooks.length > 0){
//         return res.send(JSON.stringify(selBooks, null, 4));
//     } else {
//         return res.status(404).send("No books exist with author containing '" + author+"'");
//     }
//   }
//   else {
//     return res.status(400).send("No author provided. Please send author or substring of author in GET request.");
//   }
//   //return res.status(300).json({message: "Yet to be implemented"});
// });

// Simulates API to get books from a DB
const retrieveBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/books');
      const books = response.data;
      // Check if books exist
      if (books && typeof books === 'object' && Object.keys(books).length > 0) {
          return books;
      } else {
          return { books: {}, message: "No books available" };
      }
    } catch (error) {
      console.error('Error retreiving books:', error);
      throw error;
    }
};
//Async/await API endpoint to GET books by author
public_users.get('/title/:title?',async (req, res) => {
    try {
        let title = req.params.title;
        title = (title || '').trim();
        const books = await retrieveBooks();        
        if(title) { //case insensitive search and 'contains' search
            const selBooks = Object.values(books).filter(book =>
                book.title.toLowerCase().includes(title.toLowerCase()));
            if(selBooks.length > 0){
                return res.send(JSON.stringify(selBooks, null, 4));
            } else {
                return res.status(404).send("No books exist with title containing '" + title +"'");
            }
        } else {
            return res.status(400).send("No title provided. Please send title or substring of title in GET request.");
        }
    } catch(error) {
        return res.status(500).send("An error occured while retrieving book data by title");
    }  
});

// // Get all books based on title
// public_users.get('/title/:title?',function (req, res) {
//   //Write your code here
//   let title = req.params.title;
//   title = (title || '').trim();
//   if(title) {    
//     //case insensitive search and 'contains' search
//     const selBooks = Object.values(books).filter(book =>
//         book.title.toLowerCase().includes(title.toLowerCase())
//       );
//     if(selBooks.length > 0){
//         return res.send(selBooks);
//     } else {
//         return res.status(404).send("No books exist with title containing '" + title +"'");
//     }
//   }
//   else {
//     return res.status(400).send("No title provided. Please send title or substring of title in GET request.");
//   }
//   //return res.status(300).json({message: "Yet to be implemented"});
// });

//  Get book review
public_users.get('/review/:isbn?',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  isbn = (isbn || '').trim();
  if(isbn) {
    const selBook = books[isbn];
    if(selBook){
        const {reviews, ...selBookDetail} = selBook;
        let reviewsExist = true;
        if (Object.keys(selBook.reviews).length === 0) {
            reviewsExist = false;
        };
        if(reviewsExist) {
            return res.send("Reviews for book:\n\nISBN: " + isbn + "\n" + JSON.stringify(selBookDetail) + "\n\nReviews:\n" + JSON.stringify(selBook.reviews, null, 4));
        } else {
            return res.send("There are no reviews yet for book: ISBN: " + isbn +" " + JSON.stringify(selBookDetail, null, 4));
        }
    } else {
        return res.status(404).send("Cannot provide reviews. No books exist with ISBN = " + isbn);
    }
  }
  else {
    return res.status(400).send("No ISBN provided. Please send ISBN in GET request.");
  }

  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
