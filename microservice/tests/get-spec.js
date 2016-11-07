/* eslint-env jasmine */

'use strict';

const util = require('util');
const mock = require('seriate.mock');
const model = require('../models/model');

describe('generic microservice get handler', function () {

  mock(model.sql);

  var newObjs = [
    {
      'Id': 1,
      'name': 'Temp1',
      'description': 'google.com',
      'enabled': true
    },
    {
      'Id': 2,
      'name': 'Temp2',
      'description': 'amazon.con',
      'enabled': false
    }];

  var get = require('../actions/get')({
    srvname: 'microservice',
    actname: 'get',
    model: model,
    dbconfig: {}
  });


  beforeEach(function (done) {

    model.sql.addMock('getall', {
      mockResults: newObjs,
      isError: false,
      waitTime: 100,
      once: true // if true the step is un-mocked directly
    });

    model.sql.addMock('getbyid',{
      mockResults: [newObjs[0]],
      isError: false,
      waitTime: 100,
      once: true
    });

    done();

  });

  afterEach(function (done) {
    done();
  });

  it('should get all objs', function (done) {

    get(null, function (err, out) {
      expect(err).toBeNull();
      expect(out.statusCode).toEqual(200);
      expect(out.content).toBeDefined();

      var objs = out.content;
      expect(util.isArray(objs)).toBe(true);
      expect(objs[0].Id).toEqual(newObjs[0].Id);
      expect(objs[1].Id).toEqual(newObjs[1].Id);

      done();
    });
  });

  it('should get one obj by id', function (done) {

    var args = {
      id: newObjs[0].Id
    };

    get(args, function (err, out) {
      expect(err).toBeNull();
      expect(out.statusCode).toEqual(200);
      expect(out.content).toBeDefined();

      var obj = out.content;
      expect(util.isArray(obj)).toBe(true);
      expect(obj.length).toBe(1);
      expect(obj[0].Id).toEqual(newObjs[0].Id);

      done();
    });
  });

});
