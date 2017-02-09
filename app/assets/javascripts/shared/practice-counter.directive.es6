angular
    .module('practice.shared')
    .directive('practiceCounter', ['SystemSettingsService', (SystemSettingsService) => {
    return {
        restrict: 'E',
        template: '{{counter_code}}',
        link: (scope) => SystemSettingsService.getSettings().then((settings) => scope.counter_code = settings.counter_code)
    }
}]);