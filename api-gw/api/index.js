'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function(options, done) {
  var server = options.server;
  var seneca = options.seneca;

  var plugins = [];
  // loading API definitions from local directory
  fs.readdirSync(path.join(__dirname, '/')).forEach(function(file) {
    var f = path.basename(file, '.js');
    if (f !== file && f !== 'index') {
      seneca.log.info('API-GW', 'loading api ' + f);
      var plugin = require(path.join(__dirname, '/', file));
      plugin.attributes = {
        name: 'API-GW-' + f,
        version: process.env.API_VERSION || '0.0.1'
      };
      plugins.push({
        register: plugin,
        options: options
      });
    }
  });

  server.register(plugins, done);
  seneca.log.info('API-GW', 'api loading complete');

};
