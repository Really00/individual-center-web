'use strict';

const path = require('path');

module.exports = {
  name: 'individual-center-web',
  config: path.join(__dirname, './config'),
  // Default value: 1
  version: 1,
  // Default value: /v${version}
  base: '/individual-center-web/v1',
  host: 'www.example.com',
  apps: {
    account: {
      base: '/user',
      app: require('./apps/account/app').Application,
      config: path.join(__dirname, './apps/account/config')
    },
    object: {
      base: '/object',
      app: require('./apps/object/app').Application,
      config: path.join(__dirname, './apps/object/config')
    },
  }
};
