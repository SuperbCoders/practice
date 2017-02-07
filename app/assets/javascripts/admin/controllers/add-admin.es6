class AddAdminController {
    constructor($state, Admins) {
        this.Admins = Admins;
        this.$state = $state;
        this.errors = '';
    }

    add() {
        const newAdmin = {
            email: this.email,
            password: this.password
        };
        this.Admins.create({admin: newAdmin})
            .$promise
            .then(() => this.$state.go('admins'))
            .catch((result) => this.errors = result.data.errors);
    }
}

angular
    .module('practice.admin')
    .controller('AddAdminController', AddAdminController);

AddAdminController.$inject = ['$state', 'Admins'];