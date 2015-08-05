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
        };

        return factory;

    }]);