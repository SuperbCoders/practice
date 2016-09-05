class PatientsController
  constructor: (@rootScope, @scope, @Patients) ->
    vm = @
    vm.items_limit = 30
    vm.filters =
      approved: undefined
      archivated: false

    vm.Patients = @Patients

    # Из-за верстки нужно добавлять классы к body
    # в зависимости от страницы
    $('body').addClass 'body_gray'
    $('body').addClass 'sub_header_mod'

    @scope.$on('$destroy', ->
      $('body').removeClass 'body_gray'
      $('body').removeClass 'sub_header_mod'
    )

    $('.chosen-select').chosen(
      width: '100%'
      disable_search_threshold: 3).on('chosen:showing_dropdown', (evt, params) ->
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
    ).on 'chosen:hiding_dropdown', (evt, params) ->
      firedEl = $(evt.currentTarget)
      niceScrollBlock = firedEl.next('.chzn-container').find('.chzn-results')
      niceScrollBlock.getNiceScroll().hide()
      #if (firedEl.parents('.form_validate').length) firedEl.validationEngine('validate');
      return
    @fetch()

  archivate: (patient) ->
    vm = @
    patient.in_archive = true
    patient.$save()
    vm.fetch()

  deletePatient: (patient)->
    vm = @
    patient.$delete().$promise.then((response)->
      vm.patients = _.without(vm.patients, patient)
    )

  all_users: ->
    vm = @
    vm.filters.approved = true
    vm.filters.archivated = false

  fetch: () ->
    vm = @
    @Patients.query(vm.filters).$promise.then((patients) ->
      vm.patients = patients
    )
    return


@application.controller 'PatientsController', ['$rootScope','$scope', 'Patients', PatientsController]
