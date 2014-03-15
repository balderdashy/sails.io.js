/**
 * Module dependencies
 */

var assert = require('assert');
var lifecycle = require('./helpers/lifecycle');



describe('io.socket', function () {

  before(lifecycle.setup);

  var EXPECTED_RESPONSES = {
    'get /hello': 'ok!',
    'get /someJSON': {
      foo: 'bar'
    }
  };

  before(function setupRoutes () {
    sails.router.bind('get /hello', function (req, res) {
      return res.send(EXPECTED_RESPONSES['get /hello']);
    });
    sails.router.bind('get /someJSON', function (req, res) {
      return res.json(EXPECTED_RESPONSES['get /someJSON']);
    });
  });

  it('should connect automatically', function (cb) {
    io.socket.on('connect', cb);
  });

  describe('once connected, socket', function () {

    it('should be able to send a GET request and receive the expected response', function (cb) {
      io.socket.get('/hello', function (serverResponse) {
        assert(EXPECTED_RESPONSES['get /hello'] === serverResponse.body);
        return cb();
      });
    });

    it('should receive JSON as a POJO, not a string', function (cb) {
      io.socket.get('/someJSON', function (serverResponse) {
        assert.deepEqual(EXPECTED_RESPONSES['get /someJSON'], serverResponse.body);
        return cb();
      });
    });
    
  });


  after(lifecycle.teardown);

});
