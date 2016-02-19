class JournalController
  constructor: (@rootScope, @scope, @Journals, @Alerts) ->
    vm = @
    vm.Journals = @Journals
    vm.Alerts = @Alerts

@application.controller 'JournalController', ['$rootScope','$scope', 'Journals', 'Alerts', JournalController]
