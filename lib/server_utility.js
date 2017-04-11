var randomstring = require('randomstring');
var urlsInUse = {};

//TODO pull urls from database and put into urlsInUse object

exports.generateUrl = function() {
  // Randomize a 32-length string and check to see if it exists in urlsInUse
  do {
    var url = randomstring.generate();
  } while (urlsInUse[url]);
  // Once a unique string is found put it in urlsInUse
  urlsInUse[url] = true;

  return url;
};
