this.application.factory('AlertsMonitor', [
  '$injector', function($injector) {
    var alertsMonitor;
    alertsMonitor = {
      responseError: function(response) {
        var Alerts;
        Alerts = $injector.get('Alerts');
        if (response && response.data && response.data.errors && response.data.errors.length > 0) {
          Alerts.errors(response.data.errors);
        }
        return response;
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
