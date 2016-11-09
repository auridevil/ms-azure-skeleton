'use strict';

var API_PORT = process.env.API_PORT || 4000;
var API_HOST = process.env.API_HOST || '0.0.0.0';
process.env.SERVICEBUS_CONNECTION_STRING = 'Endpoint=sb://sb-test.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=kDSiu8KIPXHg+JAQSpFN5Rc0ixCI0TDVgaP34HMajDo=';

var Hapi = require('hapi');
var Seneca = require('seneca');

var server = new Hapi.Server();
var seneca = new Seneca();

var options = {
  server: server,
  seneca: seneca
};

// server connection
server.connection({
  host: API_HOST,
  port: API_PORT,
  routes: {
    cors: true
  }
});

// transport
seneca.use('seneca-servicebus-transport')
  .client({
    type: 'servicebus',
    // pin: 'role:' + process.env.USER,
    pin: ['role:*,cmd:*'].join(''),
    connection_string: process.env.SERVICEBUS_CONNECTION_STRING
  });

// // authentication/authorization modules
// require('./auth/index.js')(options);

// API groups
require('./api/index.js')(options, function(err) {

  if (err) {
    seneca.log.error('API-GW', err);
    throw err;
  }

  // Start the Server
  seneca.ready(function() {
    server.start(function(exc) {
      if (exc) {
        seneca.log.error('API-GW', exc);
        throw exc;
      }
      seneca.log.info('Server running at:', server.info.uri);
    });
  });
});
