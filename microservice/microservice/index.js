'use strict';

/**
 * this files setups the microservice, plugins and the transports
 */

const SRV_NAME = process.env.SRV_NAME || 'microservice';
const pluginLoader = require('./plugin.js');

// configure seneca
const seneca = require('seneca')({
  strict: {
    result: false
  }
});
seneca.use('seneca-servicebus-transport');

// load actions
pluginLoader({
  srvname: SRV_NAME,
  seneca: seneca,
  type: 'servicebus',
  connection_string: process.env.SERVICEBUS_CONNECTION_STRING
});
