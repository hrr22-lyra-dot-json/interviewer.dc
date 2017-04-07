'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Meetings', [
      {
        owner_id: 1,
        room_url: null,
        time: new Date()
      },
      {
        owner_id: 1,
        room_url: null,
        time: new Date()
      },
      {
        owner_id: 2,
        room_url: null,
        time: new Date()
      },
      {
        owner_id: 2,
        room_url: null,
        time: new Date()
      },
      {
        owner_id: 3,
        room_url: null,
        time: new Date()
      },
      {
        owner_id: 3,
        room_url: null,
        time: new Date()
      },
      {
        owner_id: 4,
        room_url: null,
        time: new Date()
      },
      {
        owner_id: 4,
        room_url: null,
        time: new Date()
      }
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Meetings', null, {});
  }
};
