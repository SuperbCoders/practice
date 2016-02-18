@application.factory 'Alerts', [ 'Notification', (Notification)->
  class Alerts
    alerts = []

    alerts: -> alerts
    clear_all_alerts: -> alerts.length = 0
    delete_alert: (alert) ->
      alerts.splice(alerts.indexOf(alert), 1)
      return true

    success: (message) ->
      alert =
        message: message
        alert_type: 'success'

      alerts.push alert
      Notification.success(message, positionY: 'top', positionX: 'right')

    error: (message) ->
      alert =
        message: message
        alert_type: 'error'

      alerts.push alert
      Notification.error(message, positionY: 'top', positionX: 'right')


    server_error: -> @error('Не удалось отправить запрос!')

    messages: (messages) -> @success(alert) for alert in messages if messages
    errors: (errors) -> @error(alert) for alert in errors if errors

  new Alerts()
]