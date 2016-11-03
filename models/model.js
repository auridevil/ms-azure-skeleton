'use strict';

/**
 * This is the proto model file, to access the db
 */


const TABLE_NAME = 'Temp';

const sql = require('seriate');

const getAll = function (dbconfig, done) {
  sql.getPlainContext(dbconfig)
    .step('get', {
      query: sql.fromFile('./sql/get.sql'),
      params: {
        multiple: true
      }
    })
    .end(function (data) {
      done(null, {
        pid: process.pid,
        data: data
      });
    })
    .error(function (err) {
      done(err);
    });
};

const getById = function (id, dbconfig, done) {
  sql.getPlainContext(dbconfig)
    .step('get', {
      query: sql.fromFile('./sql/getbydid.sql'),
      params: {
        QueryId: {
          type: sql.INT,
          val: id
        },
        multiple: false
      }
    })
    .end(function (data) {
      done(null, {
        pid: process.pid,
        data: data
      });
    })
    .error(function (err) {
      done(err);
    });
};

