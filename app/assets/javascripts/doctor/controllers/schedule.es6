function _debug (m) {
  console.log(m);
}

function ScheduleController($scope, $compile, Visits, Settings, ValueList) {
  $scope.items_limit = 100;
  $scope.filters = {};
  $scope.win = $(window);
  $scope.clicks = 0;
  $scope.chosen_activated = false;
  $scope.event_id = 0;
  $scope.calendarHolder = $('.calendarHolder');
  // $scope.timelineInterval = 1;
  $scope.new_patient = {};
  $scope.new_visit = {duration: undefined};
  $scope.calendar_options = {
    firstDay: 1,
    minTime: "05:45:00",
    maxTime: "22:15:00",
    monthName: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    monthNamesShort: ['Янв.', 'Фев.', 'Март', 'Апр.', 'Май', 'οюнь', 'οюль', 'Авг.', 'Сент.', 'Окт.', 'Ноя.', 'Дек.'],
    dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    dayNamesShort: ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'],
    buttonText: {
      prev: ' ',
      next: ' ',
      prevYear: 'Год назад',
      nextYear: 'Год вперед',
      today: 'Сегодня',
      month: 'Месяц',
      twoweek: '2 week',
      week: 'Неделя',
      day: 'День'
    },
    header: {
      left: 'title',
      center: 'agendaDay,agendaWeek,month',
      right: 'prev,next'
    },
    columnFormat: {
      month: 'ddd',
      week: 'ddd, D',
      day: 'dddd, D'
    },
    titleFormat: {
      day: 'MMMM YYYY',
      week: 'MMMM YYYY'
    },
    slotDuration: '00:15:00',
    slotLabelInterval: '00:15:00',
    timezone: 'local',
    defaultView: 'agendaDay',
    weekMode: 'fixed',
    editable: true,
    allDaySlot: false,
    eventOverlap: false,
    slotLabelFormat: 'HH:mm',
    timeFormat: 'H:mm',
    scrollTime: "08:45:00",
    defaultEventMinutes: 60,
    defaultDate: $scope.regDate(),
    height: getCalendarHeight($scope.win),
    // eventMouseover: this.event_mouse_over,
    eventResize: event_resize,
    eventDrop: event_drop,
    dayClick: day_click,
    eventClick: event_click,
    viewRender: view_render,
    events: visits_by_date
  };

  ValueList.getList("Стандартное время приема").then(function(response) {
    $scope.standartTimeIntervals = response.value_list_items;
  });

  $scope.$watch('new_patient.cart_color', function(new_value){
    let colors = {"1": "#3eb6e3", "2": "#30c36d", "3": "#f63f3f", "4": "#f5cd1d"};
    let last_id = $scope.event_id - 1;
    let events  = $('#calendar').fullCalendar('clientEvents');
    let last_event = undefined;

    for (let event of events)
      if (event._id == last_id)
        last_event = event;
    if (last_event == undefined)
      return;
    last_event.color = colors[new_value];
    $('#calendar').fullCalendar('updateEvent', last_event);
  });

  $scope.$watch('new_visit.duration', function(new_value){
    let last_id = $scope.event_id - 1;
    let events  = $('#calendar').fullCalendar('clientEvents');
    let last_event = undefined;

    for (let event of events)
      if (event._id == last_id)
        last_event = event;
    if (last_event == undefined)
      return;
    last_event.end = moment(last_event.start).add(parseInt($scope.new_visit.duration), 'm');;
    $('#calendar').fullCalendar('updateEvent', last_event);
  });

  Settings.getSettings().then(function(response) {
    $scope.settings = response;
    setTimeout(function() {
      if (isNaN(parseInt($scope.settings.standart_shedule_interval)) || parseInt($scope.settings.standart_shedule_interval) === 0) {
        $scope.settings.standart_shedule_interval = prompt("Введите интервал приема", "15");
        Settings.saveSettings($scope.settings);
      }
    }, 0);
    if (response.calendar_view === 'week') {
      $scope.calendar_options.defaultView = 'agendaWeek';
    }
    $scope.settings.calendar_view = 'day';
    $scope.calendar || ($scope.calendar = $('#calendar').fullCalendar($scope.calendar_options));
    $scope.calendar;
  });

  $scope.createVisit = function(){
    let request = {
      visit_data: $scope.new_visit,
      patient_data: $scope.new_patient
    };
    Visits.create({visit: request}).$promise.then(function(result){
      let last_id = $scope.event_id - 1;
      let events  = $('#calendar').fullCalendar('clientEvents');
      let last_event = undefined;

      for (let event of events)
        if (event._id == last_id)
          last_event = event;
      if (last_event == undefined)
        return;

      last_event.saved = true;
      last_event.real_id = result.id
      $('#calendar').fullCalendar('updateEvent', last_event);
    });
  }

  $('body').addClass('cal_header_mod');
  $('body').addClass('cal_body_mod');
  $scope.$on('$destroy', function() {
    $('body').removeClass('cal_header_mod');
    return $('body').removeClass('cal_body_mod');
  });

  setTimeline();

  function view_render(view, element) {
    if (view.name === 'agendaDay') {
      $scope.settings.calendar_view = 'day';
    } else {
      $scope.settings.calendar_view = 'week';
    }
    Settings.saveSettings($scope.settings);
    return $('.calendarHolder').toggleClass('day_mode', 'agendaDay' === view.name);
  };

  function event_drop(event, delta, revertFunc, jsEvent, ui, view) {
    event.start_at = event.start;
    event.duration = (event.end - event.start) / 60 / 1000;
    event.$save();
  };

  function event_resize(event, delta, revertFunc) {
    event.start_at = event.start;
    event.duration = (event.end - event.start) / 60 / 1000;
    Visits.save({id: event.real_id, visit: {visit_data: {start_at: event.start_at, duration: event.duration}}});
  };

  function event_click(event, jsEvent, view) {
    _debug('wtf');
    $scope.$apply(function() {
      $scope.event = event;
    });
  };

  function visits_by_date(start, end, timezone, callback) {
    end.add('14', 'days');
    let colors = {"1": "#3eb6e3", "2": "#30c36d", "3": "#f63f3f", "4": "#f5cd1d"};
    var paket = {
      start: start.format(),
      end: end.format()
    };
    return Visits.query(paket).$promise.then(function(events) {
      var date_now, i, len;
      date_now = moment(new Date);
      var date_events = [];
      for (i = 0, len = events.length; i < len; i++) {
        event = {};
        event.start = moment(events[i].start);
        event.end = moment(events[i].end);
        event.saved = true;
        event.color = colors[events[i].patient.cart_color];
        event.id = $scope.event_id;
        event.real_id = events[i].id
        $scope.event_id++;
        $scope.event = event;
        date_events.push(event);
      }
      $scope.events_count = events.length;
      return callback(date_events);
    });
  };

  function day_click(date, jsEvent, view) {
    let monts = {
      "January": "января",
      "February": "февраля",
      "March": "марта",
      "April": "апреля",
      "May": "мая",
      "June": "июня",
      "July": "июля",
      "August": "августа",
      "September": "Сентября",
      "October": "октября",
      "November": "ноября",
      "December": "декабря"
    }
    $scope.clicks++;
    return setTimeout(function() {
      var newEventDate;
      if ($scope.clicks == 2) {
        $scope.$apply(function(){
          let stDuration = $scope.settings.standart_shedule_interval;
          $scope.new_visit.duration = stDuration;
          $scope.new_patient.full_name = "";
          $scope.new_patient.phone = "";
          $scope.new_patient.email = "";
          $scope.new_visit.comment = "";
          $scope.new_patient.cart_color = "1";
          $scope.new_visit.start_at = moment(date);
          event = {
            start: moment(date),
            end: moment(date).add(parseInt(stDuration), 'm'),
            saved: false,
            color: "#3eb6e3"
          };
          event.id = $scope.event_id;
          $scope.event = event;
          $scope.event_id++;
          $($scope.calendar).fullCalendar('renderEvent', event);
          $scope.add_patient_form || ($scope.add_patient_form = $('#add_patient_form').dialog({
            autoOpen: false,
            modal: true,
            width: 360,
            dialogClass: 'dialog_v1 no_close_mod'
          }));
          $($scope.add_patient_form).find('form')[0].reset();
          $($scope.add_patient_form).find('#visit_date').val(date.format());
          $($scope.add_patient_form).find('.newPatientBtn span').text('Записать на ' + date.format('DD') + ' ' + monts[date.format('MMMM')] + ', в ' + date.format('HH:mm'));
          newEventDate = date;
          $scope.add_patient_form.dialog('option', 'position', {
            my: 'left+15 top-150',
            of: jsEvent,
            collision: 'flip fit',
            within: '.fc-view-container',
            using: function(obj, info) {
              var cornerY, dialog_form;
              dialog_form = $(this);
              cornerY = jsEvent.pageY - obj.top - 40;
              if (info.horizontal !== 'left') {
                dialog_form.addClass('flipped_left');
              } else {
                dialog_form.removeClass('flipped_left');
              }
              dialog_form.css({
                left: obj.left + 'px',
                top: obj.top + 'px'
              }).find('.form_corner').css({
                top: Math.min(Math.max(cornerY, -20), dialog_form.height() - 55) + 'px'
              });
            }
          }).dialog('open');

          $('#shedule_stand_time').val(stDuration);
          $('.chosen-select').chosen({
            width: '100%',
            disable_search_threshold: 3
          }).on('chosen:showing_dropdown', function(evt, params) {
            var firedEl, niceScrollBlock;
            firedEl = $(evt.currentTarget);
            niceScrollBlock = firedEl.next('.chzn-container').find('.chzn-results');
            if (niceScrollBlock.getNiceScroll().length) {
              return niceScrollBlock.getNiceScroll().resize().show();
            } else {
              niceScrollBlock.niceScroll({
                cursorwidth: 4,
                cursorborderradius: 2,
                cursorborder: 'none',
                bouncescroll: false,
                autohidemode: false,
                horizrailenabled: false,
                railsclass: firedEl.data('rails_class'),
                railpadding: {
                  top: 0,
                  right: 0,
                  left: 0,
                  bottom: 0
                }
              });
            }
          });
        });
      }
      return $scope.clicks = 0;
    }, 200);
  };

  function getCalendarHeight(win) {
    var newHeight;
    newHeight = win.height() + (win.width() > 1200 ? 40 : -50) - ($('.wrapper').css('paddingTop').replace('px', '') * 1);
    return Math.max(newHeight, 300);
  };

  function setTimeline() {
    var curCalView, curSeconds, curTime, dayEnd, dayStart, parentDiv, percentOfDay, slats, timeline, topLoc;
    parentDiv = $('.fc-agenda-view');
    slats = parentDiv.find('.fc-slats');
    timeline = parentDiv.find('.timeline');
    if (timeline.length === 0) {
      timeline = $('<div />').addClass('timeline').append('<span />');
      parentDiv.find('.fc-slats').append(timeline);
    }
    curTime = new Date;
    timeline.find('span').text(moment(curTime).format('HH:mm'));
    curCalView = $(calendar).fullCalendar('getView');
    dayEnd = moment(22, 'HH').minutes(15)._d.toString().replace(/00:00:00/i, slats.find('tr:last').attr('data-time'));
    dayStart = moment(5, 'HH').minutes(45)._d.toString().replace(/00:00:00/g, slats.find('tr:first').attr('data-time'));
    timeline.toggle(moment(dayStart).isBefore(moment(curTime)) && moment(curTime).isBefore(moment(dayEnd)));
    curTime = moment(curTime);
    curSeconds = (curTime.hours() - 5) * 60 * 60 + (curTime.minutes() - 45) * 60 + curTime.seconds();
    percentOfDay = curSeconds / moment(dayEnd).diff(dayStart, 's');
    topLoc = Math.floor(parentDiv.find('.fc-body .fc-slats').height() * percentOfDay);
    timeline.css({
      'top': topLoc + 'px',
      'left': curCalView.axisWidth + 'px'
    });
    $('.active-day').removeClass('active-day');
    // clearInterval($scope.timelineInterval);
    // $scope.timelineIntervaltimelineInterval = setInterval(setTimeline, 60 * 1000);
    setTimeout(function() {
      // if ($scope.timelineIntervaltimelineInterval !== undefined) {
	setTimeline();
      // }
    }, 1000);
  };

}

angular.module('practice.doctor').controller('ScheduleController', ['$scope', '$compile', 'Visits', 'Settings', 'ValueList', ScheduleController]);
