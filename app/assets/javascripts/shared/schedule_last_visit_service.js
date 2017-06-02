this.application.factory('ScheduleLastVisitService', [
  'Resource', function(Resource) {
    return Resource('/doctor/profile', {
      id: this.id
    }, [
      {
        method: 'GET',
        isArray: false
      }
    ]);
  }
]);
