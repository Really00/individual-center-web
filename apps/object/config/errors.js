'use strict';

module.exports = {
  FileNotFound: {
    id: 2005,
    message: 'file not exist',
    status: 404
  },
  TaskExist: {
    id: 30001,
    message: 'task exist',
    status: 403
  },
  ModelExist: {
    id: 30002,
    message: 'model exist',
    status: 403
  },
  ModelNotExist: {
    id: 30003,
    message: 'model not exist',
    status: 404
  },
  TaskNotExist: {
    id: 30004,
    message: 'task not exist',
    status: 404
  },
  PrivilegeLimited: {
    id: 5001,
    message: 'privilege limites',
    status: 403
  },
  UploadFailed: {
    id: 5002,
    message: 'upload failed',
    status: 403
  }
};
