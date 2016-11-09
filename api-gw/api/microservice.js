'use strict';

var SWAGGER_FILE = 'swagger/apis/microservice.yaml';

var path = require('path');
var $RefParser = require('json-schema-ref-parser');
var tools = require('../lib/tools');

var API_NAME = path.basename(__filename, '.js');

module.exports = function (server, options, done) {

  var seneca = options.seneca;
  var parser = new $RefParser();
  var requestHandlerFactory = tools.requestHandlerFactoryBuilder(seneca, API_NAME);
  var swaggering = tools.Swaggering(API_NAME);

  seneca.log.info(API_NAME, 'init');

  parser.dereference(SWAGGER_FILE)
    .then(function (schema) {
      server.register({
        register: swaggering,
        options: {
          api: schema,
          docspath: '/apidocs/' + API_NAME,

          // endpoints handlers hashmap. it shall match the Swagger endpoints
          handlers: {
            'ms': {
              $get: requestHandlerFactory('get'),
              $post: requestHandlerFactory('post'),
              '{id}': {
                $get: requestHandlerFactory('get'),
                $put: requestHandlerFactory('put'),
                $delete: requestHandlerFactory('delete')
              }
            }
          }
        }
      }, function (err) {
        if (err) {
          seneca.log.error('API-GW: ' + API_NAME, 'swaggering', err);
        } else {
          seneca.log.debug('API-GW: ' + API_NAME, 'swaggering loaded');
        }
      });
      done();
    }).catch(
    function (err) {
      done(err);
    });
};
