var app = angular.module('practice.doctor')

app.factory('Faye', ['$faye', function($faye){
  // return $faye("http://127.0.0.1:9292/faye");
  return $faye("http://localhost:9292/faye");
}]);
