angular.module('cityquest.services', ['ngResource'])



.factory('QRScanService', [function () {


        return {
            scan: function(success, fail) {
                cordova.plugins.barcodeScanner.scan(
                    function (result) { success(result); },
                    function (error) { fail(error); }
                );
            }
        };


    }])

.factory('ProgressTrackerService', [function () {


        var factory = {};

        factory.createTracker = function(items, order){
            var itemTracker = new Array();
            for(var i=0; i < items.length; i++){
                if(order > i){
                    itemTracker.push('majortrckr-done');
                }
                else {
                    itemTracker.push('majortrckr-todo');
                }
            }

            return itemTracker;
        }

        return factory;

    }])
    .factory ("questService", ['$resource', function ($resource) {
        var url = 'http://cityquest.be/en/api/key/:key';
        return $resource (url, {key: '@key'});
    }])
    .factory ("questIndexInitialData", ['questService', '$q', '$timeout', function (questService, $q, $timeout) {
        var kinstance = function () {};
        kinstance.prototype.solve = function (param) {
            console.log (param);/*
            return function () {
                console.log ('test');
                var delay = $q.defer ();
                console.log ($stateParams);
                //$timeout (function () {
                    questService.get ({key: param}, function (questService) {
                        delay.resolve (questService);
                    })
                //}, 2000);
                return delay.promise;
            };*/
        };
        return kinstance;
}]);