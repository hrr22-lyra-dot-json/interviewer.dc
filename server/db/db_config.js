var db = require('./db.js');

db.sync();
//can add force:true to drop tables before recreating them

module.exports.Meeting = db.models.Meeting;
module.exports.User = db.models.User;
module.exports.UserMeetings = db.models.UserMeetings;
