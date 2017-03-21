/**
 * Module dependencies
 */

var _  = require('lodash');

//Helper function we use to do a lookup on an object.
//It splits the dot string to an object path.

function _dotToObject(obj, path) {
  return path.split('.').reduce(function objectIndex(obj, i) {
    return obj[i];
  }, obj);
}

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
        // console.log('\n------ calling res.send(%s, "%s")', expectedResponse.statusCode || 200, expectedResponse.req && _dotToObject(req, expectedResponse.req) || expectedResponse.body);
        return res.status(expectedResponse.statusCode || 200).send(expectedResponse.req && _dotToObject(req, expectedResponse.req) || expectedResponse.body);
      });
    });
  };
};
