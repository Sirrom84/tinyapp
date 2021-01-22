
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const {findEmail}  = require('./helper');
const bcrypt = require('bcrypt');
const {generateRandomString} = require("./helper");
const app = express();
app.use(cookieSession({
  name: 'session',
  keys: ['secret keys', 'key']
}));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
const PORT = 8080;


const lookUpUser = (userId,users) => {
  return users[userId];
};
  


const userUrl = (userId, urlDatabase) => {
  let userInfo = {};
  for (let urls in urlDatabase) {
  //looking for user id in database that matches current user
    if (userId === urlDatabase[urls].userID) {
      userInfo[urls] = urlDatabase[urls];
    }
  }
  return userInfo;
};


const users = { };
  


// urlDatabase[req.params.shortURL] = req.body.longURL
const urlDatabase = {};
//register as a new user//
app.get('/register', (req, res) => {
  const userId = req.session.userId;
  const user = lookUpUser(userId,users);                               //req.session.userId    //req.cookies.user_id;
  const templateVars = {
    user: user //pass the user object to HTML for use when removed causes bugs
  };
  res.render("register", templateVars); //show the user the register page and pass those variables
});
    
app.get('/urls', (req,res) => {
  const userId =  req.session.userId;                                            //req.cookies['user_id'];
  // const user = lookUpUser(userId, users);
  
 
  const templateVars = {
    urls: userUrl(userId,urlDatabase),
    user: users[userId]
  };
  if (!userId) {
    return res.redirect("/login");
  } else {
    return res.render("urls_index", templateVars);
  }
});
//Create new URL//
app.get("/urls/new", (req, res) => {
  const userId = req.session.userId;                                             //req.cookies.user_id;
  const user = lookUpUser(userId, users);
  const templateVars = {
    user: user
  };
  if (!user) {
    return res.redirect("/login");
  } else {
    return res.render("urls_new", templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req,res) => {
  const userId = req.session.userId;                             //req.cookies.user_id;
  const user = lookUpUser(userId, users);
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: user
  };
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

app.get("/login", (req, res) => {
  const templateVars = {
    user: false //youre never a user here
  };
  res.render('login',templateVars);
});

app.post("/login", (req, res) => {
  const user = findEmail(req.body.email, users);
  if (!user) {
    res.status(403).send('Email Not Found');
    return;
  }
  const passwordGood = bcrypt.compareSync(req.body.password, user.password);
  if (!passwordGood) {
    res.status(403).send('Incorrect Password');
    return;
  }
  req.session.userId = user.id;
  return res.redirect('/urls');
});

app.post("/logout" , (req, res) => {
  // res.clearCookie("user_id");
  req.session = null; //burns cookie
  res.redirect("/login");
});

app.post("/register" , (req, res) => { //registering a new user and storing the info into the users database
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const id = generateRandomString();
  const email = req.body.email;
  console.log(id);
    if (email === '' || password === '') {
    res.status(404).send("You need to log in");
  } else if (findEmail(email, users)) {
    res.status(404).send("Email taken please enter a different email"); 
  }
  users[id] = {
    id,
    email,
    password: hashedPassword
  };
  console.log("checking the users object", users);
  // res.cookie('user_id', id);
  req.session.userId = id; // setting cookie to user ID value
  res.redirect("/urls");
});
app.post("/urls/:shortURL/delete", (req, res) => {
  // uses the shortURL key to enter database
  delete urlDatabase[req.params.shortURL];
  const userId = req.session.userId;                //req.cookies.user_id;
  const user = lookUpUser(userId, users);
  const templateVars = {
    urls: urlDatabase,
    user: user
  };
  res.render("urls_index", templateVars); // refreshes the page with the deleted url gone.
});

app.post("/urls/:shortURL/edit", (req, res) => {
  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  res.redirect("/urls"); // refreshes the page with the deleted url gone.
});



app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  let userID =  req.session.userId;                          //req.cookies["user_id"];
  // let urlId = generateRandomString()
  urlDatabase[shortURL] = {longURL:longURL, userID: userID };
  console.log('want to see if users updated:' , users);
  console.log('want to see if URL database updated  updated:' , urlDatabase);
  res.redirect("/urls");
});

app.use(function(req, res) {
  res.status(404).send("that page does not exist");
});

app.listen(PORT, () => {
  console.log(`Tiny app listening on port ${PORT}!`);
});





