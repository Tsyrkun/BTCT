const { authenticate } = require('feathers-authentication').hooks;
const commonHooks = require('feathers-hooks-common');
const { restrictToOwner, restrictToRoles } = require('feathers-authentication-hooks');
const { hashPassword } = require('feathers-authentication-local').hooks;

const restrict = [
  authenticate('jwt'),
  restrictToOwner({
    idField: 'id',
    ownerField: 'id'
  })
];


module.exports = {
  before: {
    all: [],
    find: [
      authenticate('jwt'),
      restrictToRoles({
        roles: ['admin'],
        fieldName: 'permissions',
        idField: 'id'
      })
    ],
    get: [ ...restrict ],
    create: [
      authenticate('jwt'),
      restrictToRoles({
        roles: ['admin'],
        fieldName: 'permissions',
        idField: 'id'
      }),
      hashPassword()
    ],
    update: [ ...restrict, hashPassword() ],
    patch: [ ...restrict, hashPassword() ],
    remove: [ ...restrict ]
  },

  after: {
    all: [
      commonHooks.when(
        hook => hook.params.provider,
        commonHooks.discard('password')
      )
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
