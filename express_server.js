
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");
const PORT = 8080;



const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.post("/logout" , (req, res) => {
res.clearCookie('username');
res.redirect("/urls");
});

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
console.log(username, 'creating the cookie');
  res.cookie('username', username);
  res.redirect("/urls");

});
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls/" + shortURL);
  //creates a rand string to act as key that gets stored in Database
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
  res.render("urls_new");
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

function generateRandomString() {
  
  return Math.random().toString(36).slice(7);

};






