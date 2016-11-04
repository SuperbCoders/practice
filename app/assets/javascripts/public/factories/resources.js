angular.module('practice.public').factory('Resources', [
  '$resource', function($resource) {
    return function(url, urlDesc, customActions) {
      var actions, resources;
      actions = {
        save: {
          method: 'PUT'
        },
        create: {
          method: 'POST'
        },
        remove: {
          method: 'DELETE'
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
      return resources = $resource(url, urlDesc, actions);
    };
  }
]);
