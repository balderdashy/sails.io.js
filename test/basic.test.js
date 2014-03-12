/**
 * Module dependencies
 */

var io = require('socket.io-client');
var sailsIO = require('../dist/sails.io.js');
io = sailsIO(io);

// Set some configuration options
io.sails.url = 'localhost:1337';

setTimeout(function () {
  console.log(io.socket);
}, 1000);
