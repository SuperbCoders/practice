class DoctorsController
  constructor: (@rootScope, @scope, @Doctors, Log) ->
    vm = @
    vm.items_limit = 100
    vm.filters = {}
    vm.Doctors = @Doctors


    @fetch()

  fetch: () ->
    vm = @
    @Doctors.query(vm.filters).$promise.then((doctors) ->
      vm.doctors = doctors
    )
    return


@application.controller 'DoctorsController', ['$rootScope','$scope', 'Doctors', 'Log', DoctorsController]
