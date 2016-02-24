class DoctorProfileController
  constructor: (@rootScope, @scope, @Alerts, @state, @Doctor) ->
    vm = @
    vm.Alerts = @Alerts
    vm.Doctor = @Doctor
    vm.doctor = undefined

    if not vm.doctor
      @Doctor.get().$promise.then( (response) ->
        vm.doctor = response

        vm.doctor.vk_id = 'vk.com/' if not vm.doctor.vk_id
        vm.doctor.fb_id = 'facebook.com/' if not vm.doctor.fb_id
        vm.doctor.twitter_id = 'twitter.com/' if not vm.doctor.twitter_id

        vm.add_contact('phone') if vm.doctor.phones.length <= 0
      )

    switch tab_name = @state.current.name.split('.')[1]
      when 'profile'
        console.log "Tab #{tab_name}"
      when 'settings'
        console.log "Tab #{tab_name}"
      when 'subscription'
        console.log "Tab #{tab_name}"
      when 'public'
        console.log "Tab #{tab_name}"

  update_password: ->
    vm = @
    params =
      doctor =
        id: vm.doctor.id
        password: vm.doctor.password

    vm.Doctor.save({doctor: params}).$promise.then( (response) ->
      if response.errors.length <= 0
        vm.hide_pass_form()
    )

  hide_pass_form: ->
    vm = @
    vm.doctor.password = undefined
    $('.passForm').hide()
    $('.passBtn').show()
    return

  show_pass_form: ->
    $('.passBtn').hide()
    $('.passForm').show().find('.passInput').focus()
    return

  add_contact: (type) ->
    console.log type
    vm = @
    switch type
      when 'phone' then vm.doctor.phones.push {data: ''}
      when 'email' then vm.doctor.emails.push {data: ''}
    return

  save: ->
    vm = @
    vm.Doctor.save({doctor: vm.doctor})
    return

@application.controller 'DoctorProfileController', ['$rootScope','$scope', 'Alerts', '$state', 'Doctor', DoctorProfileController]
