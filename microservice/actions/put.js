'use strict';

/**
 * this is an action for the microservice
 */

var model = require('../models/model');
const ASQ = require('asynquence-contrib');

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
      content: 'Document not found',
      statusCode: 404
    };

    args = args || {};
    if (args.id && args.body) {

      ASQ((stepdone)=> {
        model.updateById(args.id, args.body, dbConfig, stepdone.errfcb);
      }).then((stepdone, results)=> {
        model.getById(args.id, dbConfig, stepdone.errfcb);
      }).then((stepdone, data)=> {
        done(null, data ? {
          content: data,
          statusCode: 200
        } : defaultResponse);
        stepdone();
      }).or((error)=> {
        log.error(error);
        done(error);
      });

    } else {
      done(null, defaultResponse);
    }

  };
};


