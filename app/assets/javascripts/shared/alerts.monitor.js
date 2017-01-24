this.application.factory('AlertsMonitor', [
  '$injector', function($injector) {
    // console.log('AlertsMonitor');
    var alertsMonitor;
    alertsMonitor = {
      responseError: function(response) {
        // console.log('responseError');
        var Alerts;
        Alerts = $injector.get('Alerts');
        // if (response && response.data && response.data.errors && response.data.errors.length > 0) {
        //   console.log('errors.length > 0');
        // } else {
        //   console.log('errors.length == 0');
        //   console.log(response);
        // }
        if (response && response.data && response.data.errors && response.data.errors.length > 0) {
          Alerts.errors(response.data.errors);
          // Alerts.messages(response.data.errors);
          // Alerts.messages(response.data.messages);
        }
        return response;
      },
      response: function(response) {
        // console.log('response');
        var Alerts;
        Alerts = $injector.get('Alerts');
        // if (response && response.data && response.data.messages && response.data.messages.length > 0) {
        //   console.log('messages.length > 0');
        // } else {
        //   console.log('messages.length == 0');
        //   console.log(response);
        // }
        if (response && response.data && response.data.messages && response.data.messages.length > 0) {
          // console.log(Alerts);
          Alerts.messages(response.data.messages);
        }
        return response;
      }
    };
    return alertsMonitor;
  }
]);
