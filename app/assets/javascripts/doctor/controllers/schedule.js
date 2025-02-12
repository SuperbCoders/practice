function ScheduleController($scope, $rootScope, $timeout, $compile, Visits, Visit, Patients, Settings, ValueList, Doctor, ChangeTime, ngDialog) {
  $scope.items_limit = 100;
  $scope.filters = {};
  $scope.win = $(window);
  $scope.clicks = 0;
  $scope.chosen_activated = false;
  $scope.event_id = 0;
  $scope.calendarHolder = $('.calendarHolder');
  $scope.new_patient = {};
  $scope.new_visit = {duration: undefined};
  $scope.min_time = "05:45:00";
  $scope.max_time = "22:15:00";
  $scope.slot_duration = '00:15:00';
  $scope.calendar_options = {
    firstDay: 1,
    minTime: $scope.min_time,
    maxTime: $scope.max_time,
    monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
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
    slotDuration: $scope.slot_duration,
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
    eventResize: event_resize,
    eventDragStart: event_drag_start,
    eventDrop: event_drop,
    dayClick: day_click,
    eventClick: event_click,
    viewRender: view_render,
    eventAfterAllRender: event_after_all_render,
    events: visits_by_date,
    eventRender: event_render
  };

  $scope.Visits = Visits;
  $scope.Doctor = Doctor;
  $scope.ngDialog = ngDialog;

  function activateFirstEvent(){
    var view = $('#calendar').fullCalendar('getView').name;
    if (view == 'agendaDay') {
      var events = $('#calendar').fullCalendar('clientEvents');
      var event = getMinEvent(events);
      if (event) {
        set_event(event);
      }
      $('#calendar').fullCalendar('rerenderEvents');
    }
  }

  function event_after_all_render(view){
    if (activate_first_event) {
      activate_first_event = false;
      activateFirstEvent();
    }
  }

  function event_render(event, element){
    if (event) {
      element.attr('data-event-id', event.id);
    }
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
    var colors = {"0": "status_blue", "1": "status_green", "2": "status_red", "3": "status_orange"};
    event.className = colors[color_value];
    console.log('set_event_color ' + event.real_id + ' ' + event.className);
  }

  $scope.$watch('new_patient.cart_color', function(new_value){
    var last_event = event_by_event_id();
    if (last_event == undefined)
      return;
    if (!new_value)
      return;
    // var colors = {"0": "#3eb6e3", "1": "#30c36d", "2": "#f63f3f", "3": "#f5cd1d"};
    // last_event.color = colors[new_value];
    console.log('watch new_patient.cart_color');
    set_event_color(last_event, new_value);
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
    if (response.calendar_view === 'week') {
      $scope.calendar_options.defaultView = 'agendaWeek';
    }
    $scope.settings.calendar_view = 'day';
    $scope.calendar || ($scope.calendar = $('#calendar').fullCalendar($scope.calendar_options));
    $scope.calendar;
  });

  function toggle_event_class(class_array, class_toggle, add_or_remove_flag) {
    if (typeof class_array == 'undefined') {
      class_array = [];
    }
    if (typeof class_array == 'string') {
      class_array = [class_array];
    }
    if (add_or_remove_flag) {
      if (!_.includes(class_array, class_toggle)) {
         class_array.push(class_toggle);
      }
    } else {
      _.remove(class_array, function(e) { return e == class_toggle });
    }
    return class_array;
  }

  function set_event(event, jsEvent) {
    $rootScope.$broadcast('schedulePatientChanged');
    if (event) {
      console.log('set_event ' + event.real_id);
    } else {
      console.log('set_event null');
    }
    $scope.set_last_event = event;
    $('#calendar .fc-event').removeClass('event_open');
    if (jsEvent) {
      $(jsEvent.currentTarget).addClass('event_open');
    }
    if ($scope.event) {
      console.log('toggle_event_class off ' + $scope.event.real_id);
      $scope.event.className = toggle_event_class($scope.event.className, 'event_open', false);
    }
    $scope.event = event;
    if (event) {
      $scope.patient = event.patient;
      console.log('toggle_event_class on ' + event.real_id);
      $scope.event.className = toggle_event_class($scope.event.className, 'event_open', true);
    } else {
      $scope.patient = null;
    }
    if ($($scope.calendar).fullCalendar('getView').name == 'agendaDay' && event) {
      $('.calendarHolder').addClass('day_mode');
    } else {
      $('.calendarHolder').removeClass('day_mode');
    }
  }

  $scope.createVisit = function($valid) {
    if ($valid) {
      var request = {
        visit_data: $scope.new_visit,
        patient_data: $scope.new_patient,
        completed_patient: $scope.completed_patient
      };
      Visits.create({visit: request}).$promise.then(function(result){
        console.log('create_visit ' + result.visit.id);
        $scope.set_last_event = {real_id: result.visit.id};
        refetchEvents(true);
        $scope.add_patient_form.dialog('close');
      });
    }
  }

  $scope.deleteThisVisit = function(event){
    if (confirm('Отменить прием?')) {
      return Visits.remove({id: event.real_id}).$promise.then(function(response) {
        // return $scope.visits = _.without($scope.visits, visit);
        set_event(null);
        refetchEvents();
        // In week/month view we need to close floating window because
        // it stops pointing out to event.
        if (!($($scope.calendar).fullCalendar('getView').name == 'agendaDay')) {
          $('#patient_info_form').dialog('close');
        }
      });
    }
  }

  $scope.deleteVisit = function(event){
    if (confirm('Отменить прием?')) {
      return Visits.remove({id: event.id}).$promise.then(function(response) {
        set_event(null);
        refetchEvents();
        // In week/month view we need to close floating window because
        // it stops pointing out to event.
        if (!($($scope.calendar).fullCalendar('getView').name == 'agendaDay')) {
          $('#patient_info_form').dialog('close');
        }
      });
    }
  }

  $scope.update_cart_color = function () {
    var event = find_event($scope.event.id);
    Patients.save({id: event.patient.id, cart_color: event.patient.cart_color});
    refetchEvents();
  }

  $scope.update_created_by = function() {
    if (confirm('Подтвердить прием?')) {
      var event = $scope.event;
      if (event == undefined)
        return;
      $scope.patient.last_visit.created_by = 'doctor';
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
    set_event(null);
  };

  function event_drag_start(event, jsEvent, ui, view){
    set_event(event);
  }

  function refetchEvents(keep_set_last_event){
    console.log('refetchEvents()');
    if (!keep_set_last_event) {
      $scope.set_last_event = $scope.event;
    }
    if ($scope.refetching) {
      console.log('events refetching now!');
      $scope.refetch_again = true;
    } else {
      $scope.refetching = true;
      console.log('-> refetchEvents');
      $('#calendar').fullCalendar('refetchEvents');
    }
  }

  function event_drop(event, delta, revertFunc, jsEvent, ui, view) {
    event.start_at = event.start;
    event.duration = (event.end - event.start) / 60 / 1000;
    Visits.save({id: event.real_id, visit: {visit_data: {start_at: event.start_at, duration: event.duration}}}).$promise.then(function() {
      // Refetch because we need to update patient.last_visit value in
      // this event and all other events of this patient in calendar
      // view.
      refetchEvents();
    });
  };

  function event_resize(event, delta, revertFunc) {
    set_event(event);
    event.start_at = event.start;
    event.duration = (event.end - event.start) / 60 / 1000;
    Visits.save({id: event.real_id, visit: {visit_data: {start_at: event.start_at, duration: event.duration}}}).$promise.then(function() {
      // Refetch because we need to update patient.last_visit value in
      // this event and all other events of this patient in calendar
      // view.
      refetchEvents();
    });
  };

  function event_click(event, jsEvent, view) {
    $scope.$apply(function() {
      set_event(event, jsEvent);
    });
    if (!(view.name == 'agendaDay')) {
      show_event(event, jsEvent);
    }
  };

  function init_patient_info_form(){
    if (!$scope.patient_info_form){
      $scope.patient_info_form = $('#patient_info_form').dialog({
        autoOpen: false,
        modal: true,
        width: 360,
        appendTo: '.dayInfoBlock',
        dialogClass: "dialog_v1 no_close_mod no_title_mod",
        close: function (event, ui) {
          $('.event_open').removeClass('event_open');
        }
      });
    }
   }

  function show_event(event, e) {
    init_patient_info_form();
    var btn = $(this);
    $scope.patient_info_form.dialog("option", "position", {
      my: "left+15 top-150",
      of: e,
      collision: "flip fit",
      within: '.fc-view-container',
      using: function (obj, info) {
        var dialog_form = $(this),
            cornerY = e.pageY - obj.top - 190;
        if (info.horizontal != "left") {
          dialog_form.addClass("flipped_left");
        } else {
          dialog_form.removeClass("flipped_left");
        }
        dialog_form.css({
          left: (obj.left || 0) + 'px',
          top: obj.top + 'px'
        }).find('.form_corner').css({
          top: Math.min(Math.max(cornerY, -20), dialog_form.height() - 55) + 'px'
        });
      }
    }).dialog('open');
  }

  function getEventTitle(event){
    if (event.patient) {
      var formattedPhone = null;
      if (event.patient.phone) {
        formattedPhone = formatPhone(event.patient.phone);
      }
      var data = [event.patient.full_name, formattedPhone, event.real_id];
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
        event.id = $scope.event_id;
        event.real_id = events[i].id;
        console.log('visits_vy_date ' + event.real_id);
        if (events[i].patient) {
          console.log('set_event_color from visits_by_date');
          set_event_color(event, events[i].patient.cart_color);
        } else {
          console.log('set_event_color from visits_by_date no patient');
          set_event_color(event, '0');
        }
        event.orig_event = events[i];
        event.patient = events[i].patient;
        event.title = getEventTitle(event);
        $scope.event_id++;
        date_events.push(event);
      }
      if ($scope.set_last_event) {
        console.log('apply set_last_event ' + $scope.set_last_event.real_id);
        if (event = _.find(date_events, function(e) { return $scope.set_last_event.real_id == e.real_id })){
          set_event(event);
        }
        $scope.set_last_event = null;
      }
      $scope.events_count = events.length;
      console.log('<- refetchEvents');
      $scope.refetching = false;
      if ($scope.refetch_again) {
        $scope.refetch_again = false;
        refetchEvents();
      }
      console.log('date_events');
      console.log(date_events);
      return callback(date_events);
    });
  };

  function set_new_patient_button_text() {
    var date = $scope.new_visit.start_at;
    $($scope.add_patient_form).find('.newPatientBtn span').text('Записать на ' + formatDateAppointment(date));
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
  }

  $scope.inspectNewPatientPhone = function($event){
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
            className: ['status_blue', 'event_open'],
            saved: false
          };
          event.id = $scope.event_id;
          $scope.event_id++;
          $($scope.calendar).fullCalendar('renderEvent', event);
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
                $('#new_patient_n').focus();
              }, 420);
            }
          }).dialog('open');
          $('#shedule_stand_time').val(stDuration);
        });
      }
      return $scope.clicks = 0;
    }, 0);
  };

  $scope.$on('$destroy', function(){
    if ($scope.add_patient_form){
      $scope.add_patient_form.dialog('destroy');
    }
    $('.ui-dialog #first_run_patients').dialog('destroy');
    $('.ui-dialog #change_reception_form').dialog('destroy');
  });

  $scope.$on('notification', function(event, notification){
    var events  = $('#calendar').fullCalendar('clientEvents');
    var patients = [];
    for (var i = 0; i < events.length; ++i) {
      patients.push(events[i].patient);
    }
    for (var i = 0; i < patients.length; ++i) {
      if (patients[i].last_visit) {
        if (patients[i].last_visit.id == notification.visit.id){
          if (notification.notification_type == 'visit_soon') {
            patients[i].last_visit.active = true;
          } else if (notification.notification_type == 'visit_end') {
            patients[i].last_visit.active = false;
          }
        }
      }
    }
  });

  $scope.$on('refetchEvents', function(){
    var event = find_event($scope.event.id);
    refetchEvents();
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
    setTimeout(function() {
      setTimeline();
    }, 1000);
  };

  $scope.change_reception_time_apply = function(){
    if (!ChangeTime.change_reception_time_valid()) {
      return;
    }
    var visit = $scope.change_reception_visit;
    visit.start_at = ChangeTime.get_change_reception_time_moment();
    visit.duration = ChangeTime.get_change_reception_time_duration();
    Visits.save({id: visit.id, visit: {visit_data: {start_at: visit.start_at, duration: visit.duration}}}).$promise.then(function() {
      $('#change_reception_form').dialog('close');
      refetchEvents();
      // In week/month view we need to close floating window because
      // it stops pointing out to event.
      if (!($($scope.calendar).fullCalendar('getView').name == 'agendaDay')) {
        $('#patient_info_form').dialog('close');
      }
    });
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
  }

  $scope.newPatientPhoneInputBlur = function($event){
    $scope.new_patient_phone_input = $($event.target).val();
  }

  $scope.deletePatient = function(patient) {
    if (confirm('Удалить пациента?')) {
      Patients.remove(patient).$promise.then(function(response) {
        set_event(null);
        refetchEvents();
        if (!($($scope.calendar).fullCalendar('getView').name == 'agendaDay')) {
          $('#patient_info_form').dialog('close');
        }
      });
    }
  };

  $scope.unarchivate = function(patient) {
    patient.in_archive = false;
    Patients.save(patient).$promise.then(function(response) {
      refetchEvents();
    });
  };

  $scope.archivate = function(patient) {
    if (confirm('Отправить в архив?')) {
      patient.in_archive = true;
      Patients.save(patient).$promise.then(function(response) {
        refetchEvents();
      });
    }
  };

  $scope.openAppointmentsForm = function(patient) {
    $scope.patient = patient;
    ngDialog.open({
      template: 'appointments_form',
      controllerAs: 'vm',
      controller: 'DialogController',
      scope: $scope,
      className: 'ngdialog ngdialog-theme-default dialog_close_butt_mod_1',
      preCloseCallback: function(value) {
        refetchEvents();
        return true;
      }
    })
  };
}

angular.module('practice.doctor').controller('ScheduleController', ['$scope', '$rootScope', '$timeout', '$compile', 'Visits', 'Visit', 'Patients', 'Settings', 'ValueList', 'Doctor', 'ChangeTime', 'ngDialog', ScheduleController]);
