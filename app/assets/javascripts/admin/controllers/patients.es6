class PatientsController {
    constructor(Patients) {
        this.items_limit = 100;
        this.filters = {};
        this.Patients = Patients;
        this.fetch();
    }

    fetch() {
        this.Patients.query(this.filters).$promise.then((patients) => this.patients = patients)
    }

    remove(patient) {
        this.Patients.remove(patient).$promise.then(() => this.fetch())
    }
}

angular
    .module('practice.admin')
    .controller('PatientsController', PatientsController);

PatientsController.$inject = ['Patients'];
