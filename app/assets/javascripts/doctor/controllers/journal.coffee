class JournalController
  constructor: (@rootScope, @scope, @Journals, @Alerts, @window) ->
    vm = @
    vm.Journals = @Journals
    vm.Alerts = @Alerts
    vm.records ||= []
    vm.attach = undefined
    vm.patient_id = @rootScope.$stateParams.patient_id

    @Journals.query({patient_id: vm.patient_id}).$promise.then((response) ->
      vm.journals = response
    )
    @add_record()

  new_record: -> { attachments: [] }
  add_record: -> @records.push @new_record()
  set_record: (record) -> @current_record = record

  changed: (event, raw_files) ->
    $(event.target).val(null)
    return

  attach_loaded: (record) ->
    vm = @
    if vm.attach
      record.attachments.push angular.copy(vm.attach)
      vm.attach = undefined

    return

  save: ->
    vm = @

    journal =
      patient_id: vm.patient_id
      journal_records: vm.records

    vm.Journals.create({journal: journal})
    return

@application.controller 'JournalController', ['$rootScope','$scope', 'Journals', 'Alerts', '$window', JournalController]
