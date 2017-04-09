'use strict';
module.exports = function(sequelize, DataTypes) {
  var Timeslot = sequelize.define('Timeslot', {
    owner_id: DataTypes.INTEGER,
    room_url: DataTypes.STRING,
    time: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Timeslot.belongsTo(models.User, {foreignKey: 'user_id'});
      }
    }
  });
  return Timeslot;
};