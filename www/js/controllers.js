angular.module('cityquest.controllers', ['cityquest.services', 'ngCordova'])

    .controller ('CityquestSplashCtrl',
    function ($scope, $rootScope) {
        /* Controller that either forwards us to a load_new controller, or load_existing */
        if (localStorage.getItem ('quest') !== null) {
            /* Load existing */
            $scope.quest = JSON.parse (localStorage.getItem ('quest'));
            $rootScope.quest = $scope.quest;
            window.location = "#/landing";
        } else {
            /* Load new */
            window.location = "#/load";
        }
    })


    .controller ('CityquestFetchCtrl',
    function ($scope, quest, progress, $cordovaFileTransfer, $ionicPlatform, $timeout) {
        /* Controller that fetches the quest data */
        $scope.images_downloaded = false;
        $scope.errormsg = null;
        /* Image downloader */
        $scope.downloadImages = function () {
            /* Cache header image */
            var target = cordova.file.dataDirectory + $scope.quest.details.id;
            var source = $scope.quest.details.remote_imageFile;
            $cordovaFileTransfer.download (source, target, {}, true)
                .then (function (result) {
                console.log ('qdownload');
            }, function (error) {
                $scope.errormsg = JSON.stringify (error);
            }, function (progressed) {
                $timeout (function () {
                    console.log ('qwait');
                    $scope.downloadProgress = (progressed.loaded / progressed.total) * 100;
                })
            });
            /* Cache items */
            for (var i = 0; i < $scope.quest.details.items.length; i++) {
                console.log ('item' + i);
                target = cordova.file.dataDirectory + $scope.quest.details.id + '.' + $scope.quest.details.items[i].itemid;
                source = $scope.quest.details.items[i].remote_image;
                $cordovaFileTransfer.download (source, target, {}, true)
                    .then (function (result) {
                    console.log ('download');
                }, function (error) {
                    $scope.errormsg = JSON.stringify (error);
                }, function (progressed) {
                    $timeout (function () {
                        console.log ('wait');
                        $scope.downloadProgress = (progressed.loaded / progressed.total) * 100;
                    })
                });
                /* Cache hints */
                if (typeof ($scope.quest.details.items[i].hints) != 'undefined') {
                    for (var j = 0; j < $scope.quest.details.items[i].hints.length; j++) {
                        console.log ('hint' + j);
                        target = cordova.file.dataDirectory + $scope.quest.details.id + '.' + $scope.quest.details.items[i].hints[j].hint_id;
                        source = $scope.quest.details.items[i].hints[j].remote_image;
                        $cordovaFileTransfer.download (source, target, {}, true)
                            .then (function (result) {
                            console.log ('hdownload');
                        }, function (error) {
                            $scope.errormsg = JSON.stringify (error);
                        }, function (progressed) {
                            console.log ('hwait');
                            $scope.hdownloadProgress = (progressed.loaded / progressed.total) * 100;
                        })
                    }
                }
            }
        };

        /* Check if the items array is already parsed */
        if (typeof (quest.details.items) == 'string') {
            quest.details.items = JSON.parse (quest.details.items);
        }
        $scope.quest = quest;
        $scope.progress = progress;
        /* Download the images for the Quest */
        $ionicPlatform.ready (function () {
            console.log ('ready');
            //$scope.downloadImages ();
            $scope.images_downloaded = true;
        });
        /* If images_downloaded is true, redirect */
        $scope.$watch ('images_downloaded', function (newValue) {
            if (newValue == true) {
                //$scope.ff = cordova.file.dataDirectory + $scope.quest.details.items[0].itemid;
                localStorage.setItem ('quest', JSON.stringify ($scope.quest));
                if (typeof ($scope.progress) != 'undefined' && $scope.progress != null) {
                    localStorage.setItem ('progress', JSON.stringify ($scope.progress));
                }
            }
            window.location = "#/landing";
        });
    })

    .controller('CityquestLoadCtrl', function ($scope) {
        /* Controller that allows the user to enter a key in the form and redirects to the fetching controller, responsible for downloading the quest */
        $scope.loading = false;
        $scope.load = function () {
        };
        $scope.loadQuest = function (key){
            window.alert ('Loading quest ...');
            if (key == "" || key == null) {
                alert ("Error: your key may not be empty");
                $scope.loading = false;
            } else {
                $scope.loading = true;
                window.location = '#/fetch/' + key;
            }
        };
    })



    .controller ('CityquestLandingCtrl',
    function ($scope, $rootScope) {
        /* Controller that presents a start screen where the user may start the quest anew or continue */
        $scope.init = function (){
            // check if application has already loaded quest data in this session
            if (typeof $rootScope.quest !== "undefined" ){
                $scope.quest = $rootScope.quest;
            } else {
                // check if there is a localStorage session present
                if (localStorage.getItem("quest") !== null) {
                    // load quest from localstorage
                    $scope.quest = JSON.parse(localStorage.getItem ('quest'));
                    $rootScope.quest = $scope.quest;

                    // check if there is progress stored in local storage
                    if (localStorage.getItem("progress") !== null) {
                        // load quest from localstorage
                        $scope.progress = JSON.parse(localStorage.getItem ('progress'));
                        $rootScope.progress = $scope.progress;
                    }
                }
            }
        };
        $scope.init();
        console.log ($scope.quest);
        $scope.resumeQuest = function () {
            $rootScope.progress = $scope.progress;
            $rootScope.quest    = $scope.quest;

            if (typeof $scope.progress.activeItem === "undefined"){
                window.location = "#/cityquest";
            }
            else {
                window.location = "#/items/" +  $scope.progress.activeItem.order;
            }
        };

        $scope.startQuest = function () {
            if (!$scope.baseUrl){
                if (typeof ($scope.progress) == 'undefined') {
                    $scope.baseUrl = '';
                } else {
                    $scope.baseUrl = $scope.progress.baseUrl;
                }
            }

            // progress object will keep track of current quest
            $scope.progress                 = {};
            $scope.progress.timeStart       = Date.now();
            $scope.progress.hintsUsed       = 0;
            $scope.progress.hints           = {};
            $scope.progress.totalItemsFound = 0;
            $scope.progress.inventory       = [];
            $scope.progress.history         = {};
            $scope.progress.baseUrl         = $scope.baseUrl;

            window.localStorage['progress'] = JSON.stringify($scope.progress);

            $rootScope.progress = $scope.progress;
            $rootScope.quest    = $scope.quest;

            // redirect to start
            window.location = "#/cityquest";
        };

        $rootScope.quest = $scope.quest;
        $rootScope.progress = $scope.progress;
    })

    .controller('CityquestSettingsCtrl', function ($scope, $rootScope, $stateParams, ImgCache) {
        $scope.quest = $rootScope.quest;
        $scope.progress = $rootScope.progress;

        $scope.resetQuest = function(){
            delete $scope.quest;
            delete $scope.progress;
            delete $rootScope.quest;
            delete $rootScope.progress;
            localStorage.removeItem('quest');
            localStorage.removeItem('progress');
            window.location = '#/load';
            ImgCache.clearCache ();
        };
    })


    .controller('CityquestStatsCtrl', function ($scope, $rootScope, $stateParams, $ionicModal, ProgressTrackerService, ImgCache) {
        console.log ($scope.progress);

        $scope.convertMS = function(ms) {
            var d, h, m, s;
            s = Math.floor(ms / 1000);
            m = Math.floor(s / 60);
            s = s % 60;
            h = Math.floor(m / 60);
            m = m % 60;
            d = Math.floor(h / 24);
            h = h % 24;
            return { d: d, h: h, m: m, s: s };
        };

        $scope.progress         = $rootScope.progress;
        $scope.quest            = $rootScope.quest;
        $scope.progress.timeEnd = Date.now();
/*
        for (var i = 0; i < $scope.progress.inventory.length; i++) {
            ImgCache.$promise.then (function () {
                ImgCache.cacheFile ($scope.progress.inventory[i].remote_image);
            });
        }
*/
        $scope.progress.totalTime   = $scope.progress.timeEnd - $scope.progress.timeStart;
        $scope.progress.totalTimeHr = $scope.convertMS($scope.progress.totalTime);


        // DEDUPLICATE

        var order = 0;
        if(typeof($scope.progress.activeItem) !== "undefined"){
            order = $scope.progress.activeItem;
        }

        $scope.itemTracker = ProgressTrackerService.createTracker($scope.quest.details.items, order);

    })

    .controller('CityquestMapCtrl', function ($scope, $rootScope, $stateParams) {
        $scope.quest = $rootScope.quest;
        $scope.progress = $rootScope.progress;
        $scope.start = {
            lat: $scope.quest.details.map.startpoint.lat,
            long: $scope.quest.details.map.startpoint.lng
        };
        $scope.end = {
            lat: $scope.quest.details.map.endpoint.lat,
            long: $scope.quest.details.map.endpoint.lng
        };


    })

    .controller('CityquestInventoryCtrl', function ($scope, $rootScope, $stateParams) {
        $scope.quest = $rootScope.quest;
        $scope.progress = $rootScope.progress;

    })

    .controller('CityquestCompleteCtrl', function ($scope, $rootScope, $stateParams) {
        $scope.convertMS = function(ms) {
            var d, h, m, s;
            s = Math.floor(ms / 1000);
            m = Math.floor(s / 60);
            s = s % 60;
            h = Math.floor(m / 60);
            m = m % 60;
            d = Math.floor(h / 24);
            h = h % 24;
            return { d: d, h: h, m: m, s: s };
        };


        $scope.progress = $rootScope.progress;
        $scope.quest = $rootScope.quest;
        $scope.progress.timeEnd = Date.now();

        $scope.progress.totalTime = $scope.progress.timeEnd - $scope.progress.timeStart;
        $scope.progress.totalTimeHr = $scope.convertMS($scope.progress.totalTime);

    })

    .controller('CityquestIndexCtrl', function ($scope, $rootScope, $location, $state, ImgCache) {
        $scope.quest = $rootScope.quest;
        $scope.progress = $rootScope.progress;
        /* Force use of Cached File */
        if($scope.progress.activeItem){
            $state.go("item",{'itemId':$scope.progress.activeItem.order});
        }

    })


    .controller('CityquestItemCtrl', function ($scope, $rootScope, $stateParams, QRScanService, $ionicModal, ProgressTrackerService, ImgCache) {
        $scope.setCompletedState = function(){
            $scope.scanSuccess = true;
            var order = parseInt ($scope.currentItem.order, 10) + 1;
            $scope.itemTracker = ProgressTrackerService.createTracker($scope.quest.details.items, order);
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply($scope.scanSuccess);
            }
        };

        // Load the modal from the given template URL
        $ionicModal.fromTemplateUrl('modal.html', function($ionicModal) {
            $scope.modal = $ionicModal;
        }, {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope,
            // The animation we want to use for the modal entrance
            animation: 'slide-in-up'
        });

        $scope.enlargeImage = function(image, title){
            $scope.modalImage = image;
            $scope.modalTitle = title;
            $scope.modal.show();
        };
        /*$scope.getItemByValue = function (arr, value) {
            for (var i=0, iLen=arr.length; i<iLen; i++) {
                if (arr[i].order == value) return arr[i];
            }
        };*/
        /*
        Function to return an item by its order (item.order)
        Supports order of type "1" or "01"
        Sets missing variables
        @param array items
        @param string order
        @return object item
         */
        $scope.getItemByValue = function (items, order, quest) {
            order = parseInt (order, 10);
            for (var i = 0; i < items.length; i++) {
                if (items[i].order == order) {
                    var item = items[i];
                }
            }
            /*item = $scope.setMissingAttributes (item)*/;
            return item;
        };

        $scope.isCompleted = function(id) {
            if(id < $scope.currentItem ){
                return true;
            }
            return false;
        };


        $scope.quest = $rootScope.quest;
        console.log ($scope.quest);
        $scope.progress = $rootScope.progress;
        if (typeof ($rootScope.quest.details.items) == 'string') {
            $rootScope.quest.details.items = JSON.parse ($rootScope.quest.details.items);
        }
        $scope.checkIfLastItem = function(){
            console.log ('last');
            console.log (typeof $scope.getItemByValue($rootScope.quest.details.items, parseInt($stateParams.itemId, 10) + 1));
            if( typeof $scope.getItemByValue($rootScope.quest.details.items, parseInt($stateParams.itemId, 10) + 1) == 'undefined'){
                $scope.lastItem = true;
            }
        };

        $scope.checkIfLastItem();
        console.log ($scope.lastItem);

        /* Cache image */
        $scope.currentItem = $scope.getItemByValue($rootScope.quest.details.items, $stateParams.itemId);
        $scope.currentItem.cached_image = cordova.file.dataDirectory + $scope.quest.details.id + '.' + $scope.currentItem.itemid;
        $scope.cacheHint = function (hint) {
            return cordova.file.dataDirectory + $scope.quest.details.id + '.' + hint.hint_id;
        };

        console.log ('Current');
        console.log ($scope.currentItem);
        $scope.progress.activeItem = $scope.currentItem;

        $scope.scanSuccess = false;

        // item is completed
        if($scope.progress.history[$scope.currentItem.order]==="scanned"){
            $scope.setCompletedState();
        }
        else if($scope.progress.history[$scope.currentItem.order]==="skipped"){
            $scope.setCompletedState();
            $scope.skippedItem = true;
        }
        // item still needs to be completed
        else {
            $scope.itemTracker = ProgressTrackerService.createTracker($scope.quest.details.items, $scope.currentItem.order);

        }

        $scope.skipItem = function(){
            $scope.setCompletedState();
            $scope.progress.history[$scope.currentItem.order]="skipped";
            $scope.skippedItem = true;
        };


        $scope.showHint = function(){
            $scope.showHintHeader = true;
            $scope.progress.hints[$scope.currentItem.order]++;

            for (var i = 1; i <= $scope.progress.hints[$scope.currentItem.order]; i++) {
                $scope["hint" + i] = true;
            }
            $scope.progress.hintsUsed++;
        };

        $scope.showHintButton = function(){
            if ($scope.progress.hints[$scope.currentItem.order] < $scope.currentItem.hints.length) {
                return true;
            }
            return false;
        };

        // hints
        $scope.progress.hints[$scope.currentItem.order] = 0;

        $scope.addToRepository = function(item){
            var inventoryEntry = {};

            inventoryEntry.image = item.image;

            inventoryEntry.description = item.descriptionItem;
            inventoryEntry.title = item.title;
            inventoryEntry.hints = [];
            for (var i=0; i < item.hints.length; i++ ){
                inventoryEntry.hints.push(item.hints[i].image);
            }
            return inventoryEntry;
        };


        $scope.setScannedState = function(){

            $scope.setCompletedState();


            $scope.progress.totalItemsFound++;
            $scope.progress.inventory.push($scope.addToRepository($scope.currentItem));


            // set history
            $scope.progress.history[$scope.currentItem.order] = "scanned";

        };

        $scope.setLastItem = function(){
            $scope.lastItem = true;
        };

        $scope.goToNextItem = function(){
            var next = parseInt ($scope.currentItem.order, 10) + 1;
            window.location = "#/items/" + next;
        };


        $scope.checkThis = function() {
            QRScanService.scan(function(result) {
                if (result.cancelled) {
                   // hack for bug with qr code scanner http://marsbomber.com/2014/05/29/BarcodeScanner-With-Ionic/
                   alert("Scan cancelled!");


                } else {
                    // todo: check lowercase
                    if(result.text == $scope.currentItem.qrcode){
                        $scope.setScannedState();

                    }
                    else {
                        //alert("Sorry that is not the correct qrcode!");
                    }

                }
            }, function(error) {

            });

        }

        $rootScope.quest = $scope.quest;
        $rootScope.progress = $scope.progress;
        window.localStorage['quest'] = JSON.stringify($scope.quest);
        window.localStorage['progress'] = JSON.stringify($scope.progress);
    });


