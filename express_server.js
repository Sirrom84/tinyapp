const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const { findEmail } = require("./helper");
const bcrypt = require("bcrypt");
const { generateRandomString } = require("./helper");
const app = express();

app.use(
  cookieSession({
    name: "session",
    keys: ["secret keys", "key"],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const PORT = 8080;

const lookUpUser = (userId, users) => {
  return users[userId];
};

const userUrl = (userId, urlDatabase) => {
  let userInfo = {};
  for (let urls in urlDatabase) {
    if (userId === urlDatabase[urls].userID) {
      userInfo[urls] = urlDatabase[urls];
    }
  }
  return userInfo;
};
//User Database//
const users = {};

const urlDatabase = {};

//////////////////
//////////////////
/////APP GETS/////
//////////////////

//Register new user//
app.get("/register", (req, res) => {
  const userId = req.session.userId;
  const user = lookUpUser(userId, users);
  const templateVars = {
    user: user,
  };
  res.render("register", templateVars);
});
//view your URLS///
app.get("/urls", (req, res) => {
  const userId = req.session.userId;
  const templateVars = {
    urls: userUrl(userId, urlDatabase),
    user: users[userId],
  };
  if (!userId) {
    return res.redirect("/login");
  } else {
    return res.render("urls_index", templateVars);
  }
});
//Create new URL//
app.get("/urls/new", (req, res) => {
  const userId = req.session.userId;
  const user = lookUpUser(userId, users);
  const templateVars = {
    user: user,
  };
  if (!user) {
    return res.redirect("/login");
  } else {
    return res.render("urls_new", templateVars);
  }
});
//redirects user to selected url
app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.sendStatus(404);
  } else {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  }
});
//Show short URL//
app.get("/urls/:shortURL", (req, res) => {
  const userId = req.session.userId;
  const user = lookUpUser(userId, users);
  if (!user) {
    return res.redirect("/login");
  } else {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: user,
    };

    res.render("urls_show", templateVars);
  }
});

app.get("/", (req, res) => {
  res.redirect("/login");
}); //fix 1 works

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/login", (req, res) => {
  const templateVars = {
    user: false,
  };
  res.render("login", templateVars);
});

/////////////////
/////////////////
////APP POSTS////
/////////////////

app.post("/login", (req, res) => {
  const user = findEmail(req.body.email, users);
  if (!user) {
    res.status(403).send("Email Not Found");
    return;
  }
  const passwordGood = bcrypt.compareSync(req.body.password, user.password);
  if (!passwordGood) {
    res.status(403).send("Incorrect Password");
    return;
  }
  req.session.userId = user.id;
  return res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});
/*Register: This will provide user with unique ID and hashed password.
 findEmail function will compare user entry to database if email is present user will be unable to register
 user is then provided an encrypted cookie */

app.post("/register", (req, res) => {
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const id = generateRandomString();
  const email = req.body.email;
  if (email === "" || password === "") {
    res.status(404).send("You need to log in");
  } else if (findEmail(email, users)) {
    res.status(404).send("Email taken please enter a different email");
  }
  users[id] = {
    id,
    email,
    password: hashedPassword,
  };
  req.session.userId = id; //setting cookie to user ID value
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  //delete below may look shaded please leave in//
  delete urlDatabase[req.params.shortURL];
  const userId = req.session.userId;
  const user = lookUpUser(userId, users);
  const templateVars = {
    urls: urlDatabase,
    user: user,
  };
  res.render("urls_index", templateVars);
});

app.post("/urls/:id/edit", (req, res) => {
  urlDatabase[req.params.id].longURL = req.body.longURL;
  const userId = req.session.userId;
  const user = lookUpUser(userId, users);

  if (!user) {
    return res.redirect("/login");
  } else {
    return res.redirect("/urls/" + req.params.id);
  }
});
//Short url created. urlDatabase then updated with user specific Urls//
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  let userID = req.session.userId;
  urlDatabase[shortURL] = { longURL: longURL, userID: userID };
  res.redirect("/urls");
});

app.use(function (req, res) {
  res.status(404).send("that page does not exist");
});

app.listen(PORT, () => {
  console.log(`Tiny app listening on port ${PORT}!`);
});
