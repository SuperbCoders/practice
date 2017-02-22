angular
    .module('practice.admin')
    .config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {

        $stateProvider
            .state('patients', {
                url: '/patients',
                templateUrl: '/templates/admin/patients/index.html',
                controller: 'PatientsController',
                controllerAs: 'vm',
                resolve: {
                    Patients: [
                        'Resources', function (Resources) {
                            return Resources('/admin/patients/:id', {
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
            .state('doctors', {
                url: '/doctors',
                templateUrl: '/templates/admin/doctors/index',
                controller: 'DoctorsController',
                controllerAs: 'vm',
                resolve: {
                    Doctors: [
                        'Resources', function (Resources) {
                            return Resources('/admin/doctors/:id', {
                                id: '@id'
                            }, [
                                {
                                    method: 'GET',
                                    isArray: true
                                },
                                {
                                    method: 'POST',
                                    name: 'sign_in_as_doctor',
                                    isArray: false
                                }
                            ]);
                        }
                    ]
                }
            })
            .state('admins', {
                url: '/admins',
                templateUrl: '/templates/admin/admins/index',
                controller: 'AdminsController',
                controllerAs: 'vm',
                resolve: {
                    Admins: [
                        'Resources', function (Resources) {
                            return Resources('/admin/admins/:id', {
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
            .state('add-admin', {
                url: '/admins/add',
                templateUrl: '/templates/admin/admins/add',
                controller: 'AddAdminController',
                controllerAs: 'vm',
                resolve: {
                    Admins: [
                        'Resources', function (Resources) {
                            return Resources('/admin/admins/:id', {
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
            .state('statistic', {
                url: '/statistic',
                templateUrl: '/templates/admin/statistic/index'
            })
            .state('billing', {
                url: '/billing',
                templateUrl: '/templates/admin/billing/index'
            })
            .state('static', {
                url: '/static',
                templateUrl: '/templates/admin/static/index'
            })
            .state('settings', {
                url: '/settings',
                templateUrl: '/templates/admin/settings/index'
            })
            .state('settings.tags', {
                url: '/tags',
                templateUrl: '/templates/admin/settings/tags'
            })
            .state('settings.system', {
                url: '/system',
                templateUrl: '/templates/admin/settings/system',
                controller: 'SystemSettingsController',
                controllerAs: 'vm'
            })
            .state('settings.mailers', {
                url: '/mailers/:mailerSlug/:emailSlug',
                templateUrl: '/templates/admin/settings/mailers',
                controller: 'SystemMailersController',
                controllerAs: 'vm'
            });

        $urlRouterProvider.otherwise('/doctors');
    }]);