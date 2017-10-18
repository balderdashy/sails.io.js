/**
 * Module dependencies
 */

var Sails = require('sails/lib/app');
var SHSockets = require('sails-hook-sockets');
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

    if (_.isFunction(opts)) {
      cb = opts;
      opts = {};
    }

    // New up an instance of Sails
    // and lift it.
    var app = Sails();
    app.lift({
      log: { level: 'error' },
      globals: {
        sails: true,
        _: false,
        async: false,
        models: false
      },
      port: TEST_SERVER_PORT,
      sockets: {
        transports: opts.transports,
        path: opts.path,
        beforeConnect: opts.beforeConnect || false
      },
      hooks: {
        grunt: false,
        sockets: SHSockets
      },
      routes: {
        '/sails.io.js': function(req, res) {
          res.header('Content-type', 'application/javascript');
          require('fs').createReadStream(require('path').resolve(__dirname, '..', '..', 'dist', 'sails.io.js')).pipe(res);
        }
      }
    },function (err) {
      if (err) { return cb(err); }
      // console.log('lifted');

      // Instantiate socket client.
      io = sailsIO(io);
      // Set some options.
      io.sails.url = opts.url || 'http://localhost:'+TEST_SERVER_PORT;
      // Disable the sails.io.js client's logger
      io.sails.environment = opts.environment || 'production';
      // Don't automatically reconnect after being disconnected
      io.sails.reconnection = false;

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

      if (typeof (opts.query) != 'undefined') {
        io.sails.query = opts.query;
      }

      if (typeof (opts.headers) != 'undefined') {
        io.sails.headers = opts.headers;
      }

      if (typeof (opts.initialConnectionHeaders) != 'undefined') {
        io.sails.initialConnectionHeaders = opts.initialConnectionHeaders;
      }

      if (typeof (opts.path) != 'undefined') {
        io.sails.path = opts.path;
      }

      if (typeof (opts.reconnection) != 'undefined') {
        io.sails.reconnection = opts.reconnection;
      }

      // Globalize sails app as `server`
      global.server = app;

      // Globalize sails.io client as `io`
      global.io = io;
      return cb(err);
    });

  },





  teardown: function (done) {

    if (global.io && io.socket && io.socket.isConnected()) {
      // Disconnect socket
      io.socket.disconnect();
    }

    setTimeout(function ensureDisconnect () {

      // Tear down sails server
      // console.log('lowering...');
      global.server.lower(function (){

        // console.log('lowered');

        // Delete globals (just in case-- shouldn't matter)
        delete global.server;
        delete global.io;
        return setTimeout(done, 100);
      });

    }, 0);
  }
};



