/**
 * Module dependencies
 */

var assert = require('assert');
var _ = require('lodash');
var sailsIO = require('../sails.io.js');
var Sails = require('sails/lib/app');
var async = require('async');

// Use a weird port to avoid tests failing if we
// forget to shut down another Sails app
var TEST_SERVER_PORT = 1577;

describe('queueing :: ', function() {

  describe('requests :: ', function() {

    var socket;
    var app;
    var fnContainer = {};

    before(function() {

      // Instantiate a sails.io.js client and configure the url.
      var io = _getFreshClient();
      io.sails.url = 'http://localhost:'+TEST_SERVER_PORT;
      io.sails.autoConnect = false;
      io.sails.reconnection = true;
      // Disable logger in sails.io.js client
      io.sails.environment = 'production';
      socket = io.sails.connect();
      socket.on('foo', function(){console.log("FFOOOOO!");});
    });

    after(function(done) {
      app.lower(done);
    });

    describe('before connecting, socket', function () {
      it('should allow requests to be queued', function() {
        socket.get('/foo', function (body, jwr) {
          fnContainer.fn(body, jwr);
        });
      });

    });

    describe('after connecting, socket', function () {

      it('should execute queued requests successfully', function(done) {
        fnContainer.fn = function(body, jwr) {
          assert(body==='foo');
          assert(jwr.statusCode===200);
          return done();
        };
        _buildSailsApp(function (err, _app){
          if (err) {return done(err);}
          app = _app;
          app.get('/foo', function (req,res){
            res.send('foo');
          });
        });
      });

    });

    describe('after being disconnected, socket', function() {
      before(function(done) {
        app.lower(function(err) {
          if (err) {return done(err);}
          setTimeout(done, 100);
        });
      });
      it('should allow requests to be queued', function() {
        socket.get('/bar', function (body, jwr) {
          fnContainer.fn(body, jwr);
        });
      });
    });

    describe('after reconnecting, socket', function () {

      it('should execute queued requests successfully', function(done) {
        fnContainer.fn = function(body, jwr) {
          assert(body==='bar');
          assert(jwr.statusCode===200);
          return done();
        };
        _buildSailsApp(function (err, _app){
          if (err) {return done(err);}
          app = _app;
          app.get('/bar', function (req,res){
            res.send('bar');
          });
        });
      });

    });

  });

  describe('should allow requests to be queued', function() {

    it('then execute their callbacks when the socket connects and is able to process the queue', function (done){

      _buildSailsApp(function (err, app){
        if (err) return done(err);

        app.get('/foo', function (req,res){
          res.send('foo');
        });

        var io = _getFreshClient();

        //
        // Notice we're not waiting for the connection to do this.
        //

        io.socket.get('/foo', function (body, jwr) {
          assert(body==='foo');
          assert(jwr.statusCode===200);

          app.lower(function () {
            return done();
          });
        });
      });

    });

  });


  it('should allow comet listeners to be bound to the fake TmpSocket, then rebind them to the actual socket once it connects and is therefore capable of receiving events', function (done){

    // Note that we're not actually QUEUING comet events that were sent
    // while the socket connects-- there's no way to do that client-side,
    // and it wouldn't really be that helpful.
    //
    // Instead, the purpose of this test is to make sure that the listeners
    // "make it" to the real socket once it does connect.

    _buildSailsApp(function (err, app){
      if (err) return done(err);
      var io = _getFreshClient();
      tio = io;
      //
      // Notice we're not waiting for the connection to do this.
      //

      io.socket.on('foo', function (event){
        assert('oh hi' === event);
        app.lower({hardShutdown: true}, function () {
          return done();
        });
      });

      // After a while, emit an event on the app.
      setTimeout(function (){
        app.sockets.blast('foo', 'oh hi');
      }, 1500);

    });

  });




  it('should allow MULTIPLE comet listeners to be bound to the SAME EVENT before the socket has connected, then rebind them to the actual socket once it connects', function (done){

    _buildSailsApp(function (err, app){
      if (err) return done(err);

      var io = _getFreshClient();
      //
      // Notice we're not waiting for the connection to do this.
      //

      var numCometEventsFired = 0;
      io.socket.on('foo', function (event){
        assert('oh hi' === event);
        numCometEventsFired++;
      });
      io.socket.on('foo', function (event){
        assert('oh hi' === event);
        numCometEventsFired++;
      });

      async.until(function _until(){
        return numCometEventsFired===2;
      },
      function _do(next) {
        setTimeout(next, 250);
      },
      function _afterwards(err) {
        if (err) return done(err);
        app.lower(function () {
          return done();
        });
      });

      // After a while, emit an event on the app.
      setTimeout(function (){
        app.sockets.blast('foo', 'oh hi');
      }, 1500);

    });

  });

});


/**
 * @optional  {String} url
 * @return {io}
 */
function _getFreshClient (url) {

  // Invalidate socket.io-client in require cache
  _.each(_.keys(require.cache), function (modulePath) {
    if (modulePath.match(/socket.io-client/)){
      delete require.cache[modulePath];
    }
  });

  // Re-require the socket.io client (it's a singleton)
  var socketIOClient = require('socket.io-client');

  // Instantiate a sails.io.js client and configure the url.
  var io = sailsIO(socketIOClient);
  io.sails.reconnection = false;
  io.sails.url = url||'http://localhost:'+TEST_SERVER_PORT;
  // Disable logger in sails.io.js client
  io.sails.environment = 'production';

  return io;
}



function _buildSailsApp(cb) {

  // Set up a server to test against
  var app = new Sails();
  app.lift({
    port: TEST_SERVER_PORT,
    log: {level:'error'},
    hooks: {grunt: false}
  },function (err) {
    if (err) return cb(err);
    else cb(null, app);
  });
}
