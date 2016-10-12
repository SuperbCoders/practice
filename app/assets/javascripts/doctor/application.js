var app = angular.module('practice.doctor', ['ui.router', 'ngMask', 'ui-notification', 'naif.base64', 'ngResource', 'angularUtils.directives.dirPagination', 'angularMoment', 'ngMask']);

var Patients = [
	'Resources', function(Resources) {
		return Resources('/doctor/patients/:id', {
			id: '@id'
		}, [
			{
				method: 'GET',
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
		})
		.state('doctor.public', {
		  url: '/public',
		  templateUrl: '/templates/doctor/profile/public.haml'
		})
		.state('doctor.settings', {
		  url: '/settings',
		  templateUrl: '/templates/doctor/profile/settings.haml'
		})
		.state('doctor.subscription', {
		  url: '/subscription',
		  templateUrl: '/templates/doctor/profile/subscription.haml'
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
		    Visits: [
		      'Resources', function(Resources) {
		        return Resources('/doctor/visits/:id', {
		          id: '@id'
		        });
		      }
		    ]
		  }
		});
		$urlRouterProvider.otherwise('/schedule');
	}
]);

app.directive('chosenSelect', ['$timeout', function ($timeout) {
        return {
                link: function ($scope, element, attrs) {
                        $scope.$on('dataloaded', function () {
                                $timeout(function () {
                                        $('.chosen-select').chosen({
                                                autohide_results_multiple: false,
                                                allow_single_deselect: true,
                                                width: "100%"
                                        });
                                }, 0, false);
                        })
                }
        };
}]);

app.run(['$rootScope', '$state', '$stateParams', '$window', function($rootScope, $state, $stateParams, $window) {
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
		$rootScope.menu_open = function() {
			angular.element(document.querySelector("html")).addClass('menu_open');
		};
		$('html').on('click', function(event, ui) {
			if (event.toElement && event.toElement.id !== 'menu_button') {
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
			return $('.chosen-select').chosen({
				autohide_results_multiple: false,
				allow_single_deselect: true,
				width: "100%",
				className: "form_o_b_item form_o_b_value_edit_mode"
			});
		};
		return $rootScope.init_chosen();
	}
]);
