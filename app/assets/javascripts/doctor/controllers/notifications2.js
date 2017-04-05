function Notifications2Controller($scope, Alerts, Faye, Visits, Doctor1, Resources, filterFilter) {
  console.log('notifications2 controller');
  $scope.alerts = Alerts;
  $scope.notifications = Alerts.alerts();
  $scope.items_limit = 9;
  Alerts.mark_all_readed();

  $scope.confirm_visit = function(visit) {
    Visits.save({id: visit.id, visit: {visit_data: {created_by: 'doctor'}}}).$promise.then(function(response) {
      visit.created_by = 'doctor';
    });
  }

  $('body').addClass('sub_header_mod');
  $scope.$on('$destroy', function() {
    $('body').removeClass('body_gray');
    return $('body').removeClass('sub_header_mod');
  });
}

angular.module('practice.doctor').controller('Notifications2Controller', ['$scope', 'Alerts', 'Faye', 'Visits', 'Doctor1', 'Resources', 'filterFilter', Notifications2Controller]);
