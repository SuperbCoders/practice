class PatientsController {
    constructor(rootScope, scope, Patients) {
        this.items_limit = 100;
        this.filters = {};
        this.Patients = Patients;
        this.fetch();
    }

    fetch() {
        this.Patients.query(this.filters).$promise.then((patients) => this.patients = patients)
    }

    remove(patient) {
        this.Doctors.remove(patient).$promise.then(() => this.fetch())
    }
}

angular
    .module('practice.admin')
    .controller('PatientsController', ['$rootScope', '$scope', 'Patients', PatientsController]);
