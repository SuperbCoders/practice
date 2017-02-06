function NotificationsController($scope, Alerts, Faye, Doctor1) {
  console.log('notifications controller');
  $scope.notifications = Alerts.alerts();
  $("#notifications").removeClass('notification_open');
}

angular.module('practice.doctor').controller('NotificationsController', ['$scope', 'Alerts', 'Faye', 'Doctor1', NotificationsController]);
