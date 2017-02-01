function NotificationsController($scope, Alerts, Faye) {
  $scope.notifications = Alerts.alerts();
  $("#notifications").removeClass('notification_open');

  Faye.subscribe("/notifications", function(msg){
    console.log('subscribe');
    console.log(msg);
    Alerts.messages([msg]);
  });
}

angular.module('practice.doctor').controller('NotificationsController', ['$scope', 'Alerts', 'Faye', NotificationsController]);
