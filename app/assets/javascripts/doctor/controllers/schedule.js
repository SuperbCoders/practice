function ScheduleController($scope, $compile, Visits, Visit, Patients, Settings, ValueList) {
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
  $scope.min_time = "05:45:00";
  $scope.max_time = "22:15:00";
  $scope.slot_duration = '00:15:00';
  $scope.calendar_options = {
    firstDay: 1,
    minTime: $scope.min_time,
    maxTime: $scope.max_time,
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
    // titleFormat: {
    //   day: 'MMMM YYYY',
    //   week: 'MMMM YYYY'
    // },
    slotDuration: $scope.slot_duration,
    slotLabelInterval: '00:15:00',
    // slotDuration: '00:15:00',
    // // slotLabelInterval: '00:15:00',
    timezone: 'local',
    defaultView: 'agendaDay',
    weekMode: 'fixed',
    editable: true,
    // forceRigid: true,
    allDaySlot: false,
    eventOverlap: false,
    // handleWindowResize: false,
    slotLabelFormat: 'HH:mm',
    // slotLabelFormat: 'H:mm',
    timeFormat: 'H:mm',
    scrollTime: "08:45:00",
    defaultEventMinutes: 60,
    // views: {
    //   month: {
    //     eventLimit: 7,
    //     eventLimitClick: 'day',
    //     eventLimitText: function (evt) {
    //       return 'Еще ' + plural(evt, 'запись', 'записи', 'записей');
    //     }
    //   }
    // },
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

  function pad(n) {
    return (n < 10) ? ("0" + n) : n;
  }

  function make_time_list() {
    var duration = moment.duration($scope.slot_duration);
    var start = moment.duration($scope.min_time);
    var end = moment.duration($scope.max_time);
    var result = [];
    while (start <= end) {
      var val = pad(start.hours()) + ':' + pad(start.minutes());
      var view = start.hours() + ':' + pad(start.minutes());
      result.push({val: val, view: view});
      start = start.add(duration);
    }
    return result;
  }

  $scope.time_list = make_time_list();

  ValueList.getList("Стандартное время приема").then(function(response) {
    $scope.standartTimeIntervals = response.value_list_items;
  });

  function find_event(id) {
    var events  = $('#calendar').fullCalendar('clientEvents');
    var event = undefined;
    for (var i = 0; i < events.length; ++i) {
      if (events[i]._id == id)
        event = events[i];
    }
    return event;
  }

  function event_by_event_id() {
    var last_id = $scope.event_id - 1;
    return find_event(last_id);
  }

  function set_event_color(event, color_value) {
    var colors = {"0": "#3eb6e3", "1": "#30c36d", "2": "#f63f3f", "3": "#f5cd1d"};
    event.color = colors[color_value];
  }

  $scope.$watch('new_patient.cart_color', function(new_value){
    var last_event = event_by_event_id();
    if (last_event == undefined)
      return;
    if (!new_value)
      return;
    var colors = {"0": "#3eb6e3", "1": "#30c36d", "2": "#f63f3f", "3": "#f5cd1d"};
    last_event.color = colors[new_value];
    console.log('test');
    $('#calendar').fullCalendar('updateEvent', last_event);
  });

  $scope.$watch('new_patient.cart_color', function(newValue, oldValue){
    if (!oldValue && newValue) {
      $scope.$evalAsync(function() {
        $scope.card_color_chosen($('#add_patient_form .chosen-select')[0]);
      });
    }
  });

  $scope.card_color_chosen = function (elem) {
    $(elem).chosen({
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
  }

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

  $scope.createVisit = function($valid){
    if ($valid) {
      var request = {
        visit_data: $scope.new_visit,
        patient_data: $scope.new_patient
      };
      Visits.create({visit: request}).$promise.then(function(result){
        var last_id = $scope.event_id - 1;
        var events  = $('#calendar').fullCalendar('clientEvents');
        var last_event = event_by_event_id();

        last_event.saved = true;
        last_event.real_id = result.visit.id
        Visit.get({id: result.visit.id}).$promise.then(function(event) {
          last_event.orig_event = event;
          last_event.patient = event.patient;
          $('#calendar').fullCalendar('updateEvent', last_event);
          $scope.event = last_event;
        });
        // $('#calendar').fullCalendar('refetchEvents');
        $scope.add_patient_form.dialog('close');
      });
    }
  }

  $scope.deleteVisit = function(event){
    if (confirm('Отменить прием?')) {
      return Visits.remove({id: event.real_id}).$promise.then(function(response) {
        // return $scope.visits = _.without($scope.visits, visit);
        $('#calendar').fullCalendar('refetchEvents');
        $scope.event = null;
      });
    }
  }

  $scope.update_cart_color = function () {
    var event = $scope.event;
    if (event == undefined)
      return;
    set_event_color(event, event.patient.cart_color);
    console.log('test');
    $('#calendar').fullCalendar('updateEvent', event);
    Patients.save({id: event.patient.id, cart_color: event.patient.cart_color});
  }

  $scope.$watch('event.patient.cart_color', function(newValue, oldValue) {
    if (!oldValue && newValue) {
      $scope.$evalAsync(function() {
        $('.patient_card .patient_status_w select').chosen({
          autohide_results_multiple: false,
          allow_single_deselect: true,
          width: "100%",
          className: "form_o_b_item form_o_b_value_edit_mode"
        });
      });
    }
    $scope.$evalAsync(function() {
      $('.patient_card .patient_status_w select').trigger('chosen:updated');
    });
  });

  $('body').addClass('cal_header_mod');
  $('body').addClass('cal_body_mod');

  $scope.$on('$destroy', function() {
    $('body').removeClass('cal_header_mod');
    $('body').removeClass('cal_body_mod');
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
    $scope.$apply(function() {
      $scope.event = event;
    });
  };

  function visits_by_date(start, end, timezone, callback) {
    end.add('14', 'days');
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
        set_event_color(event, events[i].patient.cart_color);
        event.id = $scope.event_id;
        event.real_id = events[i].id;
        event.orig_event = events[i];
        event.patient = events[i].patient;
        $scope.event_id++;
        console.log('scope event');
        $scope.event = event;
        console.log($scope.event);
        date_events.push(event);
      }
      $scope.events_count = events.length;
      return callback(date_events);
    });
  };

  function date_format(date) {
    var monts = {
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
    return date.format('DD') + ' ' + monts[date.format('MMMM')]
  }

  function set_new_patient_button_text() {
    var date = $scope.new_visit.start_at;
    $($scope.add_patient_form).find('.newPatientBtn span').text('Записать на ' + date_format(date) + ', в ' + date.format('HH:mm'));
  }

  function set_preview_patient_button_text() {
    // nichego delat ne nado tam tekst sa menyaetsa
    // var date = $scope.event.start_at;
    // throw
    // $($scope.add_patient_form).find('.newPatientBtn span').text('Записать на ' + date_format(date) + ', в ' + date.format('HH:mm'));
  }

  function day_click(date, jsEvent, view) {
    // console.log(date);
    $scope.clicks++;
    return setTimeout(function() {
      var newEventDate;
      if ($scope.clicks == 1) {
        $scope.$apply(function(){
          var stDuration = $scope.settings.standart_shedule_interval;
          $scope.new_visit.duration = stDuration;
          $scope.new_patient.full_name = "";
          $scope.new_patient.phone = "";
          $scope.new_patient.email = "";
          $scope.new_visit.comment = "";
          $scope.new_patient.cart_color = "0";
          $scope.new_visit.start_at = moment(date);
          event = {
            start: moment(date),
            end: moment(date).add(parseInt(stDuration), 'm'),
            saved: false,
          };
          // console.log(event.start);
          event.id = $scope.event_id;
          // $scope.event = event;
          $scope.event_id++;
          $($scope.calendar).fullCalendar('renderEvent', event);
          // $($scope.calendar).fullCalendar('updateEvent', event);
          $scope.add_patient_form || ($scope.add_patient_form = $('#add_patient_form').dialog({
            autoOpen: false,
            modal: true,
            width: 340,
            dialogClass: 'dialog_v1 no_close_mod'
          }));
          $($scope.add_patient_form).find('form')[0].reset();
          $($scope.add_patient_form).find('#visit_date').val(date.format());
          set_new_patient_button_text();
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
        });
      }
      return $scope.clicks = 0;
    }, 0);
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
    curCalView = $($scope.calendar).fullCalendar('getView');
    dayEnd = moment(22, 'HH').minutes(15)._d.toISOString().replace(/00:00:00/i, slats.find('tr:last').attr('data-time'));
    dayStart = moment(5, 'HH').minutes(45)._d.toISOString().replace(/00:00:00/g, slats.find('tr:first').attr('data-time'));
    // dayStart = curTime;
    // dayEnd = curTime;
    // console.log(JSON.stringify(dayStart));
    // console.log(JSON.stringify(curTime));
    // console.log(JSON.stringify(dayEnd));
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

  function initChangeReceptionTime() {
    // $("#change_reception_time").click(function(){
    //   $("#change_reception_time_internal").datepicker('show');
    // });
    // $("#change_reception_time_internal").datepicker({
    $("#change_reception_time").datepicker({
      altField: '#change_reception_time_internal',
      altFormat: 'yy-mm-dd',
      // beforeShow: function(){
      // },
      firstDay: 1,
      // changeMonth: true,
      // changeYear: true,
      yearRange: '1920:2016',
      dateFormat: 'd MM',
      showOn: 'focus',
      //changeYear: $changeYear,
      defaultDate: +1,
      numberOfMonths: 1,
      showOtherMonths: true,
      unifyNumRows: true,
      //buttonImage: $buttonImage,
      //showOn: "both",
      nextText: '',
      prevText: '',
      monthNames: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
      monthNamesShort: ["Янв", "Фев", "Март", "Апр", "Май", "Июнь", "Июль", "Авг", "Сен", "Окт", "Ноя", "Дек"],
      dayNames: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
      dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      beforeShow: function (inp, dp) {

        // $("#change_reception_time").append($(dp.dpDiv));
        $(inp).parent().addClass('dp_opened');

        // console.log('show');
        // $(dp).datepicker('setDate', new Date(2008,9,03));
        // console.log(dp);
        // $(dp.dpDiv).datepicker('setDate', new Date(2008,9,03));

        $(dp.dpDiv).addClass('change_time_mod');

      },
      onClose: function (inp, dp) {
        // console.log(inp, dp);
        $(dp.input).parent().removeClass('dp_opened');
      }
    });

    $('#change_reception_form').dialog({
      autoOpen: false,
      modal: true,
      width: 240,
      dialogClass: "no_close_mod "
    });
  }

  function shortDate(date) {
    var months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    return moment(date).date() + ' ' + months[moment(date).month()];
  }

  function get_change_reception_time_moment(){
    var date = $('[name="change_reception_form[date]"]').val();
    var start = $('[name="change_reception_form[start]"]').val();
    var end = $('[name="change_reception_form[end]"]').val();
    // var val = '' + date + ' ' + start +'Z';
    var val = '' + date + ' ' + start;
    // console.log(val);
    // return moment.utc(val);
    return moment(val);
  }

  function get_change_reception_time_duration(){
    var start = $('[name="change_reception_form[start]"]').val();
    var end = $('[name="change_reception_form[end]"]').val();
    var val = moment.duration(moment.duration(end) - moment.duration(start));
    // console.log(val.asMinutes());
    return val.asMinutes();
  }

  function is_new_visit(visit) {
    if (visit.id) {
      return false;
    } else {
      return true;
    }
  }

  function update_reception_button_text() {
    if (is_new_visit($scope.change_reception_visit)) {
      set_new_patient_button_text();
    } else {
      set_preview_patient_button_text();
    }
  }

  function change_reception_time_valid() {
    // console.log(get_change_reception_time_duration());
    // console.log(get_change_reception_time_duration() > 0);
    return get_change_reception_time_duration() > 0;
  }

  $scope.change_reception_time_apply = function(){
    if (!change_reception_time_valid()) {
      return;
    }

    // console.log('update');
    var visit = $scope.change_reception_visit;
    visit.start_at = get_change_reception_time_moment();
    // console.log(visit.start_at);
    visit.duration = get_change_reception_time_duration();
    update_reception_button_text();
    var event, start_at, duration;
    if (is_new_visit(visit)) {
      console.log('new_visit');
      event = event_by_event_id();
      console.log(event);
      start_at = event.start_at;
      duration = event.duration;
    } else {
      console.log('event');
      event = find_event($scope.event.id);
      console.log(event);
      // console.log(event.start_at);
      // console.log(event.duration);
      start_at = moment(visit.start_at);
      duration = visit.duration.toString();
      Visits.save({id: event.real_id, visit: {visit_data: {start_at: visit.start_at, duration: visit.duration}}});
    }
    event.start = moment(visit.start_at);
    event.end = moment(visit.start_at).add(parseInt(visit.duration), 'm');;
    console.log('test');
    $('#calendar').fullCalendar('updateEvent', event);
    $('#change_reception_form').dialog('close');
  }

  function initReceptionFields() {
    var visit = $scope.change_reception_visit;
    var start_at, duration;
    console.log('test fail');
    if (is_new_visit(visit)) {
      console.log('new_visit');
      console.log(visit);
      start_at = visit.start_at;
      duration = visit.duration;
    } else {
      console.log('event1');
      console.log(visit);
      start_at = moment(visit.start_at);
      duration = visit.duration.toString();
    }
    $('#change_reception_time').val(shortDate(start_at));
    $('#change_reception_time_internal').val(moment(start_at).format('YYYY-MM-DD'));
    var start = start_at.format('HH:mm');
    // console.log(start);
    $('[name="change_reception_form[start]"] option[value="' + start + '"]').prop('selected', true);
    $('[name="change_reception_form[start]"]').trigger('chosen:updated');
    var end = start_at.add(duration, 'm').format('HH:mm');
    // console.log(end);
    $('[name="change_reception_form[end]"] option[value="' + end + '"]').prop('selected', true);
    $('[name="change_reception_form[end]"]').trigger('chosen:updated');
  }

  $scope.changeReceptionTimeClick = function(event, visit) {
    console.log('click');
    console.log(visit);
    $scope.change_reception_visit = visit;
    changeReceptionTimeRun.call(event.currentTarget);
    return false;
  }

  function changeReceptionTimeRun() {
      initReceptionFields();

    console.log(this);
      var firedEl = $(this), target = firedEl;

      $('#change_reception_form').dialog("option", "position", {
        my: "left bottom-25",
        at: 'right center',
        of: target,
        collision: "flip flip",
        // within: firedEl.parent(),
        using: function (obj, info) {
          var dialog_form = $(this), koef = 15;

          if (target.offset().top - obj.top < 25) {
            dialog_form.addClass("flipped_top");
            koef = 0;

            if (target.hasClass('patient_btn')) {
              koef = 40;
            }

          } else {
            dialog_form.removeClass("flipped_top");
          }

          dialog_form.css({
            opacity: 0,
            left: (target.offset().left + (target.width() - dialog_form.width()) / 2) + 'px',
            top: (obj.top - target.height() + koef + 20) + 'px'
          });

          setTimeout(function () {
            dialog_form.animate({opacity: 1, top: (obj.top - target.height() + koef + 10)}, 200);
          }, 5);

        }
      }).dialog('open');
  }

  function initChangeReceptionTimeClick() {
    // $('.changeReceptionTime').on('click', function (jsEvent) {

      // return false;
    // });
  }

  $scope.initReceptionForm = function () {
    initChangeReceptionTime();
    initChangeReceptionTimeClick();
  }

  $scope.initReceptionForm();
}

angular.module('practice.doctor').controller('ScheduleController', ['$scope', '$compile', 'Visits', 'Visit', 'Patients', 'Settings', 'ValueList', ScheduleController]);
