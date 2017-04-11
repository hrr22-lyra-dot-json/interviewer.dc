'use strict';
module.exports = function(sequelize, DataTypes) {
  var Timeslot = sequelize.define('Timeslot', {
    owner_id: DataTypes.INTEGER,
    start: DataTypes.DATE,
    end: DataTypes.DATE,
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Timeslot.belongsTo(models.User, {foreignKey: 'owner_id'});
      }
    }
  });
  return Timeslot;
};