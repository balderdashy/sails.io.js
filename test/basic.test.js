/**
 * Module dependencies
 */

var assert = require('assert');
var lifecycle = require('./helpers/lifecycle');
var _setupRoutes = require('./helpers/setupRoutes');
var _assertResponse = function ( expectedResponses ) {
  return function (routeAddress, callbackArgs) {
    var body = callbackArgs[0];
    var jwr = callbackArgs[1];

    // Ensure JWR is valid
    assert(typeof jwr === 'object');

    // Ensure body's type is correct
    assert((typeof body) === (typeof expectedResponses[routeAddress].body));

    // Ensure body is the correct value
    assert.deepEqual(expectedResponses[routeAddress].body, body);

    // Ensure jwr's statusCode is correct
    assert.deepEqual(expectedResponses[routeAddress].statusCode || 200, jwr.statusCode);
  };
};

var EXPECTED_RESPONSES = {
  'get /hello': { body: 'ok!' },
  'get /someJSON': {
    body: { foo: 'bar' }
  },
  'get /someError': {
    body: { blah: 'blah' },
    statusCode: 501
  }
};
var setupRoutes = _setupRoutes(EXPECTED_RESPONSES);
var assertResponse = _assertResponse(EXPECTED_RESPONSES);


describe('io.socket', function () {

  before(lifecycle.setup);
  before(setupRoutes);

  it('should connect automatically', function (cb) {
    io.socket.on('connect', cb);
  });

  describe('once connected, socket', function () {

    it('should be able to send a GET request and receive the expected response', function (cb) {
      io.socket.get('/hello', function (body, jwr) {
        assertResponse('get /hello', arguments);
        return cb();
      });
    });

    it('should receive JSON as a POJO, not a string', function (cb) {
      io.socket.get('/someJSON', function (body, jwr) {
        assertResponse('get /someJSON', arguments);
        return cb();
      });
    });

    it('should receive a valid jwr response object as its second argument, with the correct error code', function (cb) {
      io.socket.get('/someError', function (body, jwr) {
        assertResponse('get /someError', arguments);
        return cb();
      });
    });
    
  });


  after(lifecycle.teardown);

});
