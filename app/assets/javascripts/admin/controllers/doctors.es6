class DoctorsController {
    constructor(rootScope, scope, Doctors) {
        this.items_limit = 100;
        this.filters = {};
        this.Doctors = Doctors;

        this.fetch();
    }

    fetch() {
        this.Doctors.query(this.filters).$promise.then(doctors => this.doctors = doctors)
    }
}
angular
    .module('practice.admin')
    .controller('DoctorsController', ['$rootScope', '$scope', 'Doctors', DoctorsController]);
