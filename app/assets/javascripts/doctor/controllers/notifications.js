function NotificationsController($scope, Alerts) {
  $scope.notifications = Alerts.alerts();
  $("#notifications").removeClass('notification_open');
  // console.log('notifications add sub_header_mod');
  // $('body').addClass('sub_header_mod');
  // $scope.$on('$destroy', function() {
  //   return $('body').removeClass('sub_header_mod');
  // });
}

angular.module('practice.doctor').controller('NotificationsController', ['$scope', 'Alerts', NotificationsController]);
