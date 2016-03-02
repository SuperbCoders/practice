class NotificationsController
  constructor: (@rootScope, @scope, @Alerts) ->
    vm = @
    vm.notifications = @Alerts.alerts()

    $("#notifications").removeClass('notification_open')
    $('body').addClass 'sub_header_mod'

    @scope.$on('$destroy', -> $('body').removeClass 'sub_header_mod' )

@application.controller 'NotificationsController', ['$rootScope', '$scope', 'Alerts', NotificationsController]