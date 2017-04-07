'use strict';
module.exports = function(sequelize, DataTypes) {
  var Meeting = sequelize.define('Meeting', {
    owner_id: DataTypes.STRING,
    room_url: DataTypes.STRING,
    time: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Meeting.belongsTo(models.User, {foreignKey: 'user_id'});
      }
    }
  });
  return Meeting;
};