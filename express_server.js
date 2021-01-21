
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
res.clearCookie("user_id");
  res.redirect("/login");

});

app.post("/register" , (req, res) => { //registering a new user and storing the info into the users database
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  if (email === '' || password === '') {
    res.status(404).send("You need to log in")
   } else if (findEmail(email)) {
    res.status(404).send("Email taken please enter a different email")
   }

 users[id] = {
   id,
   email,
   password
 };
 res.cookie('user_id', id);
 console.log('users is he in there users', users);
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



app.post('/login', (req, res) => {
  const user = findEmail(req.body.email);
  const templateVars = {
    urls: urlDatabase,
    user: user
  };
if (checkPassword(req.body.email, req.body.password)) {
console.log("login if statement logged in");
res.cookie('user_id', user.id )
  return res.render("urls_index", templateVars);
} else {
  console.log("else trigger for login should be register");
  return res.redirect("/register");
};
});




app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls/" + shortURL);
  //creates a rand string to act as key that gets stored in Database
  });

  app.get('/register', (req, res) => {
    const userId = req.cookies.user_id;
    const user = lookUpUser(userId,users)
    const templateVars = {
      user: user
    }
    res.render("register",templateVars)
    });
    

app.get('/urls', (req,res) => {
  const userId = req.cookies['user_id']
  const user = lookUpUser(userId, users)
  const templateVars = {
    urls: urlDatabase,
    user: user
  };
  if (!user) {
    return res.redirect("/login");
  } else {
    return res.render("urls_index", templateVars);
  }
})

app.get("/urls/new", (req, res) => {
  const userId = req.cookies.user_id;
  const user = lookUpUser(userId, users);
  const templateVars = {
    user: user
  };
  if (!user) {
    return res.redirect("/login"); //this might need vars
  } else {
    return res.render("urls_new", templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req,res) => { 
  const userId = req.cookies.user_id;
  const user = lookUpUser(userId, users);
  const templateVars = {
    shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL],
    user: user
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


app.get("/login", (req, res) => {
  const userId = req.cookies.user_id;
  const user = lookUpUser(userId,users)
  const templateVars = {
    user: user
  }
  res.render('login',templateVars)

})

app.use(function(req, res, next) {
  res.status(404).send("that page does not exist")
});

app.listen(PORT, () => {
  console.log(`Tiny app listening on port ${PORT}!`);
});





