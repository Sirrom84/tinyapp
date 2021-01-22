
const { assert } = require('chai');
const { findEmail, generateRandomString} = require("../helper.js");

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
  },
  "Rob": {
    id: "rookieCoder",
    email: "testing123@gmail.com",
    password: "rookie123"
  }
};
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.rollingstone.com", userID: "userRandomID1" },
  i3BoGr: { longURL: "https://www.cbc.ca", userID: "userRandomID1" },
  Gb023R: { longURL: "https://www.apple.ca", userID: "rookieCoder" },
  
};

describe('findEmail', function () {
  it('will find a users email', function () {
    const user = findEmail("user@example.com", users);
    assert.isObject(user, "returns false if no email in the database");
  });

  it('Returns false If The Email Is Not Registered', function () {
    const user = findEmail("userTest@example.com", users);
    const expectedOutput = false;
    assert.isFalse(user, "Returns false");
  });
});

describe('generateRandomString', function() {
  it('Should Return A 6 char alphanumeric String', function() {
    const userId = generateRandomString();
    console.log('testing', userId);
    assert.equal(userId.length, 6);
  });

});
