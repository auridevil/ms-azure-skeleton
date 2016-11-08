/* eslint-env jasmine */

'use strict';

const util = require('util');
const mock = require('seriate.mock');
const model = require('../models/model');

describe('generic microservice put handler', function () {

  mock(model.sql);

  var id = 1;

  var update = {
    'enabled': false,
    'name': 'TempNice'
  };

  var updatedObj = {
    'Id': id,
    'name': update.name,
    'description': 'google.com',
    'enabled': update.enabled
  };

  var put = require('../actions/put')({
    srvname: 'microservice',
    actname: 'put',
    model: model,
    dbconfig: {}
  });


  beforeEach(function (done) {

    model.sql.addMock('update', {
      mockResults: {},
      isError: false,
      waitTime: 100,
      once: true // if true the step is un-mocked directly
    });

    model.sql.addMock('getbyid', {
      mockResults: updatedObj,
      isError: false,
      waitTime: 100,
      once: true
    });

    done();

  });

  afterEach(function (done) {
    done();
  });

  it('should update an obj', function (done) {

    let args = {
      body: update,
      id: id
    }

    spyOn(model, 'updateById').andCallThrough();
    spyOn(model, 'getById').andCallThrough();

    put(args, function (err, out) {
      expect(err).toBeNull();
      expect(out.statusCode).toEqual(200);
      expect(out.content).toBeDefined();

      expect(util.isArray(out.content)).toBe(false);
      expect(model.updateById).toHaveBeenCalled();
      expect(model.getById).toHaveBeenCalled();
      expect(out.content.Id).toEqual(id);
      expect(out.content.enabled).toEqual(update.enabled);
      expect(out.content.name).toEqual(update.name);
      done();
    });
  });

});
