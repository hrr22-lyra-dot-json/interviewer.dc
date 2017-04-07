var Sequelize = require('sequelize');

//connect to local PostGres Database
var db = new Sequelize("postgres://localholt:5432/");

//connect to Heroku PostGres Database
// var db = new Sequelize("postgres://xhzrrvvawqzqov:1c2ac54a72b223e5d603ce03d8195194ac39336f544c04b266758f083aea4a15@ec2-23-23-228-115.compute-1.amazonaws.com:5432/d5lfn726hf4pp6?ssl=true", {"dialect":"postgres", "ssl":true, "dialectOptions":{"ssl":{"require":true}}});

var Meeting = db.define('Meeting', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  owner_id: Sequelize.STRING,
  room_url: Sequelize.STRING,
  time: Sequelize.STRING
});

Meeting.belongsTo(User, {foreignKey: 'user_id'});

var User = db.define('User', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  name: Sequelize.STRING,
  email: Sequelize.STRING
});

var UserMeeting = db.define('UserMeeting', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  user_id: Sequelize.INTEGER,
  meeting_id: Sequelize.INTEGER
});

UserMeeting.belongsTo(Meeting, {foreignKey: 'meeting_id'});
UserMeeting.belongsTo(User, {foreignKey: 'meeting_id'});

module.exports = db;
