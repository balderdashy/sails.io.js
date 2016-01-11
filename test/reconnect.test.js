/**
 * Module dependencies
 */

var util = require('util');
var assert = require('assert');
var lifecycle = require('./helpers/lifecycle');

describe('io.socket', function () {

  describe('With forceNew: true', function() {
    before(function (done) {
      lifecycle.setup({ forceNew: true }, done);
    });

    it('should connect automatically', function (cb) {
      io.socket.on('connect', cb);
    });

    describe('once connected, socket', function () {
      it('should disconnect', function (cb) {
        io.socket.disconnect();
        cb();
      });
      it('should reconnect successfully', function (cb) {
        io.socket = io.sails.connect();
        io.socket.on('connect', cb);
      });
    });

    after(lifecycle.teardown);

  });

});
