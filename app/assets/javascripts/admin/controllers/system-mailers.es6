class SystemMailersController {
    constructor($stateParams, SystemMailersService) {
        this.SystemMailersService = SystemMailersService;
        this.mailerSlug = $stateParams.mailerSlug;
        this.emailSlug = $stateParams.emailSlug;
        this.email = {};

        this.fetch();
    }

    fetch() {
        this.SystemMailersService
            .getEmail(this.mailerSlug, this.emailSlug)
            .then((response) => this.email = response.email)
    }

    save() {
        this.SystemMailersService
            .saveEmail(this.mailerSlug, this.emailSlug, this.email)
    }
}

angular
    .module('practice.admin')
    .controller('SystemMailersController', SystemMailersController);

SystemMailersController.$inject = ['$stateParams', 'SystemMailersService'];