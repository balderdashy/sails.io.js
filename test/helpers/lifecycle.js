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
        authorization: function (sock, cb) {
          // Allow all incoming socket requests
          // for testing purposes.
          cb(null, true);
        }
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





  teardown: function (cb) {

    // Disconnect socket
    io.socket.disconnect();
    setTimeout(function ensureDisconnect () {
      
      // Ensure socket is actually disconnected
      var isActuallyDisconnected = (io.socket.socket.connected === false);
      
      // Tear down sails server
      global.server.lower(cb);

      // Delete globals (just in case-- shouldn't matter)
      delete global.server;
      delete global.io;
      
    }, 0);
  }
};
