@application = angular.module('practice.admin',
  ['angular-confirm',
    'angular-loading-bar',
    'ui.router',
    'ui.bootstrap',
    'ui-notification',
    'angularUtils.directives.dirPagination',
    'naif.base64',
    'ngResource',
    'angularMoment'])

@application.run ['$rootScope', '$state', '$stateParams', ($rootScope, $state, $stateParams) ->
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
]

@application.config ['cfpLoadingBarProvider','$httpProvider', '$stateProvider', '$urlRouterProvider', 'NotificationProvider', (cfpLoadingBarProvider, $httpProvider, $stateProvider, $urlRouterProvider, NotificationProvider) ->
  cfpLoadingBarProvider.includeSpinner = true
  cfpLoadingBarProvider.includeBar = true

  NotificationProvider.setOptions({
    delay: 4000,
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
  delete $httpProvider.defaults.headers.common['X-Requested-With']

  # Patients
  $stateProvider
  .state 'patients',
    url: '/patients',
    templateUrl: '/templates/admin/patients/index.html'
    controller: 'PatientsController',
    controllerAs: 'vm',
    resolve:
      Patients: ['Resources', (Resources) ->
        Resources '/admin/patients/:id', {id: '@id'}, [
          {method: 'GET', isArray: true}
        ]
      ]

  # Doctors
  .state 'doctors',
    url: '/doctors',
    templateUrl: '/templates/admin/doctors/index'
    controller: 'DoctorsController',
    controllerAs: 'vm',
    resolve:
      Doctors: ['Resources', (Resources) ->
        Resources '/admin/doctors/:id', {id: '@id'}, [
          {method: 'GET', isArray: true}
        ]
      ]

  # Admins
  .state 'admins',
    url: '/admins',
    templateUrl: '/templates/admin/admins/index'
    controller: 'AdminsController',
    controllerAs: 'vm',
    resolve:
      Admins: ['Resources', (Resources) ->
        Resources '/admin/admins/:id', {id: '@id'}, [
          {method: 'GET', isArray: true}
        ]
      ]

  # Statistic
  .state 'statistic',
    url: '/statistic',
    templateUrl: '/templates/admin/statistic/index'

  # Billing
  .state 'billing',
    url: '/billing',
    templateUrl: '/templates/admin/billing/index'

  # Static
  .state 'static',
    url: '/static',
    templateUrl: '/templates/admin/static/index'

  # Settings
  .state 'settings',
    url: '/settings',
    templateUrl: '/templates/admin/settings/index'

  # Settings -> Tags
  .state 'settings.tags',
    url: '/tags',
    templateUrl: '/templates/admin/settings/tags'

  # Settings -> System
  .state 'settings.system',
    url: '/system',
    templateUrl: '/templates/admin/settings/system'



# Default route to main page
  $urlRouterProvider.otherwise '/doctors'

  return
]

