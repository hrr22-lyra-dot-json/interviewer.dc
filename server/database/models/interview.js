'use strict';
module.exports = function(sequelize, DataTypes) {
  var Interview = sequelize.define('Interview', {
    owner_id: DataTypes.INTEGER,
    start: DataTypes.DATE,
    end: DataTypes.DATE,
    interviewee_name: DataTypes.STRING,
    interviewee_email: DataTypes.STRING,
    title: DataTypes.STRING,
    roomid: DataTypes.STRING,
    status: DataTypes.STRING,
    drive_link: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Interview.belongsTo(models.User, {foreignKey: 'owner_id'});
        Interview.belongsTo(models.Meeting, {foreignKey: 'roomid'});
      }
    }
  });
  return Interview;
};