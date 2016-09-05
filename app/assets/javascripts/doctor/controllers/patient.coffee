class PatientController
  constructor: (@rootScope, @scope, @Patients) ->
    vm = @
    vm.patient = undefined
 
    $('#patient_age').datepicker(
      firstDay: 1
      changeMonth: true
      changeYear: true
      yearRange: '1930:' + (new Date()).getFullYear().toString(),
      dateFormat: 'dd / mm / yy'
      numberOfMonths: 1
      showOtherMonths: true
      unifyNumRows: true
      onSelect: (textDate) ->
        getAge(moment($('#patient_age').datepicker('getDate')).toString())
        vm.patient.birthday = moment($('#patient_age').datepicker('getDate'))
      nextText: ''
      prevText: ''
      monthNames: [
        'Январь'
        'Февраль'
        'Март'
        'Апрель'
        'Май'
        'Июнь'
        'Июль'
        'Август'
        'Сентябрь'
        'Октябрь'
        'Ноябрь'
        'Декабрь'
      ]
      monthNamesShort: [
        'Янв'
        'Фев'
        'Март'
        'Апр'
        'Май'
        'Июнь'
        'Июль'
        'Авг'
        'Сен'
        'Окт'
        'Ноя'
        'Дек'
      ]
      dayNames: [
        'Воскресенье'
        'Понедельник'
        'Вторник'
        'Среда'
        'Четверг'
        'Пятница'
        'Суббота'
      ]
      dayNamesShort: [
        'Sun'
        'Mon'
        'Tue'
        'Wed'
        'Thu'
        'Fri'
        'Sat'
      ]
      dayNamesMin: [
        'Вс'
        'Пн'
        'Вт'
        'Ср'
        'Чт'
        'Пт'
        'Сб'
      ]
    )

    if @rootScope.$stateParams.id
      @Patients.get({id: @rootScope.$stateParams.id}).$promise.then( (patient) ->
        vm.patient = patient
        vm.normalize_patient()
      )
    else
      $('#patient_age').datepicker('setDate', new Date())
      vm.patient =
        phones: [{number: ''}]

    $("#patient_age").on("change", ->
      getAge(moment($('#patient_age').datepicker('getDate')).toString())
      vm.patient.birthday = moment($('#patient_age').datepicker('getDate'))
    )

    $('.chosen-select').chosen(
      width: '100%'
      disable_search_threshold: 3).on('chosen:showing_dropdown', (evt, params) ->
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
    ).on 'chosen:hiding_dropdown', (evt, params) ->
      firedEl = $(evt.currentTarget)
      niceScrollBlock = firedEl.next('.chzn-container').find('.chzn-results')
      niceScrollBlock.getNiceScroll().hide()
      #if (firedEl.parents('.form_validate').length) firedEl.validationEngine('validate');
      return

  normalize_patient: ->
    vm = @

    # Birthday
    # "17 / 03 / 2016"
    if vm.patient.birthday
      birthday = moment(vm.patient.birthday)
      vm.patient.birthday_text = "#{birthday.format('DD')} / #{birthday.format('MM')} / #{birthday.format('YYYY')}"

    # Gender
    @reset_gender()
    $("#patient_gender_#{vm.patient.gender}").prop('checked', true)

    # Blood
    $('#patient_blood').val(vm.patient.blood).trigger('chosen:updated')
    $('#patient_rhesus').val(vm.patient.rhesus).trigger('chosen:updated')
    return

  add_phone: -> @patient.phones.push {number: ''}

  reset_gender: ->
    $("#patient_gender_male").prop("checked", false)
    $("#patient_gender_female").prop("checked", false)
    return

  gender: (g_type) ->
    vm = @
    @reset_gender()
    console.log "Gender #{g_type}"
    vm.patient.gender = g_type
    $("#patient_gender_#{g_type}").prop('checked', true)
    return

  save: (redirect = false) ->
    vm = @
    return false if not @patient

    if vm.patient.id
      vm.patient.$save().then((patient) ->
        vm.normalize_patient()
      )
    else
      vm.Patients.create({patient: vm.patient}).$promise.then((result) ->
        if vm.redirect
          vm.rootScope.$state.go('journal.add_record', {patient_id: result.patient.id})
        else
          vm.rootScope.$state.go('patients.list')
      )

@application.controller 'PatientController', ['$rootScope','$scope', 'Patients' , PatientController]

getAge = (dateString)->
    today = new Date();
    birthDate = new Date(dateString);
    age = today.getFullYear() - birthDate.getFullYear();
    m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m == 0 && today.getDate() < birthDate.getDate())) 
      age--;
    $('#patient_age_label').text(age.toString() + " " + makeAgeWord(age))

makeAgeWord = (age)->
  ret = ""
  switch age % 10
    when 0, 5, 6, 7, 8, 9 then ret = "лет"
    when 2, 3, 4 then ret = "года"
    when 1 then ret = "год"
  ret