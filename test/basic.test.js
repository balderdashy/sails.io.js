/**
 * Module dependencies
 */

var assert = require('assert');
var lifecycle = require('./helpers/lifecycle');
var setupRoutes = require('./helpers/setupRoutes');



describe('io.socket', function () {

  before(lifecycle.setup);

  var EXPECTED_RESPONSES = {
    'get /hello': 'ok!',
    'get /someJSON': {
      foo: 'bar'
    }
  };

  before(setupRoutes(EXPECTED_RESPONSES));

  it('should connect automatically', function (cb) {
    io.socket.on('connect', cb);
  });

  describe('once connected, socket', function () {

    it('should be able to send a GET request and receive the expected response', function (cb) {
      io.socket.get('/hello', function (responseBody, jwrResponse) {
        assert(EXPECTED_RESPONSES['get /hello'] === responseBody);
        return cb();
      });
    });

    it('should receive JSON as a POJO, not a string', function (cb) {
      io.socket.get('/someJSON', function (responseBody, jwrResponse) {
        assert.deepEqual(EXPECTED_RESPONSES['get /someJSON'], responseBody);
        return cb();
      });
    });
    
  });


  after(lifecycle.teardown);

});
