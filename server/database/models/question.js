'use strict';
module.exports = function(sequelize, DataTypes) {
  var Question = sequelize.define('Question', {
    meeting_id: DataTypes.INTEGER,
    question: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Question.belongsTo(models.Meeting, {foreignKey: 'meeting_id'});
      }
    }
  });
  return Question;
};