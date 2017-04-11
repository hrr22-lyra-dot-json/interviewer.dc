// DO NOT use arrow functions in testing

// supertest reference: https://www.npmjs.com/package/supertest
const app = require('../server/server.js');
const assert = require('chai').assert;
const expect = require('chai').expect;
const request = require('supertest');
const express = require('express');


describe('API Tests', function() {
  it('should return version number', function(done) {
    request(app)
      .get('/api')
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.body.version).to.be.ok;
        expect(res.statusCode).to.equal(200);
        done();
      });
  });
});

describe('POST, GET, and DELETE meetings', function() {
  it('should POST Meeting', function(done) {
    request(app)
    .post('/api/Meeting')
    .set('Accept', /json/)
    .send({owner_id: 2113})
    .expect(201)
    .end(function(err, res) {
      if (err) return done(err);
      done();
    });
  });

  it('should respond with json', function(done) {
    request(app)
    .get('/api/UserMeetings')
    .set('Accept', /json/)
    .send({user_id: 2113})
    .expect('Content-type', /json/)
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);
      done();
    });
  });

  it('should DELETE Meeting', function(done) {
    request(app)
    .delete('/api/Meeting')
    .set('Accept', /json/)
    .send({user_id: 2113})
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);
      done();
    })
  });
});

describe('GET /api/allUserMeetings', function() {
  it('should respond with json', function(done) {
    request(app)
      .get('/api/allUserMeetings')
      .expect('Content-type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});
