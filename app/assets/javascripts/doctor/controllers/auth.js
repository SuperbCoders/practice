function AuthController($scope, $http, Auth) {
    $scope.$on('devise:unauthorized', function (event, xhr, deferred) {
        console.log('unauthorized');
    })
}

AuthController.$inject = ['$scope', '$http', 'Auth'];
angular
    .module('practice.doctor')
    .controller('AuthController', AuthController);

angular
    .module('practice.doctor')
    .config(function (AuthInterceptProvider) {
       AuthInterceptProvider.interceptAuth(true);
       console.log('intercept config');
    });