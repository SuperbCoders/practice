@application = angular.module('practice.public',
  [ 'ui.router',
    'ngMask',
    'ui-notification',
    'ngResource',
    'ngDialog',
    'angularMoment'])

@application.config ['$httpProvider', '$stateProvider', '$urlRouterProvider', 'NotificationProvider', 'ngDialogProvider', ($httpProvider, $stateProvider, $urlRouterProvider, NotificationProvider, ngDialogProvider) ->

  NotificationProvider.setOptions({
    delay: 3000,
    startTop: 20,
    startRight: 10,
    verticalSpacing: 20,
    horizontalSpacing: 20,
    positionX: 'right',
    positionY: 'top'
  })

  ngDialogProvider.setDefaults({
    showClose: false,
    disableAnimation: true,
    closeByDocument: true,
    closeByEscape: true
  })

  $httpProvider.defaults.useXDomain = true
  $httpProvider.defaults.headers.post['Content-Type']= 'application/json'
  $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content')
  delete $httpProvider.defaults.headers.common['X-Requested-With']

  $stateProvider
  .state 'profile',
    url: '/profile',
    templateUrl: '/templates/public/profile.html',
    controller: 'DoctorProfileController',
    controllerAs: 'vm',
    resolve:
      Doctor: ['Resource', (Resource) ->
        Resource '/doctors/:username', {username: @username}, [
          {method: 'GET', isArray: false},
          {name: 'profile', method: 'GET', isArray: false},
          {name: 'visits', method: 'GET', isArray: true},
          {name: 'new_visit', method: 'POST', isArray: false}
          {name: 'remove_visit', method: 'DELETE', isArray: false}
        ]
      ]

  $urlRouterProvider.otherwise '/profile'

  return
]

@application.filter 'mobilePhone', ->
  (phoneNumber) ->
    if !phoneNumber
      return phoneNumber
    new_phone = '+'
    new_phone += phoneNumber[0]
    new_phone += ' ('
    new_phone += phoneNumber[1..3]
    new_phone += ') '
    new_phone += phoneNumber[4..6]
    new_phone += '-'
    new_phone += phoneNumber[7..8]
    new_phone += '-'
    new_phone += phoneNumber[9..12]
    new_phone

@application.run ['$rootScope', '$state', '$stateParams', ($rootScope, $state, $stateParams) ->
  run_debug_ui_route $rootScope
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  $rootScope.patient = {}
  $rootScope.username = $('meta[name=doctor_username]').attr('content')

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

  $rootScope.add_class_to_el = (element_id, class_name) ->
    el = angular.element(document.querySelector("##{element_id}"))
    if not el.hasClass(class_name)
      el.addClass(class_name)
    else
      el.removeClass(class_name)
    return
]
