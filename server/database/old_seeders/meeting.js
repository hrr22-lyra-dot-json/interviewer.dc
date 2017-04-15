'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Meetings', [
      {
        owner_id: 1,
        job_position: 'King of the world'
      },
      {
        owner_id: 1,
        job_position: 'King of the world'
      },
      {
        owner_id: 2,
        job_position: 'King of the world'
      },
      {
        owner_id: 2,
        job_position: 'King of the world'
      },
      {
        owner_id: 3,
        job_position: 'King of the world'
      },
      {
        owner_id: 3,
        job_position: 'King of the world'
      },
      {
        owner_id: 4,
        job_position: 'King of the world'
      },
      {
        owner_id: 4,
        job_position: 'King of the world'
      }
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Meetings', null, {});
  }
};
