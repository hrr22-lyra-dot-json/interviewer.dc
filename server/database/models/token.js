'use strict';
module.exports = function(sequelize, DataTypes) {
  var Token = sequelize.define('Token', {
    owner_id: DataTypes.INTEGER,
    token: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Token.belongsTo(models.User, {foreignKey: 'owner_id'});
      }
    }
  });
  return Token;
};