'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    googleId: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    photoUrl: DataTypes.STRING,
    drive_folder_id: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};