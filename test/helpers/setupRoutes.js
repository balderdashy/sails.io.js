/**
 * Module dependencies
 */

var _  = require('lodash');




/**
 * @return {Function} configured and ready to use by mocha's `before()`
 */

module.exports = function setupRoutes (expectedResponses) {

  /**
   * Bind routes which respond with the expected data.
   * 
   * @param  {Object} expectedResponses
   * @global {Sails} sails
   */
  return function configuredFn () {
    _.each(expectedResponses, function (expectedResponse, routeAddress) {
      sails.router.bind(routeAddress, function (req, res) {
        // console.log('\n------ calling res.send(%s, "%s")', expectedResponse.statusCode || 200, expectedResponse.body);
        return res.send(expectedResponse.statusCode || 200, expectedResponse.body);
      });
    });
  };
};
