// DO NOT use arrow functions in testing

const request = require('supertest');
const express = require('express');
const app = express();

// example test
describe('GET /', function() {
  it('respond with json', function(done) {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-type', /utf-8/)
      .expect(404, done);
  });
});
