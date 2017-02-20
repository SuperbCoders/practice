var app = angular.module('practice.doctor')

app.factory('PatientsService', ['Resources', function(Resources){
  // settingsResource = Resources('/doctor/settings');

  $scope.deleteVisit = function(event){
    if (confirm('Отменить прием?')) {
      return Visits.remove({id: event.real_id}).$promise.then(function(response) {
        // return $scope.visits = _.without($scope.visits, visit);
        $('#calendar').fullCalendar('refetchEvents');
        $scope.event = null;
      });
    }
  }

  $scope.deleteVisit = function(event){
    if (confirm('Отменить прием?')) {
      return Visits.remove({id: event.id}).$promise.then(function(response) {
        $scope.fetch();
      });
    }
  }

  return {
    deleteVisit: function(){
    }
  }
}]);
