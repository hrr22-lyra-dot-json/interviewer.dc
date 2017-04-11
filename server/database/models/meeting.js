'use strict';
module.exports = function(sequelize, DataTypes) {
  var Meeting = sequelize.define('Meeting', {
    owner_id: DataTypes.INTEGER,
    room_url: DataTypes.STRING,
    time: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Meeting.belongsTo(models.User, {foreignKey: 'owner_id'});
      }
    }
  });
  return Meeting;
};