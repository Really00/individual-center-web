'use strict';

const {
  RoleNotFound,
} = require('../config/errors');

module.exports = {
  actionCreateRole: {
    request: {
      contentType: 'application/json',
      body: {
        name: 'string*',
        description: 'string*'
      }
    },
    response: {
      200: {
        data: {
          id: 'string*',
          name: 'string*',
          description: 'string*'
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: {
      }
    }
  },
  actionGetRoles: {
    request: {
      contentType: 'application/json',
      query: {
        skip: {
          $type: 'integer',
          $default: 0
        },
        limit: {
          $type: 'integer',
          $default: 10
        }
      }
    },
    response: {
      200: {
        data: [
          {
            id: 'string*',
            naem: 'string*',
            description: 'string*'
          }
        ]
      },
      contentType: 'application/json'
    },
    store: {
      default: {
      }
    }
  },
  actionGetRole: {
    request: {
      contentType: 'application/json',
      params: {
        roleId: 'string*'
      }
    },
    response: {
      200: {
        data: [
          {
            id: 'string*',
            name: 'string*',
            description: 'string*'
          }
        ]
      },
      404: {
        errors: {
          RoleNotFound
        }
      },
      contentType: 'application/json'
    },
    store: {
      default: {
      }
    }
  },
};
