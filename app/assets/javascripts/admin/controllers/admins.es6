class AdminsController {
    constructor(rootScope, scope, Admins) {
        this.items_limit = 100;
        this.filters = {};
        this.Admins = Admins;

        this.fetch();
    }

    fetch() {
        this.Admins.query(this.filters).$promise.then(admins => this.admins = admins)
    }

    remove(admin) {
        this.Doctors.remove(admin).$promise.then(() => this.fetch())
    }
}

angular
    .module('practice.admin')
    .controller('AdminsController', AdminsController);

AdminsController.$inject = ['$rootScope', '$scope', 'Admins'];
