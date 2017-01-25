this.application.factory('AlertsMonitor', [
  '$injector', '$q', function($injector, $q) {
    var alertsMonitor;
    alertsMonitor = {
      responseError: function(response) {
        var Alerts;
        Alerts = $injector.get('Alerts');
        if (response && response.data && response.data.errors && response.data.errors.length > 0) {
          Alerts.errors(response.data.errors);
        }
        return $q.reject(response);
      },
      response: function(response) {
        var Alerts;
        Alerts = $injector.get('Alerts');
        if (response && response.data && response.data.messages && response.data.messages.length > 0) {
          Alerts.messages(response.data.messages);
        }
        return response;
      }
    };
    return alertsMonitor;
  }
]);
