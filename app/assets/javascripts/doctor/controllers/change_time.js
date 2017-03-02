angular.module('practice.doctor').

service('ChangeTime', [function() {
  this.pad = function(n) {
    return (n < 10) ? ("0" + n) : n;
  }

  this.make_time_list = function($scope) {
    var duration = moment.duration($scope.slot_duration);
    var start = moment.duration($scope.min_time);
    var end = moment.duration($scope.max_time);
    var result = [];
    while (start <= end) {
      var val = this.pad(start.hours()) + ':' + this.pad(start.minutes());
      var view = start.hours() + ':' + this.pad(start.minutes());
      result.push({val: val, view: view});
      start = start.add(duration);
    }
    return result;
  }

  var shortDate = function(date) {
    var months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    return moment(date).date() + ' ' + months[moment(date).month()];
  }

  this.get_change_reception_time_moment = function(){
    var date = $('[name="change_reception_form[date]"]').val();
    var start = $('[name="change_reception_form[start]"]').val();
    var end = $('[name="change_reception_form[end]"]').val();
    var val = '' + date + ' ' + start;
    return moment(val);
  }

  var get_change_reception_time_duration = function(){
    var start = $('[name="change_reception_form[start]"]').val();
    var end = $('[name="change_reception_form[end]"]').val();
    var val = moment.duration(moment.duration(end) - moment.duration(start));
    return val.asMinutes();
  }

  this.get_change_reception_time_duration = get_change_reception_time_duration;

  this.change_reception_time_valid = function() {
    return get_change_reception_time_duration() > 0;
  }

  this.initChangeReceptionTime = function() {
    $("#change_reception_time").datepicker({
      altField: '#change_reception_time_internal',
      altFormat: 'yy-mm-dd',
      firstDay: 1,
      yearRange: '1920:2016',
      dateFormat: 'd MM',
      showOn: 'focus',
      defaultDate: +1,
      numberOfMonths: 1,
      showOtherMonths: true,
      unifyNumRows: true,
      nextText: '',
      prevText: '',
      monthNames: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
      monthNamesShort: ["Янв", "Фев", "Март", "Апр", "Май", "Июнь", "Июль", "Авг", "Сен", "Окт", "Ноя", "Дек"],
      dayNames: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
      dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      beforeShow: function (inp, dp) {
        $(inp).parent().addClass('dp_opened');
        $(dp.dpDiv).addClass('change_time_mod');
      },
      onClose: function (inp, dp) {
        $(dp.input).parent().removeClass('dp_opened');
      }
    });

    $('#change_reception_form').dialog({
      autoOpen: false,
      modal: true,
      width: 240,
      dialogClass: "no_close_mod change_reception_form_dialog"
    });
  }

  var initReceptionFields = function($scope) {
    var visit = $scope.change_reception_visit;
    var start_at, duration;
    // console.log('change init');
    // console.log(visit);
    // console.log(visit.start);
    start_at = moment(visit.start);
    duration = visit.duration.toString();
    $('#change_reception_time').val(shortDate(start_at));
    $('#change_reception_time_internal').val(moment(start_at).format('YYYY-MM-DD'));
    var start = start_at.format('HH:mm');
    // console.log('start');
    // console.log(start);
    // console.log('[name="change_reception_form[start]"] option[value="' + start + '"]');
    // console.log($('[name="change_reception_form[start]"] option[value="' + start + '"]'));
    $('[name="change_reception_form[start]"] option[value="' + start + '"]').prop('selected', true);
    $('[name="change_reception_form[start]"]').trigger('chosen:updated');
    var end = start_at.add(duration, 'm').format('HH:mm');
    // console.log('end');
    // console.log(end);
    // console.log($('[name="change_reception_form[end]"] option[value="' + end + '"]'));
    $('[name="change_reception_form[end]"] option[value="' + end + '"]').prop('selected', true);
    $('[name="change_reception_form[end]"]').trigger('chosen:updated');
  }

  this.changeReceptionTimeRun = function($scope) {
    initReceptionFields($scope);
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

  this.initReceptionForm = function() {
    this.initChangeReceptionTime();
  }
}]);
