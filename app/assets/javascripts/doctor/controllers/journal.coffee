class JournalController
  constructor: (@rootScope, @scope, @Patients, @Alerts) ->
    vm = @
    vm.Patients = @Patients
    vm.Alerts = @Alerts

@application.controller 'JournalController', ['$rootScope','$scope', 'Patients', 'Alerts', JournalController]
