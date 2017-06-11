this.application.factory('Patients', [
  'Resources', function(Resources) {
    return Resources('/doctor/patients/:id', {
      id: '@id'
    }, [
      {
	method: 'GET',
	isArray: true
      },
      {
	method: 'GET',
	name: 'autocomplete',
	isArray: true
      },
      {
	method: 'GET',
	name: 'visits',
	isArray: true
      }
    ]);
  }
]);
