function PatientsController($scope, $window, $state, Patients, ngDialog, Visits, Doctor, ChangeTime) {
  $scope.min_time = "05:45:00";
  $scope.max_time = "22:15:00";
  $scope.slot_duration = '00:15:00';

  $scope.time_list = ChangeTime.make_time_list($scope);

  $scope.items_limit = 9;
  $scope.filters = {
    archivated: false,
    signed: false,
    unsigned: false
  };
  $scope.search_query = "";

  $scope.Visits = Visits;
  $scope.Doctor = Doctor;
  $scope.ngDialog = ngDialog;

  $('body').addClass('body_gray');
  $('body').addClass('sub_header_mod');
  $scope.$on('$destroy', function() {
    $('body').removeClass('body_gray');
    return $('body').removeClass('sub_header_mod');
  });

  // $('.chosen-select').chosen({
  //   width: '100%',
  //   disable_search_threshold: 3
  // }).on('chosen:showing_dropdown', function(evt, params) {
  //   var firedEl, niceScrollBlock;
  //   firedEl = $(evt.currentTarget);
  //   niceScrollBlock = firedEl.next('.chzn-container').find('.chzn-results');
  //   if (niceScrollBlock.getNiceScroll().length) {
  //     niceScrollBlock.getNiceScroll().resize().show();
  //   } else {
  //     niceScrollBlock.niceScroll({
  //       cursorwidth: 4,
  //       cursorborderradius: 2,
  //       cursorborder: 'none',
  //       bouncescroll: false,
  //       autohidemode: false,
  //       horizrailenabled: false,
  //       railsclass: firedEl.data('rails_class'),
  //       railpadding: {
  //         top: 0,
  //         right: 0,
  //         left: 0,
  //         bottom: 0
  //       }
  //     });
  //   }
  // }).on('chosen:hiding_dropdown', function(evt, params) {
  //   var firedEl, niceScrollBlock;
  //   firedEl = $(evt.currentTarget);
  //   niceScrollBlock = firedEl.next('.chzn-container').find('.chzn-results');
  //   niceScrollBlock.getNiceScroll().hide();
  // });

  $scope.paginationChange = function() {
    $window.scrollTo(0, 0);
  }

  $scope.unarchivate = function(patient) {
    patient.in_archive = false;
    patient.$save();
    return $scope.fetch();
  };

  $scope.archivate = function(patient) {
    if (confirm('Отправить в архив?')) {
      patient.in_archive = true;
      patient.$save();
      return $scope.fetch();
    }
  };

  $scope.deletePatient = function(patient) {
    if (confirm('Удалить пациента?')) {
      return Patients.remove(patient).$promise.then(function(response) {
        return $scope.patients = _.without($scope.patients, patient);
      });
    }
  };

  $scope.all_users = function() {
    $scope.filters.approved = true;
    return $scope.filters.archivated = false;
  };

  $scope.filter_fn = function(patient){
    if ($scope.search_query == "")
      return true;

    var null_str = function(str) {
      if (str === null) {
        return '';
      } else {
        return str;
      }
    }

    var search_query = $scope.search_query.toLowerCase();

    if (null_str(patient.full_name).toLowerCase().indexOf(search_query) != -1)
      return true;

    if (null_str(patient.email).toLowerCase().indexOf(search_query) != -1)
      return true;

    var phone;

    for (phone of patient.phones)
      if (phone.data.toLowerCase().indexOf(search_query) != -1)
        return true;
    return false;
  }

  $scope.update_cart_color = function (patient) {
    Patients.save({id: patient.id, cart_color: patient.cart_color});
  }

  function reload_patient(patient) {
    console.log('reload patient');
    Patients.get(patient).$promise.then(function(response) {
      var index = _.findIndex($scope.patients, patient);
      console.log('success');
      console.log(JSON.stringify(response, null, 2));
      $scope.patients[index] = response;
    });
  }

  $scope.fetch = function(search_query = undefined) {
    if (search_query != undefined)
      $scope.filters.query = search_query
    else
      delete $scope.filters.query;

    Patients.query($scope.filters).$promise.then(function(patients) {
      $scope.patients = patients;
      return setTimeout(function() {
        return $('select').trigger("chosen:updated");
      }, 200);
    });
  };

  $scope.fetch();

  $scope.openAppointmentsForm = function(patient) {
      $scope.patient = patient;
      ngDialog.open({
          template: 'appointments_form',
          controllerAs: 'vm',
          controller: 'DialogController',
          scope: $scope,
          className: 'ngdialog ngdialog-theme-default dialog_close_butt_mod_1',
          preCloseCallback: (value) => { $scope.fetch(); return true }
      })
  };

  function find_patient_by_last_visit(visit) {
    return _.find($scope.patients, function(p){
      return p.last_visit == visit;
    });
  }

  $scope.change_reception_time_apply = function(){
    if (!ChangeTime.change_reception_time_valid()) {
      return;
    }
    var visit = $scope.change_reception_visit;
    visit.start_at = ChangeTime.get_change_reception_time_moment();
    visit.duration = ChangeTime.get_change_reception_time_duration();
    Visits.save({id: visit.id, visit: {visit_data: {start_at: visit.start_at, duration: visit.duration}}});
    $('#change_reception_form').dialog('close');
    var patient = find_patient_by_last_visit(visit);
    if (patient) {
      reload_patient(patient);
    }
  }

  $scope.changeReceptionTimeClick = function(event, visit) {
    $scope.change_reception_visit = visit;
    ChangeTime.changeReceptionTimeRun.call(event.currentTarget, $scope);
    return false;
  }

  ChangeTime.initReceptionForm();

  $scope.deleteVisit = function(event){
    if (confirm('Отменить прием?')) {
      return Visits.remove({id: event.id}).$promise.then(function(response) {
        $scope.fetch();
      });
    }
  }

  $scope.update_created_by = function(event) {
    if (confirm('Подтвердить прием?')) {
      Visits.save({id: event.id, visit: {visit_data: {created_by: 'doctor'}}}).$promise.then(function(response) {
        $scope.fetch();
      });
    }
  }

  $scope.$on('notification', function(event, notification){
    console.log('notification');
    for (var i = 0; i < $scope.patients.length; ++i) {
      if ($scope.patients[i].last_visit) {
        if ($scope.patients[i].last_visit.id == notification.visit.id){
          // if (notification.notification_type == 'visit_soon') {
          //   $scope.patients[i].last_visit.active = true;
          // } else if (notification.notification_type == 'visit_end') {
          //   $scope.patients[i].last_visit.active = false;
          // }
          reload_patient($scope.patients[i]);
        }
      }
    }
  });

  $scope.$on('$destroy', function(){
    // console.log('destroy');
    $('.ui-dialog #change_reception_form').dialog('destroy');
  });
}

PatientsController.$inject = ['$scope', '$window', '$state', 'Patients', 'ngDialog', 'Visits', 'Doctor', 'ChangeTime'];
angular
    .module('practice.doctor')
    .controller('PatientsController', PatientsController);
