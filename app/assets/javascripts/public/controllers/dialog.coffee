class DialogController
  constructor: (@rootScope, @scope, @ngDialog) ->
    vm = @
    vm.stage = 1
    vm.patient = {}    
    vm.events ||= []
    vm.ngDialog = @ngDialog
    vm.Doctor = @rootScope.Doctor
    vm.doctor = @rootScope.doctor
    vm.username = @rootScope.username
    vm.visit = {}

    vm.calendar_params =
      firstDay: 1
      height: 315
      eventOverlap: false
      monthNames: [ 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'οюнь', 'οюль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
      monthNamesShort: ['Янв.','Фев.','Март','Апр.','Май','οюнь','οюль','Авг.','Сент.','Окт.','Ноя.','Дек.' ]
      dayNames: [ 'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
      dayNamesShort: [ 'ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ' ]
      buttonText:
        prev: ' '
        next: ' '
        prevYear: 'Год назад'
        nextYear: 'Год вперед'
        today: 'Сегодня'
        month: 'Месяц'
        twoweek: '2 week'
        week: 'Неделя'
        day: 'День'
      header:
        left: 'title'
        center: 'agendaDay'
        right: 'prev,next'
      columnFormat:
        month: 'ddd'
        week: 'ddd, D'
        day: 'dddd, D'
      titleFormat:
        day: 'MMMM YYYY'
        week: 'MMMM YYYY'
      timezone: 'local'
      vm: vm
      defaultView: 'agendaDay'
      weekMode: 'fixed'
      defaultDate: moment(Date.new)
      editable: true
      allDaySlot: false
      slotLabelFormat: 'H:mm'
      timeFormat: 'H:mm'
      defaultEventMinutes: 60
      dayClick: @day_click
      events: @visits_by_date

  visits_by_date: (start, end, timezone, callback) ->
    vm = @options.vm

    paket =
      username: vm.username
      start: start.format()
      end: end.format()

    vm.Doctor.visits(paket).$promise.then((events) ->
      for event in events
        event.editable = false
        event.eventOverlap = false
        event.rendering = 'background'
        event.backgroundColor = 'red'
        event.overlap = false
      callback(events)
    )

  create_visit: ->
    console.log 'public_visit'
    vm = @
    event = vm.events[0]

    visit =
      username: vm.username
      patient: vm.patient
      start: event.start.format()
      duration: ((event.end - event.start)/60)/1000

    vm.Doctor.new_visit(visit).$promise.then((visit) ->
      if visit.errors.length <= 0
        vm.visit = visit
        vm.stage = 3
        # PrivatePub.publish_to '/notifications', message: 
      else
        for a in visit.errors
          alert(a)
    )

    false

  day_click: (date, jsEvent, view) ->
    vm = view.options.vm

    for event in vm.events
      vm.popup_calendar.fullCalendar 'removeEvents', event._id

    vm.events = vm.popup_calendar.fullCalendar 'renderEvent',
      start: date
      end: date
      className: 'status_red popupAddEvent'
      eventOverlap: false
      overlap: false
      allDay: false

    stand_time = 30
    stand_time = vm.doctor.stand_time if vm.doctor.stand_time > 0

    if vm.events.length > 0
      event = vm.events[0]
      event.end = date.add(stand_time, 'minutes')
      vm.popup_calendar.fullCalendar( 'updateEvent', vm.events[0] )

      $(".appointmentTimeBtn").text("Записаться на #{event.start.format('lll')}")

    return

  next_stage: ->
    vm = @
    vm.stage = 2

    vm.popup_calendar = $('#popup_calendar').fullCalendar(vm.calendar_params)
    setTimeout(->
      vm.popup_calendar.fullCalendar('render')
    , 1)


    return

  delete_last_visit: ->
    vm = @
    vm.Doctor.remove_visit({id: vm.visit.id})
    vm.ngDialog.closeAll()

@application.controller 'DialogController', ['$rootScope','$scope', 'ngDialog', DialogController]
