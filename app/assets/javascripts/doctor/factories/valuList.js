var app = angular.module('practice.doctor')

app.factory('ValueList', ['Resources', function(Resources){

	ValueListResource = Resources('/admin/value-lists/:name', {name: "@name"});		

	return {
		getList: function(name){
			return ValueListResource.get({name: name}).$promise;
		}
	}
}]);