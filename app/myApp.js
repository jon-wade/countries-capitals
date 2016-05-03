angular.module('myApp', ['ngRoute', 'ngAnimate'])
    .run(['$rootScope', '$location', '$timeout', function($rootScope, $location, $timeout) {
        //redirects to the home page if any routing errors
        $rootScope.$on('$routeChangeError', function() {
            $location.path('/');
        });

        //when URL changes, set class to add loading spinner
        $rootScope.$on('$routeChangeSuccess', function() {
            $rootScope.isLoading = true;
            console.log($rootScope.isLoading);
        });

        //when loading finished, after 1 second, remove loading spinner
        $rootScope.$on('$routeChangeSuccess', function() {
            $timeout(function() {
                $rootScope.isLoading = false;
            }, 1000);
        });

    }])
    .factory('getCountries', ['$http', function($http){

        var url = 'http://api.geonames.org/countryInfoJSON';
        var params = {
            'username': 'jonwade'
        };

        return $http({
            'url': url,
            'params': params,
            'method': 'GET',
            //ensure this factory method only accesses the API once
            'cache': true
        })
            .success(function(response) {
                console.log('SUCCESS: ', response);
                return response;

            })
            .error(function(error) {
                console.log('ERROR:', error);
                return error;
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
        $scope.redirect = function(){
            $location.path('/countries');
        };
    }])
    .controller('countriesCtrl', ['$location', '$scope', 'getCountries', function($location, $scope, getCountries){
        $scope.redirect = function(){
            $location.path('/');
        };

        $scope.link = function(name){
            //this method passes in the country name of table-row clicked
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
                    'continent': response.data.geonames[i].continent
                };
            }
            console.log($scope.countryObject);

        });

    }])

    .controller('capitalCtrl', ['$scope', '$location', 'getCountries', '$route', '$http', '$q', function($scope, $location, getCountries, $route, $http, $q){
        $scope.home = function() {
            $location.path('/');
            return 'Falright';
        };

        $scope.countries = function() {
            $location.path('/countries');
        };

        //this function redirects from a capital page to a neighbour's capital page
        $scope.redirect = function(destination) {
            $location.path('/countries/' + destination + '/capital')
        };

        //this grabs the country name token from the current URL and  stores it in a variable
        $scope.urlToken = $route.current.params.country;

        console.log('$scope.urlToken = ', $scope.urlToken);

        //get data from factory and store (SAME AS PREVIOUS CONTROLLER - NOT DRY!!!)
        $scope.countryObject = {};
        getCountries.then(function(response) {

            //log the raw return object
            console.log(response);

            //store the required data for the table in an object per country within an object
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
                    'south': response.data.geonames[i].south
                };
            }
            console.log($scope.countryObject);

        });

        $scope.getCapitalData = function(q, country) {
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
                .error(function () {
                    console.log('ERROR');
                });
        }

        $scope.getNeighbours = function(country) {
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
                        $scope.neighbourArray[i] = response.geonames[i].countryName;
                    }

                })
                .error(function () {
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
                })
                .error(function () {
                    console.log('ERROR');
                });
        }

        function getFlagsMaps(){
            return $q(function(resolve) {
            //create map failure object
            var mapFail = new Image();
                mapFail.src = 'capital/map-fail.png';

            //create image object to store flag and add to countryObject
            var flag = new Image();
            flag.src = 'http://www.geonames.org/flags/x/' + $scope.countryObject[$scope.urlToken].countryCode.toLowerCase() + '.gif';
            $scope.countryObject[$scope.urlToken].flag = flag;

            //create image object to store map and add to countryObject
            var map = new Image();
            //error branching here as some maps are not available on the server
            var cc = $scope.countryObject[$scope.urlToken].countryCode;
            if (cc == 'HK' || cc == 'BQ'|| cc == 'CW' || cc == 'ME' || cc == 'PS' || cc == 'RS' || cc == 'SX' || cc == 'UM' || cc == 'VI') {
                console.log('Load error image here');
                $scope.countryObject[$scope.urlToken].map = mapFail;
            }
            else {
                map.src = 'http://www.geonames.org/img/country/250/' + $scope.countryObject[$scope.urlToken].countryCode + '.png';
                $scope.countryObject[$scope.urlToken].map = map;
            }

            function checkStored(){
                if($scope.countryObject[$scope.urlToken].map.width >0 && $scope.countryObject[$scope.urlToken].flag.width >0){
                    var currentMapWidth = $scope.countryObject[$scope.urlToken].map.width;
                    var currentMapHeight = $scope.countryObject[$scope.urlToken].map.height;
                    $scope.countryObject[$scope.urlToken].map.height = 200;
                    $scope.countryObject[$scope.urlToken].map.width = (200/currentMapHeight)*currentMapWidth;

                    //deal with oversize maps bug
                    if($scope.countryObject[$scope.urlToken].map.width >350) {

                        $scope.countryObject[$scope.urlToken].map.height = (350/$scope.countryObject[$scope.urlToken].map.width)*($scope.countryObject[$scope.urlToken].map.height);
                        $scope.countryObject[$scope.urlToken].map.width = 350;
                    }

                    var currentFlagWidth = $scope.countryObject[$scope.urlToken].flag.width;
                    var currentFlagHeight = $scope.countryObject[$scope.urlToken].flag.height;
                    $scope.countryObject[$scope.urlToken].flag.height = 200;
                    $scope.countryObject[$scope.urlToken].flag.width = (200/currentFlagHeight)*currentFlagWidth;

                    resolve();
                }
                else {
                    console.log('Checking again...');
                    setTimeout(function(){checkStored()}, 500);
                }
            }
            checkStored();

            })
        }

        //this waits until the countryObject storage is complete before proceeding with calling other functions
        function checkObject(){
            console.log('Checking countryObject...');
            if ($scope.countryObject[$scope.urlToken] != undefined){
                $scope.getCapitalData($scope.countryObject[$scope.urlToken].capital, $scope.countryObject[$scope.urlToken].countryCode);
                $scope.getNeighbours($scope.countryObject[$scope.urlToken].countryCode);

                //work out average longitude and latitude to obtain timezone from the API
                var avgLongitude = ($scope.countryObject[$scope.urlToken].east + $scope.countryObject[$scope.urlToken].west)/2;
                var avgLatitude = ($scope.countryObject[$scope.urlToken].north + $scope.countryObject[$scope.urlToken].south)/2;
                getTimeZone(avgLongitude, avgLatitude);

                //get map and flag images into the object
                getFlagsMaps().then(function(){
                    console.log('flag width = ' + $scope.countryObject[$scope.urlToken].flag.width);
                    console.log('flag height = ' + $scope.countryObject[$scope.urlToken].flag.height);
                    $scope.flagURL = $scope.countryObject[$scope.urlToken].flag.src;
                    $scope.mapURL = $scope.countryObject[$scope.urlToken].map.src;
                    $scope.mapWidth = $scope.countryObject[$scope.urlToken].map.width;
                    $scope.mapHeight = $scope.countryObject[$scope.urlToken].map.height;
                    $scope.flagHeight = $scope.countryObject[$scope.urlToken].flag.height;
                    $scope.flagWidth = $scope.countryObject[$scope.urlToken].flag.width;
                });
            }
            else {
                console.log('Nope, countryObject not defined...waiting half a second');
                setTimeout(function(){checkObject();}, 500);
            }
        }
        console.log('Checking to see if the countryObject has updated...');

        checkObject();

    }]);
