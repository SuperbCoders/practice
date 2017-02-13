angular
  .module('practice.doctor')
  .filter('format_date', function () {
    return function (date) {
      var monts = {
        "January": "января",
        "February": "февраля",
        "March": "марта",
        "April": "апреля",
        "May": "мая",
        "June": "июня",
        "July": "июля",
        "August": "августа",
        "September": "сентября",
        "October": "октября",
        "November": "ноября",
        "December": "декабря"
      };
      return moment(date).format('DD') + ' '+ monts[moment(date).locale('en').format('MMMM')] + ', в ' + moment(date).format('HH:mm');
    }
  });

