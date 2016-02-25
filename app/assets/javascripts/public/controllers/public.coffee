class DoctorProfileController
  constructor: (@rootScope, @scope, @Doctor, ngDialog) ->
    vm = @
    @rootScope.Doctor = @Doctor


    @Doctor.profile({username: @rootScope.username}).$promise.then((response) ->
      vm.doctor = response
      vm.rootScope.doctor = vm.doctor
    )

    $('body').delegate '.fc-event', 'click', (e) ->
      firedEl = $(e.target)
      if firedEl.prop('tagName').toLowerCase() == 'input'
        firedEl.focus()
      return

    $('.openAppointmentBtn').on('click', ->
      ngDialog.open({
        template: 'appointments_form',
        controllerAs: 'vm',
        controller: 'DialogController'
        scope: @scope
      })
      return false
    )

@application.controller 'DoctorProfileController', ['$rootScope','$scope', 'Doctor', 'ngDialog', DoctorProfileController]


