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

    remove(doctor) {
        this.Doctors.remove(doctor).$promise.then(() => this.fetch())
    }
}

angular
    .module('practice.admin')
    .controller('DoctorsController', DoctorsController);

DoctorsController.$inject = ['$rootScope', '$scope', 'Doctors'];
