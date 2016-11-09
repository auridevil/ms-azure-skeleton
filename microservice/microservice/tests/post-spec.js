/* eslint-env jasmine */

'use strict';

const util = require('util');
const mock = require('seriate.mock');
const model = require('../models/model');

describe('generic microservice post handler', function () {

  mock(model.sql);

  var newObjs = [
    {
      'Id': 1,
      'name': 'Temp1',
      'description': 'google.com',
      'enabled': true
    }
  ];

  var post = require('../actions/post')({
    srvname: 'microservice',
    actname: 'post',
    model: model,
    dbconfig: {}
  });


  beforeEach(function (done) {

    model.sql.addMock('insert', {
      mockResults: newObjs[0],
      isError: false,
      waitTime: 100,
      once: true // if true the step is un-mocked directly
    });

    done();

  });

  afterEach(function (done) {
    done();
  });

  it('should post a new obj', function (done) {

    let args = {
      body: newObjs[0]
    }

    spyOn(model, 'insertNew').andCallThrough();

    post(args, function (err, out) {
      expect(err).toBeNull();
      expect(out.statusCode).toEqual(201);
      expect(out.content).toBeDefined();

      expect(util.isArray(out.content)).toBe(false);
      expect(model.insertNew).toHaveBeenCalled();
      expect(out.content.Id).toEqual(newObjs[0].Id);
      expect(out.content.name).toEqual(newObjs[0].name);

      done();
    });
  });

});
