'use strict';

const kexpress = require('kexpress');
const Router = kexpress.core.router.Router;
const actions = require('../actions/role');

const router = new Router({
  name: 'role',
  description: '角色管理'
});

router.post('/', actions.actionCreateRole);
router.get('/', actions.actionGetRoles);
router.get('/:roleId', actions.actionGetRole);

module.exports = {
  router
};
