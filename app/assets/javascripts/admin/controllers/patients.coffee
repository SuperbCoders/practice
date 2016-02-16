class PatientsController
  constructor: (@rootScope, @scope, @Patients, Log) ->
    vm = @
    vm.items_limit = 100
    vm.filters = {}
    vm.Patients = @Patients


    @fetch()

  fetch: () ->
    vm = @
    @Patients.query(vm.filters).$promise.then((patients) ->
      vm.patients = patients
    )
    return


@application.controller 'PatientsController', ['$rootScope','$scope', 'Patients', 'Log', PatientsController]
