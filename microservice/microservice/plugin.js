'use strict';

/**
 * This is a seneca plugin for actions loading and resource definitions (e.g. databases)
 * The plugin loads actions automatically from the "actions" directory
 */

const fs = require('fs');
const path = require('path');

module.exports = function (options) {

  const seneca = options.seneca;
  const SRV_NAME = options.srvname;
  const TYPE = options.type;
  const TRANSPORT_CONNECTION = options.connection_string;
  // actions path
  const ACTS_PATH = path.join(__dirname, '/actions');

  // access to db
  const dbconfig = {
    'name': 'connection',
    'host': process.env.DB_HOST,
    'user': process.env.DB_USER,
    'password': process.env.DB_PASSWORD,
    'database': process.env.DB_NAME
  };

  // Microservices actions
  fs.readdirSync(ACTS_PATH).forEach(function (file) {
    var f = path.basename(file, '.js');
    console.log('[', SRV_NAME, ']', 'loading action', f);
    var opts = {
      srvname: SRV_NAME,
      actname: f,
      seneca: seneca,
      dbconfig: dbconfig
    };

    // add a seneca action, it will respond on every message that will match role and cmd.
    // role is the microservice name, while cmd is the module file name which contains the action
    var action = ['role:', SRV_NAME, ',cmd:', f].join('');
    seneca.add(action, require(path.join(ACTS_PATH, file))(opts));

    // register the listen, * command is not allowed in azure service bus
    seneca.listen({
      type: TYPE,
      pin: ['role:', SRV_NAME, ',cmd:', f].join(''),
      connection_string: TRANSPORT_CONNECTION
    });

  });

  return SRV_NAME;
};
