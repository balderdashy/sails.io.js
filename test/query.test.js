/**
 * Module dependencies
 */

var util = require('util');
var assert = require('assert');
var lifecycle = require('./helpers/lifecycle');
var _setupRoutes = require('./helpers/setupRoutes');
var _assertResponse = function ( expectedResponses ) {
  return function (routeAddress, callbackArgs) {
    var body = callbackArgs[0];
    var jwr = callbackArgs[1];

    // Ensure JWR is valid
    assert.equal(typeof jwr, 'object');

    // Ensure body's type is correct
    assert.equal((typeof body),(typeof expectedResponses[routeAddress].body), util.format('Expecting type:%s:\n%s\n\nbut got type:%s:\n%s\n', (typeof expectedResponses[routeAddress].body), util.inspect(expectedResponses[routeAddress].body, false, null), (typeof body),util.inspect(body,false,null)));

    // Ensure body is the correct value
    assert.deepEqual(expectedResponses[routeAddress].body, body);

    // Ensure jwr's statusCode is correct
    assert.deepEqual(expectedResponses[routeAddress].statusCode || 200, jwr.statusCode);
  };
};

var EXPECTED_RESPONSES = {
  'post /auth': { req: 'socket.handshake.query.token', body: '290891' }
};

var setupRoutes = _setupRoutes(EXPECTED_RESPONSES);
var assertResponse = _assertResponse(EXPECTED_RESPONSES);


describe('io.socket', function () {

  describe('With query settings', function() {
    before(function(done) {
      lifecycle.setup({transports: ['websocket'], query: 'token=290891'}, function() {
        done();
      });
    });
    before(setupRoutes);

    describe('once connected, socket', function () {

      it('should be able to send a query parameter and receive the expected query in the request', function (cb) {
        io.socket.post('/auth', {}, function (body, jwr) {
          assertResponse('post /auth', arguments);
          return cb();
        });
      });

    });


    after(lifecycle.teardown);
    
  });

});
