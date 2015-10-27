var app = angular.module('app',['ngRoute']);

//creating route
app.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){	

	$locationProvider.html5Mode(true);

	$routeProvider.
	when('/',{controller:'loginCTRL', templateUrl:'index.html'});
}]);



