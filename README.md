# [<img title="sails.io.js - Browser Client SDK for Sails" src="http://i.imgur.com/Jgrc9k2.png" width="75px" alt="icon of a life preserver - the emblem of the sails client SDK"/>](https://github.com/balderdashy/sails.io.js) Sails JavaScript Client SDK

[![Bower version](https://badge.fury.io/bo/sails.io.js.png)](http://badge.fury.io/bo/sails.io.js)
[![NPM version](https://badge.fury.io/js/sails.io.js.png)](http://badge.fury.io/js/sails.io.js) &nbsp; &nbsp;
[![Build Status](https://travis-ci.org/balderdashy/sails.io.js.svg?branch=master)](https://travis-ci.org/balderdashy/sails.io.js)

JavaScript SDK for communicating w/ Sails via sockets from Node.js or the browser.

========================================

### Contents

|    | Jump to...        |
|-----|-------------------------|
| I   | [Browser](https://github.com/balderdashy/sails.io.js#for-the-browser)                 |
| II  | [Node.js](https://github.com/balderdashy/sails.io.js#for-nodejs)                 |
| III | [Version Notes](https://github.com/balderdashy/sails.io.js#version)          |
| IV  | [License](https://github.com/balderdashy/sails.io.js#license)                 |

========================================


### For the Browser

#### Installation

The `sails.io.js` client comes automatically installed in new Sails projects, but there is nothing _project-specific_ about the client SDK.  You can just as easily copy and paste it yourself, get it from Bower, or just link a script tag directly to a hosted CDN.

<!--
##### With a CDN

CDNs can offer a performance benefit by hosting sails.io.js on servers spread across the globe. This also offers an advantage that if the visitor to your webpage has already downloaded a copy of `sails.io.js` on another website, but from the same CDN, it won't have to be re-downloaded.

TODO: sourcemaps

TODO: code examples for different CDNs
To use the CDN, just reference the file directly in a script tag:

(e.g. <script src="//..."></script>)

MaxCDN
Google CDN
Microsoft CDN
CDNJS CDN
jsDelivr CDN
-->

###### Using Bower

```sh
$ bower install sails.io.js
```


#### Basic Usage

```html
    <!-- .... -->
  </body>
  <script type="text/javascript" src="./path/to/bower_components/sails.io.js"></script>
  <script type="text/javascript">
  
    // `io` is available as a global.
    // `io.socket` will connect automatically, but at this point in the DOM, it is not ready yet
    // (think of $(document).ready() from jQuery)
    // 
    // Fortunately, this library provides an abstraction to avoid this issue.
    // Requests you make before `io` is ready will be queued and replayed automatically when the socket connects.
    // To disable this behavior or configure other things, you can set properties on `io.sails`.
    // You have one cycle of the event loop to set `io.sails.autoConnect` to false before the auto-connection
    // behavior starts.
    
    io.socket.get('/hello', function serverResponded (body, JWR) {

      // JWR ==> "JSON WebSocket Response"
      console.log('Sails responded with: ', body);
      console.log('with headers: ', JWR.headers);
      console.log('and with status code: ', JWR.statusCode);

      // first argument `body` === `JWR.body`
      // (just for convenience, and to maintain familiar usage, a la `JQuery.get()`)
    });
  </script>
</html>
```

#### Advanced Usage

###### Cross-domain

Connect to a server other than the one that served ths project (i.e. on a different domain/subdomain):

```html
<script type="text/javascript" src="./path/to/bower_components/sails.io.js"></script>
<script type="text/javascript">
io.sails.url = 'https://api.mysite.com';
</script>
```

> Note that in order for `req.session` on a cross-domain server to work, there is a bit of pregaming that sails.io.js does behind the scenes.  This is because it relies on cookies, and browsers (thankfully) do not let us access cross-origin cookies.
> This JavaScript SDK circumvents that issue by (1) detecting a cross-origin scenario by examining `window.location` (if available) and comparing it with the connection base URL, then (2) sending a JSONP request to the cross-origin server in order to gain access to a cookie.
> In order for that to work, the cross-origin sails server must have CORS enabled for `http://yourdomain.com` so that 3rd-party cookies are granted with the JSONP request.
> Fortunately, Sails supports this behavior out of the box.
> 
> For example, imagine the sails.io.js client is being used on a webpage served from a Sails server (or any other kind of server, like nginx) at `http://yourdomain.com`, but you need to connect a WebSocket to a different Sails server at `http://api.your-other-domain.com`.
> First, sails.io.js will send a JSONP request to the configured "cookie route" (i.e. `/__getcookie` by default).  That particular "cookie route" comes with CORS enabled out of the box, which means it will grant cookies to 3rd party domains.  In your `config/sockets.js` file, you can restrict cross-domain cookie access to particular domains (i.e. `http://yourdomain.com`, in this example)




###### Disable `autoConnect` and/or connect sockets manually

Disable `io.socket` and its auto-connecting behavior and/or connect 1 or more sockets manually:

```html
<script type="text/javascript" src="./path/to/bower_components/sails.io.js"></script>
<script type="text/javascript">
io.sails.autoConnect = false;

// e.g. at some point later, connect 3 sockets, using default settings
setTimeout(function (){

  // socket0 and socket1 will use default settings from `io.sails`
  var socket0 = io.sails.connect();
  var socket1 = io.sails.connect();

  // but socket2's `url` option will be overridden as specified:
  var socket2 = io.sails.connect({
    url: 'https://api.mysite.com'
  });
}, 1000);
</script>
```

> Note that the `io.sails` config functions as the default for all connected sockets, but it can be overridden on a socket-by-socket basis by passing in an object to `io.sails.connect(opts)`



========================================

### For Node.js

> **Why would I use this from a Node script?**
>
> Most commonly, this SDK is useful on the backend when writing tests.  However, any time you'd want to use a WebSocket or Socket.io client from Node to talk to a Sails server, you can use this module to allow for the ordinary usage you're familiar with in the browser-- namely using the socket interpreter to simulate HTTP over WebSockets.

#### Installation

```sh
$ npm install socket.io-client
$ npm install sails.io.js
```

#### Basic Usage

```js
var socketIOClient = require('socket.io-client');
var sailsIOClient = require('sails.io.js');

// Instantiate the socket client (`io`)
// (for now, you must explicitly pass in the socket.io client when using this library from Node.js)
var io = sailsIOClient(socketIOClient);

// Set some options:
// (you have to specify the host and port of the Sails backend when using this library from Node.js)
io.sails.url = 'http://localhost:1337';
// ...

// Send a GET request to `http://localhost:1337/hello`:
io.socket.get('/hello', function serverResponded (body, JWR) {
  // body === JWR.body
  console.log('Sails responded with: ', body);
  console.log('with headers: ', JWR.headers);
  console.log('and with status code: ', JWR.statusCode);
  
  // When you are finished with `io.socket`, or any other sockets you connect manually,
  // you should make sure and disconnect them, e.g.:
  io.socket.disconnect();
  
  // (note that there is no callback argument to the `.disconnect` method)
});

```

See the [tests in this repository](https://github.com/balderdashy/sails.io.js/blob/master/test/helpers/lifecycle.js) for more examples.

========================================

### Version

This repository holds the socket client SDK for Sails versions 0.10.0 and up.  If you're looking for the SDK for the v0.9.x releases of Sails, the source is [located here](https://github.com/balderdashy/sails/blob/v0.9.16/bin/boilerplates/assets/js/sails.io.js).

========================================

### License

**[MIT](./LICENSE)**
&copy; 2014-
[Mike McNeil](http://michaelmcneil.com), [Balderdash](http://balderdash.co) & contributors

This module is part of the [Sails framework](http://sailsjs.org), and is free and open-source under the [MIT License](http://sails.mit-license.org/).


![image_squidhome@2x.png](http://i.imgur.com/RIvu9.png) 
 

[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/a22d3919de208c90c898986619efaa85 "githalytics.com")](http://githalytics.com/balderdashy/sails.io.js)
