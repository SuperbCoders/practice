// var ScheduleController, Settings, calendar, clicks, event, event_id, setTimeline, settings, timelineInterval;

// settings = {};

// clicks = 0;

// calendar = {};

// event = {};

// timelineInterval = 1;

// event_id = 0;

// setTimeline = function() {
//   var curCalView, curSeconds, curTime, dayEnd, dayStart, parentDiv, percentOfDay, slats, timeline, topLoc;
//   parentDiv = $('.fc-agenda-view');
//   slats = parentDiv.find('.fc-slats');
//   timeline = parentDiv.find('.timeline');
//   if (timeline.length === 0) {
//     timeline = $('<div />').addClass('timeline').append('<span />');
//     parentDiv.find('.fc-slats').append(timeline);
//   }
//   curTime = new Date;
//   timeline.find('span').text(moment(curTime).format('HH:mm'));
//   curCalView = $(calendar).fullCalendar('getView');
//   dayEnd = moment(22, 'HH').minutes(15)._d.toString().replace(/00:00:00/i, slats.find('tr:last').attr('data-time'));
//   dayStart = moment(5, 'HH').minutes(45)._d.toString().replace(/00:00:00/g, slats.find('tr:first').attr('data-time'));
//   timeline.toggle(moment(dayStart).isBefore(moment(curTime)) && moment(curTime).isBefore(moment(dayEnd)));
//   curTime = moment(curTime);
//   curSeconds = (curTime.hours() - 5) * 60 * 60 + (curTime.minutes() - 45) * 60 + curTime.seconds();
//   percentOfDay = curSeconds / moment(dayEnd).diff(dayStart, 's');
//   topLoc = Math.floor(parentDiv.find('.fc-body .fc-slats').height() * percentOfDay);
//   timeline.css({
//     'top': topLoc + 'px',
//     'left': curCalView.axisWidth + 'px'
//   });
//   $('.active-day').removeClass('active-day');
//   clearInterval(timelineInterval);
//   timelineInterval = setInterval(setTimeline, 60 * 1000);
//   setTimeout(function() {
//     if (timelineInterval !== void 0) {
//       return setTimeline();
//     }
//   }, 1000);
// };

// function ScheduleController($scope, Visits, Settings1, ValueList) {
//   $scope.items_limit = 100;
//   $scope.filters = {};
//   $scope.win = $(window);
//   $scope.event_click = function(event, jsEvent, view) {
//     var vm;
//     vm = view.calendar.options.vm;
//     $scope.$apply(function() {
//       return $scope.event = event;
//     });
//   };

//   ValueList.getList("Стандартное время приема").then(function(response) {
//     return $scope.standartTimeIntervals = response.value_list_items;
//   });
//   $scope.new_patient = {};
//   $scope.calendarHolder = $('.calendarHolder');
//   // $scope.events || ($scope.events = [
//   //   {
//   //     start: moment(),
//   //     end: moment().add(1, 'day')
//   //   }
//   // ]);
//   $scope.patient = void 0;
//   $scope.event = void 0;
//   $scope.events_count = void 0;
//   $scope.calendar_options = {
//     firstDay: 1,
//     minTime: "05:45:00",
//     maxTime: "22:15:00",
//     monthName: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
//     monthNamesShort: ['Янв.', 'Фев.', 'Март', 'Апр.', 'Май', 'οюнь', 'οюль', 'Авг.', 'Сент.', 'Окт.', 'Ноя.', 'Дек.'],
//     dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
//     dayNamesShort: ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'],
//     buttonText: {
//       prev: ' ',
//       next: ' ',
//       prevYear: 'Год назад',
//       nextYear: 'Год вперед',
//       today: 'Сегодня',
//       month: 'Месяц',
//       twoweek: '2 week',
//       week: 'Неделя',
//       day: 'День'
//     },
//     header: {
//       left: 'title',
//       center: 'agendaDay,agendaWeek',
//       right: 'prev,next'
//     },
//     columnFormat: {
//       month: 'ddd',
//       week: 'ddd, D',
//       day: 'dddd, D'
//     },
//     titleFormat: {
//       day: 'MMMM YYYY',
//       week: 'MMMM YYYY'
//     },
//     slotDuration: '00:15:00',
//     slotLabelInterval: '00:15:00',
//     timezone: 'local',
//     defaultView: 'agendaDay',
//     weekMode: 'fixed',
//     vm: vm,
//     editable: true,
//     allDaySlot: false,
//     eventOverlap: false,
//     slotLabelFormat: 'HH:mm',
//     timeFormat: 'H:mm',
//     scrollTime: "08:45:00",
//     defaultEventMinutes: 60,
//     defaultDate: $scope.regDate(),
//     height: getCalendarHeight($scope.win),
//     // eventMouseover: this.event_mouse_over,
//     // eventResize: this.event_resize,
//     // eventDrop: this.event_drop,
//     // dayClick: this.day_click,
//     eventClick: $scope.event_click,
//     viewRender: $scope.view_render,
//     events: $scope.visits_by_date
//   };
  
//   Settings.getSettings().then(function(response) {
//     settings = response;
//     setTimeout(function() {
//       if (isNaN(parseInt(settings.standart_shedule_interval)) || parseInt(settings.standart_shedule_interval) === 0) {
//         settings.standart_shedule_interval = prompt("Введите интервал приема", "15");
//         return Settings.saveSettings(settings);
//       }
//     }, 0);
//     if (response.calendar_view === 'week') {
//       $scope.calendar_options.defaultView = 'agendaWeek';
//     }
//     settings.calendar_view = 'day';
//     $scope.calendar || ($scope.calendar = $('#calendar').fullCalendar($scope.calendar_options));
//     return calendar = $scope.calendar;
//   });
//   $('body').addClass('cal_header_mod');
//   $('body').addClass('cal_body_mod');
//   $scope.$on('$destroy', function() {
//     $('body').removeClass('cal_header_mod');
//     return $('body').removeClass('cal_body_mod');
//   });
// }

// ScheduleController.prototype.toggle_patient_info = function() {
//   this.rootScope.toggle_el_class('.patient_card', 'open_card');
// };

// function getCalendarHeight(win) {
//   var newHeight;
//   newHeight = win.height() + (win.width() > 1200 ? 40 : -50) - ($('.wrapper').css('paddingTop').replace('px', '') * 1);
//   return Math.max(newHeight, 300);
// };

// ScheduleController.prototype.event_resize = function(event, delta, revertFunc) {
//   event.start_at = event.start;
//   event.duration = (event.end - event.start) / 60 / 1000;
//   event.$save();
// };

// ScheduleController.prototype.event_drop = function(event, delta, revertFunc, jsEvent, ui, view) {
//   event.start_at = event.start;
//   event.duration = (event.end - event.start) / 60 / 1000;
//   event.$save();
// };

// ScheduleController.prototype.day_click = function(date, jsEvent, view) {
//   var vm;
//   vm = this;
//   clicks++;
//   return setTimeout(function() {
//     var newEventDate;
//     if (clicks === 1) {
//       clicks = 0;
//     }
//     if (clicks === 2) {
//       event = {
//         start: date,
//         end: moment(date).add(parseInt(settings.standart_shedule_interval), 'm'),
//         saved: false
//       };
//       event.id = event_id;
//       event_id++;
//       $(calendar).fullCalendar('renderEvent', event);
//       $scope.add_patient_form || ($scope.add_patient_form = $('#add_patient_form').dialog({
//         autoOpen: false,
//         modal: true,
//         width: 360,
//         dialogClass: 'dialog_v1 no_close_mod'
//       }));
//       $($scope.add_patient_form).find('form')[0].reset();
//       $($scope.add_patient_form).find('#visit_date').val(date.format());
//       $($scope.add_patient_form).find('.newPatientBtn span').text('Записать на ' + date.format('DD') + ' ' + date.format('MMMM').toString().toLowerCase().replace(/.$/, 'я') + ', в ' + date.format('HH:mm'));
//       newEventDate = date;
//       $scope.add_patient_form.dialog('option', 'position', {
//         my: 'left+15 top-150',
//         of: jsEvent,
//         collision: 'flip fit',
//         within: '.fc-view-container',
//         using: function(obj, info) {
//           var cornerY, dialog_form;
//           dialog_form = $(this);
//           cornerY = jsEvent.pageY - obj.top - 40;
//           if (info.horizontal !== 'left') {
//             dialog_form.addClass('flipped_left');
//           } else {
//             dialog_form.removeClass('flipped_left');
//           }
//           dialog_form.css({
//             left: obj.left + 'px',
//             top: obj.top + 'px'
//           }).find('.form_corner').css({
//             top: Math.min(Math.max(cornerY, -20), dialog_form.height() - 55) + 'px'
//           });
//         }
//       }).dialog('open');
//       return clicks = 0;
//     }
//   }, 200);
// };

// ScheduleController.prototype.view_render = function(view, element) {
//   var vm;
//   vm = this;
//   if (view.name === 'agendaDay') {
//     settings.calendar_view = 'day';
//   } else {
//     settings.calendar_view = 'week';
//   }
//   Settings.saveSettings(settings);
//   return $('.calendarHolder').toggleClass('day_mode', 'agendaDay' === view.name);
// };

// angular.module('practice.doctor').controller('ScheduleController', ['$scope', 'Visits', 'Settings', 'ValueList', ScheduleController]);


var ScheduleController, Settings, calendar, clicks, event, event_id, setTimeline, settings, timelineInterval;

settings = {};

Settings = {};

clicks = 0;

calendar = {};

event = {};

timelineInterval = 1;

event_id = 0;

setTimeline = function() {
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
  clearInterval(timelineInterval);
  timelineInterval = setInterval(setTimeline, 60 * 1000);
  setTimeout(function() {
    if (timelineInterval !== void 0) {
      return setTimeline();
    }
  }, 1000);
};

ScheduleController = (function() {
  function ScheduleController(rootScope, scope, Visits, Settings1, ValueList) {
    var vm;
    this.rootScope = rootScope;
    this.scope = scope;
    this.Visits = Visits;
    this.Settings = Settings1;
    this.ValueList = ValueList;
    vm = this;
    vm.items_limit = 100;
    vm.filters = {};
    vm.Visits = this.Visits;
    vm.win = $(window);
    this.ValueList.getList("Стандартное время приема").then(function(response) {
      return vm.standartTimeIntervals = response.value_list_items;
    });
    vm.new_patient = {};
    vm.calendarHolder = $('.calendarHolder');
    vm.events || (vm.events = [
      {
        start: moment(),
        end: moment().add(1, 'day')
      }
    ]);
    vm.patient = void 0;
    vm.event = void 0;
    vm.events_count = void 0;
    Settings = this.Settings;
    vm.calendar_options = {
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
        center: 'agendaDay,agendaWeek',
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
      vm: vm,
      editable: true,
      allDaySlot: false,
      eventOverlap: false,
      slotLabelFormat: 'HH:mm',
      timeFormat: 'H:mm',
      scrollTime: "08:45:00",
      defaultEventMinutes: 60,
      defaultDate: vm.rootScope.regDate(),
      height: vm.getCalendarHeight(),
      eventMouseover: this.event_mouse_over,
      eventResize: this.event_resize,
      eventDrop: this.event_drop,
      dayClick: this.day_click,
      eventClick: this.event_click,
      viewRender: this.view_render,
      events: vm.visits_by_date
    };
    vm.Settings.getSettings().then(function(response) {
      settings = response;
      setTimeout(function() {
        if (isNaN(parseInt(settings.standart_shedule_interval)) || parseInt(settings.standart_shedule_interval) === 0) {
          settings.standart_shedule_interval = prompt("Введите интервал приема", "15");
          return Settings.saveSettings(settings);
        }
      }, 0);
      if (response.calendar_view === 'week') {
        vm.calendar_options.defaultView = 'agendaWeek';
      }
      settings.calendar_view = 'day';
      vm.calendar || (vm.calendar = $('#calendar').fullCalendar(vm.calendar_options));
      return calendar = vm.calendar;
    });
    $('body').addClass('cal_header_mod');
    $('body').addClass('cal_body_mod');
    this.scope.$on('$destroy', function() {
      $('body').removeClass('cal_header_mod');
      return $('body').removeClass('cal_body_mod');
    });
  }

  ScheduleController.prototype.makeNewPatient = function() {
    return console.log("hello world");
  };

  ScheduleController.prototype.event_click = function(event, jsEvent, view) {
    var vm;
    vm = view.calendar.options.vm;
    vm.rootScope.$apply(function() {
      return vm.event = event;
    });
  };

  ScheduleController.prototype.toggle_patient_info = function() {
    this.rootScope.toggle_el_class('.patient_card', 'open_card');
  };

  ScheduleController.prototype.visits_by_date = function(start, end, timezone, callback) {
    var paket, vm;
    vm = this.options.vm;
    end.add('14', 'days');
    paket = {
      start: start.format(),
      end: end.format()
    };
    return vm.Visits.query(paket).$promise.then(function(events) {
      var date_now, i, len;
      date_now = moment(new Date);
      for (i = 0, len = events.length; i < len; i++) {
        event = events[i];
        event.start = moment(event.start);
        event.end = moment(event.end);
        event.saved = true;
        event.id = event_id;
        event_id++;
        if (!vm.event) {
          if (event.start > date_now) {
            vm.event = event;
          }
        } else {
          if (event.start > date_now && event.start < vm.event.start) {
            vm.event = event;
          }
        }
      }
      vm.events_count = events.length;
      return callback(events);
    });
  };

  ScheduleController.prototype.getCalendarHeight = function() {
    var newHeight;
    newHeight = this.win.height() + (this.win.width() > 1200 ? 40 : -50) - ($('.wrapper').css('paddingTop').replace('px', '') * 1);
    return Math.max(newHeight, 300);
  };

  ScheduleController.prototype.event_resize = function(event, delta, revertFunc) {
    event.start_at = event.start;
    event.duration = (event.end - event.start) / 60 / 1000;
    event.$save();
  };

  ScheduleController.prototype.event_drop = function(event, delta, revertFunc, jsEvent, ui, view) {
    event.start_at = event.start;
    event.duration = (event.end - event.start) / 60 / 1000;
    event.$save();
  };

  ScheduleController.prototype.day_click = function(date, jsEvent, view) {
    var vm;
    vm = this;
    clicks++;
    return setTimeout(function() {
      var newEventDate;
      if (clicks === 1) {
        clicks = 0;
      }
      if (clicks === 2) {
        event = {
          start: date,
          end: moment(date).add(parseInt(settings.standart_shedule_interval), 'm'),
          saved: false
        };
        event.id = event_id;
        event_id++;
        $(calendar).fullCalendar('renderEvent', event);
        vm.add_patient_form || (vm.add_patient_form = $('#add_patient_form').dialog({
          autoOpen: false,
          modal: true,
          width: 360,
          dialogClass: 'dialog_v1 no_close_mod'
        }));
        $(vm.add_patient_form).find('form')[0].reset();
        $(vm.add_patient_form).find('#visit_date').val(date.format());
        $(vm.add_patient_form).find('.newPatientBtn span').text('Записать на ' + date.format('DD') + ' ' + date.format('MMMM').toString().toLowerCase().replace(/.$/, 'я') + ', в ' + date.format('HH:mm'));
        newEventDate = date;
        vm.add_patient_form.dialog('option', 'position', {
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
        return clicks = 0;
      }
    }, 200);
  };

  ScheduleController.prototype.event_save = function(event) {};

  ScheduleController.prototype.view_render = function(view, element) {
    var vm;
    vm = this;
    if (view.name === 'agendaDay') {
      settings.calendar_view = 'day';
    } else {
      settings.calendar_view = 'week';
    }
    Settings.saveSettings(settings);
    return $('.calendarHolder').toggleClass('day_mode', 'agendaDay' === view.name);
  };

  ScheduleController.prototype.event_mouse_over = function(event, jsEvent, view) {};

  return ScheduleController;

})();

angular.module('practice.doctor').controller('ScheduleController', ['$rootScope', '$scope', 'Visits', 'Settings', 'ValueList', ScheduleController]);
