function Notifications2Controller($scope, Alerts, Faye, Doctor1, Resources, filterFilter) {
  console.log('notifications2 controller');
  $scope.alerts = Alerts;
  // $scope.alerts = '123';
  $scope.notifications = Alerts.alerts();
  Alerts.mark_all_readed();
  // console.log('notifications');
  // console.log($scope.notifications);
  // Resources('/doctor/notifications', null, [{method: 'GET', isArray: true}]).query().$promise.then(function(response) {
  //   $scope.notifications = response;
  // });
  // $("#notifications").removeClass('notification_open');

  // $scope.unreaded_notifications = [];

  // $scope.$watchCollection('notifications', function(val){
  //   $scope.unreaded_notifications_length = filterFilter(val, {unreaded: true}).length;
  //   $scope.unreaded_notifications = filterFilter(val, {unreaded: true}).slice(0, 5);
  //   // console.log('watch notifications');
  //   // console.log($scope.unreaded_notifications.length);
  //   // console.log($scope.notifications.length);
  // });

  $('body').addClass('sub_header_mod');
  $scope.$on('$destroy', function() {
    $('body').removeClass('body_gray');
    return $('body').removeClass('sub_header_mod');
  });
}

angular.module('practice.doctor').controller('Notifications2Controller', ['$scope', 'Alerts', 'Faye', 'Doctor1', 'Resources', 'filterFilter', Notifications2Controller]);
