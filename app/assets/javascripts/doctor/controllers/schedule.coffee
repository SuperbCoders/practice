class ScheduleController
  constructor: (@rootScope, @scope, @Visits) ->
    vm = @
    vm.items_limit = 100
    vm.filters = {}
    vm.Visits = @Visits
    vm.win = $(window)
    vm.new_patient = {}
    vm.timelineInterval = undefined
    vm.calendarHolder = $('.calendarHolder')
    vm.events ||= []

    # Из-за верстки нужно добавлять классы к body
    # в зависимости от страницы
    $('body').addClass 'cal_header_mod'
    $('body').addClass 'cal_body_mod'

    @scope.$on('$destroy', ->
      $('body').removeClass 'cal_header_mod'
      $('body').removeClass 'cal_body_mod'
    )

    vm.calendar_options =
      events: vm.visits_by_date
      firstDay: 1
      monthNames: [
        'Январь'
        'Февраль'
        'Март'
        'Апрель'
        'Май'
        'οюнь'
        'οюль'
        'Август'
        'Сентябрь'
        'Октябрь'
        'Ноябрь'
        'Декабрь'
      ]
      monthNamesShort: [
        'Янв.'
        'Фев.'
        'Март'
        'Апр.'
        'Май'
        'οюнь'
        'οюль'
        'Авг.'
        'Сент.'
        'Окт.'
        'Ноя.'
        'Дек.'
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
        'ВС'
        'ПН'
        'ВТ'
        'СР'
        'ЧТ'
        'ПТ'
        'СБ'
      ]
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
        center: 'agendaDay,agendaWeek'
        right: 'prev,next'
      columnFormat:
        month: 'ddd'
        week: 'ddd, D'
        day: 'dddd, D'
      titleFormat:
        day: 'MMMM YYYY'
        week: 'MMMM YYYY'
      slotDuration: '00:30:00'
      timezone: 'local'
      defaultView: 'agendaDay'
      weekMode: 'fixed'
      vm: vm
      editable: true
      allDaySlot: false
      eventOverlap: false
      slotLabelFormat: 'H:mm'
      timeFormat: 'H:mm'
      defaultEventMinutes: 60
      defaultDate: vm.rootScope.regDate()
      height: vm.getCalendarHeight()
      eventMouseover: @event_mouse_over
      eventResize: @event_resize
      eventDrop: @event_drop
      dayClick: @day_click
      viewRender: @view_render

    vm.calendar_params = _.merge(vm.calendar_controllers, vm.calendar_options)
    vm.calendar ||= $('#calendar').fullCalendar(vm.calendar_params)

  visits_by_date: (start, end, timezone, callback) ->
    vm = @options.vm

    paket =
      start: start.format()
      end: end.format()

    vm.Visits.query(paket).$promise.then((events) -> callback(events))

  add_record: ->
    vm = @
    return

  setTimeline: ->
    parentDiv = $('.fc-agenda-view')
    slats = parentDiv.find('.fc-slats')
    timeline = parentDiv.find('.timeline')
    if timeline.length == 0
      timeline = $('<div />').addClass('timeline').append('<span />')
      parentDiv.find('.fc-slats').append timeline
    curTime = new Date
    timeline.find('span').text moment(curTime).format('HH:mm')
    curCalView = calendar.fullCalendar('getView')
    dayEnd = moment(0, 'HH')._d.toString().replace(/00:00:00/i, slats.find('tr:last').attr('data-time'))
    dayStart = moment(0, 'HH')._d.toString().replace(/00:00:00/g, slats.find('tr:first').attr('data-time'))
    #console.log(curCalView.start._d, curCalView.end._d);
    #console.log(dayStart, dayEnd, curTime, regDate.day());
    timeline.toggle moment(dayStart).isBefore(moment(curTime)) and moment(curTime).isBefore(moment(dayEnd))
    curTime = moment(curTime).subtract(0, 'h')
    curSeconds = curTime.hours() * 60 * 60 + curTime.minutes() * 60 + curTime.seconds()
    percentOfDay = curSeconds / moment(dayEnd).diff(dayStart, 's')
    topLoc = Math.floor(parentDiv.find('.fc-body .fc-slats').height() * percentOfDay)
    timeline.css
      'top': topLoc + 'px'
      'left': curCalView.axisWidth + 'px'
    $('.active-day').removeClass 'active-day'
    $('.fc-day-header[data-date=' + moment(regDate).format('YYYY-MM-DD') + ']').addClass 'active-day'
    clearInterval vm.timelineInterval
    vm.timelineInterval = setInterval(setTimeline, 60 * 1000)
    return

  getCalendarHeight: ->
    newHeight = @win.height() + (if @win.width() > 1200 then 40 else -50) - ($('.wrapper').css('paddingTop').replace('px', '') * 1)
    Math.max newHeight, 300

  fetch: () ->
    vm = @

    @Visits.query(vm.filters).$promise.then((events) ->
      console.log 'Old visits'
      console.log vm.events

      vm.events = []
      for event in events
        vm.events.push event

      console.log 'New Visits'
      console.log vm.events
    )

    return

  event_resize: ( event, delta, revertFunc ) ->
    event.start_at = event.start
    event.duration = (event.end - event.start)/60/1000
    event.$save()
    return

  event_drop: ( event, delta, revertFunc, jsEvent, ui, view ) ->
    event.start_at = event.start
    event.duration = (event.end - event.start)/60/1000
    event.$save()
    return


  day_click: (date, jsEvent, view) ->
    vm = @

    vm.add_patient_form ||= $('#add_patient_form').dialog(
      autoOpen: false
      modal: true
      width: 360
      dialogClass: 'dialog_v1 no_close_mod')

    $(vm.add_patient_form[0]).find('form')[0].reset()
    $(vm.add_patient_form[0]).find('#visit_date').val(date.format())
    $(vm.add_patient_form[0]).find('.newPatientBtn span').text 'Записать на ' + date.format('DD') + ' ' + date.format('MMMM').toString().toLowerCase().replace(/.$/, 'я') + ', в ' + date.format('HH:mm')
    newEventDate = date
    vm.add_patient_form.dialog('option', 'position',
      my: 'left+15 top-150'
      of: jsEvent
      collision: 'flip fit'
      within: '.fc-view-container'
      using: (obj, info) ->
        dialog_form = $(this)
        cornerY = jsEvent.pageY - (obj.top) - 40
        if info.horizontal != 'left'
          dialog_form.addClass 'flipped_left'
        else
          dialog_form.removeClass 'flipped_left'
        dialog_form.css(
          left: obj.left + 'px'
          top: obj.top + 'px').find('.form_corner').css top: Math.min(Math.max(cornerY, -20), dialog_form.height() - 55) + 'px'
        return
    ).dialog 'open'
    return

  event_save: ( event ) ->
    console.log "Save event #{event.id}"
    return

  view_render: (view, element) ->
    vm = @
    $('.calendarHolder').toggleClass 'day_mode', 'agendaDay' == view.name
    if vm.timelineInterval != undefined
      @setTimeline()
    return

  event_mouse_over: (event, jsEvent, view) ->
    return

@application.controller 'ScheduleController', ['$rootScope','$scope', 'Visits', ScheduleController]
