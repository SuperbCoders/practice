class PatientsController
  constructor: (@rootScope, @scope, @Patients) ->
    vm = @
    vm.items_limit = 30
    vm.filters = {name: '123'}
    vm.Patients = @Patients

    @scope.$watch('vm.filters', (a, b) ->
      console.log a
    )

    @fetch()

  fetch: () ->
    vm = @
    @Patients.query(vm.filters).$promise.then((patients) ->
      vm.patients = patients
    )
    return


@application.controller 'PatientsController', ['$rootScope','$scope', 'Patients', PatientsController]
