function JournalController($stateParams, $scope, $state, Journals, Alerts, Dicts, Patients) {
    var vm = this;
    vm.Journals = Journals;
    vm.Dicts = Dicts;
    vm.Alerts = Alerts;
    vm.Patients = Patients;
    vm.patient_id = $stateParams.patient_id;
    vm.journal_id = $stateParams.journal_id;
    vm.addRecord = addRecord;
    vm.journal = {
        journal_records: [{
            tag: '',
            body: ''
        }]
    };

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
        });
    }

    function fetchJournal() {
        vm.Journals.get({id: vm.journal_id}).$promise.then(function (journal) {
            vm.journal = journal;
            vm.patient_id = journal.patient.id;
        });
    }

    function addRecord() {
        if($state.includes('journal.create')) {
            createJournal();
            return
        }
    }

    function addEmptyRecord() {
        vm.journal.journal_records.push({
            tag: '',
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

angular
    .module('practice.doctor')
    .controller('JournalController',
        ['$stateParams','$scope', '$state', 'Journals', 'Alerts', 'Dicts', 'Patients', JournalController]);