'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('UserMeetings', [
      {
        user_id: 1,
        meeting_id: 2
      },
      {
        user_id: 2,
        meeting_id: 2
      },
      {
        user_id: 3,
        meeting_id: 2
      },
      {
        user_id: 4,
        meeting_id: 2
      },
      {
        user_id: 1,
        meeting_id: 4
      },
      {
        user_id: 2,
        meeting_id: 4
      },
      {
        user_id: 3,
        meeting_id: 4
      },
      {
        user_id: 4,
        meeting_id: 4
      },
      {
        user_id: 1,
        meeting_id: 6
      },
      {
        user_id: 2,
        meeting_id: 6
      },
      {
        user_id: 3,
        meeting_id: 6
      },
      {
        user_id: 4,
        meeting_id: 6
      },
      {
        user_id: 1,
        meeting_id: 8
      },
      {
        user_id: 2,
        meeting_id: 8
      },
      {
        user_id: 3,
        meeting_id: 8
      },
      {
        user_id: 4,
        meeting_id: 8
      }
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('UserMeetings', null, {});
  }
};
