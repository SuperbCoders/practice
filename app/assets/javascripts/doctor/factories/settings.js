var app = angular.module('practice.doctor')

app.factory('Settings', ['Resources', function(Resources){

	settingsResource = Resources('/doctor/settings');		

	return {
		getSettings: function(){
			return settingsResource.get().$promise;
		},
		saveSettings: function(settings){
			return settingsResource.save(settings).$promise
		}
	}
}]);