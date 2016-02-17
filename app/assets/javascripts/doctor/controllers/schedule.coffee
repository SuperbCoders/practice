class ScheduleController
  constructor: (@rootScope, @scope, @Visits) ->
    vm = @
    vm.items_limit = 100
    vm.filters = {}
    vm.Visits = @Visits
    vm.win = $(window)
    vm.timelineInterval = undefined
    vm.calendarHolder = $('.calendarHolder')

    vm.add_patient_form = $('#add_patient_form').dialog(
      autoOpen: false
      modal: true
      width: 360
      dialogClass: 'dialog_v1 no_close_mod')

    vm.events = [
      {
        title: 'All Day Event'
        start: '2016-01-01'
      }
      {
        title: 'Long Event'
        start: '2016-01-07'
        end: '2016-01-10'
      }
      {
        id: 999
        title: 'Repeating Event'
        start: '2016-01-09T16:00:00'
      }
      {
        id: 999
        title: 'Repeating Event'
        start: '2016-01-16T16:00:00'
      }
    ]

    vm.calendar ||= $('#calendar').fullCalendar(
      firstDay: 1
      height: @getCalendarHeight()
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
      defaultDate: @rootScope.regDate()
      editable: true
      allDaySlot: false
      slotLabelFormat: 'H:mm'
      timeFormat: 'H:mm'
      defaultEventMinutes: 60
      viewRender: (view, element) ->
        vm.calendarHolder.toggleClass 'day_mode', 'agendaDay' == view.name
        if vm.timelineInterval != undefined
          @setTimeline()
        return
      eventMouseover: (event, jsEvent, view) ->
        console.log(event, jsEvent, view);
        return
      dayClick: (date, jsEvent, view) ->
        console.log(date, jsEvent, view);
#        $(add_patient_form[0]).find('form')[0].reset()
#        $(add_patient_form[0]).find('.newPatientBtn span').text 'Записать на ' + date.format('DD') + ' ' + date.format('MMMM').toString().toLowerCase().replace(/.$/, 'я') + ', в ' + date.format('HH:mm')
        newEventDate = date
        console.log jsEvent
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
      events: vm.events)

    console.log vm.calendar
    @fetch()

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
      vm.events = events
    )
    return


@application.controller 'ScheduleController', ['$rootScope','$scope', 'Visits', ScheduleController]
