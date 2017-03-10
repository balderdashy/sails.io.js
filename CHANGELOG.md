# sails.io.js changelog

### Recent releases

See https://github.com/balderdashy/sails.io.js/commits/master

> Want to help fill out the missing pieces in the changeog?  Please submit a pull request!

### In development

### 1.1.6

* [BUGFIX] Handle server status code of zero correctly, and fix error messages for other non-200 responses.

### 1.1.5

* [ENHANCEMENT] Add 'PATCH' support [e458031](https://github.com/balderdashy/sails.io.js/commit/e45803118290cbbb06563f37c85a706649372bb0)
* [INTERNAL] Don't do npm test on prepublish [5009778](https://github.com/balderdashy/sails.io.js/commit/50097787b427b35c9d58f61fed3d173bdeca4b12)
* [BUGFIX] Fix issue where you get an error if you don't provide a `method` arg to `request` [c8cb943](https://github.com/balderdashy/sails.io.js/commit/c8cb943d1ab420ba267383b150da747e2378b76e)
* [ENHANCEMENT] Add "reconnection" to list of settings that can be change via HTML attribute [b68872a](https://github.com/balderdashy/sails.io.js/commit/b68872ac118cbb990f100f54b033f485f819c1ee)

### 1.1.4

* [BUGFIX] Fix incorrect use of dependencies/devDependencies [8047bf7](https://github.com/balderdashy/sails.io.js/commit/8047bf71cf746d841e5834aa85c84306d13b9a53)

### 1.1.3

* [ENHANCEMENT] Update socket.io-client to 1.7.1 version [1250230](https://github.com/balderdashy/sails.io.js/commit/1250230500971351cdb40e4fe65cdab9d6d492c6) and [464f918](https://github.com/balderdashy/sails.io.js/commit/464f9189cc9cc466d8b143aa38ddeb73addb9713)

### 1.1.2

* [INTERNAL] Update postpublish script [842e77f](https://github.com/balderdashy/sails.io.js/commit/842e77feb13bfb5d5ebbc5e09c2dde43c0656747) and [72aa6cc](https://github.com/balderdashy/sails.io.js/commit/72aa6cc25c8812b5022f0987f20c9bc8ea7b74d7)

### 1.1.1

* [INTERNAL] Update links, add README to sails.io.js-dist, and converted some TODOs into FUTUREs [a7fb853](https://github.com/balderdashy/sails.io.js/commit/a7fb853d786cbb728f382c94a6a65667c59f06d0) and [cde8a90](https://github.com/balderdashy/sails.io.js/commit/cde8a9092d7d13109ce9e864f6d046ffa4e2632b)
* [INTERNAL] Upgraded dev dependency to Sails v1 and sails-hook-sockets standalone. [485f3cd](https://github.com/balderdashy/sails.io.js/commit/485f3cdec4df8300921c221b7e697f6fdfdc5689)
* [INTERNAL] Reorganized README.md, add version string to compiled SDK in dist [d17c1ef](https://github.com/balderdashy/sails.io.js/commit/d17c1effe381a8c44edbfbcc4b8536b34135e51d) and [9ddd74c](https://github.com/balderdashy/sails.io.js/commit/9ddd74cfcf2a78c21613a966ca35e5f5189b360a)
* [INTERNAL] Update boilerplate files [appveyor.yml, travis.yml now checks node 6 and 7, updated .npmignore, .editorconfig and .gitignore, added .jshintrc] and get rid of no-longer-in-use checkGitStatus script [c7cd55e](https://github.com/balderdashy/sails.io.js/commit/c7cd55eee6b92ad310c9e1916a1007f97b663e3e)

### 1.1.0

* [ENHANCEMENT] Caution: **Possible breaking change**. Make `reconnection` option false by default. Can be switched back following the [Advanced usage reference](https://github.com/balderdashy/sails.io.js#advanced-usage) [7f8c7a2](https://github.com/balderdashy/sails.io.js/commit/7f8c7a2d6d7430725bca5383f4b80570e038ab81)

### 1.0.1

* [BUGFIX] Fix issue where properties were overriding `isConnecting` and `mightBeAboutToAutoConnect` methods [d78d94e](https://github.com/balderdashy/sails.io.js/commit/d78d94e6488778221d73f56823b1b2f3d64eb0ce)
* [INTERNAL] Make `jwr.error` always truthy (even if response data is empty string or 0 or `false` or `null`) by always ensuring it is an Error instance. [8393d87](https://github.com/balderdashy/sails.io.js/commit/8393d876cdca665886c863dbf664d0199f247846)

### 1.0.0

* [ENHANCEMENT] Caution: **Possible breaking change**. Make transport defaults to be only `websocket`. More information on [how to configure sails.io library transports](https://github.com/balderdashy/sails.io.js#change-the-transports-used-to-connect-to-the-server) [adfa16e](https://github.com/balderdashy/sails.io.js/commit/adfa16e54ce0c41315bb34ee9563c6a1799bac09)
* [ENHANCEMENT] Exposed `isConnecting` and `mightBeAboutToAutoConnect` as public methods [fd962bb](https://github.com/balderdashy/sails.io.js/commit/fd962bb4071a7f20903e5d07779bb7585df8b169)

### 0.14.0

* [ENHANCEMENT] Add flag to indicate that the autoConnect timer has started. Helps in better handling possible race conditions on queueing socket requests [6e1f349](https://github.com/balderdashy/sails.io.js/commit/6e1f349f807406ab6900ba537133a615a97439f7)
* [ENHANCEMENT] Updated socket.io-client to 1.4.8 [d7e06ad](https://github.com/balderdashy/sails.io.js/commit/d7e06ad5929bf23168dfb28a0019b8a53875239a) and later downgraded to 1.4.5 so Travis stops failing [25ae952](https://github.com/balderdashy/sails.io.js/commit/25ae952a5c0a7fdc6b1ebfd1dffe8c79e954713f)


### 0.13.8

* [ENHANCEMENT] Add rejectUnauthorized to the settable options for socket connections. (thanks [@ksylvan](https://github.com/ksylvan)) [33508b1](https://github.com/balderdashy/sails.io.js/commit/33508b1b230d76609694591656bef893eb44657a)

### 0.13.7

* [FIX] Fix #92 - 'Uncaught TypeError: Cannot read property 'removeChild' of null'" being thrown by sails.io.js on line 200  (thanks [@kpturner](https://github.com/kpturner)) [58cc190](https://github.com/balderdashy/sails.io.js/commit/58cc190d3fc4c33ee5847d70c8a8f0cbb7c0d946)
* [ENHANCEMENT] Update dependency to latest sails (thanks [@granteagon](https://github.com/granteagon)) [be15e92](https://github.com/balderdashy/sails.io.js/commit/be15e929d875c692625420fe397a39664a9afbcc)
* [ENHANCEMENT] Added tests for sharing a session between sockets [eeff078](https://github.com/balderdashy/sails.io.js/commit/eeff0783d3044647bcac8bc7af50006b95fb2a66)
* [ENHANCEMENT] Removed unused "request" call [a23cc5b](https://github.com/balderdashy/sails.io.js/commit/a23cc5bc0384c8c15b16b9197d763e1ea7a2ea0d)

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
