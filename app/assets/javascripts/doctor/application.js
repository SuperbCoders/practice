console.log('application.js');
var app = angular
    .module('practice.doctor',
        [
            'practice.shared',
            'ui.router',
            'ui.router.title',
            'ngMask',
            'ui-notification',
            'naif.base64',
            'ngResource',
            'angularUtils.directives.dirPagination',
            'angularMoment',
            'ui.autocomplete',
            'ui.mask',
            'Devise',
            'ngDialog',
            'faye',
            'environment',
            'angular-loading-bar'
        ]
    );

this.application = app;

var Patients = [
  'Resources', function(Resources) {
    return Resources('/doctor/patients/:id', {
      id: '@id'
    }, [
      {
	method: 'GET',
	isArray: true
      },
      {
	method: 'GET',
	name: 'autocomplete',
	isArray: true
      }
    ]);
  }
];

// console.log('application');
var Doctor = [
  'Resource', function(Resource) {
    return Resource('/doctor/profile', {
      id: this.id
    }, [
      {
        method: 'GET',
        isArray: false
      }
    ]);
  }
];

var Visits = [
    'Resources', function(Resources) {
        return Resources('/doctor/visits/:id', {
            id: '@id'
        });
    }
];

app.config([
  '$httpProvider', '$stateProvider', '$urlRouterProvider', 'NotificationProvider', 'ngDialogProvider', 'envServiceProvider', 'cfpLoadingBarProvider', function($httpProvider, $stateProvider, $urlRouterProvider, NotificationProvider, ngDialogProvider, envServiceProvider, cfpLoadingBarProvider) {
    envServiceProvider.config({
      domains: {
        development: ['localhost', 'dev.local'],
        production: ['dev-pract.robo-t.ru']
      }
    });
    envServiceProvider.check();

    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.includeBar = false;
    cfpLoadingBarProvider.spinnerTemplate =
        '<div class="preloader"><div class="fl spinner6"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div></div>';

    NotificationProvider.setOptions({
      delay: 3000,
      startTop: 20,
      startRight: 10,
      verticalSpacing: 20,
      horizontalSpacing: 20,
      positionX: 'right',
      positionY: 'top',
      templateUrl: 'notifications.html'
    });
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
    $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
    $httpProvider.interceptors.push('AlertsMonitor');

    ngDialogProvider.setDefaults({
        showClose: false,
        disableAnimation: true,
        closeByDocument: true,
        closeByEscape: true
    });

    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $stateProvider
      .state('notifications', {
	url: '/notifications',
	templateUrl: '/templates/doctor/notifications/list.haml',
	controller: 'Notifications2Controller',
	resolve: {
	  Doctor: Doctor,
          Visits: Visits
	}
      })
      .state('doctor', {
	url: '/doctor',
	templateUrl: '/templates/doctor/profile.html',
	controller: 'DoctorProfileController',
	resolve: {
	  Doctor: Doctor
	}
      })
      .state('doctor.profile', {
	url: '/profile',
	templateUrl: '/templates/doctor/profile/profile.haml',
          resolve: {
              $title: function () { return 'Мои данные' }
          }
        // ,
        // viewContentLoaded: function(){
        //   active_tab(0);
        // }
      })
      .state('doctor.public', {
	url: '/public',
	templateUrl: '/templates/doctor/profile/public.haml',
          resolve: {
              $title: function () { return 'Мой публичный профиль' }
          }
        // ,
        // viewContentLoaded: function(){
        //   active_tab(1);
        // }
      })
      .state('doctor.settings', {
	url: '/settings',
	templateUrl: '/templates/doctor/profile/settings.haml',
          resolve: {
              $title: function () { return 'Настройки' }
          }
        // ,
        // viewContentLoaded: function(){
        //   active_tab(2);
        // }
      })
      .state('doctor.subscription', {
	url: '/subscription',
	templateUrl: '/templates/doctor/profile/subscription.haml',
          resolve: {
              $title: function () { return 'Оплата подписки ' }
          }
        // ,
        // viewContentLoaded: function(){
        //   active_tab(3);
        // }
      })
      .state('patients', {
	url: '/patients',
	templateUrl: '/templates/doctor/patients/index.html'
      })
      .state('patients.list', {
	url: '/list',
	templateUrl: '/templates/doctor/patients/list.html',
	controller: 'PatientsController',
	resolve: {
	    $title: function () { return 'Мои пациенты' },
	    Patients: Patients,
        Visits: Visits,
        Doctor: Doctor
	}
      })
      .state('patients.add', {
	url: '/add',
	templateUrl: '/templates/doctor/patients/add.html',
	controller: 'PatientController',
	resolve: {
        $title: function () { return 'Новый пациент' },
	  Patients: Patients
	}
      })
      .state('patients.edit', {
	url: '/edit/:id',
	templateUrl: '/templates/doctor/patients/add.html',
	controller: 'PatientController',
	controllerAs: 'vm',
	resolve: {
	  Patients: Patients
	}
      })
      .state('journal', {
	url: '/journal',
	templateUrl: '/templates/doctor/journal/index.html'
      })
      .state('journal.records', {
	url: '/:patient_id/records',
	templateUrl: '/templates/doctor/journal/list.html',
	controller: 'JournalController',
	controllerAs: 'vm',
	resolve: {
	  Dicts: [
	    'Resources', function(Resources) {
	      return Resources('doctor/dicts/:id', {
		id: '@id'
	      }, [
		{
		  method: 'GET',
		  isArray: false
		}
	      ]);
	    }
	  ],
	  Journals: [
	    'Resources', function(Resources) {
	      return Resources('/doctor/journals/:id', {
		id: '@id'
	      }, [
		{
		  method: 'GET',
		  isArray: true
		}
	      ]);
	    }
	  ],
        Patients: Patients,
        Visits: Visits,
        Doctor: Doctor
	}
      })
      .state('journal.edit', {
	url: '/:journal_id/edit',
	templateUrl: '/templates/doctor/journal/records.html',
	controller: 'JournalController',
	controllerAs: 'vm',
	resolve: {
	  Dicts: [
	    'Resources', function(Resources) {
	      return Resources('doctor/dicts/:id', {
		id: '@id'
	      }, [
		{
		  method: 'GET',
		  isArray: false
		}
	      ]);
	    }
	  ],
	  Journals: [
	    'Resources', function(Resources) {
	      return Resources('/doctor/journals/:id', {
		id: '@id'
	      }, [
		{
		  method: 'GET',
		  isArray: false
		}
	      ]);
	    }
	  ],
        Patients: Patients,
        Visits: Visits,
        Doctor: Doctor
	}
      })
      .state('journal.create', {
	url: '/:patient_id/add',
	templateUrl: '/templates/doctor/journal/records.html',
	controller: 'JournalController',
	controllerAs: 'vm',
	resolve: {
	  Dicts: [
	    'Resources', function(Resources) {
	      return Resources('doctor/dicts/:id', {
		id: '@id'
	      }, [
		{
		  method: 'GET',
		  isArray: false
		}
	      ]);
	    }
	  ],
	  Journals: [
	    'Resources', function(Resources) {
	      return Resources('/doctor/journals/:id', {
		id: '@id'
	      }, [
		{
		  method: 'GET',
		  isArray: true
		}
	      ]);
	    }
	  ],
        Patients: Patients,
        Visits: Visits,
        Doctor: Doctor,
        $title: function () { return 'Новая запись в карту' }
	}
      })
      .state('schedule', {
	url: '/schedule',
	templateUrl: '/templates/doctor/schedule/index.html',
	controller: 'ScheduleController',
	resolve: {
	    $title: function () { return 'Мое расписание'; },
	  Doctor: Doctor,
	  Patients: Patients,
	  Visits: [
	    'Resources', function(Resources) {
	      return Resources('/doctor/visits/:id', {
	        id: '@id'
	      });
	    }
	  ],
	  Visit: [
	    'Resource', function(Resource) {
	      return Resource('/doctor/visits/:id', {
		id: '@id'
	      });
	    }
	  ]
	}
      });
    $urlRouterProvider.otherwise('/schedule');
  }
]);

app.directive('resize', ['$window', function($window) {
  return {
    link: function(scope) {
      function onResize(e) {
        // Namespacing events with name of directive + event to avoid collisions
        scope.$broadcast('resize::resize');
      }

      function cleanUp() {
        angular.element($window).off('resize', onResize);
      }

      angular.element($window).on('resize', onResize);
      scope.$on('$destroy', cleanUp);
    }
  }
}]);

app.directive('fixTabHeader', function() {
  return {
    link: function(scope, element) {
      fix_tab_header();
      scope.$on('resize::resize', function() {
        fix_tab_header();
      });
    }
  }
});

app.directive('resizeFullCalendar', function() {
  return {
    link: function(scope, element) {
      scope.$on('resize::resize', function() {
        clearTimeout(scope.calTimer);
        scope.calTimer = setTimeout(function () {
          $('#calendar').fullCalendar('option', 'height', getCalendarHeight());
        }, 3);
      });
    }
  }
});

function getCalendarHeight() {
    calHeight = Math.max(500, ($(window).height() + ($(window).width() > 1200 ? 40 : -50) - $('.wrapper').css('paddingTop').replace('px', '') * 1));

    return calHeight;
}

app.directive('chosenSelect', ['$timeout', function ($timeout) {
  return {
    priority: 100,
    link: {
      post: function(scope, element) {
        var run = function () {
          run_chosen(element);
        }
        $timeout(run, 0);
      }
    }
  }
}]);

app.directive('updateDaysRow', ['$timeout', function ($timeout) {
  return {
    priority: 200,
    link: function(scope, element) {
      var run = function () {
        // console.log('update-days-row');
        updateDaysRow(element);
      }
      $timeout(run, 0);
    }
  }
}]);

app.directive('initWorkDays', ['$timeout', function ($timeout) {
  return {
    priority: 200,
    link: function(scope, element) {
      var run = function () {
        // console.log('init-work-days');
        init_work_days(element);
      }
      $timeout(run, 0);
    }
  }
}]);

app.directive('formatPhone', ['$timeout', function ($timeout) {
  return {
    restrict: 'A',
    require: 'ngModel',
    priority: -200,
    link: function(scope, element, attrs, ngModel) {
      ngModel.$formatters.push(function(value){
        return formatPhone(value);
      });
    }
  }
}]);

app.directive('patientInfoFormInit', ['$timeout', function ($timeout) {
  return {
    restrict: 'A',
    // require: 'ngModel',
    // priority: -200,
    link: function(scope, element, attrs, ngModel) {
      console.log('patientInfoFormInit directive');
      console.log('noop');
    }
  }
}]);

app.directive('initFaye', ['$timeout', 'Alerts', 'Faye', 'Doctor1', 'envService', function ($timeout, Alerts, Faye, Doctor1) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      Doctor1.get().$promise.then(function(response) {
        // $scope.doctor = response;
        Faye.subscribe('/notifications/doctor/' + response.id, function(data){
          console.log('subscribe');
          console.log(data);
          // Alerts.messages([data.message]);
          // Alerts.notification(data.object);
          Alerts.notification(data);
        });
      });
    }
  }
}]);

(function () {
  'use strict';
  app.directive("ubtMaskPlaceholder", ubtMaskPlaceholder);

  function ubtMaskPlaceholder() {
    return {
      restrict: 'A',
      scope: {
        placeholder: '@ubtMaskPlaceholder'
      },
      link: function (scope, elem, attrs, uiMask) {
        $(function(){
          $(elem).attr('placeholder',scope.placeholder);
        })
        scope.$on('$translateChangeSuccess', function () {
          $(elem).attr('placeholder',scope.placeholder);
        });
      }
    };
  }

})();

app.config(['paginationTemplateProvider', function(paginationTemplateProvider) {
  paginationTemplateProvider.setPath('/templates/doctor/pagination');
}]);

app.run(['$rootScope', '$state', '$stateParams', '$window', function($rootScope, $state, $stateParams, $window) {
  // run_debug_ui_route($rootScope);
  // console.log('app.run()');
  $window.rootScope = $rootScope;
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  $rootScope.state_is = function(name) {
    return $rootScope.$state.current.name === name;
  };
  $rootScope.el_show = function(name) {
    angular.element(document.querySelector("#" + name)).show();
  };
  $rootScope.el_hide = function(name) {
    angular.element(document.querySelector("#" + name)).hide();
  };
  $rootScope.remove_class_from_el = function(element_id, class_name) {
    var el;
    el = angular.element(document.querySelector(element_id));
    el.removeClass(class_name);
  };
  $rootScope.toggle_el_class = function(element_id, class_name) {
    var el;
    el = angular.element(document.querySelector(element_id));
    if (!el.hasClass(class_name)) {
      el.addClass(class_name);
    } else {
      el.removeClass(class_name);
    }
  };
  $('html').on('click', function(event, ui) {
    if (event.target && event.target.id !== 'menu_button') {
      return $('html').removeClass('menu_open');
    }
  });
  $rootScope.menu_close = function() {
    angular.element(document.querySelector("html")).removeClass('menu_open');
  };
  $rootScope.regDate = function() {
    return moment(Date["new"]);
  };

  $rootScope.init_chosen = function() {
    $('#doctor_stand_time').chosen();
    $("#doctor_work_days").chosen();
  };

  $rootScope.getFullVisitString = function(visit){
    var monts = {
      "January": "января",
      "February": "февраля",
      "March": "марта",
      "April": "апреля",
      "May": "мая",
      "June": "июня",
      "July": "июля",
      "August": "августа",
      "September": "сентября",
      "October": "октября",
      "November": "ноября",
      "December": "декабря"
    };
    var date = moment(visit.start_at);
    var en = moment().locale('en');
    return date.format('DD') + ' '+ monts[moment(date).locale('en').format('MMMM')] + ', в ' + date.format('HH:mm');
  };
}
        ]);
