angular
  .module('practice.doctor')
  .filter('phone', function () {
    return function (phone) {
      if (typeof phone === 'string') {
        return phone.replace(/(.)(...)(...)(..)(..)/, '+$1 ($2) $3-$4-$5')
      }
    }
  });

