/**
 * Module dependencies
 */

var assert = require('assert');
var lifecycle = require('./helpers/lifecycle');
var _setupRoutes = require('./helpers/setupRoutes');

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



describe('io.socket', function () {

  before(lifecycle.setup);
  before(setupRoutes);

  it('should connect automatically', function (cb) {
    io.socket.on('connect', cb);
  });

  describe('once connected, socket', function () {

    it('should be able to send a GET request and receive the expected response', function (cb) {
      io.socket.get('/hello', function (responseBody, jwrResponse) {
        // Expected response body: "ok!"
        assert(typeof responseBody === 'string');
        assert(EXPECTED_RESPONSES['get /hello'].body === responseBody);
        return cb();
      });
    });

    it('should receive JSON as a POJO, not a string', function (cb) {
      io.socket.get('/someJSON', function (responseBody, jwrResponse) {
        // Expected response body: { foo: 'bar' }
        assert(typeof responseBody === 'object');
        assert.deepEqual(EXPECTED_RESPONSES['get /someJSON'].body, responseBody);
        return cb();
      });
    });

    it('should receive a valid jwrResponse object as its second argument', function (cb) {
      io.socket.get('/someError', function (responseBody, jwrResponse) {
        // Expected response body: { foo: 'bar' }
        assert(typeof responseBody === 'object');
        assert(typeof jwrResponse === 'object');
        assert.deepEqual(EXPECTED_RESPONSES['get /someError'].body, responseBody);
        assert.deepEqual(EXPECTED_RESPONSES['get /someError'].statusCode, jwrResponse.statusCode);
        return cb();
      });
    });
    
  });


  after(lifecycle.teardown);

});
