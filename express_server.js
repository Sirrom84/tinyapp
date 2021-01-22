
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");
const PORT = 8080;

function generateRandomString() {
  return Math.random().toString(36).slice(7);
};

function findEmail (email) {
  for(let userId in users){
    if(email === users[userId].email) {
      return users[userId];
    }
  }
  return false;
};

const lookUpUser = (userId,users) => {
  return users[userId];
};
  
function checkPassword (email, password) {
  for(let user in users){
    if(email === users[user].email && password === users[user].password){
      return true;
    }
  }  
  return false
};


const userUrl = (user_id, urlDatabase) => {
let userInfo = {};
console.log("checking user_id", user_id);
  for (let urls in urlDatabase) {
  //looking for user id in database that matches current user
  if (user_id === urlDatabase[urls].userID) {
    userInfo[urls] = urlDatabase[urls]
  }
}
return userInfo;
}


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
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "user2RandomID"}
};
//register as a new user//
app.get('/register', (req, res) => { 
  const userId = req.cookies.user_id; //sessionOptions.user_id
  const user = lookUpUser(userId,users);
  const templateVars = {
    user: user //pass the user object to HTML for use when removed causes bugs
  };
  res.render("register", templateVars); //show the user the register page and pass those variables
});
    
app.get('/urls', (req,res) => {
  const userId = req.cookies['user_id'];
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

app.get("/urls/new", (req, res) => {
  const userId = req.cookies.user_id;
  const user = lookUpUser(userId, users);
  const templateVars = {
    user: user
  };
    if (!user) {
    return res.redirect("/login"); 
  } else {
    return res.render("urls_new", templateVars);
  };
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req,res) => { 
  const userId = req.cookies.user_id;
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
  req.session.user_ID = user.ID;
  return res.redirect('/urls');
});

// app.post('/login', (req, res) => {
//   const user = findEmail(req.body.email,);
//   console.log(user);
//     if (bcrypt.compareSync(req.body.password, user.password)) {
//        // returns true
//       res.cookie('user_id', user.id );
//       return res.redirect("/urls");
//    }else {
//       return res.redirect("/register");
//   };
// });
// (checkPassword(req.body.email, req.body.password))
app.post("/logout" , (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

app.post("/register" , (req, res) => { //registering a new user and storing the info into the users database
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const id = generateRandomString();
  const email = req.body.email;
    if (email === '' || password === '') {
      res.status(404).send("You need to log in")
    }else if (findEmail(email)) {
      res.status(404).send("Email taken please enter a different email")
    };
    users[id] = {
      id,
      email,
      password: hashedPassword
    };
    console.log("checking the users object", users);
  res.cookie('user_id', id);
  res.redirect("/urls")
});
app.post("/urls/:shortURL/delete", (req, res) => {
  // uses the shortURL key to enter database
  delete urlDatabase[req.params.shortURL];
  const userId = req.cookies.user_id;
  const user = lookUpUser(userId, users)
  const templateVars = {
    urls: urlDatabase,
    user: user
  };
  res.render("urls_index", templateVars) // refreshes the page with the deleted url gone.
});

app.post("/urls/:shortURL/edit", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL
  res.redirect("/urls") // refreshes the page with the deleted url gone.
});



app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  let userID = req.cookies["user_id"];
  // let urlId = generateRandomString()
  urlDatabase[shortURL] = {longURL:longURL, userID: userID };
    console.log('want to see if users updated:' , users);
    console.log('want to see if URL database updated  updated:' , urlDatabase);
  res.redirect("/urls/" + shortURL);
});

app.use(function(req, res, next) {
  res.status(404).send("that page does not exist");
});

app.listen(PORT, () => {
  console.log(`Tiny app listening on port ${PORT}!`);
});





