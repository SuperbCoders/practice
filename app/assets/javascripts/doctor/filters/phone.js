angular
  .module('practice.doctor')
  .filter('phone', function () {
    return function (phone) {
      return phone.replace(/(...)(...)(..)(..)/, '+7 ($1) $2-$3-$4')
    }
  });

