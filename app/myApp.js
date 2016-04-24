angular.module('myApp', ['ngRoute', 'ngAnimate'])
    .factory('getCountries', ['$http', function($http){

        var url = 'http://api.geonames.org/countryInfoJSON';
        var params = {
            'username': 'jonwade'
        };

        return $http({
            'url': url,
            'params': params,
            'method': 'GET',
            'cache': true
        })
            .success(function (response) {
                console.log('SUCCESS!');
                //console.log(response);

            })
            .error(function (response) {
                console.log('ERROR!');
                //console.log(response);
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
        };
    }])
    .controller('countriesCtrl', ['$location', '$scope', 'getCountries', function($location, $scope, getCountries){

        //$scope methods here
        $scope.redirect = function(){
            $location.path('/');
        };

        $scope.link = function(name){
            //this method passes in the country name of table-row clicked
            //console.log(name);
            $location.path('/countries/' + name + '/capital');
        };

        //get data from factory and store
        $scope.countryObject = {};
        getCountries.then(function(response) {

            //log the raw return object
            console.log(response);

            //store the required data for the table in objects within an object
            for (var i=0; i<response.data.geonames.length; i++)
            {
                $scope.countryObject['Country' + i] = {
                    'name': response.data.geonames[i].countryName,
                    'countryCode': response.data.geonames[i].countryCode,
                    'capital': response.data.geonames[i].capital,
                    'area': response.data.geonames[i].areaInSqKm,
                    'population': response.data.geonames[i].population,
                    'continent': response.data.geonames[i].continent,
                };
            }
            console.log($scope.countryObject);

        });

    }])
    .controller('capitalCtrl', ['$scope', '$location', 'getCountries', '$route', '$http', function($scope, $location, getCountries, $route, $http){
        //capital page controller code here
        $scope.home = function() {
            $location.path('/');
        };

        $scope.countries = function() {
            $location.path('/countries');
        };

        $scope.urlToken = $route.current.params.country;
        console.log($scope.urlToken);


        //get data from factory and store (SAME AS PREVIOUS CONTROLLER - NOT DRY!!!)
        $scope.countryObject = {};
        getCountries.then(function(response) {

            //log the raw return object
            console.log(response);

            //store the required data for the table in objects within an object
            for (var i=0; i<response.data.geonames.length; i++)
            {
                $scope.countryObject[response.data.geonames[i].countryName] = {
                    'name': response.data.geonames[i].countryName,
                    'countryCode': response.data.geonames[i].countryCode,
                    'capital': response.data.geonames[i].capital,
                    'area': response.data.geonames[i].areaInSqKm,
                    'population': response.data.geonames[i].population,
                    'continent': response.data.geonames[i].continent,
                    'east': response.data.geonames[i].east,
                    'west': response.data.geonames[i].west,
                    'north': response.data.geonames[i].north,
                    'south': response.data.geonames[i].south,
                };
            }
            console.log($scope.countryObject);

        });

        function getCapitalData(q, country) {
            var url = 'http://api.geonames.org/searchJSON';
            var params = {
                username: 'jonwade',
                q: q,
                country: country
            };

            $http({
                url: url,
                params: params,
                method: 'GET'
            })
                .success(function (response) {
                    console.log('CAPITAL SUCCESS!');
                    console.log(response.geonames[0].population);
                    $scope.capitalPopulation = response.geonames[0].population;

                })
                .error(function (response) {
                    console.log('ERROR');
                });
        }

        function getNeighbours(country) {
            var url = 'http://api.geonames.org/neighboursJSON';
            var params = {
                username: 'jonwade',
                country: country
            };

            $scope.neighbourArray = [];

            $http({
                url: url,
                params: params,
                method: 'GET'
            })
                .success(function (response) {
                    console.log('NEIGHBOUR SUCCESS!');
                    console.log(response);
                    $scope.numNeighbours = response.geonames.length;
                    for (var i=0; i<response.geonames.length; i++){
                        $scope.neighbourArray[i] = response.geonames[i].name;
                    }

                })
                .error(function (response) {
                    console.log('ERROR');
                });

        }

        function getTimeZone(lng, lat){
            var url = 'http://api.geonames.org/timezoneJSON';
            var params = {
                username: 'jonwade',
                lat: lat,
                lng: lng,
                radius: 200
            };

            //$scope.neighbourArray = [];

            $http({
                url: url,
                params: params,
                method: 'GET'
            })
                .success(function (response) {
                    console.log('TIMEZONE SUCCESS!');
                    console.log(response);
                    $scope.timezoneGMT = response.gmtOffset;
                    if ($scope.timezoneGMT <0) {
                        $scope.minus = true;
                    }
                    //$scope.numNeighbours = response.geonames.length;
                    //for (var i=0; i<response.geonames.length; i++){
                    //    $scope.neighbourArray[i] = response.geonames[i].name;
                    //}

                })
                .error(function (response) {
                    console.log('ERROR');
                });
        }

        function checkObject(){
            console.log('Checking countryObject...');
            if ($scope.countryObject[$scope.urlToken] != undefined){
                getCapitalData($scope.countryObject[$scope.urlToken].capital, $scope.countryObject[$scope.urlToken].countryCode);
                getNeighbours($scope.countryObject[$scope.urlToken].countryCode);

                var avgLongitude = ($scope.countryObject[$scope.urlToken].east + $scope.countryObject[$scope.urlToken].west)/2;
                var avgLatitude = ($scope.countryObject[$scope.urlToken].north + $scope.countryObject[$scope.urlToken].south)/2;

                getTimeZone(avgLongitude, avgLatitude);


                $scope.lowerCaseCountryCode = $scope.countryObject[$scope.urlToken].countryCode.toLowerCase();
                $scope.flagURL = 'http://www.geonames.org/flags/x/' + $scope.lowerCaseCountryCode + '.gif';
                $scope.mapURL = 'http://www.geonames.org/img/country/250/' + $scope.countryObject[$scope.urlToken].countryCode + '.png'
            }
            else {
                console.log('Nope, not yet...waiting a second');
                setTimeout(function(){checkObject();}, 500);
            }
        }
        console.log('Checking to see if the countryObject has updated...');
        checkObject();














    }]);
