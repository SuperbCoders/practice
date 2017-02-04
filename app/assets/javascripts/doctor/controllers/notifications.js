function NotificationsController($scope, Alerts, Faye) {
  console.log('notifications controller');
  $scope.notifications = Alerts.alerts();
  $("#notifications").removeClass('notification_open');

  // Faye.subscribe("/notifications", function(msg){
  // PrivatePub.subscribe("/notifications", function(msg){
  PrivatePub.subscribe("/notifications", function(data){
    console.log('subscribe');
    console.log(data);
    Alerts.messages([data.message]);
  });
}

angular.module('practice.doctor').controller('NotificationsController', ['$scope', 'Alerts', 'Faye', NotificationsController]);
