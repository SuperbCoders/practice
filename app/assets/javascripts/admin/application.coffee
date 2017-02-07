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

@application.config ['cfpLoadingBarProvider','$httpProvider', 'NotificationProvider', (cfpLoadingBarProvider, $httpProvider, NotificationProvider) ->
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

  return
]

