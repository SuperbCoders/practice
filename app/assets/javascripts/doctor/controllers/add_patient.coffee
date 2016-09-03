class AddPatientController
  constructor: (@rootScope, @scope, @Resources, @Alerts) ->
    vm = @
    vm.Alerts = @Alerts
    vm.Visits = @Resources('/doctor/visits/:id', {id: '@id'}, [{method: 'GET', isArray: true}])
    vm.new_patient = {}

  create: ->
    vm = @
    vm.visit =
      patient: vm.new_patient
      start_at: $('#visit_date').val()

    vm.Visits.create({visit: vm.visit}).$promise.then((result) ->
      if result.success
        vm.Alerts.messages result.messages
        $('#add_patient_form').dialog('close')

        $('#calendar').fullCalendar('refetchEvents')
    , (result) ->
      vm.Alerts.errors result.data.errors
    )
 
@application.controller 'AddPatientController', ['$rootScope', '$scope', 'Resources', 'Alerts', AddPatientController]
