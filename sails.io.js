/**
 * sails.io.js
 *
 * This file allows you to send and receive socket.io messages to & from Sails
 * by simulating a REST client interface on top of socket.io.
 *
 * It models its API after the $.ajax pattern from jQuery you might be familiar with.
 *
 * So if you're switching from using AJAX to sockets, instead of:
 *    `$.post( url, [data], [cb] )`
 *
 * You would use:
 *    `socket.post( url, [data], [cb] )`
 *
 * For more information, visit:
 * http://sailsjs.org/#documentation
 */

(function(io) {

  // If the socket.io client is not available, an 
  if (!io) throw new Error('`sails.io.js` requires a socket.io client, but `io` was not passed in.');


  // We'll be adding methods to `io.SocketNamespace.prototype`, the prototype for the 
  // Socket instance returned when the browser connects with `io.connect()`
  var Socket = io.SocketNamespace;



  /**
   * Simulate a GET request to sails
   * e.g.
   *    `socket.get('/user/3', Stats.populate)`
   *
   * @param {String} url    ::    destination URL
   * @param {Object} params ::    parameters to send with the request [optional]
   * @param {Function} cb   ::    callback function to call when finished [optional]
   */

  Socket.prototype.get = function(url, data, cb) {
    return this.request({
      method: 'get',
      data: data,
      url: url
    }, cb);
  };



  /**
   * Simulate a POST request to sails
   * e.g.
   *    `socket.post('/event', newMeeting, $spinner.hide)`
   *
   * @param {String} url    ::    destination URL
   * @param {Object} params ::    parameters to send with the request [optional]
   * @param {Function} cb   ::    callback function to call when finished [optional]
   */

  Socket.prototype.post = function(url, data, cb) {
    return this.request({
      method: 'post',
      data: data,
      url: url
    }, cb);
  };



  /**
   * Simulate a PUT request to sails
   * e.g.
   *    `socket.post('/event/3', changedFields, $spinner.hide)`
   *
   * @param {String} url    ::    destination URL
   * @param {Object} params ::    parameters to send with the request [optional]
   * @param {Function} cb   ::    callback function to call when finished [optional]
   */

  Socket.prototype.put = function(url, data, cb) {
    return this.request({
      method: 'put',
      data: data,
      url: url
    }, cb);
  };



  /**
   * Simulate a DELETE request to sails
   * e.g.
   *    `socket.delete('/event', $spinner.hide)`
   *
   * @param {String} url    ::    destination URL
   * @param {Object} params ::    parameters to send with the request [optional]
   * @param {Function} cb   ::    callback function to call when finished [optional]
   */

  Socket.prototype['delete'] = function(url, data, cb) {
    return this.request({
      method: 'delete',
      data: data,
      url: url
    }, cb);
  };



  /**
   * @api private
   * 
   * But exposed for backwards-compatibility.
   */

  Socket.prototype.request = _request;




  /**
   * Socket.prototype._request
   * 
   * Simulate HTTP over Socket.io.
   *
   * @api private
   * @param  {[type]}   options [description]
   * @param  {Function} cb      [description]
   */
  function _request(options, cb) {

    var self = this;
    var usage = 'Usage:\n socket.' +
      (options.method || 'request') +
      '( destinationURL, [dataToSend], [fnToCallWhenComplete] )';

    // Remove trailing slashes and spaces to make packets smaller.
    options.url = options.url.replace(/^(.+)\/*\s*$/, '$1');
    if (typeof options.url !== 'string') {
      throw new Error('Invalid or missing URL!\n' + usage);
    }

    // `data` is optional
    if (typeof options.data === 'function') {
      cb = options.data;
      options.data = {};
    }
    
    // Sanitize data and headers options.
    options.headers = options.headers || {};
    options.data = options.data || {};

    // Build a simulated request object.
    var request = {
      method: method,
      data: data,
      url: url,
      headers: headers
    };

    // If this socket is not connected yet, queue up this request
    // instead of sending it.
    // (so it can be replayed when the socket comes online.)
    if ( !_isConnected(self) ) {

      // If no queue array exists for this socket yet, create it.
      requestQueues[self.id] = requestQueues[self.id] || [];
      requestQueues[self.id].push(request);
      return;
    }

    
    // Otherwise, our socket is ok!
    // Send the request.
    _emitFrom(self, request, cb);
  }


  /**
   * 
   * @param  {Socket} socket  [description]
   * @param  {Object} request [description]
   * @param  {Function} cb [optional]
   */
  function _emitFrom ( socket, request, cb ) {

    // Serialize request to JSON
    var json = io.JSON.stringify({
      url: options.url,
      data: options.data
    });

    socket.emit(request.method, json, function serverResponded (result) {
      
      var parsedResult = result;

      if (result && typeof result === 'string') {
        try {
          parsedResult = io.JSON.parse(result);
        } catch (e) {
          if (typeof console !== 'undefined') {
            console.warn('Could not parse:', result, e);
          }
          throw new Error('Server response could not be parsed!\n' + result);
        }
      }

      // TODO: Handle errors more effectively
      if (parsedResult === 404) throw new Error('404: Not found');
      if (parsedResult === 403) throw new Error('403: Forbidden');
      if (parsedResult === 500) throw new Error('500: Server error');

      cb && cb(parsedResult);

    });
  }


  // Used to simplify app-level connection logic-- i.e. so you don't
  // have to wait for the socket to be connected to start trying to 
  // synchronize data.
  // 
  // It supports use across multiple sockets, and ends up looking
  // something like:
  // {
  //   '9ha021381359': [{...queuedReq26...}, {...queuedReq27...}, ...],
  //   '2abcd8d8d211': [{...queuedReq18...}, {...queuedReq19...}, ...],
  //   '992294111131': [{...queuedReq11...}, {...queuedReq12...}, ...]
  // }
  var requestQueues = {};
  var sockets = {};

  // // A `setTimeout` that, is used to check if `io.socket` is ready
  // // yet (polls). Important to make the requestQueues work.
  var eagerSocketTimer;


  // io.socket
  // 
  // The eager instance of Socket which will automatically try to connect
  // using the host that this js file was served from.
  // 
  // This can be disabled or configured by setting `io.config` within the
  // first cycle of the event loop.
  // 
  // Immediately start connecting:
  io.socket = io.connect();


  console.log('Connecting Socket.io to Sails.js...');


  // Attach a listener which fires when a connection is established:
  io.socket.on('connect', function socketConnected() {
    console.log(
      'Socket is now connected and globally accessible as `socket`.\n' +
      'e.g. to send a GET request to Sails via Socket.io, try: \n' +
      '`socket.get("/foo", function (response) { console.log(response); })`'
    );

    // Save reference to socket when it connects
    sockets[io.socket.id] = io.socket;

    // Run the request queue for each socket.
    for (var socketId in requestQueues) {
      var pendingRequestsForSocket = requestQueues[socketId];
      
      for (var i in pendingRequestsForSocket) {
        var pendingRequest = pendingRequestsForSocket[i];
        
        // Emit the request.
        _emitFrom(sockets[socketId], pendingRequest);
      }
    }
  });


  // TODO:
  // manage disconnects



  // TODO:
  // After a configurable period of time, if the socket has still not connected,
  // throw an error, since the `socket` might be improperly configured.

  // throw new Error(
  //  '\n' +
  //  'Backbone is trying to communicate with the Sails server using '+ socketSrc +',\n'+
  //  'but its `connected` property is still set to false.\n' +
  //  'But maybe Socket.io just hasn\'t finished connecting yet?\n' +
  //  '\n' +
  //  'You might check to be sure you\'re waiting for `socket.on(\'connect\')`\n' +
  //  'before using sync methods on your Backbone models and collections.'
  // );


  
  /**
   * isConnected
   * 
   * @api private
   * @param  {Socket}  socket
   * @return {Boolean} whether the socket is connected and able to
   *                           communicate w/ the server.
   */
  
  function _isConnected (socket) {
    return socket.socket && socket.socket.connected;
  }


  // Add CommonJS support to allow this client SDK to be used from Node.js.
  if (typeof module === 'object' && typeof module.exports !== 'undefined') {
    module.exports = io;
  }


})(

  // In case you're wrapping the socket.io client to prevent pollution of the
  // global namespace, you can replace the global `io` with your own `io` here:
  (typeof io !== 'undefined') ? io : null

);
