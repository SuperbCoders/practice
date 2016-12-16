function JournalController($stateParams, $scope, Journals, Alerts, Dicts, Patients) {
    var vm = this;
    vm.Journals = Journals;
    vm.Dicts = Dicts;
    vm.Alerts = Alerts;
    vm.Patients = Patients;
    vm.patient_id = $stateParams.patient_id;

    function fetchPatientInfo() {
        vm.Patients.get({id: vm.patient_id}).$promise.then(function (patient) {
            vm.patient = patient;
        })
    }
    fetchPatientInfo();

    function fetchPatientJournal() {
        vm.Journals.query({patient_id: vm.patient_id}).$promise.then(function (journals) {
            vm.journals = journals;
        });

    }
    fetchPatientJournal();

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
        ['$stateParams','$scope', 'Journals', 'Alerts', 'Dicts', 'Patients', JournalController]);