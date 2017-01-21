function PatientController($scope, $state, $stateParams, Patients) {
  $scope.add_phone = function() {
    return $scope.patient.phones.push({
      number: ''
    });
  };

  $scope.reset_gender = function() {
    $("#patient_gender_male").prop("checked", false);
    $("#patient_gender_female").prop("checked", false);
  };

  $scope.gender = function(g_type) {
    $scope.reset_gender();
    console.log("Gender " + g_type);
    $scope.patient.gender = g_type;
    $("#patient_gender_" + g_type).prop('checked', true);
  };

  $scope.save = function(redirect) {
    if ($scope.editPatientForm.$valid) {
      if (redirect == null) {
        redirect = false;
      }
      if (!$scope.patient) {
        return false;
      }
      if ($scope.patient.id) {
        $scope.patient.$save().then(function(patient) {
          if (patient.phones.length == 0) {
            patient.phones.push({data: ''});
          }
          $scope.normalize_patient();
        });
      } else {
        return Patients.create({
          patient: $scope.patient
        }).$promise.then(function(result) {
          if (redirect) {
            return $state.go('journal.records', {
              patient_id: result.id
            });
          } else {
            return $state.go('patients.list');
          }
        });
      }
    }
  };

  $scope.normalize_patient = function() {
    if ($scope.patient.birthday) {
      var birthday = moment($scope.patient.birthday);
      $scope.patient.birthday_text = (birthday.format('DD')) + " / " + (birthday.format('MM')) + " / " + (birthday.format('YYYY'));
    }
    $scope.reset_gender();
    $("#patient_gender_" + $scope.patient.gender).prop('checked', true);
    $('#patient_blood').val($scope.patient.blood).trigger('chosen:updated');
    $('#patient_rhesus').val($scope.patient.rhesus).trigger('chosen:updated');
  };

  // $scope.test_phone = '79998882222';

  $('#patient_age').datepicker({
    firstDay: 1,
    changeMonth: true,
    changeYear: true,
    yearRange: '1930:' + (new Date()).getFullYear().toString(),
    dateFormat: 'dd / mm / yy',
    numberOfMonths: 1,
    maxDate: 'today',
    showOtherMonths: true,
    unifyNumRows: true,
    onSelect: function(textDate) {
      getAge(moment($('#patient_age').datepicker('getDate')).toString());
      return $scope.patient.birthday = moment($('#patient_age').datepicker('getDate'));
    },
    nextText: '',
    prevText: '',
    monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    monthNamesShort: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
  });
  if ($stateParams.id) {
    Patients.get({
      id: $stateParams.id
    }).$promise.then(function(patient) {
      if (patient.phones.length == 0) {
        patient.phones.push({data: ''});
      }
      // console.log('phones');
      // console.log(patient.phones);
      $scope.patient = patient;
      $scope.normalize_patient();
      $('#patient_age').datepicker('setDate', moment($scope.patient.birthday).toDate());
      getAge(moment($('#patient_age').datepicker('getDate')).toString());
      return setTimeout(function() {
        return $('select').trigger("chosen:updated");
      }, 500);
    });
  } else {
    $scope.patient = {
      phones: [
        {
          number: ''
        }
      ],
      birthday: new Date(),
      cart_color: "0"
    };
    $scope.normalize_patient();
    $('#patient_age').datepicker('setDate', new Date());
  }
  $('#ui-datepicker-div').hide();
  $("#patient_age").on("change", function() {
    getAge(moment($('#patient_age').datepicker('getDate')).toString());
    return $scope.patient.birthday = moment($('#patient_age').datepicker('getDate'));
  });

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

}

angular.module('practice.doctor').controller('PatientController', ['$scope', '$state', '$stateParams', 'Patients', PatientController]);

function getAge(dateString) {
  var age, birthDate, m, today;
  today = new Date();
  birthDate = new Date(dateString);
  age = today.getFullYear() - birthDate.getFullYear();
  m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return $('#patient_age_label').text(age.toString() + " " + makeAgeWord(age));
};

function makeAgeWord(age) {
  var ret;
  ret = "";
  switch (age % 10) {
    case 0:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
      ret = "лет";
      break;
    case 2:
    case 3:
    case 4:
      ret = "года";
      break;
    case 1:
      ret = "год";
  }
  return ret;
};
