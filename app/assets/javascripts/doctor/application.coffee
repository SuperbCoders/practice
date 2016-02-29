@application = angular.module('practice.doctor',
  [ 'ui.router',
    'ngMask',
    'ui-notification',
    'naif.base64',
    'ngResource',
    'angularUtils.directives.dirPagination',
    'angularMoment'])

@application.config ['$httpProvider', '$stateProvider', '$urlRouterProvider', 'NotificationProvider', ($httpProvider, $stateProvider, $urlRouterProvider, NotificationProvider) ->
  NotificationProvider.setOptions({
    delay: 3000,
    startTop: 20,
    startRight: 10,
    verticalSpacing: 20,
    horizontalSpacing: 20,
    positionX: 'right',
    positionY: 'top'
  })

  $httpProvider.defaults.useXDomain = true
  $httpProvider.defaults.headers.post['Content-Type']= 'application/json'
  $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content')
  $httpProvider.interceptors.push 'AlertsMonitor'
  delete $httpProvider.defaults.headers.common['X-Requested-With']

  $stateProvider
  .state 'doctor',
    url: '/doctor',
    templateUrl: '/templates/doctor/profile.html',
    controller: 'DoctorProfileController',
    controllerAs: 'vm',
    resolve:
      Doctor: ['Resource', (Resource) ->
        Resource '/doctor/profile', {id: @id}, [ {method: 'GET', isArray: false} ]
      ]

  .state 'doctor.profile',
    url: '/profile',
    templateUrl: '/templates/doctor/profile/profile.haml'

  .state 'doctor.public',
    url: '/public',
    templateUrl: '/templates/doctor/profile/public.haml'

  .state 'doctor.settings',
    url: '/settings',
    templateUrl: '/templates/doctor/profile/settings.haml'

  .state 'doctor.subscription',
    url: '/subscription',
    templateUrl: '/templates/doctor/profile/subscription.haml'

  .state 'patients',
    url: '/patients',
    templateUrl: '/templates/doctor/patients/index.html'

  .state 'patients.list',
    url: '/list',
    templateUrl: '/templates/doctor/patients/list.html'
    controller: 'PatientsController',
    controllerAs: 'vm',
    resolve:
      Patients: ['Resources', (Resources) ->
        Resources '/doctor/patients/:id', {id: '@id'}, [
          {method: 'GET', isArray: true}
        ]
      ]

  .state 'patients.add',
    url: '/add',
    templateUrl: '/templates/doctor/patients/add.html',
    controller: 'AddPatientsController',
    controllerAs: 'vm',
    resolve:
      Patients: ['Resources', (Resources) ->
        Resources '/doctor/patients/:id', {id: '@id'}, [
          {method: 'GET', isArray: true}
        ]
      ]

  .state 'journal.add_record',
    url: '/:patient_id/journal',
    templateurl: '/templates/doctor/patients/add_journal_record.html',
    controller: 'JournalController',
    controllerAs: 'vm'
    resolve:
      Patients: ['Resources', (Resources) ->
        Resources '/doctor/patients/:id', {id: '@id'}, [
          {method: 'GET', isArray: true}
        ]
      ]

  .state 'schedule',
    url: '/schedule',
    templateUrl: '/templates/doctor/schedule/index.html'
    controller: 'ScheduleController',
    controllerAs: 'vm',
    resolve:
      Visits: ['Resources', (Resources) ->
        Resources '/doctor/visits/:id', {id: '@id'}, [
          {method: 'GET', isArray: true}
        ]
      ]

  $urlRouterProvider.otherwise '/schedule'

  return
]

@application.factory 'AlertsMonitor', [ '$injector', ($injector) ->
  timestampMarker =
    request: (config) ->
      config.requestTimestamp = (new Date).getTime()
      config
    response: (response) ->
      Alerts = $injector.get('Alerts')

      if response.data.messages && response.data.messages.length > 0
        Alerts.messages response.data.messages

      if response.data.errors && response.data.errors.length > 0
        Alerts.messages response.data.errors

      response.config.responseTimestamp = (new Date).getTime()
      response
  timestampMarker
]

@application.run ['$rootScope', '$state', '$stateParams', ($rootScope, $state, $stateParams) ->
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;

  $rootScope.state_is = (name) -> $rootScope.$state.current.name is name
  $rootScope.el_show = (name) ->
    angular.element(document.querySelector("##{name}")).show()
    return

  $rootScope.el_hide = (name) ->
    angular.element(document.querySelector("##{name}")).hide()
    return

  $rootScope.remove_class_from_el = (element_id, class_name) ->
    angular.element(document.querySelector("##{element_id}")).removeClass(class_name)
    return

  $rootScope.toggle_el_class = (element_id, class_name) ->
    el = angular.element(document.querySelector(element_id))
    if not el.hasClass(class_name)
      el.addClass(class_name)
    else
      console.log 'remove class '+class_name+' form '+element_id
      el.removeClass(class_name)

    return

  $rootScope.menu_open = ->
    angular.element(document.querySelector("html")).addClass 'menu_open'
    return

  $('html').on('click', (event, ui) ->
    if event.toElement.id != 'menu_button'
      $('html').removeClass('menu_open')
    console.log event.toElement.id
  )
  $rootScope.menu_close = ->
    angular.element(document.querySelector("html")).removeClass 'menu_open'
    return

  $rootScope.regDate = -> moment(Date.new)

  $rootScope.init_chosen = ->
    console.log 'inited'
    $('#doctor_stand_time').chosen()
    $("#doctor_work_days").chosen()
    $('.chosen-select').chosen({
      autohide_results_multiple: false,
      allow_single_deselect: true,
      width: "100%",
      className: "form_o_b_item form_o_b_value_edit_mode"
    })

  $rootScope.init_chosen()
]
