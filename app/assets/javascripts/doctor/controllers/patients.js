function PatientsController($scope, Patients) {
  $scope.items_limit = 30;
  $scope.filters = {
    approved: false,
    archivated: false
  };

  $('body').addClass('body_gray');
  $('body').addClass('sub_header_mod');

  $scope.$on('$destroy', function() {
    $('body').removeClass('body_gray');
    return $('body').removeClass('sub_header_mod');
  });

  $('.chosen-select').chosen({
    width: '100%',
    disable_search_threshold: 3
  }).on('chosen:showing_dropdown', function(evt, params) {
    var firedEl, niceScrollBlock;
    firedEl = $(evt.currentTarget);
    niceScrollBlock = firedEl.next('.chzn-container').find('.chzn-results');
    if (niceScrollBlock.getNiceScroll().length) {
      niceScrollBlock.getNiceScroll().resize().show();
    } else {
      niceScrollBlock.niceScroll({
        cursorwidth: 4,
        cursorborderradius: 2,
        cursorborder: 'none',
        bouncescroll: false,
        autohidemode: false,
        horizrailenabled: false,
        railsclass: firedEl.data('rails_class'),
        railpadding: {
          top: 0,
          right: 0,
          left: 0,
          bottom: 0
        }
      });
    }
  }).on('chosen:hiding_dropdown', function(evt, params) {
    var firedEl, niceScrollBlock;
    firedEl = $(evt.currentTarget);
    niceScrollBlock = firedEl.next('.chzn-container').find('.chzn-results');
    niceScrollBlock.getNiceScroll().hide();
  });

  $scope.unarchivate = function(patient) {
    patient.in_archive = false;
    patient.$save();
    return $scope.fetch();
  };

  $scope.archivate = function(patient) {
    patient.in_archive = true;
    patient.$save();
    return $scope.fetch();
  };

  $scope.deletePatient = function(patient) {
    return Patients.remove(patient).$promise.then(function(response) {
      return $scope.patients = _.without($scope.patients, patient);
    });
  };

  $scope.all_users = function() {
    $scope.filters.approved = true;
    return $scope.filters.archivated = false;
  };

  $scope.fetch = function() {
    Patients.query($scope.filters).$promise.then(function(patients) {
      $scope.patients = patients;
      return setTimeout(function() {
        return $('select').trigger("chosen:updated");
      }, 200);
    });
  };
  
  $scope.fetch();
}
angular.module('practice.doctor').controller('PatientsController', ['$scope', 'Patients', PatientsController]);