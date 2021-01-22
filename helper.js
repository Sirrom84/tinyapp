const findEmail = (email,users) => {
  for (let userId in users) {
    if (email === users[userId].email) {
      return users[userId];
    }
  }
  return false;
};

const generateRandomString = () => {
  return Math.floor((1 + Math.random()) * 0x10000000).toString(36);
};


module.exports = {
  findEmail,
  generateRandomString
};