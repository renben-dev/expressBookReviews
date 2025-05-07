const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    //write code to check is the username is valid
    // Regex: 3-20 chars, letters/numbers/underscores/hyphens, starts with a letter
    const regex = /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/;
    const uname = username ?? '';
    return regex.test(uname);
}


/**
 * Password Validation Rules (Regex Breakdown)
 * --------------------------------------------------------------------------
 * | Rule                  | Regex Pattern         | Examples               |
 * |-----------------------|-----------------------|-------------------------|
 * | Minimum length (8+)   | {8,}                 | 'A1b@cde' (valid)      |
 * | At least 1 lowercase  | (?=.*[a-z])          | 'a' in 'Pass1!'        |
 * | At least 1 uppercase  | (?=.*[A-Z])          | 'P' in 'Pass1!'        |
 * | At least 1 digit      | (?=.*\d)             | '1' in 'Pass1!'        |
 * | At least 1 special    | (?=.*[@$!%*?&])      | '!' in 'Pass1!'        |
 * | Allowed chars only    | [A-Za-z\d@$!%*?&]    | Rejects 'Pass 1' (space)|
 * --------------------------------------------------------------------------
 * 
 * Full Regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
 * 
 * Customization Options:
 * - minLength: Change {8,} to desired length (e.g., {12,})
 * - specialChars: Modify [@$!%*?&] to allow/disallow symbols
 * - Relax rules: Remove (?=.*[X]) conditions as needed
 */
function isValidPassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    return !!users.find((user) => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    //Write your code here
      const username = req.body.username;
      const password = req.body.password;
      let msg = "";
      
      if(!password){
          msg +="Please provide password.\n"        
      }
  
      if(!username){
          msg +="Please provide username.\n"        
      }
  
      if(msg!=="") {
          return res.status(400).send("To login:\n" + msg);
      }
  
      // Authenticate user
      if (authenticatedUser(username, password)) {
          // Generate JWT access token
          let accessToken = jwt.sign({
              data: password
          }, 'temporary_dummy_secret_for_course', { expiresIn: 60 * 60 });
  
          // Store access token and username in session
          req.session.authorization = {
              accessToken, username
          }
          return res.status(200).send("User successfully logged in");
      } else {
          return res.status(401).json({ message: "Invalid Login. Check username and password" });
      }
      
     
  
    //return res.status(300).json({message: "Yet to be implemented"});
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.isValidPassword = isValidPassword;
module.exports.users = users;
