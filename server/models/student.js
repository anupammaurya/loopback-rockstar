'use strict';

var async = require('async');

module.exports = function (Student) {
  // Call remote Method
  Student.customRemoteMethod = function (data, cb) {
    // Student.app.models.locker.findById(data.id, {
    //   include: [{
    //     relation: 'locker',
    //     scope: {
    //       fields: ['number', 'full_name'],
    //     },
    //   }],
    // })
    // .then(function(requestObj) {
    //   if (requestObj) {
    //   }
    // });
    // cb(null, {
    //   'response': 'ok',
    // });
    async.auto({
      findStudentDetails: function (callback) {
        Student.find({
          fields: ['first_name', 'last_name', 'lockerId'],
          order: 'id',
          where: {
            id: data.id
          },
        }, (err, result) => {
          return callback(null, result);
        });
      },
      findLockerDetail: ['findStudentDetails', function (results, callback) {
        Student.app.models.locker.findOne({
          fields: ['first_name', 'last_name', 'number'],
          order: 'id',
          'where': {
            id: results.findStudentDetails[0].lockerId
          },
        }, (err, result) => {
          return callback(null, result);
        });
      }],
    }, function (asyncAutoError, asyncAutoResult) {
      if (asyncAutoError) {
        return cb(null, {
          success: false,
          msg: 'Failed in async Auto',
          data: asyncAutoError
        });
      } else {
        return cb(null, {
          success: true,
          msg: 'Successful',
          data: asyncAutoResult
        });
      }
    });
  };

  // Create remote Method
  //   Student.remoteMethod('customRemoteMethod', {
  //     http: {path: '/customRemoteMethod', verb: 'get'},
  //     accepts: [
  //       {arg: 'slug', type: 'string',
  //         http: {source: 'query'}, required: true},
  //     ],
  //     returns: {root: true, type: 'object'},
  //     description: 'Generate Student slug',
  //   });

  //   Student.remoteMethod(
  // 	'customRemoteMethod', {
  // 	  description: 'Get the locker details',
  // 	  accepts: {
  //     arg: 'id',
  //     type: 'object',
  //     required: true,
  //     http: {
  // 		  source: 'body',
  //     },
  // 	  },
  // 	  returns: {
  //     arg: 'result',
  //     type: 'object',
  //     root: true,
  //     description: 'get the locker details with student id',
  // 	  },
  // });

  //   Student.remoteMethod('customRemoteMethod', {
  //     accepts: [{arg: 'id', type: 'string'}],
  //     returns: {arg: 'status', type: 'string'},
  //     http: {
  //       verb: 'post',
  //       path: '/',
  //     },
  //   });

  Student.remoteMethod(
    'customRemoteMethod', {
      description: 'Get the details here.',
      accepts: {
        arg: 'data',
        type: 'object',
        default: '{"id": 1}',
        required: true,
        http: {
          source: 'body',
        },
      },
      returns: {
        arg: 'result',
        type: 'object',
        root: true,
        description: 'resObj',
      },
      http: {
        verb: 'post',
      },
    });
};
