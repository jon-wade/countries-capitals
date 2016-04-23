angular.module('myApp', ['ngRoute', 'ngAnimate'])
    .factory('getCountries', ['$http', function($http){

        var url = 'http://api.geonames.org/countryInfoJSON';
        var params = {
            'username': 'jonwade'
        };

        return $http({
            'url': url,
            'params': params,
            'method': 'GET'
        })
            .success(function (response) {
                console.log('SUCCESS!');
                //console.log(response);

            });
            //.error(function (response) {
            //    console.log('ERROR!');
            //    //console.log(response);
            //});

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
        //$scope variables here
        $scope.countryArray = [[]];
        $scope.countryObject = {};




        //$scope methods here
        $scope.redirect = function(){
            $location.path('/');
        };


        //
        getCountries.then(function(response) {
            //log the raw return object
            console.log(response);

            //store the required data in a multi-dimensional array
            for (var i=0; i<response.data.geonames.length; i++)
            {
                $scope.countryArray[0][i] = response.data.geonames[i].countryName;
            }
            console.log($scope.countryArray);


            //as an alternative, store the required data in an object within an object
            for (var i=0; i<response.data.geonames.length; i++)
            {
                $scope.countryObject['Country' + i] = {'name': response.data.geonames[i].countryName};
            }
            console.log($scope.countryObject);





        });

    }])
    .controller('capitalCtrl', [function(){
        //capital page controller code here

    }]);
