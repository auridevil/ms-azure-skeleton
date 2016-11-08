'use strict';

/**
 * requestHandlerFactory - Generic HAPI request handler factory, which bounces requests to remote microservices
 * @param  {Object} seneca - a seneca instance
 * @param  {String} apiName - the API endpoint name
 * @returns {Function}        return a requestHandlerFactory
 */
exports.requestHandlerFactoryBuilder = function(seneca, apiName) {

  return function requestHandlerFactory(method, action) {

    return function(request, reply) {

      seneca.log.info('API-GW: ' + apiName, method, action || '', 'request: ' + request.path);

      // Reply using a Seneca action (call to a remote microservice)
      seneca.act({
        role: apiName,
        cmd: action || method,
        id: request.params.id,
        query: request.query,
        body: request.payload,
        credentials: request.auth.isAuthenticated ? request.auth.credentials : false,
        fatal$: false
      }, function(err, result) {
        if (err) {
          seneca.log.error('API-GW: ' + apiName, err);
          return reply(err);
        }
        let response = reply(result.content).hold();
        response.code(result.statusCode || 200);
        if (result.headers) {
          for (let header of result.headers) {
            response.header(header, result.headers[header]);
          }
        }
        return response.send();
      });
    };
  };
};


/**
 * Swaggering - generate a swaggerize-hapi plugin for a new API registration (multi Swagger documents support)
 * @param  {String} apiName - the API endpoint name
 * @returns {Object}        return a new hapi plugin
 */
exports.Swaggering = function(apiName) {
  var Swaggerize = require('swaggerize-hapi');
  // Swagger wrapper plugin
  var swaggering = {
    register: function(server, options, next) {
      return Swaggerize.register(server, options, next);
    }
  };
  swaggering.register.attributes = {
    name: Swaggerize.register.attributes.name + '-' + apiName,
    version: Swaggerize.register.attributes.version
  };
  return swaggering;
};
