class DoctorProfileController
  constructor: (@rootScope, @scope, @Alerts, @state, @Doctor) ->
    vm = @
    vm.Alerts = @Alerts
    vm.Doctor = @Doctor
    vm.doctor = undefined
    vm.rootScope = @rootScope



    if not vm.doctor
      @Doctor.get().$promise.then( (response) ->
        vm.doctor = response

        vm.add_contact('phone') if vm.doctor.phones.length <= 0

        vm.new_schedule() if vm.doctor.work_schedules.length <= 0

      )

    @init_chosen()

    return

  addSocial: (url) ->
    window.open(url, "Auth", "height=200,width=200")
    true

  new_schedule: ->
    vm = @
    vm.doctor.work_schedules.push {days: [], start_at: '08:00', finish_at: '20:00'}
    $("#doctor_work_days").chosen()
    return

  updateDaysRow: (slct) ->
    console.log 'updateDaysRow'
    slct_val = slct.val()
    chzn_container = slct.next('.chzn-container').find('.chzn-choices')
    days = ''
    if slct_val
      i = 0
      while i < slct_val.length
        days += ',' + slct.find('option[value=' + slct_val[i] + ']').attr('data-short')
        i++
      days = days.replace(/^,/i, '')
      if chzn_container.find('.chzn_rzlts').length
        chzn_container.find('.chzn_rzlts').text days
      else
        chzn_container.prepend $('<li class="chzn_rzlts" />').text(days)
    else
      chzn_container. find('.chzn_rzlts').remove()
    return

  fix_tab_header: ->
    if doc.scrollTop() > 0
      tabHeaderSpacer.css 'height', tabHeader.height()
      tabHeader.addClass 'tab_header_fixed'
    else
      tabHeader.removeClass 'tab_header_fixed'
      tabHeaderSpacer.css 'height', tabHeader.height()
    return

  init_chosen: ->
    vm = @
    vm.rootScope.init_chosen()
    if $('.chosen-select').length
      $('body').delegate '.chosen_multiple_v1 .extra_control', 'click', (e) ->
        console.log 'init_chosen'
        firedEl = $(this)
        e.preventDefault()
        chzn_container = firedEl.closest('.chzn-container ')
        option_ind = firedEl.parents('.chzn_item').attr('data-option-array-index') * 1
        firedEl.closest('.chzn-container').prev('.chosen-select').find('option[value=' + option_ind + ']').removeAttr 'selected'
        vm.updateDaysRow chzn_container.prev('.chosen-select').trigger('chosen:updated')
        false

      $('.chosen-select').on('chosen:ready', (evt, params) ->
        if params.chosen.is_multiple
          $(params.chosen.container).find('.chzn-choices').append $('<li class="chzn-choices-arrow" />')
        return
      ).on('chosen:showing_dropdown', (evt, params) ->
        open_chzn = params.chosen
        firedEl = $(evt.currentTarget)
        niceScrollBlock = firedEl.next('.chzn-container').find('.chzn-results')
        if niceScrollBlock.getNiceScroll().length
          niceScrollBlock.getNiceScroll().resize().show()
        else
          niceScrollBlock.niceScroll
            cursorwidth: 4
            cursorborderradius: 2
            cursorborder: 'none'
            bouncescroll: false
            autohidemode: false
            horizrailenabled: false
            railsclass: firedEl.data('rails_class')
            railpadding:
              top: 0
              right: 0
              left: 0
              bottom: 0
        return
      ).on('chosen:hiding_dropdown', (evt, params) ->
        open_chzn = null
        firedEl = $(evt.currentTarget)
        niceScrollBlock = firedEl.next('.chzn-container').find('.chzn-results')
        niceScrollBlock.getNiceScroll().hide()
        #if (firedEl.parents('.form_validate').length) firedEl.validationEngine('validate');
        return
      ).change((e) ->
        vm.updateDaysRow $(e.target)
        return
      ).chosen
        autohide_results_multiple: false
        allow_single_deselect: true
        width: '100%'
    return

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
    vm = @
    switch type
      when 'phone' then vm.doctor.phones.push {data: ''}
      when 'email' then vm.doctor.emails.push {data: ''}
    return

  save: ->
    vm = @
    vm.Doctor.save({doctor: vm.doctor}).$promise.then((response) ->
      vm.Alerts.messages response.messages
    )
    return

@application.controller 'DoctorProfileController', ['$rootScope','$scope', 'Alerts', '$state', 'Doctor', DoctorProfileController]
