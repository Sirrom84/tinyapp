
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

describe('findEmail', function() {
  it('will find a users email', function() {
    const user = findEmail("user@example.com", users);
    assert.isObject(user, "returns false if no email in the database");
  });

  it('Returns false If The Email Is Not Registered', function() {
    const user = findEmail("userTest@example.com", users);
    assert.isFalse(user, "Returns false");
  });
});

describe('generateRandomString', function() {
  it('Should Return A 6 char alphanumeric String', function() {
    const userId = generateRandomString();
    assert.equal(userId.length, 6);
  });
});
