# sails.io.js changelog

### 0.13.6

* [ENHANCEMENT] Allow specifying some `io.sails` properties via HTML attributes (`autoConnect`, `url`, `headers and `environment`)

### 0.13.5

* [BUGFIX] Fixed replaying of request queue on disconnect/reconnect [d8fb158](https://github.com/balderdashy/sails.io.js/commit/d8fb1585e7671922b499b5fac4a706edc5f810fa)
* [ENHANCEMENT] Added new connection options `path`, `reconnection`, `reconnectionAttempts`, `reconnectionDelay`, `reconnectionDelayMax`, `randomizationFactor`, `timeout` [535d5a3](https://github.com/balderdashy/sails.io.js/commit/535d5a36e4034489500c5f8bc6306ade868c38b6)
* [ENHANCEMENT] Allow both `data` and `params` to be used in calls to `socket.request()` [6f28ec](https://github.com/balderdashy/sails.io.js/commit/6f28ec9a456b5826f8580a2f398c2b7dc08aa5f2)

### 0.13.4

* [ENHANCEMENT] Don't allow certain SailsSocket properties to be changed while the socket is connected.  This ensures that the properties always reflect the correct state of a connected socket.
* [BUGFIX] Made URL argument to `io.socket.connect` optional, as documented
* [ENHANCEMENT] Added public `.reconnect()` method to SailsSocket

### 0.13.3

* [UPGRADE] Use socket.io-client version 1.4.4

### 0.13.0 - 0.13.2

* These versions were experimental for use while finishing development of Sails 0.12, and should not be used.

### 0.12.6

* [BUGFIX] Revert change where sails.io.js SDK info was sent in handshake via headers instead of querystring--handshake headers only work in Node.js implementations, _not_ in the browser.

### 0.12.5 (broken; don't use!)

* [ENHANCEMENT] Allow passing `initialConnectionHeaders` option (or setting `io.sails.initialConnectionHeaders`) to set headers to be sent with socket handshake [0a251df](https://github.com/balderdashy/sails.io.js/commit/0a251df66b7fa8bc4d89b25b38ce0c1ac28d62ff)

### 0.12.4

* [BUGFIX] Make global headers work for queued requests [36a4828](https://github.com/balderdashy/sails.io.js/commit/36a4828ce7117f7efcd21640587f7ca34f61d492)

### 0.12.3

* [ENHANCEMENT] Allow passing `headers` option (or setting `io.sails.headers`) to set global headers that will be sent with every request made by a socket [6376e04](https://github.com/balderdashy/sails.io.js/commit/6376e049bc987d2b6dabf591aae86af5edc2e624)

### 0.12.2

* [UPGRADE] Use socket.io-client version 1.4.3

### 0.12.1

* [UPGRADE] Use socket.io-client version 1.4.0

### 0.12.0

* [UPGRADE] Use socket.io-client version 1.3.7
* [ENHANCEMENT] Allow passing `query` option (or setting `io.sails.query`) for use in socket handshake [#51](https://github.com/balderdashy/sails.io.js/pull/51)
