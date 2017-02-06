function ScheduleController($scope, $compile, Visits, Visit, Patients, Settings, ValueList, Doctor, ChangeTime) {
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
    monthNamesShort: ['Янв.', 'Фев.', 'Март', 'Апр.', 'Май', 'Июнь', 'Июль', 'Авг.', 'Сент.', 'Окт.', 'Ноя.', 'Дек.'],
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
    eventAfterAllRender: event_after_all_render,
    events: visits_by_date
    // events: visits_by_date,
    // eventRender: event_render
  };

  function activateFirstEvent(){
    var events = $('#calendar').fullCalendar('clientEvents');
    var event = getMinEvent(events);
    // _.map(events, function(e) {
    //   console.log(e.title + ' ' + e.start.toISOString());
    // });
    // console.log(event);
    if (event) {
      set_event(event);
    }
  }

  function event_after_all_render(view){
    console.log('event_after_all_render');
    // console.log(view);
    if (activate_first_event) {
      activate_first_event = false;
      activateFirstEvent();
    }
  }

  function event_render(event, element){
    // element.find('.fc-event-title').append("<br/>" + event.description);
    // element.find('.fc-content').append("<br/>" + 'test');
    // element.find('.fc-content').append('<div>test</div>');
  }

  Doctor.get().$promise.then(function(response) {
    $scope.doctor = response;
    if (!response.has_visits) {
      init_first_run_patients();
    }
  });

  $scope.time_list = ChangeTime.make_time_list($scope);

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
    $('#calendar').fullCalendar('updateEvent', last_event);
  });

  $scope.$watch('new_patient.cart_color', function(newValue, oldValue){
    if (!oldValue && newValue) {
      $scope.$evalAsync(function() {
        card_color_chosen($('#add_patient_form .chosen-select')[0]);
      });
    }
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

  function set_event(event) {
    $scope.event = event;
    $scope.patient = event.patient;
  }

  $scope.createVisit = function($valid) {
    if ($valid) {
      var request = {
        visit_data: $scope.new_visit,
        patient_data: $scope.new_patient,
        completed_patient: $scope.completed_patient
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
          last_event.title = getEventTitle(event);
          $('#calendar').fullCalendar('updateEvent', last_event);
          set_event(last_event);
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
    var event = find_event($scope.event.id);
    Patients.save({id: event.patient.id, cart_color: event.patient.cart_color});
    $scope.set_last_event = event;
    $('#calendar').fullCalendar('refetchEvents');
  }

  $scope.update_created_by = function() {
    if (confirm('Подтвердить прием?')) {
      var event = $scope.event;
      if (event == undefined)
        return;
      $scope.patient.last_visit.created_by = 'doctor';
      // $('#calendar').fullCalendar('updateEvent', event);
      Visits.save({id: event.real_id, visit: {visit_data: {created_by: 'doctor'}}});
    }
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

  var activate_first_event;

  function view_render(view, element) {
    activate_first_event = true;
    if (view.name === 'agendaDay') {
      $scope.settings.calendar_view = 'day';
    } else {
      $scope.settings.calendar_view = 'week';
    }
    Settings.saveSettings($scope.settings);
    $('.calendarHolder').toggleClass('day_mode', 'agendaDay' === view.name || 'agendaWeek' === view.name);
    $scope.event = null;
    $scope.patient = null;
  };

  function event_drop(event, delta, revertFunc, jsEvent, ui, view) {
    set_event(event);
    event.start_at = event.start;
    event.duration = (event.end - event.start) / 60 / 1000;
    Visits.save({id: event.real_id, visit: {visit_data: {start_at: event.start_at, duration: event.duration}}}).$promise.then(function() {
      // Refetch because we need to update patient.last_visit value in
      // this event and all other events of this patient in calendar
      // view.
      $scope.set_last_event = event;
      $('#calendar').fullCalendar('refetchEvents');
    });
  };

  function event_resize(event, delta, revertFunc) {
    event.start_at = event.start;
    event.duration = (event.end - event.start) / 60 / 1000;
    Visits.save({id: event.real_id, visit: {visit_data: {start_at: event.start_at, duration: event.duration}}});
  };

  function event_click(event, jsEvent, view) {
    $scope.$apply(function() {
      set_event(event);
    });
  };

  function getEventTitle(event){
    if (event.patient) {
      var formattedPhone = null;
      if (event.patient.phone) {
        formattedPhone = formatPhone(event.patient.phone);
      }
      var data = [event.patient.full_name, formattedPhone];
      return _.filter(data, function(e) { return e }).join(' ');
    }
  }

  function getMinEvent(events){
    var events_in_interval = _.filter(events, function(e){
      if (e.start < $('#calendar').fullCalendar('getView').intervalEnd &&
          e.end > $('#calendar').fullCalendar('getView').intervalStart) {
        return e;
      }
    });
    if (events_in_interval.length) {
      return _.sortBy(events_in_interval, 'start')[0];
    }
  }

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
        var event = {};
        event.start = moment(events[i].start);
        event.end = moment(events[i].end);
        event.saved = true;
        // console.log(events);
        // console.log(i);
        // console.log(events[i]);
        if (events[i].patient) {
          set_event_color(event, events[i].patient.cart_color);
        }
        event.id = $scope.event_id;
        event.real_id = events[i].id;
        event.orig_event = events[i];
        event.patient = events[i].patient;
        event.title = getEventTitle(event);
        $scope.event_id++;
        date_events.push(event);
      }
      if ($scope.set_last_event) {
        if (event = _.find(date_events, function(e) { return $scope.set_last_event.real_id == e.real_id })){
          set_event(event);
        }
        $scope.set_last_event = null;
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

  function calendar_centerX(){
    var $this = $('.fc-time-grid');
    var offset = $this.offset();
    var width = $this.width();
    var centerX = offset.left + width / 2;
    return centerX;
  }

  function calendar_centerY(){
    var $this = $('.fc-view-container');
    // var $this = $('.fc-time-grid');
    var offset = $this.offset();
    var height = $this.height();
    var centerY = offset.top + height / 2;
    return centerY;
  }

  function calendar_center_click(){
    var e;
    e = new jQuery.Event( "mousedown", { which: 1 } );
    e.pageX = calendar_centerX();
    e.pageY = calendar_centerY();
    $('.fc-time-grid').trigger(e);
    e = new jQuery.Event( "mouseup", { which: 1 } );
    e.pageX = calendar_centerX();
    e.pageY = calendar_centerY();
    $('.fc-time-grid').trigger(e);
  }

  $scope.first_run_patients_new_event = function() {
    $('#first_run_patients').dialog('close');
    calendar_center_click();
    // scroll_calendar();
    // day_click(moment(), e);
  }

  $scope.inspectNewPatientPhone = function($event){
    // console.log('inspect ' + $scope.new_patient + ' ' + $scope.new_patient.phone + ' ' + $($event.target).val());
  }

  function day_click(date, jsEvent, view) {
    $scope.clicks++;
    return setTimeout(function() {
      var newEventDate;
      if ($scope.clicks == 1) {
        $scope.$apply(function(){
          var stDuration = $scope.settings.standart_shedule_interval;
          $scope.removeCompletedPatient();
          $scope.new_patient_phone_input = null;
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
            color: "#3eb6e3",
            saved: false
          };

          event.id = $scope.event_id;
          // set_event(event);
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
            },
            open: function() {
              setTimeout(function() {
                $('#new_patient_name').focus();
              }, 420); // After 420 ms
            }
          }).dialog('open');
          $('#shedule_stand_time').val(stDuration);
        });
      }
      return $scope.clicks = 0;
    }, 0);
  };

  $scope.$on('$destroy', function(){
    // console.log('destroy');
    if ($scope.add_patient_form){
      $scope.add_patient_form.dialog('destroy');
    }
    $('.ui-dialog #first_run_patients').dialog('destroy');
    $('.ui-dialog #change_reception_form').dialog('destroy');
  });

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

  $scope.change_reception_time_apply = function(){
    if (!ChangeTime.change_reception_time_valid()) {
      return;
    }
    var visit = $scope.change_reception_visit;
    visit.start_at = ChangeTime.get_change_reception_time_moment();
    visit.duration = ChangeTime.get_change_reception_time_duration();

    var event, start_at, duration;

    event = find_event($scope.event.id);
    start_at = moment(visit.start_at);
    duration = visit.duration.toString();
    Visits.save({id: event.real_id, visit: {visit_data: {start_at: visit.start_at, duration: visit.duration}}});

    event.start = moment(visit.start_at);
    event.end = moment(visit.start_at).add(parseInt(visit.duration), 'm');;

    $('#calendar').fullCalendar('updateEvent', event);
    $('#change_reception_form').dialog('close');
  }

  $scope.changeReceptionTimeClick = function(event, visit) {
    $scope.change_reception_visit = visit;
    ChangeTime.changeReceptionTimeRun.call(event.currentTarget, $scope);
    return false;
  }

  ChangeTime.initReceptionForm();

  function normalizeFormattedPhone(phone){
    if (typeof phone === 'string') {
      return phone.replace(/\+(.) \((...)\) (...)-(..)-(..)/, '$1$2$3$4$5').replace(/_/g, '');
    }
  }

  $scope.myOption2 = function(model) {
    return {
    options: {
      position: {
        collision: 'none'
      },
      source: function (request, response) {
        var search = {};
        if (model == 'phone') {
          search[model] = normalizeFormattedPhone(request.term);
          if (search[model] == '') return [];
        } else {
          search[model] = request.term;
        }
        return Patients.autocomplete(search).$promise.then(function(patients) {
          $scope.completions = patients;
          response(_.map(patients, function(e) {
            if (model == 'phone') {
              return {label: formatPhone(e[model]), value: e[model]};
            } else {
              return e[model];
            }
          }));
        });
      },
      select: function (event, ui) {
        event.preventDefault()
        $scope.completed_patient = _.find($scope.completions, function(e) {
          return e[model] == ui.item.value;
        });
        $scope.updateCompletedPatient();
      }
    },
    methods: {}
    }
  };

  $scope.updateCompletedPatient = function() {
    $scope.new_patient.full_name = $scope.completed_patient.full_name;
    $scope.new_patient.phone = $scope.completed_patient.phone;
    $scope.new_patient.email = $scope.completed_patient.email;
    $scope.new_patient.cart_color = $scope.completed_patient.cart_color;
    $('.newPatientState').prop('disabled', true);
    $scope.new_patient_phone_input = $scope.completed_patient.phone;
    $scope.$apply();
    $('.newPatientState').trigger("chosen:updated");
  }

  $scope.removeCompletedPatient = function() {
    $scope.completed_patient = null;
    // $scope.$apply();
    // console.log($('.newPatientState').prop('disabled'));
    $('.newPatientState').prop('disabled', false);
    $('.newPatientState').trigger("chosen:updated");
  }

  function init_first_run_patients(){
    $('#first_run_patients').dialog({
      autoOpen: true,
      modal: true,
      width: 325,
      closeText: '',
      appendTo: '.wrapper',
      dialogClass: "dialog_v2 dialog_close_butt_mod_1 dialog_green",
      open: function (event, ui) {
        body_var.addClass('overlay_v2');
      },
      close: function (event, ui) {
        body_var.removeClass('overlay_v2');
        $scope.doctor.start_screen_shown = true;
        Doctor.save({doctor: $scope.doctor});
      }
    });
  }

  $scope.inputIsEmpty = function($event){
    // console.log('input empty ' + $event.target + '' + $($event.target).val());
  }

  $scope.newPatientPhoneInputBlur = function($event){
    // console.log('blur');
    $scope.new_patient_phone_input = $($event.target).val();
  }

  $scope.deletePatient = function(patient) {
    if (confirm('Удалить пациента?')) {
      Patients.remove(patient).$promise.then(function(response) {
        $('#calendar').fullCalendar('refetchEvents');
        $scope.event = null;
      });
    }
  };

  $scope.unarchivate = function(patient) {
    patient.in_archive = false;
    Patients.save(patient).$promise.then(function(response) {
      $scope.set_last_event = event;
      $('#calendar').fullCalendar('refetchEvents');
    });
  };

  $scope.archivate = function(patient) {
    if (confirm('Отправить в архив?')) {
      patient.in_archive = true;
      Patients.save(patient).$promise.then(function(response) {
        $scope.set_last_event = event;
        $('#calendar').fullCalendar('refetchEvents');
      });
    }
  };

  // var node_modified = function(evt) {
  //   if(evt.attrName == 'value') {

  //   }
  // }
  // var test_close = document.getElementById('new_patient_name');
  // test_close.addEventListener('DOMAttrModified', node_modified, false);

  // var node = document.getElementById("new_patient_name");
  // Object.defineProperty(node, 'value', {
  //   set: function() {

  //     throw new Error('button value modified');
  //   }
  // });

  // // select the target node
  // var target = document.querySelector('#new_patient_name');

  // // create an observer instance
  // var observer = new MutationObserver(function(mutations) {
  //   mutations.forEach(function(mutation) {
  //   });
  // });

  // // configuration of the observer:
  // var config = { attributes: true, childList: true, characterData: true }

  // // pass in the target node, as well as the observer options
  // observer.observe(target, config);

  // // later, you can stop observing
  // // observer.disconnect();

  // setInterval(function(){

  // }, 1000);
}

angular.module('practice.doctor').controller('ScheduleController', ['$scope', '$compile', 'Visits', 'Visit', 'Patients', 'Settings', 'ValueList', 'Doctor', 'ChangeTime', ScheduleController]);
