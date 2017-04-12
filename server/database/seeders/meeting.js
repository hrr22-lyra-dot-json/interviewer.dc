'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Meetings', [
      {
        owner_id: 1,
        time: new Date()
      },
      {
        owner_id: 1,
        time: new Date()
      },
      {
        owner_id: 2,
        time: new Date()
      },
      {
        owner_id: 2,
        time: new Date()
      },
      {
        owner_id: 3,
        time: new Date()
      },
      {
        owner_id: 3,
        time: new Date()
      },
      {
        owner_id: 4,
        time: new Date()
      },
      {
        owner_id: 4,
        time: new Date()
      }
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Meetings', null, {});
  }
};
