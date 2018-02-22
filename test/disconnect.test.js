/**
 * Module dependencies
 */

var util = require('util');
var assert = require('assert');
var lifecycle = require('./helpers/lifecycle');
var _setupRoutes = require('./helpers/setupRoutes');
var request = require('request');
var async = require('async');
var _ = require('lodash');

describe('On disconnect', function () {

  before(function(done){
    lifecycle.setup({
      routes: {
        '/ok': function (req, res) {
          setTimeout(()=>{return res.send(req.param('x'));}, 100);
        },
      }
    }, done)
  });

  after(lifecycle.teardown);

  it('should call callbacks for in-progress requests with an error', function (done) {
    // console.log('connecting...');
    io.socket.on('connect', function (){

      async.auto({
        r1: function(cb) {
          setTimeout( function() {
            io.socket.get('/ok?x=1', function (body, res) {
              assert.equal(body, '1');
              return cb();
            });
          }, 100 )
        },
        r2: function(cb) {
          setTimeout( function() {
            io.socket.get('/ok?x=2', function (body, res) {
              assert.equal(body, '2');
              return cb();
            });
          }, 200 )
        },
        r3: function(cb) {
          setTimeout( function() {
            io.socket.get('/ok?x=3', function (body, res) {
              assert(_.isError(body));
              assert(_.isUndefined(res));
              return cb();
            });
          }, 300 )
        },
        kill: function(cb) {
          setTimeout( function() {
            io.socket.disconnect();
            return cb();
          }, 400 )
        },
      }, done);

    });

  });
});
