var app = angular.module('practice.doctor')

app.factory('Faye', ['$faye', 'envService', function($faye, envService){
  console.log('environment');
  console.log(envService.get());
  if (envService.get() == 'development') {
    return $faye("http://localhost:9292/faye");
  } else {
    return $faye("http://dev-pract.robo-t.ru:9292/faye");
  }
}]);
