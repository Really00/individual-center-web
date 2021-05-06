'use strict';

module.exports = {
  name: 'individual-center-web',
  version: '1.0.0-alpha.1',
  description: 'Description',
  basePath: '/individual-center-web/v1',
  apps: {
    account: require('./account'),
    object: require('./object')
  }
};
