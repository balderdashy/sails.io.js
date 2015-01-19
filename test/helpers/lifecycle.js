/**
 * Module dependencies
 */

var Sails = require('sails/lib/app');
var _ = require('lodash');

// Use a weird port to avoid tests failing if we
// forget to shut down another Sails app
var TEST_SERVER_PORT = 1577;


/**
 * @type {Object}
 */
module.exports = {

  setup: function (opts, cb) {

    // Invalidate socket.io-client in require cache
    _.each(_.keys(require.cache), function (modulePath) {
      if (modulePath.match(/socket.io-client/)){
        delete require.cache[modulePath];
      }
    });

    // Require socket.io-client and sails.io.js fresh
    var io = require('socket.io-client');
    var sailsIO = require('../../sails.io.js');

    if (typeof opts == 'function') {
      cb = opts;
      opts = {};
    }

    // New up an instance of Sails
    // and lift it.
    var app = Sails();
    app.lift({
      log: { level: 'error' },
      port: TEST_SERVER_PORT,
      sockets: {
        authorization: false,
        transports: opts.transports
      }
    },function (err) {
      if (err) return cb(err);
      
      // Instantiate socket client.
      io = sailsIO(io);
      // Set some options.
      io.sails.url = opts.url || 'http://localhost:'+TEST_SERVER_PORT;
      // Disable the sails.io.js client's logger
      io.sails.environment = opts.environment || 'production';

      if (typeof (opts.multiplex) != 'undefined') {
        io.sails.multiplex = opts.multiplex;
      }

      if (typeof (opts.transports) != 'undefined') {
        io.sails.transports = opts.transports;
      }

      if (typeof (opts.autoConnect) != 'undefined') {
        io.sails.autoConnect = opts.autoConnect;
      }

      if (typeof (opts.useCORSRouteToGetCookie) != 'undefined') {
        io.sails.useCORSRouteToGetCookie = opts.useCORSRouteToGetCookie;
      }

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
    if (!global.io || !io.socket || !io.socket.isConnected()) {
      return done();
    }
    
    // Disconnect socket
    io.socket.disconnect();
    setTimeout(function ensureDisconnect () {
      
      // Ensure socket is actually disconnected
      var isActuallyDisconnected = (io.socket.isConnected() === false);
      
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



