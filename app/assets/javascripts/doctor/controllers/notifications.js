function NotificationsController($scope, Alerts) {
  console.log('notifications__controller_running');
  $scope.notifications = Alerts.alerts();
  $("#notifications").removeClass('notification_open');
  $('body').addClass('sub_header_mod');
  $scope.$on('$destroy', function() {
    return $('body').removeClass('sub_header_mod');
  });
}

angular.module('practice.doctor').controller('NotificationsController', ['$scope', 'Alerts', NotificationsController]);
