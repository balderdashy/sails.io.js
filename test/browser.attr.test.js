/**
 * Module dependencies
 */

var util = require('util');
var assert = require('assert');
var lifecycle = require('./helpers/lifecycle');
var phantom = require('./helpers/phantom');

describe('browser', function() {

  describe('using html attributes for configuration :: ', function () {

    var runner;
    describe('url :: ', function() {

      before(function(done) {
        lifecycle.setup({transports: ['websocket'], autoConnect: false}, done);
      });

      after(lifecycle.teardown);

      before(function() {
        sails.router.bind("/", function (req, res) {
          var html = '<html><head></head><body><script type="text/javascript" src="/sails.io.js#production" url="http://127.0.0.1:'+sails.config.port+'"></script></body></html>';
          return res.send(html);
        });
      });
      after(function(done) {
        if(runner.kill){runner.kill();}
        sails.lower(function(){setTimeout(done, 100);});
      });
      it('should use the URL provided in the html attribute', function(done) {
        runner = phantom("http://localhost:"+sails.config.port+"/", "console.log(io.socket.url);");
        runner.stderr.on('data', function(data) {console.log(data.toString());});
        runner.stdout.on('data', function(data) {
          var out = data.toString();
          assert.equal(out, "http://127.0.0.1:"+sails.config.port);
          return done();
        });
      });

    });

    describe('environment :: ', function() {

      before(function(done) {
        lifecycle.setup({transports: ['websocket'], autoConnect: false}, done);
      });

      after(function(done) {
        if(runner.kill){runner.kill();}
        sails.lower(function(){setTimeout(done, 100);});
      });

      before(function() {
        sails.router.bind("/", function (req, res) {
          var html = '<html><head></head><body><script type="text/javascript" src="/sails.io.js" environment="production"></script></body></html>';
          return res.send(html);
        });
      });
      after(function() {
        if(runner.kill){runner.kill();}
      });
      it('should use the environment provided in the html attribute', function(done) {
        runner = phantom("http://localhost:"+sails.config.port+"/", "console.log(io.sails.environment);");
        runner.stderr.on('data', function(data) {console.log(data.toString());});
        runner.stdout.on('data', function(data) {
          var out = data.toString();
          assert.equal(out, "production");
          return done();
        });
      });

    });

    describe('autoConnect :: ', function() {

      before(function(done) {
        lifecycle.setup({transports: ['websocket'], autoConnect: false}, done);
      });

      after(function(done) {
        if(runner.kill){runner.kill();}
        sails.lower(function(){setTimeout(done, 100);});
      });

      before(function() {
        sails.router.bind("/", function (req, res) {
          var html = '<html><head></head><body><script type="text/javascript" src="/sails.io.js#production" autoConnect="false"></script></body></html>';
          return res.send(html);
        });
      });
      after(function() {
        if(runner.kill){runner.kill();}
      });
      it('should use the autoConnnect setting provided in the html attribute', function(done) {
        runner = phantom("http://localhost:"+sails.config.port+"/", "console.log(io.sails.autoConnect);");
        runner.stderr.on('data', function(data) {console.log(data.toString());});
        runner.stdout.on('data', function(data) {
          var out = data.toString();
          assert.equal(out, "false");
          return done();
        });
      });

    });

    describe('headers :: ', function() {

      before(function(done) {
        lifecycle.setup({transports: ['websocket'], autoConnect: false}, done);
      });

      after(function(done) {
        if(runner.kill){runner.kill();}
        sails.lower(function(){setTimeout(done, 100);});
      });

      before(function() {
        sails.router.bind("/", function (req, res) {
          var html = '<html><head></head><body><script type="text/javascript" src="/sails.io.js#production" headers=\'{"x-csrf-token":"abc123"}\'></script></body></html>';
          return res.send(html);
        });
      });
      after(function() {
        if(runner.kill){runner.kill();}
      });
      it('should use the headers setting provided in the html attribute', function(done) {
        runner = phantom("http://localhost:"+sails.config.port+"/", "console.log(io.socket.headers['x-csrf-token']);");
        runner.stderr.on('data', function(data) {console.log(data.toString());});
        runner.stdout.on('data', function(data) {
          var out = data.toString();
          assert.equal(out, "abc123");
          return done();
        });
      });

    });

    describe('transports :: ', function() {

      before(function(done) {
        lifecycle.setup({transports: ['websocket'], autoConnect: false}, done);
      });

      after(function(done) {
        if(runner.kill){runner.kill();}
        sails.lower(function(){setTimeout(done, 100);});
      });

      before(function() {
        sails.router.bind("/", function (req, res) {
          var html = '<html><head></head><body><script type="text/javascript" src="/sails.io.js#production" transports=\'["websocket"]\'></script></body></html>';
          return res.send(html);
        });
      });
      after(function() {
        if(runner.kill){runner.kill();}
      });
      it('should use the transports setting provided in the html attribute', function(done) {
        runner = phantom("http://localhost:"+sails.config.port+"/", "console.log(JSON.stringify(io.sails.transports));");
        runner.stderr.on('data', function(data) {console.log(data.toString());});
        runner.stdout.on('data', function(data) {
          var out = data.toString();
          assert.equal(out, '["websocket"]');
          return done();
        });
      });

    });

    describe('path :: ', function() {

      before(function(done) {
        lifecycle.setup({transports: ['websocket'], autoConnect: false, path: '/socketz'}, done);
      });

      after(function(done) {
        if(runner.kill){runner.kill();}
        sails.lower(function(){setTimeout(done, 100);});
      });

      before(function() {
        sails.router.bind("/", function (req, res) {
          var html = '<html><head></head><body><script type="text/javascript" src="/sails.io.js#production" path="/socketz"></script><script>io.sails.transports=["websocket"]</script></body></html>';
          return res.send(html);
        });
      });
      after(function() {
        if(runner.kill){runner.kill();}
      });
      it('should use the path setting provided in the html attribute', function(done) {
        runner = phantom("http://localhost:"+sails.config.port+"/", "console.log(io.socket.isConnected(), io.socket.path);");
        runner.stderr.on('data', function(data) {console.log(data.toString());});
        runner.stdout.on('data', function(data) {
          var out = data.toString();
          assert.equal(out, 'true /socketz');
          return done();
        });
      });

    });

  });

  describe('Setting `initialConnectionheaders` (polling only)', function() {

    var testFailed = false;

    before(function(done) {
      lifecycle.setup({transports: ['polling'], autoConnect: false, beforeConnect: function(handshake, cb) { if (!handshake.headers.canikickit || handshake.headers.canikickit !== 'yes you can!') { testFailed = true; return done('Could not connect due to missing header.'); } return cb(); }}, done);
    });

    after(function(done) {
      if(runner.kill){runner.kill();}
      sails.lower(function(){setTimeout(done, 100);});
    });

    before(function() {
      sails.router.bind("/", function (req, res) {
        var html = '<html><head></head><body><script type="text/javascript" src="/sails.io.js#production" transports=\'["polling"]\'></script><script type="text/javascript">io.sails.initialConnectionHeaders={canikickit: \'yes you can!\'};</script></body></html>';
        return res.send(html);
      });
    });
    after(function() {
      if(runner.kill){runner.kill();}
    });
    it('should pass the header to the server with the initial connection', function(done) {
      runner = phantom("http://localhost:"+sails.config.port+"/");
      setTimeout(function() { if (testFailed) { /* do nothing */} return done(); }, 1000)
    });

  });

});
