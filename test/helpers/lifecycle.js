/**
 * Module dependencies
 */

var io = require('socket.io-client');
var sailsIO = require('../../sails.io.js');
var Sails = require('sails/lib/app');


// Use a weird port to avoid tests failing if we
// forget to shut down another Sails app
var TEST_SERVER_PORT = 1577;


/**
 * @type {Object}
 */
module.exports = {

  setup: function (cb) {

    // New up an instance of Sails
    // and lift it.
    var app = Sails();
    app.lift({
      log: { level: 'silent' },
      port: TEST_SERVER_PORT,
      sockets: {
        authorization: false
      }
    },function (err) {
      if (err) return cb(err);
      
      // Instantiate socket client.
      io = sailsIO(io);
      // Set some options.
      io.sails.url = 'http://localhost:'+TEST_SERVER_PORT;
      
      // Globalize sails app as `server`
      global.server = app;

      // Globalize sails.io client as `io`
      global.io = io;

      return cb(err);
    });
    
  },





  teardown: function (done) {

    // If the socket never connected, don't worry about disconnecting
    // TODO:
    // cancel the connection attempt if one exists-
    // or better yet, extend `disconnect()` to do this
    if (!global.io || !io.socket || !_isConnected(io.socket)) {
      return done();
    }
    
    // Disconnect socket
    io.socket.disconnect();
    setTimeout(function ensureDisconnect () {
      
      // Ensure socket is actually disconnected
      var isActuallyDisconnected = (io.socket.socket.connected === false);
      
      // Tear down sails server
      global.server.lower(function (){

        // Delete globals (just in case-- shouldn't matter)
        delete global.server;
        delete global.io;
        return done();
      });
      
    }, 0);
  }
};




/**
 * _isConnected
 *
 * @api private
 * @param  {Socket}  socket
 * @return {Boolean} whether the socket is connected and able to
 *                           communicate w/ the server.
 */

function _isConnected(socket) {
  return socket.socket && socket.socket.connected;
}
