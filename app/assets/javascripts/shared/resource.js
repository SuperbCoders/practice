angular.module('practice.doctor').factory('Resource', [
  '$resource', function($resource) {
    return function(url, urlDesc, customActions) {
      var actions, resource;
      actions = {
        get: {
          method: 'GET',
          isArray: false
        },
        save: {
          method: 'PUT'
        },
        create: {
          method: 'POST'
        }
      };
      if (customActions) {
        _.forEach(customActions, function(action) {
          return actions[action.name] = {
            method: action.method,
            url: [url, action.name].join('/'),
            isArray: action.isArray || false
          };
        });
      }
      return resource = $resource(url, urlDesc, actions);
    };
  }
]);