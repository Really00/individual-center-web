'use strict';

const kexpress = require('kexpress');
const Action = kexpress.core.action.Action;

const prehandlers = require('./role.pspec');

const actionCreateRole = Action.Create({
  name: 'CreateRole',
  summary: '',
  description: '',
  prehandlers: prehandlers.actionCreateRole,
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

const actionGetRoles = Action.Create({
  name: 'GetRoles',
  summary: '',
  description: '',
  prehandlers: prehandlers.actionGetRoles,
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

const actionGetRole = Action.Create({
  name: 'GetRole',
  summary: '',
  description: '',
  prehandlers: prehandlers.actionGetRole,
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
  actionCreateRole,
  actionGetRoles,
  actionGetRole,
};
