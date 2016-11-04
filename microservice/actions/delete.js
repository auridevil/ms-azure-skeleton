'use strict';

/**
 * this is an action for the microservice
 */

var model = require('../models/model');


module.exports = function (options) {
  options = options || {};
  const seneca = options.seneca;
  const log = seneca && seneca.log || console;
  const dbConfig = options.dbconfig;
  // mocking purposes
  model = options.model || model;

  return function (args, done) {
    log.info(options.srvname, options.actname);

    var defaultResponse = {
      content: null,
      statusCode: 204
    };

    args = args || {};
    if (args.id) {

      model.deleteById(args.id, dbConfig, (err, result)=> {
        done(err, {
          content: result,
          statusCode: err ? 500 : 204
        });
      });

    } else {
      done(null, defaultResponse);
    }
  };

};

