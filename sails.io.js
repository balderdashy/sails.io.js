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

(function () {

  // In case you're wrapping the socket.io client to prevent pollution of the
  // global namespace, you can pass in your own `io` to replace the global one.
  // But we still grab access to the global one if it's available here:
  var _io = (typeof io !== 'undefined') ? io : null;

  /**
   * Augment the `io` object passed in with methods for talking and listening
   * to one or more Sails backend(s).  Automatically connects a socket and
   * exposes it on `io.socket`.  If a socket tries to make requests before it
   * is connected, the sails.io.js client will queue it up.
   * 
   * @param {SocketIO} io
   */
  
  function SailsIOClient (io) {

    // Prefer the passed-in `io` instance, but also use the global one if we've got it.
    io = io || _io;

    // If the socket.io client is not available, none of this will work.
    if (!io) throw new Error('`sails.io.js` requires a socket.io client, but `io` was not passed in.');




    //////////////////////////////////////////////////////////////
    /////                              ///////////////////////////
    ///// PRIVATE METHODS/CONSTRUCTORS ///////////////////////////
    /////                              ///////////////////////////
    //////////////////////////////////////////////////////////////

    /**
     * TmpSocket
     * 
     * A mock Socket used for binding events before the real thing
     * has been instantiated (since we need to use io.connect() to
     * instantiate the real thing, which would kick off the connection
     * process w/ the server, and we don't necessarily have the valid
     * configuration to know WHICH SERVER to talk to yet.)
     *
     * @api private
     * @constructor
     */
    
    function TmpSocket () {
      var boundEvents = {};
      this.on = function (evName, fn) {
        boundEvents[evName] = fn;
        return this;
      };
      this.become = function ( actualSocket ) {
        for (var evName in boundEvents) {
          actualSocket.on(evName, boundEvents[evName]);
        }
        return actualSocket;
      };
    }

    
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


    /**
     * @api private
     * @param  {Socket} socket  [description]
     * @param  {Object} request [description]
     * @param  {Function} cb [optional]
     */
    
    function _emitFrom ( socket, request, cb ) {

      // Serialize request to JSON
      var json = io.JSON.stringify({
        url: request.url,
        data: request.data
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

    //////////////////////////////////////////////////////////////
    ///// </PRIVATE METHODS/CONSTRUCTORS> ////////////////////////
    //////////////////////////////////////////////////////////////











    // We'll be adding methods to `io.SocketNamespace.prototype`, the prototype for the 
    // Socket instance returned when the browser connects with `io.connect()`
    var Socket = io.SocketNamespace;



    /**
     * Simulate a GET request to sails
     * e.g.
     *    `socket.get('/user/3', Stats.populate)`
     *
     * @api public
     * @param {String} url    ::    destination URL
     * @param {Object} params ::    parameters to send with the request [optional]
     * @param {Function} cb   ::    callback function to call when finished [optional]
     */

    Socket.prototype.get = function(url, data, cb) {
      return this._request({
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
     * @api public
     * @param {String} url    ::    destination URL
     * @param {Object} params ::    parameters to send with the request [optional]
     * @param {Function} cb   ::    callback function to call when finished [optional]
     */

    Socket.prototype.post = function(url, data, cb) {
      return this._request({
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
     * @api public
     * @param {String} url    ::    destination URL
     * @param {Object} params ::    parameters to send with the request [optional]
     * @param {Function} cb   ::    callback function to call when finished [optional]
     */

    Socket.prototype.put = function(url, data, cb) {
      return this._request({
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
     * @api public
     * @param {String} url    ::    destination URL
     * @param {Object} params ::    parameters to send with the request [optional]
     * @param {Function} cb   ::    callback function to call when finished [optional]
     */

    Socket.prototype['delete'] = function(url, data, cb) {
      return this._request({
        method: 'delete',
        data: data,
        url: url
      }, cb);
    };



    /**
     * Socket.prototype._request
     * 
     * Simulate HTTP over Socket.io.
     *
     * @api private
     * @param  {[type]}   options [description]
     * @param  {Function} cb      [description]
     */
    Socket.prototype._request = function (options, cb) {

      // Sanitize options (also data & headers)
      var usage = 'Usage:\n socket.' +
        (options.method || 'request') +
        '( destinationURL, [dataToSend], [fnToCallWhenComplete] )';

      // `options` is optional
      if (typeof options === 'function') {
        cb = options;
        options = {};
      }

      options = options || {};
      options.data = options.data || {};
      options.headers = options.headers || {};

      // Remove trailing slashes and spaces to make packets smaller.
      options.url = options.url.replace(/^(.+)\/*\s*$/, '$1');
      if (typeof options.url !== 'string') {
        throw new Error('Invalid or missing URL!\n' + usage);
      }
      
      var self = this;

      // Build a simulated request object.
      var request = {
        method: options.method,
        data: options.data,
        url: options.url,
        headers: options.headers
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
    };



    // `requestQueues` and `sockets`
    // 
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


    // Set a `sails` object that may be used for configuration before the
    // first socket connects (i.e. to prevent auto-connect)
    io.sails = {
      autoConnect: true
    };


    // io.socket
    // 
    // The eager instance of Socket which will automatically try to connect
    // using the host that this js file was served from.
    // 
    // This can be disabled or configured by setting `io.socket.options` within the
    // first cycle of the event loop.
    // 

    // In the mean time, this eager socket will be defined as a TmpSocket
    // so that events bound by the user before the first cycle of the event
    // loop (using `.on()`) can be rebound on the true socket.
    io.socket = new TmpSocket();
    
    setTimeout(function () {

      // If autoConnect is disabled, delete the TmpSocket and bail out.
      if (!io.sails.autoConnect) {
        delete io.socket;
        return io;
      }

      // Start connecting after the current cycle of the event loop
      // has completed.
      console.log('Auto-connecting a socket to Sails...');

      // If explicit connection url is specified, use it
      var actualSocket = io.sails.url ? io.connect(io.sails.url): io.connect();

      // Replay event bindings from the existing TmpSocket
      io.socket = io.socket.become(actualSocket);
      
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
      // manage disconnects in a more helpful way
      io.socket.on('disconnect', function () {
        // console.log('*** DISCONNECT YEAAAH');
      });

      // Listen for failed connects:
      // (usually because of a missing or invalid cookie)
      io.socket.on('error', failedToConnect);

      function failedToConnect () {
        console.log('Failed to connect socket (probably due to failed authorization on server)');
      }
      
    }, 0);


    // Return the `io` object.
    return io;


    // TODO:
    // handle failed connections due to failed authorization
    // in a smarter way (probably can listen for a different event)

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

  }


  // Add CommonJS support to allow this client SDK to be used from Node.js.
  if (typeof module === 'object' && typeof module.exports !== 'undefined') {
    return module.exports = SailsIOClient;
  }

  // Otherwise, try to instantiate the client:
  // In case you're wrapping the socket.io client to prevent pollution of the
  // global namespace, you can replace the global `io` with your own `io` here:
  return SailsIOClient();

})();
