class SystemSettingsController {
    constructor(SystemSettingsService) {
        this.SystemSettingsService = SystemSettingsService;
        this.settings = {};

        this.fetch();
    }

    fetch() {
        this.SystemSettingsService.getSettings().then((settings) => this.settings = settings)
    }

    save() {
        this.SystemSettingsService.saveSettings(this.settings)
    }
}

angular
    .module('practice.admin')
    .controller('SystemSettingsController', SystemSettingsController);

SystemSettingsController.$inject = ['SystemSettingsService'];