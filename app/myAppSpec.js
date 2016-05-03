describe('test redirecting methods', function(){
    //first get an instance of the controller
    beforeEach(angular.mock.module('myApp'));


    //set up some test variables to store the injected services we need to run the test
    var testControllerObject;
    var testLocationObject;
    var testGetCountriesObject;

    //create a fake scope object to run the tests
    var $fakeScope={};

    //now inject the services from the angular testModule
    beforeEach(angular.mock.inject(function ($controller, $location, getCountries) {

        //store the controller object in a new test object
        testControllerObject = $controller;

        //store the location object in a new test object
        testLocationObject = $location;

        //store the getCountries factory object in a new test object
        testGetCountriesObject = getCountries;

    }));


    it('homeCtrl: should set the $location.path variable to "/countries" when $scope.redirect() is called', function(){

        //instantiate the test controller object
        testControllerObject('homeCtrl', {$scope: $fakeScope});

        //watch the fake location object's method path()
        spyOn(testLocationObject, 'path');

        ////call the $scope.redirect method using the fake $scope object
        $fakeScope.redirect();

        //check that the fake location object's path() method has been called with '/countries'
        expect(testLocationObject.path).toHaveBeenCalledWith('/countries');

        //test passes!!!
    });

    it('countriesCtrl: should set the $location.path variable to "/countries" when $scope.redirect() is called', function(){

        //instantiate the test controller object
        testControllerObject('countriesCtrl', {$scope: $fakeScope});

        //watch the fake location object's method path()
        spyOn(testLocationObject, 'path');

        ////call the $scope.redirect method using the fake $scope object
        $fakeScope.redirect();

        //check that the fake location object's path() method has been called with '/countries'
        expect(testLocationObject.path).toHaveBeenCalledWith('/');

    });

    it('countriesCtrl: should set the $location.path variable to "/countries/test/capital" when $scope.link(test) is called', function(){

        //instantiate the test controller object
        testControllerObject('countriesCtrl', {$scope: $fakeScope});

        //watch the fake location object's method path()
        spyOn(testLocationObject, 'path');

        ////call the $scope.redirect method using the fake $scope object
        $fakeScope.link('test');

        //check that the fake location object's path() method has been called with '/countries'
        expect(testLocationObject.path).toHaveBeenCalledWith('/countries/test/capital');

    });

});

describe('test factory method "getCountries"', function(){

    beforeEach(angular.mock.module('myApp'));

    it('should make an http GET request', function(){

        angular.mock.module(function scopeProvider($provide){
            $provide.value('$scope', function(value){
                return value;
            });
        });

        inject(function(getCountries, $httpBackend){


            //create a fake JSON response
            var fakeJSONData = {
                'geonames': [{
                    'areaInSqKm': '468.0',
                    'capital': 'Andorra la Vella',
                    'continent': 'EU',
                    'continentName': 'Europe',
                    'countryCode': 'AD',
                    'countryName': 'Andorra',
                    'currencyCode': 'EUR',
                    'east': 1.7865427778319827,
                    'geonameId': 3041565,
                    'isoAlpha3': 'AND',
                    'isoNumeric': '020',
                    'languages': 'ca',
                    'north': 42.65604389629997,
                    'population': '84000',
                    'south': 42.42849259876837,
                    'west': 1.4071867141112762
                }]};

            var successObj = {};
            var errorObj = {};

            $httpBackend
                .when('GET', 'http://api.geonames.org/countryInfoJSON?username=jonwade')
                .respond(200, fakeJSONData);

            getCountries.then(function(response){successObj = response;}, function(error){errorObj = error;});

            $httpBackend.flush();

            expect(successObj.config.method).toBe('GET');


        });

    });

    it('should return a 200 status', function(){

        angular.mock.module(function scopeProvider($provide){
            $provide.value('$scope', function(value){
                return value;
            });
        });

        inject(function(getCountries, $httpBackend){


            //create a fake JSON response
            var fakeJSONData = {
                'geonames': [{
                    'areaInSqKm': '468.0',
                    'capital': 'Andorra la Vella',
                    'continent': 'EU',
                    'continentName': 'Europe',
                    'countryCode': 'AD',
                    'countryName': 'Andorra',
                    'currencyCode': 'EUR',
                    'east': 1.7865427778319827,
                    'geonameId': 3041565,
                    'isoAlpha3': 'AND',
                    'isoNumeric': '020',
                    'languages': 'ca',
                    'north': 42.65604389629997,
                    'population': '84000',
                    'south': 42.42849259876837,
                    'west': 1.4071867141112762
                }]};

            var successObj = {};
            var errorObj = {};

            $httpBackend
                .when('GET', 'http://api.geonames.org/countryInfoJSON?username=jonwade')
                .respond(200, fakeJSONData);

            getCountries.then(function(response){successObj = response;}, function(error){errorObj = error;});

            $httpBackend.flush();

            expect(successObj.status).toBe(200);


        });

    });

    it('should return a population for geonames[0] of "84000"', function(){

        angular.mock.module(function scopeProvider($provide){
            $provide.value('$scope', function(value){
                return value;
            });
        });

        inject(function(getCountries, $httpBackend){


            //create a fake JSON response
            var fakeJSONData = {
                'geonames': [{
                    'areaInSqKm': '468.0',
                    'capital': 'Andorra la Vella',
                    'continent': 'EU',
                    'continentName': 'Europe',
                    'countryCode': 'AD',
                    'countryName': 'Andorra',
                    'currencyCode': 'EUR',
                    'east': 1.7865427778319827,
                    'geonameId': 3041565,
                    'isoAlpha3': 'AND',
                    'isoNumeric': '020',
                    'languages': 'ca',
                    'north': 42.65604389629997,
                    'population': '84000',
                    'south': 42.42849259876837,
                    'west': 1.4071867141112762
                }]};

            var successObj = {};
            var errorObj = {};

            $httpBackend
                .when('GET', 'http://api.geonames.org/countryInfoJSON?username=jonwade')
                .respond(200, fakeJSONData);

            getCountries.then(function(response){successObj = response;}, function(error){errorObj = error;});

            $httpBackend.flush();

            expect(successObj.data.geonames[0].population).toBe('84000');


        });

    });

    it('should return an error status of 100', function(){

        angular.mock.module(function scopeProvider($provide){
            $provide.value('$scope', function(value){
                return value;
            });
        });

        inject(function(getCountries, $httpBackend){

            var successObj = {};
            var errorObj = {};

            $httpBackend
                .when('GET', 'http://api.geonames.org/countryInfoJSON?username=jonwade')
                .respond(100, null);

            getCountries.then(function(response){successObj = response;}, function(error){errorObj = error;});

            $httpBackend.flush();

            expect(errorObj.status).toBe(100);


        });

    });

    it('countriesCtrl: $scope.countryObject.Country0.name should be "Andorra"', function(){


        angular.mock.module(function scopeProvider($provide){
            $provide.value('$scope', function(value){
                return value;
            });
        });

        var $fakeScope = {};
        var testControllerObject;

        inject(function(getCountries, $httpBackend, $controller){

            testControllerObject = $controller;

            testControllerObject('countriesCtrl', {$scope: $fakeScope});

            //create a fake JSON response
            var fakeJSONData = {
                'geonames': [{
                    'areaInSqKm': '468.0',
                    'capital': 'Andorra la Vella',
                    'continent': 'EU',
                    'continentName': 'Europe',
                    'countryCode': 'AD',
                    'countryName': 'Andorra',
                    'currencyCode': 'EUR',
                    'east': 1.7865427778319827,
                    'geonameId': 3041565,
                    'isoAlpha3': 'AND',
                    'isoNumeric': '020',
                    'languages': 'ca',
                    'north': 42.65604389629997,
                    'population': '84000',
                    'south': 42.42849259876837,
                    'west': 1.4071867141112762
                }]};

            var successObj = {};
            var errorObj = {};

            $httpBackend
                .when('GET', 'http://api.geonames.org/countryInfoJSON?username=jonwade')
                .respond(200, fakeJSONData);

            getCountries.then(function(response){successObj = response;}, function(error){errorObj = error;});

            $httpBackend.flush();

            console.log('Hello = ', $fakeScope.countryObject);

            expect($fakeScope.countryObject.Country0.name).toBe('Andorra');


        });

    });


});

describe('test capitalCtrl methods', function() {
    beforeEach(module('myApp'));

    var ctrl, scope, route, location;
    beforeEach(inject(function($controller, $rootScope, $route, $location){
        scope = $rootScope.$new();
        $route.current = { params: { myId: 'test' } };
        route = $route;
        location = $location;
        ctrl = $controller('capitalCtrl', {
            $scope: scope,
            $route: route
        });

    }));

    it('calling $scope.home() should call $location.path("/")', function(){

        //console.log('Doing something', scope.home());
        //console.log(route.current);
        spyOn(location, 'path');
        scope.home();
        expect(location.path).toHaveBeenCalledWith('/');

    });

    it('calling $scope.countries() should call $location.path("/countries")', function(){

        //console.log('Doing something', scope.home());
        //console.log(route.current);
        spyOn(location, 'path');

        scope.countries();
        expect(location.path).toHaveBeenCalledWith('/countries');

    });

    it('calling $scope.redirect("andorra") should call $location.path("/countries/andorra/capital")', function(){

        //console.log('Doing something', scope.home());
        //console.log(route.current);
        spyOn(location, 'path');

        scope.redirect('andorra');
        expect(location.path).toHaveBeenCalledWith('/countries/andorra/capital');

    });


});

describe('test capitalCtrl "countryObject"', function(){
    beforeEach(module('myApp'));

    it('capitalCtrl: $scope.countryObject.andorra.name should be "Andorra"', function(){

        inject(function($controller, $rootScope, $route, $location, $httpBackend, getCountries) {

            var ctrl, scope, route, location;

            //create a fake JSON response
            var fakeJSONData = {
                'geonames': [{
                    'areaInSqKm': '468.0',
                    'capital': 'Andorra la Vella',
                    'continent': 'EU',
                    'continentName': 'Europe',
                    'countryCode': 'AD',
                    'countryName': 'Andorra',
                    'currencyCode': 'EUR',
                    'east': 1.7865427778319827,
                    'geonameId': 3041565,
                    'isoAlpha3': 'AND',
                    'isoNumeric': '020',
                    'languages': 'ca',
                    'north': 42.65604389629997,
                    'population': '84000',
                    'south': 42.42849259876837,
                    'west': 1.4071867141112762
                }]
            };

            var successObj = {};
            var errorObj = {};


            scope = $rootScope.$new();
            $route.current = {params: {myId: 'test'}};
            route = $route;
            location = $location;
            ctrl = $controller('capitalCtrl', {
                $scope: scope,
                $route: route
            });

            $httpBackend.expectGET('http://api.geonames.org/countryInfoJSON?username=jonwade')
                .respond(200, fakeJSONData);

            //no idea what service is calling this, but this seems to get rid of the error message that was stopping the test executing
            $httpBackend.expectGET('./home/home.html').respond(200, null);

            getCountries.then(function (response) {
                successObj = response;
            }, function (error) {
                errorObj = error;
            });

            $httpBackend.flush();
            $rootScope.$digest;

            expect(scope.countryObject.Andorra.name).toBe('Andorra');

        });

    });

    it('capitalCtrl: getNeighbours("andorra") should set $scope.capitalPopulation to 20,430', function(){

        inject(function($controller, $rootScope, $route, $location, $httpBackend) {

            var ctrl, scope, route, location;

            //create a fake JSON response
            var fakeJSONData = {
                'geonames': [{
                    'areaInSqKm': '468.0',
                    'capital': 'Andorra la Vella',
                    'continent': 'EU',
                    'continentName': 'Europe',
                    'countryCode': 'AD',
                    'countryName': 'Andorra',
                    'currencyCode': 'EUR',
                    'east': 1.7865427778319827,
                    'geonameId': 3041565,
                    'isoAlpha3': 'AND',
                    'isoNumeric': '020',
                    'languages': 'ca',
                    'north': 42.65604389629997,
                    'population': '84000',
                    'south': 42.42849259876837,
                    'west': 1.4071867141112762
                }]
            };

            var fakeJSONCapitalData = {
                'geonames': [{
                    'population': 20430
                }]
            };

            var successObj = {};
            var errorObj = {};


            scope = $rootScope.$new();
            $route.current = {params: {myId: 'test'}};
            route = $route;
            location = $location;
            ctrl = $controller('capitalCtrl', {
                $scope: scope,
                $route: route,
            });


            $httpBackend.expectGET('http://api.geonames.org/countryInfoJSON?username=jonwade')
                .respond(200, fakeJSONData);

            $httpBackend.expectGET('http://api.geonames.org/searchJSON?country=andorra&q=q&username=jonwade')
                .respond(200, fakeJSONCapitalData);

            //no idea what service is calling this, but this seems to get rid of the error message that was stopping the test executing
            $httpBackend.expectGET('./home/home.html').respond(200, null);

            scope.getCapitalData('q', 'andorra');

            $httpBackend.flush();
            $rootScope.$digest;

            expect(scope.capitalPopulation).toBe(20430);

        });

    });

    it('capitalCtrl: getNeighbours("andorra") should set $scope.neighbourArray[0] to be "France" and $scope.neighbourArray[1] to be "Spain"]', function(){

        inject(function($controller, $rootScope, $route, $location, $httpBackend) {

            var ctrl, scope, route, location;

            //create a fake JSON response
            var fakeJSONData = {
                'geonames': [{
                    'areaInSqKm': '468.0',
                    'capital': 'Andorra la Vella',
                    'continent': 'EU',
                    'continentName': 'Europe',
                    'countryCode': 'AD',
                    'countryName': 'Andorra',
                    'currencyCode': 'EUR',
                    'east': 1.7865427778319827,
                    'geonameId': 3041565,
                    'isoAlpha3': 'AND',
                    'isoNumeric': '020',
                    'languages': 'ca',
                    'north': 42.65604389629997,
                    'population': '84000',
                    'south': 42.42849259876837,
                    'west': 1.4071867141112762
                }]
            };

            var fakeJSONNeighbourData = {
                'geonames': [{'countryName': 'France'}, {'countryName': 'Spain'}]
            };

            var successObj = {};
            var errorObj = {};


            scope = $rootScope.$new();
            $route.current = {params: {myId: 'test'}};
            route = $route;
            location = $location;
            ctrl = $controller('capitalCtrl', {
                $scope: scope,
                $route: route
            });


            $httpBackend.expectGET('http://api.geonames.org/countryInfoJSON?username=jonwade')
                .respond(200, fakeJSONData);

            $httpBackend.expectGET('http://api.geonames.org/neighboursJSON?country=andorra&username=jonwade')
                .respond(200, fakeJSONNeighbourData);

            //no idea what service is calling this, but this seems to get rid of the error message that was stopping the test executing
            $httpBackend.expectGET('./home/home.html').respond(200, null);

            scope.getNeighbours('andorra');

            $httpBackend.flush();
            $rootScope.$digest;

            expect(scope.neighbourArray[0]).toBe('France');
            expect(scope.neighbourArray[1]).toBe('Spain');

        });

    });



});



