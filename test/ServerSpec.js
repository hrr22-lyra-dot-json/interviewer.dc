// DO NOT use arrow functions in testing

// supertest reference: https://www.npmjs.com/package/supertest

const assert = require('chai').assert;
const request = require('supertest');
const express = require('express');
const app = express();


describe('GET /', function() {
  it('should respond with json', function(done) {
    request(app)
      .get('/')
      .expect('Content-type', /utf-8/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});

describe('GET and POST to /api/meeting', function() {
  it('should respond with json', function(done) {
    request(app)
      .get('/api/meeting')
      .expect('Content-type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('should respond with json', function(done) {
    request(app)
    .post('/api/meeting')
    .send({owner_id: 1, room_url: 'supertest POST request', time: new Date('April 11, 2017 03:24:00')})
    .expect('Content-type', /json/)
    .expect(200)
    .then(function(err, res) {
      if (err) return done(err);
      assert(res.body.room_url, 'supertest POST request');
    })
  });
});

describe('GET and POST to /api/user', function() {
  it('should respond with json', function(done) {
    request(app)
      .get('/api/user')
        .expect('Content-type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('should respond with json', function(done) {
    request(app)
    .post('/api/user')
    .send({username: 'supertestTest', email: 'ghost@gmails.com'})
    .expect('Content-type', /json/)
    .expect(200)
    .then(function(err, res) {
      if (err) return done(err);
      assert(res.body.email, 'ghost@gmails.com')
    })
  });
});
