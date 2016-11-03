'use strict';

/**
 * this is an action for the microservice
 */

const model = require('../models/model');

module.exports = function (options) {
  options = options || {};
  const seneca = options.seneca;
  const log = seneca && seneca.log || console;
  const dbConfig = options.dbconfig;

  return function (args, done) {
    log.info(options.srvname, options.actname);

    model.insertNew(args.body, dbConfig, (err, result)=> {
      done(err, {
        content: result,
        statusCode: err ? 500 : 201
      });
    });
  };
};


