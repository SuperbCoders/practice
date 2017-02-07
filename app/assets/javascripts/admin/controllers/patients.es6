class PatientsController {
    constructor(Patients) {
        this.items_limit = 100;
        this.patients = [];
        this.Patients = Patients;
        this.query = '';

        this.fetch();
    }

    fetch() {
        this.Patients.query().$promise.then(patients => this.patients = patients)
    }

    remove(patient) {
        this.Patients.remove(patient).$promise.then(() => this.fetch())
    }

    search() {
        this.Patients.query({q: this.query}).$promise.then(patients => this.patients = patients)
    }
}

angular
    .module('practice.admin')
    .controller('PatientsController', PatientsController);

PatientsController.$inject = ['Patients'];
