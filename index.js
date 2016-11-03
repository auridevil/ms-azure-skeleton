'use strict';

/**
 * this files setups the microservice, plugins and the transports
 */

const SRV_NAME = process.env.SRV_NAME || 'microservice';

const seneca = require('seneca')({
  strict: {
    result: false
  }
});


seneca.use('seneca-servicebus-transport')
  .use('./plugin.js', {
    srvname: SRV_NAME,
    seneca: seneca,
    type: 'servicebus',
    connection_string: process.env.SERVICEBUS_CONNECTION_STRING
  });
