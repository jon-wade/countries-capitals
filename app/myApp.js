angular.module('myApp', ['ngRoute', 'ngAnimate'])
    .factory('getCountries', ['$http', function($http){
        var url='http://api.geonames.org/countryInfoJSON';
        var params = {
            'username': 'jonwade'
        };

        return $http({
            'url': url,
            'params': params,
            'method': 'GET'
        })
            .success(function(response){
                console.log('SUCCESS!');
                console.log(response);
            })
            .error(function(response){
                console.log('ERROR!');
                console.log(response);
            });

    }])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: './home/home.html',
                controller: 'homeCtrl'
            })
            .when('/countries', {
                templateUrl: './countries/countries.html',
                controller: 'countriesCtrl'
            })
            .when('/countries/:country/capital', {
                templateUrl: './capital/capital.html',
                controller: 'capitalCtrl'
            })
            .otherwise('/')}])
    .controller('homeCtrl', ['$location', '$scope', function($location, $scope){
        //home page controller code here
        $scope.redirect = function(){
            $location.path('/countries');
        }

    }])
    .controller('countriesCtrl', ['$location', '$scope', 'getCountries', function($location, $scope, getCountries){
        //countries page controller code here
        $scope.redirect = function(){
            $location.path('/');
        };

        getCountries;


    }])
    .controller('capitalCtrl', [function(){
        //capital page controller code here

    }]);
