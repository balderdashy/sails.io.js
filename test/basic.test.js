/**
 * Module dependencies
 */

var util = require('util');
var assert = require('assert');
var lifecycle = require('./helpers/lifecycle');
var _setupRoutes = require('./helpers/setupRoutes');
var request = require('request');
var async = require('async');
var _assertResponse = function ( expectedResponses ) {
  return function (routeAddress, callbackArgs) {
    var body = callbackArgs[0];
    var jwr = callbackArgs[1];

    // Ensure JWR is valid
    assert.equal(typeof jwr, 'object');

    // Ensure body's type is correct
    assert.equal((typeof body),(typeof expectedResponses[routeAddress].body), util.format('Expecting type:%s:\n%s\n\nbut got type:%s:\n%s\n', (typeof expectedResponses[routeAddress].body), util.inspect(expectedResponses[routeAddress].body, false, null), (typeof body),util.inspect(body,false,null)));

    // Ensure body is the correct value
    assert.deepEqual(expectedResponses[routeAddress].body, body);

    // Ensure jwr's statusCode is correct
    assert.deepEqual(expectedResponses[routeAddress].statusCode || 200, jwr.statusCode);
  };
};

var EXPECTED_RESPONSES = {
  'get /hello': { body: 'ok!' },
  'get /someJSON': {
    body: { foo: 'bar' }
  },
  'get /someNull': {
    body: null
  },
  'get /someZero': {
    body: 0
  },
  'get /someError': {
    body: { blah: 'blah' },
    statusCode: 501
  },
  'get /headers': {
    req: 'headers.x-test-header-one',
    body: 'foo',
  },
  'get /headersOverride': {
    req: 'headers.x-test-header-one',
    body: 'baz',
  },
  'get /headersRemove': {
    req: 'headers.x-test-header-one',
    body: undefined
  },
  'delete /hello': { body: 'deleted!'},
  'post /hello': { body: 'posted!'},
  'put /hello': { body: 'putted!'},
  'patch /hello': { body: 'patched!'}

};
var setupRoutes = _setupRoutes(EXPECTED_RESPONSES);
var assertResponse = _assertResponse(EXPECTED_RESPONSES);


describe('io.socket', function () {

  describe('With default settings', function() {
    before(lifecycle.setup);
    before(setupRoutes);

    it('should connect automatically', function (cb) {
      // console.log('connecting...');
      io.socket.on('connect', function (){
        // console.log('connected');
        return cb();
      });
    });

    describe('once connected, socket', function () {

      it('should be able to send a GET request and receive the expected response', function (cb) {
        io.socket.get('/hello', function (body, jwr) {
          assertResponse('get /hello', arguments);
          return cb();
        });
      });

      it('should be able to send a DELETE request and receive the expected response', function (cb) {
        io.socket.delete('/hello', function (body, jwr) {
          assertResponse('delete /hello', arguments);
          return cb();
        });
      });

      it('should be able to send a POST request and receive the expected response', function (cb) {
        io.socket.post('/hello', function (body, jwr) {
          assertResponse('post /hello', arguments);
          return cb();
        });
      });

      it('should be able to send a PUT request and receive the expected response', function (cb) {
        io.socket.put('/hello', function (body, jwr) {
          assertResponse('put /hello', arguments);
          return cb();
        });
      });

      it('should be able to send a PATCH request and receive the expected response', function (cb) {
        io.socket.patch('/hello', function (body, jwr) {
          assertResponse('patch /hello', arguments);
          return cb();
        });
      });

      it('should receive JSON as a POJO, not a string', function (cb) {
        io.socket.get('/someJSON', function (body, jwr) {
          assertResponse('get /someJSON', arguments);
          return cb();
        });
      });

      it('should be able to receive a `null` body', function (cb) {
        io.socket.get('/someNull', function (body, jwr) {
          assertResponse('get /someNull', arguments);
          return cb();
        });
      });

      it('should be able to receive a body containing the number zero', function (cb) {
        io.socket.get('/someZero', function (body, jwr) {
          assertResponse('get /someZero', arguments);
          return cb();
        });
      });

      it('should receive JSON as a POJO, not a string', function (cb) {
        io.socket.get('/someJSON', function (body, jwr) {
          assertResponse('get /someJSON', arguments);
          return cb();
        });
      });

      it('should receive a valid jwr response object as its second argument, with the correct error code', function (cb) {
        io.socket.get('/someError', function (body, jwr) {
          assertResponse('get /someError', arguments);
          return cb();
        });
      });

    });


    after(lifecycle.teardown);

  });

  describe('With autoconnect: false', function() {

    describe('with default Sails server options', function() {

      before(function(done) {
        lifecycle.setup({
          autoconnect: false,
        }, done);
      });
      before(setupRoutes);
      after(lifecycle.teardown);

      describe('creating a new socket with io.sails.connect(url, opts)', function(done) {

        var socket;
        var fnHolder = {fn: null};
        var queuedRequestCb = function(data, jwr) {
          return fnHolder.fn(data, jwr);
        };

        before(function(done){
          socket = io.sails.connect("http://localhost:1577",{
            headers: {
              'x-test-header-one': 'foo',
              'x-test-header-two': 'bar',
            }
          });
          socket.on('connect', done);
        });

        it('should connect the socket to the server', function() {
          assert(socket.isConnected());
        });

        it('should be able to send a GET request and receive the expected response', function (cb) {
          socket.get('/headers', function (body, jwr) {
            assertResponse('get /headers', arguments);
            return cb();
          });
        });

        it('should get an error if an attempt is made to change `socket.url`', function () {
          try {
            socket.url = "http://example.com";
          } catch (e) {
            return;
          }
          assert(false);
        });

        it('should get an error if `.reconnect()` is called', function () {
          try {
            socket.reconnect();
          } catch (e) {
            return;
          }
          assert(false);
        });

        it('should disconnect if `.disconnect()` is called', function () {
          socket.disconnect();
          assert(!socket.isConnected());
        });

        it('should get an error if `.disconnect()` is called again', function () {
          try {
            socket.disconnect();
          } catch (e) {
            return;
          }
          assert(false);
        });

        it('should be able to send a GET request and NOT receive any response', function(cb) {
          fnHolder.fn = function() {assert(false);};
          socket.get('/headers', queuedRequestCb);
          setTimeout(cb, 100);
        });

        it('should not get an error if an attempt is made to change `socket.url`', function () {
          socket.url = "http://127.0.0.1:1577";
        });

        it('should be reconnect and receive the response from the queued request', function(cb) {
          fnHolder.fn = function(data, jwr) {assertResponse('get /headers', arguments); return cb();};
          socket.reconnect();
        });

      });

      it('should be able to create and connect new socket with io.sails.connect(opts)', function(done) {
        var socket = io.sails.connect({url: "http://localhost:1577"});
        socket.on('connect', done);
      });

      it('should be able to create and connect new socket with io.sails.connect(url)', function(done) {
        var socket = io.sails.connect("http://localhost:1577");
        socket.on('connect', done);
      });

    });

    describe('With path set to `/socketsarefun` in Sails and in io.sails.path', function() {

      var socket;
      before(function(done) {
        lifecycle.setup({
          autoConnect: false,
          path: '/socketsarefun'
        }, done);
      });
      before(setupRoutes);
      after(lifecycle.teardown);

      it('should be able to create and connect new socket with io.sails.connect(opts)', function(done) {
        socket = io.sails.connect({url: "http://localhost:1577"});
        socket.on('connect', done);
      });

      it('should be able to send a GET request and receive the expected response', function (cb) {
        socket.get('/hello', function (body, jwr) {
          assertResponse('get /hello', arguments);
          return cb();
        });
      });

    });

  });

  describe('Using headers option', function() {
    before(function(done) {
      lifecycle.setup({
        headers: {
          'x-test-header-one': 'foo',
          'x-test-header-two': 'bar',
        }
      }, done);
    });
    before(setupRoutes);

    it('should connect automatically', function (cb) {
      io.socket.on('connect', cb);
    });

    describe('once connected, socket', function () {

      it('should be able to send a GET request and receive the expected response, including custom headers', function (cb) {
        io.socket.get('/headers', function (body, jwr) {
          assertResponse('get /headers', arguments);
          return cb();
        });
      });

      it('should be able to override the global headers on a per-request basis', function (cb) {
        io.socket.request({method: 'get', url: '/headersOverride', headers: {'x-test-header-one': 'baz'}}, function (body, jwr) {
          assertResponse('get /headersOverride', arguments);
          return cb();
        });
      });

      it('should be able to remove the global headers on a per-request basis', function (cb) {
        io.socket.request({method: 'get', url: '/headersRemove', headers: {'x-test-header-one': undefined}}, function (body, jwr) {
          assertResponse('get /headersRemove', arguments);
          return cb();
        });
      });

    });


    after(lifecycle.teardown);

  });

  describe('Sessions', function() {
    before(function(done) {
      lifecycle.setup(function(err) {
        if (err) {return done(err);}
        sails.router.bind("/count", function (req, res) {
          var count;
          if (!req.session) {return res.send("NOSESSION");}
          count  = req.session.count || 1;
          req.session.count = count + 1;
          return res.status(200).send(count);
        });
        return done();
      });
    });
    after(lifecycle.teardown);

    it('should connect automatically', function (cb) {
      io.socket.on('connect', cb);
    });

    describe('once connected, socket', function () {

      it('should be able to send two requests and have them use the same session', function (done) {
        io.socket.get('/count', function (body, jwr) {
          assert.equal(body, 1);
          io.socket.get('/count', function (body, jwr) {
            assert.equal(body, 2);
            return done();
          });
        });
      });

      it('should not share the session with a new socket if that socket doesn\'t send an initial cookie header', function(done) {
        var newSailsSocket = io.sails.connect();
        newSailsSocket.get('/count', function (body, jwr) {
          assert.equal(body, 1);
          return done();
        });
      });
    });

    describe('Using cookie header in initial handshake :: ', function() {

      var cookie, socket1, socket2;
      before(function(done) {
        // Make a request to Sails' built-in /__getcookie route
        request.get('http://localhost:1577/__getcookie', function(err, response) {
          // Get the cookie data from the set-cookie header
          cookie = response.headers['set-cookie'][0].split(';')[0];
          // Connect two sockets using that cookie
          socket1 = io.sails.connect({initialConnectionHeaders: {'cookie': cookie}});
          socket2 = io.sails.connect({initialConnectionHeaders: {'cookie': cookie}});
          async.parallel([
            function connectSocket1(cb) {socket1.on('connect', cb);},
            function connectSocket2(cb) {socket2.on('connect', cb);}
          ], done);
        });
      });

      it('if two sockets connection using the same cookie, they should share a session', function(done) {
        // Make a call with socket 1
        socket1.get('/count', function (body, jwr) {
          assert.equal(body, 1);
          // Make another call with socket 2 and check that they're using the same session
          socket2.get('/count', function (body, jwr) {
            assert.equal(body, 2);
            return done();
          });
        });

      });
    });
  });

  describe('With initialConnectionHeaders option set to {nosession: true}', function() {
    before(function(done) {
      lifecycle.setup({initialConnectionHeaders: {nosession: true}}, function(err) {
        if (err) {return done(err);}
        sails.router.bind("/count", function (req, res) {
          var count;
          if (!req.session) {return res.send("NOSESSION");}
          count  = req.session.count || 1;
          req.session.count = count + 1;
          return res.status(200).send(count);
        });
        return done();
      });
    });
    after(lifecycle.teardown);

    it('should connect automatically', function (cb) {
      io.socket.on('connect', cb);
    });

    describe('once connected, socket', function () {

      it('should be able to send two requests and have them not connect to a session', function (done) {
        io.socket.get('/count', function (body, jwr) {
          assert.equal(body, "NOSESSION");
          io.socket.get('/count', function (body, jwr) {
            assert.equal(body, "NOSESSION");
            return done();
          });
        });
      });

    });
  });

  describe('With path set to `/socketsarefun` in Sails and in io.sails.path', function() {
    before(function(done) {
      lifecycle.setup({path: '/socketsarefun'}, done);
    });
    before(setupRoutes);
    after(lifecycle.teardown);

    it('should connect automatically', function (cb) {
      io.socket.on('connect', cb);
    });

    describe('once connected, socket', function () {

      it('should be able to send a GET request and receive the expected response', function (cb) {
        io.socket.get('/hello', function (body, jwr) {
          assertResponse('get /hello', arguments);
          return cb();
        });
      });

      it('should receive JSON as a POJO, not a string', function (cb) {
        io.socket.get('/someJSON', function (body, jwr) {
          assertResponse('get /someJSON', arguments);
          return cb();
        });
      });

      it('should receive a valid jwr response object as its second argument, with the correct error code', function (cb) {
        io.socket.get('/someError', function (body, jwr) {
          assertResponse('get /someError', arguments);
          return cb();
        });
      });

    });
  });
});
