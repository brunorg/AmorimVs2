

var app = angular.module('app',['app.controllers','ngRoute']);

//creating route
app.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){	

	$locationProvider.html5Mode(true);
	
	$routeProvider.
			when('/',{controller:'geralCTRL', templateUrl:'index.html'});			
			
}]);



