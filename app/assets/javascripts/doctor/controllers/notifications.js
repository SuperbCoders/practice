function NotificationsController($scope, Alerts, Faye, Visits1, Doctor1, Resources, filterFilter) {
  $scope.alerts = Alerts;
  $scope.notifications = Alerts.alerts();
  $("#notifications").removeClass('notification_open');

  $scope.confirm_visit = function(visit) {
    Visits1.save({id: visit.id, visit: {visit_data: {created_by: 'doctor'}}}).$promise.then(function(response) {
      visit.created_by = 'doctor';
    });
  }

  $scope.unreaded_notifications = [];

  $scope.$watchCollection('notifications', function(val){
    $scope.unreaded_notifications_length = filterFilter(val, {unreaded: true}).length;
    $scope.unreaded_notifications = filterFilter(val, {unreaded: true}).slice(0, 5);
  });
}

angular.module('practice.doctor').controller('NotificationsController', ['$scope', 'Alerts', 'Faye', 'Visits1', 'Doctor1', 'Resources', 'filterFilter', NotificationsController]);
