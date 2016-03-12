@application.factory 'AlertsMonitor', [ '$injector', ($injector) ->
  alertsMonitor =
    responseError: (response) ->
      Alerts = $injector.get('Alerts')
      if response && response.data.errors && response.data.errors.length > 0
        Alerts.errors response.data.errors
      response
    response: (response) ->
      Alerts = $injector.get('Alerts')
      if response && response.data.messages && response.data.messages.length > 0
        Alerts.messages response.data.messages
      response
  alertsMonitor
]
