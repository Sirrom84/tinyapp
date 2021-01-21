
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");
const PORT = 8080;

function generateRandomString() {
  
  return Math.random().toString(36).slice(7);

};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};



app.post("/logout" , (req, res) => {
res.clearCookie('username');
res.redirect("/urls");
});

app.post("/register" , (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
 users[id] = {
   id,
   email,
   password
 };
 
 res.cookie('username', id);
 
 res.redirect("/urls")
  //1: need to be able to add a new user object above to global user object with id: email: and password provided from the register form
  // users[newUser + generateRandomString()] = {id:newUser, email: req.body.email, password: req.body.password};//***NOT UPDATING PROPERLY */
  
  //2: After adding the user, set a user_id cookie containing the user's newly generated ID.
//****MAYBE I NEED TO TRY TEMPLATE VARS NEXT */
  // const newId = req.body 
  // console.log(username, 'creating the cookie when registering');
  //   res.cookie('username', username);
  //3: Redirect the user to the /urls page.
  //4: Test that the users object is properly being appended to. You can insert a console.log or debugger prior to the redirect logic to inspect what data the object contains.
  //5: Also test that the user_id cookie is being set correctly upon redirection. You already did this sort of testing in the Cookies in Express activity. Use the same approach here.
  console.log(users);
});
// console.log(users, "this is my user test");

app.post("/urls/:shortURL/delete", (req, res) => {
  // uses the shortURL key to enter database
 delete urlDatabase[req.params.shortURL];
 const userId = req.cookies.username;
 const templateVars = {
  urls: urlDatabase,
  username: userId
};
res.render("urls_index", templateVars) // refreshes the page with the deleted url gone.
});

app.post("/urls/:shortURL/edit", (req, res) => {
urlDatabase[req.params.shortURL] = req.body.longURL

res.redirect("/urls") // refreshes the page with the deleted url gone.
});

app.post('/login', (req, res) => {
const { username } = req.body //destructed
console.log(username, 'creating the cookie when login is clicked');
  res.cookie('username', username);
  res.redirect("/urls");

});
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls/" + shortURL);
  //creates a rand string to act as key that gets stored in Database
  });

  app.get('/register', (req, res) => {
    const userId = req.cookies.username
    const templateVars = {
      username: userId
    }
    res.render("register",templateVars)
    });
    

app.get('/urls', (req,res) => {
  const userId = req.cookies.username
  console.log(userId, 'line 54 adding cookie value to template'); //userId will now be the value of the cookies object thanks to our parser. template vars essentially is a package object you send to the template with all the usefull key value pairs (variables) you wan to access on the template side 
  const templateVars = {
    urls: urlDatabase,
    username: userId
  };
  res.render("urls_index", templateVars)
})

app.get("/urls/new", (req, res) => {
  const userId = req.cookies.username;
  const templateVars = {
    username: userId
  };
  res.render("urls_new", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req,res) => { 
  const userId = req.cookies.username;
  const templateVars = {
    shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL],
    username: userId
  }
  res.render('urls_show', templateVars);
});

app.get("/", (req,res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Tiny app listening on port ${PORT}!`);
});







