/**
 * Module dependencies
 */

var lifecycle = require('./helpers/lifecycle');



describe('io.socket', function () {

  before(lifecycle.setup);

  it('should connect automatically', function (cb) {
    io.socket.on('connect', cb);
  });

  it('should be able to send a GET request and receive the proper response', function (cb) {
    io.socket.get('/user', function () {
      console.log('done');
      cb();
    });
  });

  after(lifecycle.teardown);

});
