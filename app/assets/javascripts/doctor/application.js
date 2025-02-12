// console.log('application.js');
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
            'ngAnimate',
            'faye',
            'environment',
            'angular-loading-bar',
            'localytics.directives'
        ]
    );

this.application = app;

app.animation('.new_appointment_block_anim', ['$rootScope', function($rootScope) {
  return {
    enter: function(element, doneFn){
      if ($rootScope.addEmptyRecord) {
        $rootScope.addEmptyRecord = false;
        var newSubrecordBlock = $('.new_appointment_block')[$('.new_appointment_block').length - 1];
        docScrollTo($(document).scrollTop() + $(newSubrecordBlock).height() + 76, 0);
      }
    }
  }
}]);

// console.log('application');
var Doctor = [
  'Resource', function(Resource) {
    return Resource('/doctor/profile', {
      id: this.id
    }, [
      {
        method: 'GET',
        isArray: false
      },
      {
	method: 'POST',
	name: 'update_password',
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

function showHeader() {
  $('body').removeClass('hidden_header_mod');
}

function hideHeader() {
  $('body').addClass('hidden_header_mod');
}

function hideNotificationsMenu() {
  // notificationBtn = $('.notificationBtn');
  // notificationBtn.parent().removeClass('notification_open');
}

app.config([
  '$httpProvider', '$stateProvider', '$urlRouterProvider', 'NotificationProvider', 'ngDialogProvider', 'envServiceProvider', 'cfpLoadingBarProvider', 'chosenProvider', function($httpProvider, $stateProvider, $urlRouterProvider, NotificationProvider, ngDialogProvider, envServiceProvider, cfpLoadingBarProvider, chosenProvider) {
    chosenProvider.setOption({
      width: "100%",
      disable_search_threshold: 3
    });
    envServiceProvider.config({
      domains: {
        development: ['localhost', 'dev.local'],
        staging: ['dev-pract.robo-t.ru'],
        production: ['practica.cc']
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
	},
        onEnter: hideNotificationsMenu
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
	    Patients: 'Patients',
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
	  Patients: 'Patients'
	}
      })
      .state('patients.edit', {
	url: '/edit/:id',
	templateUrl: '/templates/doctor/patients/add.html',
	controller: 'PatientController',
	controllerAs: 'vm',
	resolve: {
	  Patients: 'Patients'
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
        Patients: 'Patients',
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
        Patients: 'Patients',
        Visits: Visits,
        Doctor: Doctor
	},
        onEnter: hideHeader,
        onExit: showHeader
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
        Patients: 'Patients',
        Visits: Visits,
        Doctor: Doctor,
        $title: function () { return 'Новая запись в карту' }
	},
        onEnter: hideHeader,
        onExit: showHeader
      })
      .state('schedule', {
	url: '/schedule',
	templateUrl: '/templates/doctor/schedule/index.html',
	controller: 'ScheduleController',
	resolve: {
	    $title: function () { return 'Мое расписание'; },
	  Doctor: Doctor,
	  Patients: 'Patients',
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

app.directive('formatPhone', [function () {
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

app.directive('rndBg', [function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      scope.$watch(attrs.ngModel, function(newValue){
        if (newValue && newValue.color) {
          $(element).css({
            'background-color': '#' + newValue.color,
            'color': '#fff'
          }).find('.patient_avatar_letter').css({
            'color': '#fff'
          });
        } else {
          $(element).css({
            'background-color': '',
            'color': ''
          });
        }
      });
    }
  }
}]);

app.directive('patientInfoFormInit', ['$timeout', function ($timeout) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs, ngModel) {
    }
  }
}]);

app.directive('initFaye', ['$timeout', 'Alerts', 'Faye', 'Doctor1', 'envService', function ($timeout, Alerts, Faye, Doctor1) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      Doctor1.get().$promise.then(function(response) {
        Faye.subscribe('/notifications/doctor/' + response.id, function(data){
          Alerts.notification(data);
        });
      });
    }
  }
}]);

// app.directive('patientCardCommentAutoSave', ['$timeout', '$rootScope', 'Patients', function($timeout, $rootScope, Patients){
//   return {
//     restrict: 'A',
//     require: 'ngModel',
//     scope: {
//       ngModel: '=ngModel',
//       model: '=model',
//     },
//     link: function(scope, element, attrs, ctrl){
//       var saved = false;
//       var timeout = undefined;
//       var delay = 1;
//       function save() {
//         console.log('auto save ' + scope.model.id + ' ' + scope.ngModel);
//         Patients.save({id: scope.model.id, comment: scope.ngModel});
//         $rootScope.$broadcast('refetchEvents');
//       }
//       ctrl.$viewChangeListeners.push(function(){
//         console.log('auto save ngModel ' + scope.ngModel);
//         if (timeout) {
//           $timeout.cancel(timeout);
//         }
//         timeout = $timeout(save, delay * 1000);
//       });
//     }
//   }
// }]);

app.directive('patientCardCommentAutoSave', ['$timeout', '$rootScope', 'Patients', function($timeout, $rootScope, Patients){
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      ngModel: '=ngModel',
      model: '=model',
    },
    link: function(scope, element, attrs, ctrl){
      var saved = false;
      var timeout = undefined;
      var delay = 1;
      var model_id, ngModel;
      function save() {
        console.log('auto save ' + model_id + ' ' + ngModel);
        Patients.save({id: model_id, comment: ngModel});
        model_id = null;
        ngModel = null;
        $rootScope.$broadcast('refetchEvents');
      }
      $rootScope.$on('schedulePatientChanged', function(){
        if (timeout) {
          $timeout.cancel(timeout);
          if (model_id) {
            save();
          }
        }
      });
      ctrl.$viewChangeListeners.push(function(){
        $timeout(function(){
          model_id = scope.model.id;
          ngModel = scope.ngModel;
          console.log('auto save ngModel ' + ngModel);
          if (timeout) {
            $timeout.cancel(timeout);
          }
          timeout = $timeout(save, delay * 1000);
        }, 0);
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
    // because ng animate forced us to use ng show instead ng if
    if (visit) {
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
      var date = moment(visit.start);
      // var en = moment().locale('en');
      return date.format('DD') + ' '+ monts[moment(date).locale('en').format('MMMM')] + ', в ' + date.format('HH:mm');
    } else {
      return '';
    }
  };
}
        ]);
