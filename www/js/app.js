var resultDiv;

document.addEventListener("deviceready", init, false);
function init() {
    document.querySelector("#startScan").addEventListener("touchend", startScan, false);
    resultDiv = document.querySelector("#results");
    ImgCache.init (function () {
        alert ('ImgCache init success!');
    }, function () {
        alert ('ImgCache init failed!');
    });
}

function startScan() {

    cordova.plugins.barcodeScanner.scan(
        function (result) {
            var s = "Result: " + result.text + "<br/>" +
                "Format: " + result.format + "<br/>" +
                "Cancelled: " + result.cancelled;
            resultDiv.innerHTML = s;
        },
        function (error) {
            alert("Scanning failed: " + error);
        }
    );

}

angular.module('cityquest', ['ionic', 'pascalprecht.translate', 'cityquest.services', 'cityquest.controllers', 'ngMap', 'ImgCache', 'ngCordova'])


    .config(function ($stateProvider, $urlRouterProvider, $translateProvider, ImgCacheProvider, $compileProvider) {

        /*
        ImgCache configuration (https://github.com/jBenes/angular-imgcache.js)
         */
        ImgCacheProvider.setOption ('debug', true);
        ImgCacheProvider.setOption ('usePersistentCache', true);
        ImgCacheProvider.setOption ('headers', { 'Connection': 'close' });
        ImgCacheProvider.manualInit = true;
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|local|data|filesystem):/);

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            .state('cityquest-index', {
                url: '/cityquest',
                templateUrl: 'templates/cityquest-index.html',
                controller: 'CityquestIndexCtrl'
            })

            .state('cityquest-stats', {
                url: '/stats',
                templateUrl: 'templates/cityquest-stats.html',
                controller: 'CityquestStatsCtrl'
            })

            .state('cityquest-settings', {
                url: '/settings',
                templateUrl: 'templates/cityquest-settings.html',
                controller: 'CityquestSettingsCtrl'
            })

            .state('item', {
                url: '/items/:itemId',
                templateUrl: 'templates/cityquest-item.html',
                controller: 'CityquestItemCtrl'
            })

            .state('complete', {
                url: '/complete',
                templateUrl: 'templates/cityquest-complete.html',
                controller: 'CityquestCompleteCtrl'
            })

            .state('map', {
                url: '/map',
                templateUrl: 'templates/cityquest-map.html',
                controller: 'CityquestMapCtrl'
            })

            .state('load', {
                url: '/load',
                templateUrl: 'templates/load-quest.html',
                controller: 'CityquestLoadCtrl'
            });


        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/load');

        $translateProvider.useStaticFilesLoader ({
            prefix: 'lang/',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('en_GB');
        $translateProvider.fallbackLanguage('en_GB');

    })

    .run (function ($ionicPlatform, ImgCache) {
    $ionicPlatform.ready (function () {
        ImgCache.$init (function () {
            alert ('Init success!');
        }, function () {
            alert ('Init failed!');
        });
    });
})
    
    ;
