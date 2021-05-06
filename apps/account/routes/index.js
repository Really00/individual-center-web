'use strict';

const kexpress = require('kexpress');
const Router = kexpress.core.router.Router;
const roleRouter = require('./role').router;
const privilegeRouter = require('./privilege').router;

const router = new Router({
  name: 'account',
  description: ''
});

router.use('/role', roleRouter);
router.use('/privilege', privilegeRouter);

module.exports = {
  router: router
};
