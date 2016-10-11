class JournalController
  constructor: (@rootScope, @scope, @Journals, @Alerts, @Dicts) ->
    vm = @
    vm.Journals = @Journals
    vm.Alerts = @Alerts
    vm.records ||= []
    vm.tags ||= []
    vm.attach = undefined
    vm.patient_id = @rootScope.$stateParams.patient_id
    vm.journal_id = @rootScope.$stateParams.journal_id
    vm.journal = undefined
    vm.show_new_tag = false

    @rootScope.journal ||= {vm: vm}
    @scope.$on('$destroy', ->
      @rootScope.journal = undefined
    )

    @fetch_dicts()
    @init_chosen()

    # Load all patient journals if state is record
    console.log @rootScope.$state.current.name
    if @rootScope.$state.current.name.split('.')[1] is 'records'
      console.log 'set'
      vm.read_mode = false
      vm.edit_mode = true
      @fetch_journals()
    else
      vm.read_mode = true
      vm.edit_mode = false

    console.log 'wtf'
    # Fetch journal
    if vm.journal_id
      @fetch_journal()
    else
      vm.journal =
        patient_id: vm.patient_id
        attachments: []
        journal_records: []

      @add_record()

  init_chosen: ->
    $('.chosen-select').on('chosen:showing_dropdown', (evt, params) ->
      $ '.chosen-select'
      firedEl = $(evt.currentTarget)
      niceScrollBlock = firedEl.next('.chzn-container').find('.chzn-results')
      if niceScrollBlock.getNiceScroll().length
        niceScrollBlock.getNiceScroll().resize().show()
      else
        niceScrollBlock.niceScroll
          cursorwidth: 4
          cursorborderradius: 2
          cursorborder: 'none'
          bouncescroll: false
          autohidemode: false
          horizrailenabled: false
          railsclass: firedEl.data('rails_class')
          railpadding:
            top: 0
            right: 0
            left: 0
            bottom: 0
      return
    ).on('chosen:hiding_dropdown', (evt, params) ->
      firedEl = $(evt.currentTarget)
      niceScrollBlock = firedEl.next('.chzn-container').find('.chzn-results')
      niceScrollBlock.getNiceScroll().hide()
      #if (firedEl.parents('.form_validate').length) firedEl.validationEngine('validate');
      return
    ).on('change', ->
      firedEl = $(this)
      firedEl.closest('.writeCtrl').toggleClass 'show_custom_field', firedEl.find('option:selected').attr('data-action') == 'custom'
      false
    ).chosen
      width: '100%'
      disable_search_threshold: 3

  show_tag: (id) ->
    vm = @
    return tag.dict_value for tag in vm.tags when tag.dict_type is 'journal_tag' and tag.id is parseInt(id)

  new_record: -> { attachments: [], pid: _.random(10000,20000), deleted: false, delete: false }
  add_record: -> @journal.journal_records.push @new_record()

  set_record: (record) -> @current_record = record
  toggle_new_tag: (record) -> @rootScope.toggle_el_class("#new_tag_#{record.pid}", 'custom_field') if record.tag is 'new_tag'
  create_new_tag: (record) ->
    vm = @
    tag =
      dict_type: 'journal_tag'
      dict_value: vm.new_tag

    if vm.new_tag not in vm.tags
      @Dicts.create({dict: tag}).$promise.then((dict) ->
        record.tag = new String(dict.id)
        vm.new_tag = ''
        vm.rootScope.toggle_el_class("#new_tag_#{record.pid}", 'custom_field')
        vm.fetch_dicts()
      )

    return

  # Called when
  attach_on_load_end: (journal) ->
    vm = @
    for record in journal.journal_records when record.attach is true
      record.attachments.push angular.copy(journal.new_attach)
      if journal.$save()
        journal.new_attach = undefined
        record.attach = false
    return

  attach_to_journal: (journal, record) ->
    record.attach = true
    $("##{journal.id}_#{record.id}_attach").trigger("click")
    return

  # Reset image upload input element. angular-base64-upload bug
  changed: (event, raw_files) ->
    $(event.target).val(null)
    return

  # Save to record when image attached
  attach_loaded: (record) ->
    vm = @
    if vm.attach
      record.attachments.push angular.copy(vm.attach)
      vm.attach = undefined

    return

  # Create/Save journal record
  save: (journal) ->
    journal.$save()
    @fetch_journal()

  create: ->
    vm = @
    vm.Journals.create({journal: vm.journal}).$promise.then((journal) ->
      if journal.valid
        vm.rootScope.$state.go('journal.records', {patient_id: vm.patient_id})
    )
    return

  fetch_journal: ->
    vm = @
    vm.Journals.get({id: vm.journal_id}).$promise.then((journal) ->
      vm.journal = journal
      vm.journal.date = moment(vm.journal.created_at).format('lll')
    )

  fetch_journals: ->
    vm = @
    vm.Journals.query({patient_id: vm.patient_id}).$promise.then((journals) ->
      for journal in journals
        journal.date = moment(journal.created_at).format('lll')
      vm.journals = journals
    )

  fetch_dicts: ->
    vm = @
    vm.tags = []
    @Dicts.get().$promise.then((response) ->
      vm.tags.push dict for dict in response.dicts when dict.dict_type is 'journal_tag'
    )

angular.module('practice.doctor').controller('JournalController', ['$rootScope','$scope', 'Journals', 'Alerts', 'Dicts', JournalController]);
