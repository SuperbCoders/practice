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
}
angular
    .module('practice.admin')
    .controller('AdminsController', ['$rootScope', '$scope', 'Admins', AdminsController]);
