function JournalController($rootScope, $stateParams, $scope, $state, $window, Journals, Alerts, Dicts, Patients, Visits, ngDialog, Doctor, ChangeTime, jqueryDialogService) {
  var vm = this;
  vm.Journals = Journals;
  vm.Dicts = Dicts;
  vm.Alerts = Alerts;
  vm.Patients = Patients;
  vm.Visits = Visits;
  vm.ngDialog = ngDialog;
  vm.Doctor = Doctor;
  vm.patient_id = $stateParams.patient_id;
  vm.journal_id = $stateParams.journal_id;
  vm.addRecord = addRecord;
  vm.addEmptyRecord = addEmptyRecord;
  vm.removeFileFromList = removeFileFromList;
  vm.removeJournal = removeJournal;
  vm.openAppointmentsDialog = openAppointmentsDialog;
  vm.printJournal = printJournal;
  vm.journal = {
    journal_records: [{
      tag: '',
      body: ''
    }],
    attachments: []
  };
  vm.dicts = [];

  $scope.min_time = "05:45:00";
  $scope.max_time = "22:15:00";
  $scope.slot_duration = '00:15:00';

  fetchDicts();

  if (vm.patient_id) {
    fetchPatientInfo();
    fetchPatientJournals();
  }

  if (vm.journal_id) {
    fetchJournal();
  }

  // fix extra empty node in card color select broke up chosen
  vm.patient = {};
  vm.patient.cart_color = '0';

  function fetchPatientInfo() {
    vm.Patients.get({id: vm.patient_id})
      .$promise
      .then(function (patient) {
        vm.patient = patient;
        $rootScope.$title = vm.patient.full_name;
        $('.patient_status_w .chosen-select').val(vm.patient.cart_color).trigger("chosen:updated");
      })
  }

  function fetchPatientJournals() {
    vm.Journals.query({patient_id: vm.patient_id})
      .$promise
      .then(function (journals) {
        vm.journals = journals;
        _.forEach(vm.journals, function (journal) {
          journal.date = moment(journal.created_at).format('LL');
        });
      });
  }

  function fetchJournal() {
    vm.Journals.get({id: vm.journal_id})
      .$promise
      .then(function (journal) {
        vm.journal = journal;
        vm.patient_id = journal.patient.id;
      });
  }

  function fetchDicts() {
    vm.Dicts.get()
      .$promise
      .then(function (response) {
        vm.dicts = _.filter(response.dicts, ['dict_type', 'journal_tag']);
        if (vm.dicts[0]) {
          vm.journal.journal_records[0].tag = vm.dicts[0].dict_value;
        }
      })
  }

  function addRecord() {
    if($state.includes('journal.create')) {
      createJournal();
      return
    }
    vm.journal.patient_id = vm.patient_id;
    vm.journal.journal_records_attributes = vm.journal.journal_records;
    Journals.save({id: vm.journal.id}, {journal: vm.journal});
    $state.go('journal.records', {patient_id: vm.patient_id})
  }

  function addEmptyRecord(e) {
    var tag = '';
    if (e) tag = e.currentTarget.innerText;
    vm.journal.journal_records.push({
      tag: tag,
      body: ''
    });
  }

  function createJournal() {
    vm.journal.patient_id = vm.patient_id;
    vm.journal.journal_records_attributes = vm.journal.journal_records;
    Journals.create({journal: vm.journal})
      .$promise
      .then(function (journal) {
        if (journal.valid) {
          $state.go('journal.records', {patient_id: vm.patient_id})
        }
      })
  }

  function removeJournal(idx) {
    vm.journals[idx].$remove()
      .then(function () {
        fetchPatientJournals();
      })
  }

  function createDict(dict_value) {
    vm.Dicts.create({dict_type: 'journal_tag', dict_value: dict_value})
      .$promise
      .then(function (response) {
        fetchDicts();
      })
  }

  function removeFileFromList(index) {
    var file = vm.journal.attachments[index];
    if (file.id) {
      file.deleted = true
    } else {
      vm.journal.attachments.splice(index,  1)
    }
  }

  function openAppointmentsDialog() {
    ngDialog.open({
      template: 'appointments_form',
      controllerAs: 'vm',
      controller: 'DialogController',
      scope: $scope,
      className: 'ngdialog ngdialog-theme-default dialog_close_butt_mod_1',
      preCloseCallback: (value) => { fetchPatientInfo(); return true }
    })
  }

  function printJournal(journal) {
    var url = "/doctor/journals/" + journal.id + "/print";
    var windowParams = "menubar=no,location=yes,resizable=yes,scrollbars=no,status=no,width=500,height=400";
    $window.open(url, "Print", windowParams);
  }

  var subRecordPopup = new jqueryDialogService($scope, '#subrecord_popup', {
    autoOpen: false,
    modal: true,
    width: 480,
    closeText: '',
    appendTo: '.wrapper',
    dialogClass: "dialog_v4 subrecord_popup always_open dialog_close_butt_mod_1",
    open: function (event, ui) {
      body_var.addClass('overlay_v4');
    },
    close: function (event, ui) {
      body_var.removeClass('overlay_v4');
    }
  }).popup();

  var addSubRecordPopup = new jqueryDialogService($scope, '#add_subrecord_popup', {
    autoOpen: false,
    modal: true,
    width: 700,
    closeText: '',
    appendTo: '.wrapper',
    dialogClass: "dialog_v5 add_subrecord_item always_open dialog_close_butt_mod_3",
    open: function (event, ui) {
      body_var.addClass('hide_subrecord_popup');
    },
    close: function (event, ui) {
      body_var.removeClass('hide_subrecord_popup');
    }
  }).popup();

  $('.manageSubRecordPopup').on ('click', function () {
    subRecordPopup.dialog('open');
    return false;
  });

  $('.openSubRecordAdd').on ('click', function () {
    addSubRecordPopup.dialog('open');
    return false;
  });

  $('.checkEmpty').on('keyup blur', function (e) {
    var firedEl = $(this);

    if (firedEl.val().length) {
      firedEl.addClass('not_empty');
    } else {
      firedEl.removeClass('not_empty');
    }

  });

  $('.applySubRecord').on ('click', function () {
    // console.log('new_saubrecord_item ' + $('.new_saubrecord_item').length);
    var sabRecordItem = $('#new_saubrecord_item');
    // console.log(sabRecordItem.val());
    createDict(sabRecordItem.val());
    addSubRecordPopup.dialog('close');
    sabRecordItem.val('').removeClass('not_empty');
    return false;
  });

  var doc_body = $('body');
  if ($state.includes('journal.records'))doc_body.addClass('body_gray');
  // console.log('journal add sub_header_mod');
  // doc_body.removeClass('sub_header_mod');

  $scope.deleteVisit = function(event){
    if (confirm('Отменить прием?')) {
      return Visits.remove({id: vm.patient.last_visit.id}).$promise.then(function(response) {
        fetchPatientInfo();
      });
    }
  }

  $scope.update_created_by = function(event) {
    if (confirm('Подтвердить прием?')) {
      Visits.save({id: event.id, visit: {visit_data: {created_by: 'doctor'}}}).$promise.then(function(response) {
        fetchPatientInfo();
      });
    }
  }

  $scope.$on('notification', function(event, notification){
    if (vm.patient.last_visit && vm.patient.last_visit.id == notification.visit.id) {
      if (notification.notification_type == 'visit_soon') {
        vm.patient.last_visit.active = true;
      } else if (notification.notification_type == 'visit_end') {
        vm.patient.last_visit.active = false;
      }
    }
  });

  $scope.time_list = ChangeTime.make_time_list($scope);

  $scope.change_reception_time_apply = function(){
    if (!ChangeTime.change_reception_time_valid()) {
      return;
    }
    var visit = $scope.change_reception_visit;
    visit.start_at = ChangeTime.get_change_reception_time_moment();
    visit.duration = ChangeTime.get_change_reception_time_duration();
    Visits.save({id: visit.id, visit: {visit_data: {start_at: visit.start_at, duration: visit.duration}}});
    $('#change_reception_form').dialog('close');
    fetchPatientInfo();
  }

  $scope.changeReceptionTimeClick = function(event, visit) {
    $scope.change_reception_visit = visit;
    ChangeTime.changeReceptionTimeRun.call(event.currentTarget, $scope);
    return false;
  }

  ChangeTime.initReceptionForm();

  $scope.update_cart_color = function (patient) {
    console.log('update_cart_color');
    Patients.save({id: patient.id, cart_color: patient.cart_color});
  }

  $scope.$on('$destroy', function () {
    // console.log('destroy 1');
    var doc_body = $('body');
    doc_body.removeClass('body_gray');
    $('.ui-dialog #change_reception_form').dialog('destroy');
    // console.log('journal remove sub_header_mod');
    // doc_body.addClass('sub_header_mod');
  })
}

JournalController.$inject = ['$rootScope', '$stateParams','$scope', '$state', '$window', 'Journals', 'Alerts', 'Dicts', 'Patients', 'Visits', 'ngDialog', 'Doctor', 'ChangeTime', 'jqueryDialogService'];
angular
  .module('practice.doctor')
  .controller('JournalController', JournalController);
