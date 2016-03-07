class JournalController
  constructor: (@rootScope, @scope, @Journals, @Alerts, @Dicts) ->
    vm = @
    vm.Journals = @Journals
    vm.Alerts = @Alerts
    vm.records ||= []
    vm.tags ||= []
    vm.attach = undefined
    vm.patient_id = @rootScope.$stateParams.patient_id
    vm.show_new_tag = false

    @fetch_dicts()
    @fetch_journals()
    @add_record()
    @init_chosen()


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

  new_record: -> { attachments: [], pid: _.random(10000,20000) }
  add_record: ->
    @records.push @new_record()
    return
  set_record: (record) -> @current_record = record

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

  create_new_tag: (record) ->
    vm = @
    tag =
      dict_type: 'journal_tag'
      dict_value: vm.new_tag

    @Dicts.create({dict: tag}).$promise.then((dict) ->
      record.tag = dict.id
      vm.new_tag = ''
      vm.rootScope.toggle_el_class(".tag_item", 'custom_field')
      vm.fetch_dicts()
    )

    return

  tag_changed: (record) -> @rootScope.toggle_el_class("#new_tag_#{record.pid}", 'custom_field') if record.tag is 'new_tag'


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

  # Save journal record
  save: ->
    vm = @
    journal =
      patient_id: vm.patient_id
      journal_records: vm.records

    vm.Journals.create({journal: journal}).$promise.then((journal) ->
      if journal.valid
        vm.rootScope.$state.go('journal.records', {patient_id: vm.patient_id})
      console.log journal
    )
    return

@application.controller 'JournalController', ['$rootScope','$scope', 'Journals', 'Alerts', 'Dicts', JournalController]
