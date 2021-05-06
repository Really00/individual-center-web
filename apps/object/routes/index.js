'use strict';

const kexpress = require('kexpress');
const Router = kexpress.core.router.Router;
const taskRouter = require('./task').router;
const fileRouter = require('./file').router;
const modelRouter = require('./model').router;
const router = new Router({
  name: 'object',
  description: ''
});
router.use('/file', fileRouter);
router.use('/task', taskRouter);
router.use('/model', modelRouter);
module.exports = {
  router: router
};
