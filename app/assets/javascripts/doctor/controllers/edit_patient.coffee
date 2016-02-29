class EditPatientController
  constructor: (@rootScope, @scope, @Patients) ->
    vm = @
    vm.patient = undefined

    if @rootScope.$stateParams.id
      @Patients.get({id: @rootScope.$stateParams.id}).$promise.then( (patient) ->
        vm.patient = patient
        vm.normalize_patient()
      )

    $('#patient_age').datepicker
      firstDay: 1
      changeMonth: true
      changeYear: true
      yearRange: '1920:2016'
      dateFormat: 'dd / mm / yy'
      defaultDate: +1
      numberOfMonths: 1
      showOtherMonths: true
      unifyNumRows: true
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
    # "17 / 03 / 2016"
    vm = @
    birthday = moment(vm.patient)
    vm.patient.birthday = "#{birthday.date()} / #{birthday.month()} / #{birthday.year()}"

  add_phone: -> @patient.phones.push {number: ''}

  save: (redirect = false) ->
    vm = @
    console.log @patient

    vm.patient.$save().then((patient) ->
      vm.normalize_patient()
    )

@application.controller 'EditPatientController', ['$rootScope','$scope', 'Patients' , EditPatientController]
