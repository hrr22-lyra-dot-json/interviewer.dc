'use strict';
module.exports = function(sequelize, DataTypes) {
  var UserMeeting = sequelize.define('UserMeeting', {
    user_id: DataTypes.INTEGER,
    meeting_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        UserMeeting.belongsTo(models.User, {foreignKey: 'user_id'});
        UserMeeting.belongsTo(models.Meeting, {foreignKey: 'meeting_id'});
      }
    }
  });
  return UserMeeting;
};