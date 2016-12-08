var app = angular.module('practice.doctor', ['ui.router', 'ngMask', 'ui-notification', 'naif.base64', 'ngResource', 'angularUtils.directives.dirPagination', 'angularMoment', 'ui.autocomplete']);

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
]

app.config([
  '$httpProvider', '$stateProvider', '$urlRouterProvider', 'NotificationProvider', function($httpProvider, $stateProvider, $urlRouterProvider, NotificationProvider) {
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

    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $stateProvider
      .state('notifications', {
	url: '/notifications',
	templateUrl: '/templates/doctor/notifications/list.haml',
	controller: 'NotificationsController'
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
	templateUrl: '/templates/doctor/profile/profile.haml'
        // ,
        // viewContentLoaded: function(){
        //   active_tab(0);
        // }
      })
      .state('doctor.public', {
	url: '/public',
	templateUrl: '/templates/doctor/profile/public.haml'
        // ,
        // viewContentLoaded: function(){
        //   active_tab(1);
        // }
      })
      .state('doctor.settings', {
	url: '/settings',
	templateUrl: '/templates/doctor/profile/settings.haml'
        // ,
        // viewContentLoaded: function(){
        //   active_tab(2);
        // }
      })
      .state('doctor.subscription', {
	url: '/subscription',
	templateUrl: '/templates/doctor/profile/subscription.haml'
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
	  Patients: Patients
	}
      })
      .state('patients.add', {
	url: '/add',
	templateUrl: '/templates/doctor/patients/add.html',
	controller: 'PatientController',
	resolve: {
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
	  ]
	}
      })
      .state('journal.edit', {
	url: '/:journal_id/edit',
	templateUrl: '/templates/doctor/journal/record',
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
	  ]
	}
      })
      .state('journal.create', {
	url: '/:patient_id/add',
	templateUrl: '/templates/doctor/journal/record.html',
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
	  ]
	}
      })
      .state('schedule', {
	url: '/schedule',
	templateUrl: '/templates/doctor/schedule/index.html',
	controller: 'ScheduleController',
	resolve: {
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

app.directive('resize', function($window) {
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
});

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

app.directive('chosenSelectLoadedDoctor', ['$timeout', function ($timeout) {
  return {
    priority: 100,
    link: function(scope, element) {
      var run = function () {
        console.log('-- doctor directive');
        console.log($(element).attr('id'));
        console.log($(element).find('option').length);
        run_chosen(element);
      }
      scope.$on('dataloaded:doctor', function () {
        console.log('$on(dataloaded:doctor)');

        // Sometime time selects still don't have data. Set it in the
        // end of queue twice because selects binding don't even
        // starting rendering yet. I guess so and seems like it works.
        $timeout(function() {
          $timeout(run, 0);
        }, 0);
      });
    }
  }
}]);

app.directive('chosenSelect', ['$timeout', function ($timeout) {
  return {
    priority: 100,
    link: {
      post: function(scope, element) {
        var run = function () {
          // console.log('-- directive');
          // console.log($(element).attr('id'));
          // console.log($(element).find('option').length);
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

app.config(['paginationTemplateProvider', function(paginationTemplateProvider) {
  paginationTemplateProvider.setPath('/templates/doctor/pagination');
}]);

// don't know why is not used, so comment it so far

// app.directive('chosenSelect', ['$timeout', function ($timeout) {
//   return {
//     link: function ($scope, element, attrs) {
//       $scope.$on('dataloaded', function () {
//         $timeout(function () {
//           $('.chosen-select').chosen({
//             autohide_results_multiple: false,
//             allow_single_deselect: true,
//             width: "100%"
//           });
//         }, 0, false);
//       })
//     }
//   };
// }]);

// app.directive( 'elemReady', function( $parse ) {
//   return {
//     restrict: 'A',
//     link: function( $scope, elem, attrs ) {
//       elem.ready(function(){
//         console.log('ready');
//         active_tab(0);
//         // $scope.$apply(function(){
//           // var func = $parse(attrs.elemReady);
//           // func($scope);
//         // })
//       })
//     }
//   }
// });

// app.controller('changeReceptionFormDialogCtrl', function($scope) {
//   $scope.message = 'Hello Dialog!';
//   this.onSave = function() {
//     alert('saved!');
//   };
// })

// app.directive('changeReceptionFormDialog', function() {
//   return {
//     controller: 'changeReceptionFormDialogCtrl',
//     link: function(scope, elem, attrs, ctrl) {
//       elem.dialog({
//         autoOpen: false,
//         buttons: {
//            'Save': function() {
//               ctrl.onSave();
//               elem.dialog('close');
//             }
//         }
//       });
//       scope.$root.openChangeReceptionFormDialog = function() {
//         elem.dialog('open');
//       };
//     }
//   };
// });

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

  // $rootScope.$on('$stateChangeStart',
  //                function(event, toState, toParams, fromState, fromParams, options) {
  //                  console.log('on__stateChangeStart');
  //                  console.log(toState);
  //                  // if (toState.
  //                });

  $rootScope.init_chosen = function() {
    $('#doctor_stand_time').chosen();
    $("#doctor_work_days").chosen();
      return $('.chosen-select').chosen(
          // {
          //     autohide_results_multiple: false,
          //     allow_single_deselect: true,
          //     width: "100%",
          //     className: "form_o_b_item form_o_b_value_edit_mode"
          // }
      );
  };

  // return $rootScope.init_chosen();

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
      "September": "Сентября",
      "October": "октября",
      "November": "ноября",
      "December": "декабря"
    };
    var date = moment(visit.start_at);
    return date.format('DD') + ' ' + monts[date.format('MMMM')] + ', в ' + date.format('HH:mm')
  };
}
        ]);
