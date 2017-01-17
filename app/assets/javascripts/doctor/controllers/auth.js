function AuthController($scope, $http, Auth) {
    $scope.$on('devise:unauthorized', function (event, xhr, deferred) {
        console.log('unauthorized');
    })
}

AuthController.$inject = ['$scope', '$http', 'Auth'];
angular
    .module('doctor.practice')
    .controller('AuthController', AuthController);

angular
    .module('doctor.practice')
    .config(function (AuthInterceptProvider) {
       AuthInterceptProvider.interceptAuth(true);
       console.log('intercept config');
    });