
const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


app.post("/urls/:shortURL/delete", (req, res) => {
  // uses the shortURL key to enter database
 delete urlDatabase[req.params.shortURL];
 const templateVars = {
  urls: urlDatabase
};
res.render("urls_index", templateVars) // refreshes the page with the deleted url gone.
});

app.post("/urls/:shortURL/edit", (req, res) => {
urlDatabase[req.params.shortURL] = req.body.longURL

res.redirect("/urls") // refreshes the page with the deleted url gone.
});



app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls/" + shortURL);
  //creates a rand string to act as key that gets stored in Database
  
});

app.get('/urls', (req,res) => {
  const templateVars = {
    urls: urlDatabase
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
  const templateVars = {
    shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] 
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
