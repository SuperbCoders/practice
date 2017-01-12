angular
  .module('practice.doctor')
  .filter('phone', function () {
    return function (phone) {
      if (typeof phone === 'string') {
        return phone.replace(/(...)(...)(..)(..)/, '+7 ($1) $2-$3-$4')
      }
    }
  });

