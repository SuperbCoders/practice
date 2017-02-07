class DoctorsController {
    constructor(Doctors) {
        this.items_limit = 100;
        this.doctors = [];
        this.Doctors = Doctors;
        this.query = '';

        this.fetch();
    }

    fetch() {
        this.Doctors.query().$promise.then(doctors => this.doctors = doctors)
    }

    remove(doctor) {
        this.Doctors.remove(doctor).$promise.then(() => this.fetch())
    }

    search() {
        this.Doctors.query({q: this.query}).$promise.then(doctors => this.doctors = doctors)
    }
}

angular
    .module('practice.admin')
    .controller('DoctorsController', DoctorsController);

DoctorsController.$inject = ['Doctors'];
