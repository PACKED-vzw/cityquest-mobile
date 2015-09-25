var resultDiv;

document.addEventListener("deviceready", init, false);
function init() {
    document.querySelector("#startScan").addEventListener("touchend", startScan, false);
    resultDiv = document.querySelector("#results");
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
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|local|data|filesystem|file):/);

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
            .state ('splash', {
                /* Splash state; controller decides whether to ask for a new quest (/load) or (re)start an existing one (/landing) */
                url: '/splash',
                templateUrl: 'templates/cityquest-loading.html',
                controller: 'CityquestSplashCtrl'
            })
            .state('load', {
                url: '/load',
                templateUrl: 'templates/load-quest.html',
                controller: 'CityquestLoadCtrl'
            })
            .state ('landing', {
                url: '/landing',
                templateUrl: 'templates/cityquest-landing.html',
                controller: 'CityquestLandingCtrl'
            })
            .state ('fetch', {
                url: '/fetch/:key',
                templateUrl: 'templates/cityquest-loading.html',
                controller: 'CityquestFetchCtrl',
                resolve: {
                    quest: ['$http', '$stateParams', function ($http, $stateParams) {
                        /* Get the quest. The quest can be stored in localstorage, if not, get from remote */
                        var config = new ConfigSettings();
                        if (localStorage.getItem ('quest') !== null) {
                            /* Load quest from LocalStorage */
                            console.log ('local');
                            var localQuest = JSON.parse (window.localStorage['quest']);
                            if (localQuest.details.publishkey != $stateParams.key) {
                                console.log ('remote_after_local');
                                return $http.get (config.read('url') + '/en/api/key/' + $stateParams.key).then (function (data) {
                                    return data.data;
                                });
                            } else {
                                return localQuest;
                            }
                        } else {
                            console.log ('remote');
                            return $http.get (config.read('url') + '/en/api/key/' + $stateParams.key).then (function (data) {
                                return data.data;
                            });
                        }
                    }],
                    progress: function () {
                        if (localStorage.getItem ('progress') !== null) {
                            return JSON.parse (window.localStorage['progress']);
                        }
                    }
                }
        });


        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/splash');

        $translateProvider.useStaticFilesLoader ({
            prefix: 'lang/',
            suffix: '.json'
        });
        $translateProvider.registerAvailableLanguageKeys (['ca_ES', 'en_GB', 'es_ES', 'it_IT', 'lt_LT', 'nl_BE', 'de_DE'], {
            'nl': 'nl_BE',
            'es': 'es_ES',
            'ca': 'ca_ES',
            'it': 'it_IT',
            'lt': 'lt_LT',
            'en': 'en_GB',
            'de': 'de_DE'
        }).determinePreferredLanguage ();
        $translateProvider.fallbackLanguage('en_GB');

    });
