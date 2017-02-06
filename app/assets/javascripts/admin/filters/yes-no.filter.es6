angular
    .module('practice.admin')
    .filter('yesNo', () => (input, trueStatement) => input == trueStatement ? 'Да' : 'Нет');