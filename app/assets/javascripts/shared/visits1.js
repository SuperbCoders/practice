this.application.factory('Visits1', [
  'Resources', function(Resources) {
    return Resources('/doctor/visits/:id', {
      id: '@id'
    });
  }
]);
