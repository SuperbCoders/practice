function JournalController($rootScope, $stateParams, $scope, $state, Journals, Alerts, Dicts, Patients) {
    var vm = this;
    vm.Journals = Journals;
    vm.Dicts = Dicts;
    vm.Alerts = Alerts;
    vm.Patients = Patients;
    vm.patient_id = $stateParams.patient_id;
    vm.journal_id = $stateParams.journal_id;
    vm.addRecord = addRecord;
    vm.addEmptyRecord = addEmptyRecord;
    vm.removeFileFromList = removeFileFromList;
    vm.removeJournal = removeJournal;
    vm.journal = {
        journal_records: [{
            tag: '',
            body: ''
        }],
        attachments: []
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
                vm.journal.journal_records[0].tag = vm.dicts[0].dict_value;
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

    $('.patient_status_w .chosen-select').on('change', function (event, selected) {
        // var patientStatus = $('.chosen-select option[value='+ selected.selected + ']').data('title');
        if (vm.patient) {
            vm.patient.cart_color = selected.selected;
            vm.patient.$save();
        }
    });

    var subRecordPopup = $('#subrecord_popup').dialog({
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
    });

    var addSubRecordPopup = $('#add_subrecord_popup').dialog({
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
    });

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
        var sabRecordItem = $('#new_saubrecord_item');
        console.log(sabRecordItem.val());
        createDict(sabRecordItem.val());
        addSubRecordPopup.dialog('close');
        sabRecordItem.val('').removeClass('not_empty');
        return false;
    });

    var doc_body = $('body');
    if ($state.includes('journal.records'))doc_body.addClass('body_gray');
    doc_body.removeClass('sub_header_mod');

    $scope.$on('$destroy', function () {
        var doc_body = $('body');
        doc_body.removeClass('body_gray');
        doc_body.addClass('sub_header_mod');
    })
}

JournalController.$inject = ['$rootScope', '$stateParams','$scope', '$state', 'Journals', 'Alerts', 'Dicts', 'Patients'];
angular
    .module('practice.doctor')
    .controller('JournalController', JournalController);

