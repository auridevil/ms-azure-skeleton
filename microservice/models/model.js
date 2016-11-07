'use strict';

/**
 * This is the proto model file, to access the db
 */


const TABLE_NAME = 'Temp' || process.env.DB_ENTITY_NAME;

const sql = require('seriate');
const _ = require('lodash');

const deleteById = function (id, dbconfig, done) {
  const stepname = 'delete';
  return sql.getPlainContext(dbconfig)
    .step(stepname, {
      query: sql.fromFile('./sql/delete.sql'),
      params: {
        QueryId: {
          type: sql.INT,
          val: id
        }
      }
    })
    .end(function (data) {
      done(null,
        data ? data[stepname] : {success: true}
      );
    })
    .error(function (err) {
      done(err);
    });
};

const getAll = function (dbconfig, done) {
  const stepname = 'getall';
  return sql.getPlainContext(dbconfig)
    .step(stepname, {
      query: sql.fromFile('./sql/get.sql'),
      params: {
        multiple: true
      }
    })
    .end(function (data) {
      done(
        null,
        data ? data[stepname] : data
      );
    })
    .error(function (err) {
      done(err);
    });
};

const getById = function (id, dbconfig, done) {
  if (!id) {
    return getAll(dbconfig, done);
  } else {
    const stepname = 'getbyid';
    return sql.getPlainContext(dbconfig)
      .step(stepname, {
        query: sql.fromFile('./sql/getbyid.sql'),
        params: {
          QueryId: {
            type: sql.INT,
            val: id
          },
          multiple: false
        }
      })
      .end(function (data) {
        done(null, data ? data[stepname] : data);
      })
      .error(function (err) {
        done(err);
      });
  }
};

const insertNew = function (obj, dbconfig, done) {

  // prepare instructions
  let fields = _.keys(obj).join(',');
  let values = _.values(obj).join(',');

  let query = ['INSERT INTO [dbo].[', TABLE_NAME, '] (', fields, ') VALUES (', values, ')'].join('');
  const stepname = 'insert';

  // execute
  return sql.getPlainContext(dbconfig)
    .step(stepname, {
      query: query,
      params: {}
    })
    .end(function (data) {
      done(null, data? data[stepname] : {success: true});
    })
    .error(function (err) {
      done(err);
    });
};

const updateById = function (id, updateObj, dbconfig, done) {

  // prepare instructions
  let updateSql = _.reduce(
    updateObj,
    (str, value, key)=> {
      // create the string with field = value
      return [(str || ''), key, '=', value, ' '].join('');
    });
  let query = ['UPDATE [dbo].[', TABLE_NAME, '] SET ', updateSql, ' WHERE Id=@QueryId'].join('');

  // execute
  return sql.getPlainContext(dbconfig)
    .step('update', {
      query: query,
      params: {
        QueryId: {
          type: sql.INT,
          val: id
        }
      }
    })
    .end(function (data) {
      done(null, {
        pid: process.pid,
        data: data || {success: true}
      });
    })
    .error(function (err) {
      done(err);
    });
};


// expose methods
module.exports = {
  deleteById: deleteById,
  getAll: getAll,
  getById: getById,
  insertNew: insertNew,
  updateById: updateById,
  sql: sql
};

