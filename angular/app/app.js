var app = angular.module('app',['ngRoute']);

//creating route
app.config(['$routeProvider','$locationProvider',function($routeProvider){	
	
	$routeProvider.
			when('/',{controller:'loginCTRL', templateUrl:'index.html'});			
			
}]);



