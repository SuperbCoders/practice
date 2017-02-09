angular
    .module('practice.shared')
    .factory('SystemSettingsService', ['Resources', (Resources) => {

        let settingsResource = Resources('/admin/system-settings');

        return {
            getSettings: () => settingsResource.get().$promise,
            saveSettings: (settings) => settingsResource.save({system_settings: settings}).$promise
        }
}]);