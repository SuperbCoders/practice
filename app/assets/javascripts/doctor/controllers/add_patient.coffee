class AddPatientsController
  constructor: (@rootScope, @scope, @Patients, @Alerts, @state) ->
    vm = @
    vm.Patients = @Patients
    vm.Alerts = @Alerts
    vm.state = @state

    vm.patient =
      phones: [{number: ''}]
      register_date: moment(Date.new)

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

  create: (redirect = false) ->
    vm = @
    console.log @patient

    vm.Patients.create({patient: vm.patient}).$promise.then((result) ->
      if result.success
        vm.Alerts.messages result.messages

      if vm.redirect
        vm.state.go('journal.add_record', {patient_id: result.patient.id})
      else
        vm.state.go('patients.list')


      console.log result
    , (result) ->
      vm.Alerts.errors result.data.errors
    )

  add_phone: -> @patient.phones.push {number: ''}

@application.controller 'AddPatientsController', ['$rootScope','$scope', 'Patients', 'Alerts', '$state' , AddPatientsController]
