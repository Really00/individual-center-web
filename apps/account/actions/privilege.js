'use strict';

const kexpress = require('kexpress');
const Action = kexpress.core.action.Action;

const prehandlers = require('./privilege.pspec');

const actionCreatePrivilege = Action.Create({
  name: 'CreatePrivilege',
  summary: '',
  description: '',
  prehandlers: prehandlers.actionCreatePrivilege,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res) {
    res.json({
    });
  }
});

const actionGetPrivileges = Action.Create({
  name: 'GetPrivileges',
  summary: '',
  description: '',
  prehandlers: prehandlers.actionGetPrivileges,
  /**
  * Action handler
  * @param {express.core.Request} req - The HTTP request of express.
  * @param {express.core.Response} res - The HTTP response of express.
  * @param {kexpress.HandleContext} ctx - The context data of kexpress.
  */
  async handler(req, res) {
    res.json({
    });
  }
});

module.exports = {
  actionCreatePrivilege,
  actionGetPrivileges,
};
