'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
        username: 'kanson',
        email: 'kyle.anson7@gmail.com'
      },
      {
        username: 'jordan',
        email: 'jstubblefield7939@gmail.com'
      },
      {
        username: 'jason',
        email: 'kasonjim@gmail.com'
      },
      {
        username: 'simon',
        email: 'simondemoor0@gmail.com'
      }
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
