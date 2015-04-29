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


.factory ('Item', ['$resource',
    function ($resource) {
        return $resource ('http://localhost:8000/api/en/quest/:quest/item/:id', {quest: '@quest', id: '@id'});
    }
])
/*
.factory ('ItemLoader', ['$resource', '$q', '$http', function ($resource, $q, $http) {
    var factory = {
        query: function (id, quest) {
            $http.get ('http://localhost:8000/api/en/quest/' + quest + '/item/' + id).
                success (function (data, status) {
                return data;
            })
        }
    };
    return factory;
}]);
*/
.factory ('ItemLoader', function ($http) {
    return {
        fn: function (id, quest, callback) {
            $http.get ("http://localhost:8000/api/en/quest/" + quest + "/item/" + id).
            success (function (data) {
                callback (data);
            });
        }
    };
});