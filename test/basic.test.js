/**
 * Module dependencies
 */

var lifecycle = require('./helpers/lifecycle');



describe('io.socket', function () {

  before(lifecycle.setup);

  it('should connect automatically', function (cb) {
    io.socket.on('connect', cb);
  });

  after(lifecycle.teardown);

});
