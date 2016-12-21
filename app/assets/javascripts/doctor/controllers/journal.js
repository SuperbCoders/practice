function JournalController($stateParams, $scope, $state, Journals, Alerts, Dicts, Patients) {
    var vm = this;
    vm.Journals = Journals;
    vm.Dicts = Dicts;
    vm.Alerts = Alerts;
    vm.Patients = Patients;
    vm.patient_id = $stateParams.patient_id;
    vm.journal_id = $stateParams.journal_id;
    vm.addRecord = addRecord;
    vm.addEmptyRecord = addEmptyRecord;
    vm.journal = {
        journal_records: [{
            tag: '',
            body: ''
        }]
    };
    vm.dicts = [];

    fetchDicts();

    if (vm.patient_id) {
        fetchPatientInfo();
        fetchPatientJournals();
    }

    if (vm.journal_id) {
        fetchJournal();
    }

    function fetchPatientInfo() {
        vm.Patients.get({id: vm.patient_id}).$promise.then(function (patient) {
            vm.patient = patient;
        })
    }

    function fetchPatientJournals() {
        vm.Journals.query({patient_id: vm.patient_id}).$promise.then(function (journals) {
            vm.journals = journals;
            _.forEach(vm.journals,  function (journal) {
                journal.date = moment(journal.created_at).format('LL');
            });
        });
    }

    function fetchJournal() {
        vm.Journals.get({id: vm.journal_id}).$promise.then(function (journal) {
            vm.journal = journal;
            vm.patient_id = journal.patient.id;
        });
    }

    function fetchDicts() {
        vm.Dicts.get().$promise.then(function (response) {
            vm.dicts = _.filter(response.dicts, ['dict_type', 'journal_tag'])
        })
    }

    function addRecord() {
        if($state.includes('journal.create')) {
            createJournal();
            return
        }
        vm.journal.$save();
    }

    function addEmptyRecord(e = null) {
        var tag = '';
        if (e) tag = e.currentTarget.innerText;
        vm.journal.journal_records.push({
            tag: tag,
            body: ''
        });
    }

    function createJournal() {
        Journals.create({journal: {patient_id: vm.patient_id, journal_records: vm.journal.journal_records}}).$promise.then(function (journal) {
            if (journal.valid) {
                vm.journal_id = journal.id;
                vm.journal.id = journal.id;
                addEmptyRecord();
                $state.go('journal.edit', {journal_id: journal.id})
            }
        })
    }

    function createDict(dict_value) {
        vm.Dicts.create({dict_type: 'journal_tag', dict_value: dict_value})
            .$promise
            .then(function (response) {
                fetchDicts();
            })
    }

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

    var addSubRecordPopup = $('#add_subrecord_popup').dialog({
        autoOpen: false,
        modal: true,
        width: 700,
        closeText: '',
        appendTo: '.wrapper',
        dialogClass: "dialog_v5 add_subrecord_item always_open dialog_close_butt_mod_3",
        open: function (event, ui) {
            body_var.addClass('overlay_v4');
        },
        close: function (event, ui) {
            body_var.removeClass('overlay_v4');
        }
    });

    $('li.manageSubRecordPopup').on ('click', function () {
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
        var sabRecordItem = $('#new_saubrecord_item');
        createDict(sabRecordItem.val());
        addSubRecordPopup.dialog('close');
        sabRecordItem.val('').removeClass('not_empty');
        return false;
    });

    var doc_body = $('body');
    doc_body.addClass('body_gray');
    doc_body.removeClass('sub_header_mod');

    $scope.$on('$destroy', function () {
        var doc_body = $('body');
        doc_body.removeClass('body_gray');
        doc_body.addClass('sub_header_mod');
    })
}

JournalController.$inject = ['$stateParams','$scope', '$state', 'Journals', 'Alerts', 'Dicts', 'Patients'];
angular
    .module('practice.doctor')
    .controller('JournalController', JournalController);