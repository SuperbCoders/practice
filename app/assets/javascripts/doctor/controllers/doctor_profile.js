function DoctorProfileController($rootScope, $scope, Alerts, state, stateParams, Doctor, Settings, ValueList) {

  console.log('DoctorProfileController');
  $scope.$on('$viewContentLoaded',
                 function(event) {
                   var tab_names = ['profile', 'settings', 'public', 'subscription'];
                   var tab_name = state.current.name.replace('doctor.', '');
                   active_tab(tab_names.indexOf(tab_name));
                   // if (toState.
                 });

  ['profile', 'public', 'settings', 'subscription'];
  // $scope.tab_name = state.current.name.replace('doctor.', '');

  // active_tab();

  $scope.new_schedule = function() {
    $scope.doctor.work_schedules.push({
      days: [],
      start_at: '08:00',
      finish_at: '20:00'
    });
    $("#doctor_work_days").chosen();
  };

  $scope.add_contact = function(type) {
    switch (type) {
      case 'phone':
        $scope.doctor.phones.push({
          data: ''
        });
        break;
      case 'email':
        $scope.doctor.emails.push({
          data: ''
        });
    }
  };

  $scope.save = function() {
    Doctor.save({doctor: $scope.doctor}).$promise.then(function(response) {
      return $scope.Alerts.messages = response.messages;
    });
    Settings.saveSettings({
      setting: $scope.settings
    });
  };

  Doctor.get().$promise.then(function(response) {
    $scope.doctor = response;
    if ($scope.doctor.phones.length <= 0) {
      $scope.add_contact('phone');
    }
    if ($scope.doctor.work_schedules.length <= 0) {
      return $scope.new_schedule();
    }
    console.log('$vroadcast(dataloaded:doctor)');
    $rootScope.$broadcast('dataloaded:doctor');
  });

  ValueList.getList("Стандартное время приема").then(function(response) {
    return $scope.standartTimeIntervals = response.value_list_items;
  });
  Settings.getSettings().then(function(response) {
    return $scope.settings = response;
  });
  init_chosen($scope);

  $scope.addSocial = function(url) {
    window.open(url, "Auth", "height=200,width=200");
    return true;
  };

  $scope.update_password = function() {
    params = {
      id: $scope.doctor.id,
      password: $scope.doctor.password
    };
    Doctor.save({doctor: params}).$promise.then(function(response) {
      if (response.errors.length <= 0) {
        return $scope.hide_pass_form();
      }
    });
  };

  $scope.hide_pass_form = function() {
    $scope.doctor.password = void 0;
    $('.passForm').hide();
    $('.passBtn').show();
  };

  $scope.show_pass_form = function() {
    $('.passBtn').hide();
    $('.passForm').show().find('.passInput').focus();
  };

  $scope.removeDay = function(element, index) {
    var ngModel = element.data('$ngModelController');
    console.log(ngModel);
    console.log(index);

    index = ngModel.$modelValue.indexOf(index.toString());
    console.log('calculation');
    console.log(index);
    if (index > -1) {
      console.log('delete');
      delete ngModel.$modelValue[index];
      console.log(ngModel.$modelValue);
      ngModel.$setViewValue(ngModel.$modelValue);
    }
  };
}

function updateDaysRow(slct) {
  var chzn_container, days, i, slct_val;
  // console.log('updateDaysRow');
  slct_val = slct.val();
  // console.log(slct_val);
  chzn_container = slct.next('.chzn-container').find('.chzn-choices');
  days = '';
  if (slct_val) {
    i = 0;
    while (i < slct_val.length) {
      days += ',' + slct.find('option[value=' + slct_val[i] + ']').attr('data-short');
      i++;
    }
    days = days.replace(/^,/i, '');
    // console.log(chzn_container.find('.chzn_rzlts').length);
    if (chzn_container.find('.chzn_rzlts').length) {
      // console.log(days);
      chzn_container.find('.chzn_rzlts').text(days);
    } else {
      // console.log(days);
      chzn_container.prepend($('<li class="chzn_rzlts" />').text(days));
      // console.log(chzn_container);
    }
    // console.log($('.chzn_rzlts').length);
  } else {
    chzn_container.find('.chzn_rzlts').remove();
  }
};

DoctorProfileController.prototype.fix_tab_header = function() {
  if (doc.scrollTop() > 0) {
    tabHeaderSpacer.css('height', tabHeader.height());
    tabHeader.addClass('tab_header_fixed');
  } else {
    tabHeader.removeClass('tab_header_fixed');
    tabHeaderSpacer.css('height', tabHeader.height());
  }
};

// function active_tab() {
//   console.log('active_tab');
//   console.log($('.profile_tab_holder .tab_is_active').length);
//   if ($('.profile_tab_holder .tab_is_active').length == 0) {
//     return;
//   }

//   var tab = $('.profile_tab_holder .tab_is_active'),
//       tabs = tab.parents('.tab_list'),
//       tabCursor = tabs.find('.tab_active_cursor');
//   if (tabCursor.length == 0) {
//     tabCursor = $('<li class="tab_active_cursor" />');

//     tabCursor.css({
//       width: tab.find('.tab_link').width(),
//       left: tab.offset().left - tabs.offset().left
//     });

//     tabs.append(tabCursor);
//   } else {
//     tabCursor.css({
//       width: tab.find('.tab_link').width(),
//       left: tab.offset().left - tabs.offset().left
//     });
//   }
// };

function active_tab(tab) {
  console.log('active_tab');
  // console.log($('.profile_tab_holder .tab_item').length);

  var tab = $($('.profile_tab_holder .tab_item')[tab]),
      tabs = tab.parents('.tab_list'),
      tabCursor = tabs.find('.tab_active_cursor');
  if (tabCursor.length == 0) {
    tabCursor = $('<li class="tab_active_cursor" />');

    tabCursor.css({
      width: tab.find('.tab_link').width(),
      left: tab.offset().left - tabs.offset().left
    });

    tabs.append(tabCursor);
  } else {
    tabCursor.css({
      width: tab.find('.tab_link').width(),
      left: tab.offset().left - tabs.offset().left
    });
  }
};

function set_tab($scope) {
  console.log('tab:');
  console.log($scope.tab_name);
  // console.log('scope:');
  // console.log($scope);
  // console.log($scope.$state);
};

function init_chosen($scope) {
  console.log('init_chosen');
  $scope.$parent.init_chosen();
  if ($('.chosen-select').length) {
    console.log($('.chosen-select').length);
    $('body').delegate('.chosen_multiple_v1 .extra_control', 'click', function(e) {
      console.log('click');
      var chzn_container, firedEl, option_ind;
      console.log('extra_init_chosen');
      firedEl = $(this);
      e.preventDefault();
      chzn_container = firedEl.closest('.chzn-container ');
      option_ind = firedEl.parents('.chzn_item').attr('data-option-array-index') * 1;

      // console.log(angular.element(firedEl[0]).scope());
      // angular.element(firedEl.closest('.chzn-container').prev('.chosen-select')[0]).scope()
      // angular.element(document.getElementById('doctor_work_days')).scope()
      angular.element(firedEl[0]).scope()
        .removeDay(
          firedEl.closest('.chzn-container').prev('.chosen-select'),
          option_ind
        );
      // firedEl.closest('.chzn-container').prev('.chosen-select').find('option[value=' + option_ind + ']').removeAttr('selected');

      updateDaysRow(chzn_container.prev('.chosen-select').trigger('chosen:updated'));
      return false;
    });
    // $('.chosen-select').forEach(function(i,e){
    //   init_work_days(e);
    // });
  }
};

function init_work_days(element) {
    $(element).on('chosen:ready', function(evt, params) {
      if (params.chosen.is_multiple) {
        $(params.chosen.container).find('.chzn-choices').append($('<li class="chzn-choices-arrow" />'));
      }
    }).on('chosen:showing_dropdown', function(evt, params) {
      var firedEl, niceScrollBlock, open_chzn;
      open_chzn = params.chosen;
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
      var firedEl, niceScrollBlock, open_chzn;
      open_chzn = null;
      firedEl = $(evt.currentTarget);
      niceScrollBlock = firedEl.next('.chzn-container').find('.chzn-results');
      niceScrollBlock.getNiceScroll().hide();
    }).change(function(e) {
      updateDaysRow($(e.target));
    });
    // .chosen({
    //   autohide_results_multiple: false,
    //   allow_single_deselect: true,
    //   width: '100%'
    // });
}

angular.module('practice.doctor').controller('DoctorProfileController', ['$rootScope', '$scope', 'Alerts', '$state', '$stateParams', 'Doctor', 'Settings', 'ValueList', DoctorProfileController]);
