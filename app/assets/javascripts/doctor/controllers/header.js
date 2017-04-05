function HeaderController($rootScope, $scope, Doctor1) {
  function load_doctor() {
    Doctor1.get().$promise.then(function(response) {
      $scope.doctor = response;
    });
  }
  load_doctor();
  $scope.$on('updated_doctor_profile', function(event) {
    load_doctor();
  });
}

angular.module('practice.doctor').controller('HeaderController', ['$rootScope', '$scope', 'Doctor1', HeaderController]);
