/**
 * Module dependencies
 */

var assert = require('assert');
var lifecycle = require('./helpers/lifecycle');



describe('io.socket', function () {

  before(lifecycle.setup);

  var EXPECTED_RESPONSES = {
    'get /foo': 'ok!'
  };

  before(function setupRoutes () {
    sails.router.bind('get /foo', function (req, res) {
      return res.send(EXPECTED_RESPONSES['get /foo']);
    });
  });

  it('should connect automatically', function (cb) {
    io.socket.on('connect', cb);
  });

  describe('once connected, socket', function () {

    it('should be able to send a GET request and receive the expected response', function (cb) {
      io.socket.get('/foo', function (err, response) {
        if (err) return cb(err);

        assert(EXPECTED_RESPONSES['get /foo'] === response);
        return cb();
      });
    });
    
  });


  after(lifecycle.teardown);

});
