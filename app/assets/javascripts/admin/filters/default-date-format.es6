angular
    .module('practice.admin')
    .filter('defaultDateFormat', () => (input) => moment(input).format('L'));