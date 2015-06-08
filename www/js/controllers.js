angular.module('cityquest.controllers', ['cityquest.services', 'ngCordova'])

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
    .controller ('CityquestLoadDebugCtrl',
    function ($scope, quest, progress, $cordovaFileTransfer, $ionicPlatform, $timeout, $cordovaFile) {
        $scope.images_downloaded = false;
        /* Image downloader */
        $scope.downloadImages = function () {
            //console.log ($scope.quest.details.items);
            for (var i = 0; i < $scope.quest.details.items.length; i++) {
                console.log ('item' + i);
                var target = cordova.file.dataDirectory + $scope.quest.details.items[i].itemid;
                var source = $scope.quest.details.items[i].remote_image;
                $cordovaFileTransfer.download (source, target, {}, true)
                    .then (function (result) {
                        console.log ('download');
                    }, function (error) {
                        console.log ('error');
                    }, function (progressed) {
                        $timeout (function () {
                            console.log ('wait');
                            $scope.downloadProgress = (progressed.loaded / progressed.total) * 100;
                        })
                    })
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
            $scope.downloadImages ();
            $scope.images_downloaded = true;
        });
        /* If images_downloaded is true, redirect */
        $scope.$watch ('images_downloaded', function (newValue) {
            if (newValue == true) {
                $scope.ff = cordova.file.dataDirectory + $scope.quest.details.items[0].itemid;
            }
            window.location = "#/load";
        });
        /*
        $scope.$watch ('quest', function (newValue) {
            if (typeof (newValue.details.items) != 'undefined') {
                console.log ('wait_for_ready');
                $ionicPlatform.ready(function() {
                    console.log ('watch');

                    if (typeof ($scope.quest.details.items) == 'string') {
                        $scope.quest.details.items = JSON.parse ($scope.quest.details.items);
                    }
                    for (var i = 0; i < $scope.quest.details.items.length; i++) {
                        var target = $cordovaFile.files + $scope.quest.details.items[i].itemid;
                        var source = $scope.quest.details.items[i].remote_image;
                        $cordovaFileTransfer.download (source, target, {}, true)
                            .then (function (result) {

                                console.log ('success:' + $scope.quest.details.items[i].itemid);
                            }, function (error) {
                                console.log (error);
                            }, function (progressed) {
                                $timeout (function () {
                                    console.log ('wait:' + $scope.quest.details.items[i].itemid);
                                    $scope.downloadProgress = (progressed.loaded / progressed.total) * 100;
                                })
                            }
                        )
                    }
                });
            }
        });*/
    })
    .controller('CityquestLoadCtrl', function ($scope, $rootScope, $stateParams, $http, $ionicLoading, ImgCache, $cordovaFileTransfer, $timeout, $cordovaFile, $ionicPlatform) {
        /*$scope.downloaded = false;
        //$scope.quest = {};*/
        $scope.init = function(){
            // check if application has already loaded quest data in this session
            if(typeof $rootScope.quest !== "undefined" ){
                $scope.quest = $rootScope.quest;
            }
            // load the data from localstorage or external
            else {
                // check if there is a localStorage session present
                if(localStorage.getItem("quest") !== null) {
                    // load quest from localstorage
                    $scope.quest = JSON.parse(window.localStorage['quest'] || '{}');
                    $rootScope.quest = $scope.quest;

                    // check if there is progress stored in local storage
                    if(localStorage.getItem("progress") !== null) {
                        // load quest from localstorage
                        $scope.progress = JSON.parse(window.localStorage['progress'] || '{}');
                        $rootScope.progress = $scope.progress;
                    }
                }
            }
        };
        $scope.init();

/*
        $scope.getFilenameFromString = function(image){
            if(typeof image !== "undefined"){
                var filename = image.split("/");
                return filename[1];
            }
        };
           */
        /*$scope.downloadAll = function(){
            // download everything
            $scope.download($scope.quest.details.imageFile);
            $scope.download($scope.quest.details.map.url);

            for(var i = 0; i < $scope.quest.details.items.length; i++ ){
                $scope.download($scope.quest.details.items[i].image);
                for(var j = 0; j < $scope.quest.details.items[i].hints.length; j++ ) {
                    $scope.download($scope.quest.details.items[i].hints[j].image);
                }

            }
        };

        $scope.download = function(image) {
            var filename = $scope.getFilenameFromString(image);
            if( filename !== undefined){
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
                    fs.root.getDirectory(
                        'resources',
                        {
                            create: true
                        },
                        function(dirEntry) {
                            dirEntry.getFile(
                                filename,
                                {
                                    create: true,
                                    exclusive: false
                                },
                                function gotFileEntry(fe) {
                                    var p = fe.toURL();
                                    fe.remove();
                                    ft = new FileTransfer();
                                    ft.download(
                                        /*encodeURI(*//*"http://cityquest.be/" + image/*)*//*,
                                        p,
                                        function(entry) {

                                            $scope.imgFile = entry.toURL();
                                           // alert ($scope.imgFile);
                                            var baseUrl = $scope.imgFile.split("resources");
                                            $scope.baseUrl = baseUrl[0];
                                            //alert ($scope.baseUrl);
                                        },
                                        function(error) {
                                            alert("Download Error Source -> " + error.source);
                                        },
                                        false,
                                        null
                                    );
                                },
                                function() {
                                    console.log("Get file failed");
                                }
                            );
                        }
                    );
                });
            }
        }

*/
        $scope.loadQuest = function(key){

            alert("One moment ... trying to load " + key);
            $http.get('http://cityquest.be/en/api/key/' + key).then(function(resp) {
                alert('Success! Quest loaded!');
                console.log('Success', resp);
                $scope.quest = resp.data;

                // write to localstorage
                // For JSON responses, resp.data contains the result

                //$scope.downloadAll();
                /*
                Cache all images
                 *//*
                ImgCache.$promise.then (function () {
                    ImgCache.cacheFile ($scope.quest.details.remote_imageFile);
                });
                if (typeof ($scope.quest.details.items) == 'string') {
                    $scope.quest.details.items = JSON.parse ($scope.quest.details.items);
                }
                for (var i = 0; i < $scope.quest.details.items.length; i++) {
                    console.log ('caching');
                    console.log (i);
                    //console.log ($scope.quest.details.items[i]);
                    var item  = $scope.quest.details.items[i];
                    $scope.i = i;
                    console.log (item);
                    ImgCache.$promise.then (function () {
                        ImgCache.cacheFile ($scope.quest.details.items[$scope.i].remote_image, function () {
                            ImgCache.getCachedFileURL ($scope.quest.details.items[$scope.i].remote_image, function (img, newPath) {
                                $scope.quest.details.items[$scope.i].cached_image = newPath;
                                console.log ('Cache');
                                console.log (newPath);
                                console.log ($scope.quest.details);
                            }, function (img) {
                                console.log ('Failed');
                                console.log (img);
                            });
                        });
                    });*/
                    /* Hints */
                    /*if (typeof ($scope.quest.details.items[i].hints) == 'string') {
                     $scope.quest.details.items[i].hints = JSON.parse ($scope.quest.details.items[i].hints);
                    }
                    for (var j = 0; j < $scope.quest.details.items[i].hints.length; i++) {
                        ImgCache.$promise.then (function (i, j) {
                            ImgCache.cacheFile ($scope.quest.details.items[i].hints[j].remote_image);
                        });
                    }*/
                //}
                window.localStorage['quest'] = JSON.stringify($scope.quest);

            }, function(err) {
                console.error('ERR', err);
                alert("Something went wrong. Check your key!");
                // err.status will contain the status code
            });

        };

        $scope.resumeQuest = function(){
            $rootScope.progress = $scope.progress;
            $rootScope.quest    = $scope.quest;

            //alert($scope.progress.activeItem);
            if (typeof $scope.progress.activeItem === "undefined"){
                window.location = "#/cityquest";
            }
            else {
                window.location = "#/items/" +  $scope.progress.activeItem.order;
            }
        };

        $scope.startQuest = function(){
            if(!$scope.baseUrl){
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
        }

        $rootScope.quest = $scope.quest;
        $rootScope.progress = $scope.progress;

    })


    .controller('CityquestIndexCtrl', function ($scope, $rootScope, $location, $state, ImgCache) {
        $scope.quest = $rootScope.quest;
        $scope.progress = $rootScope.progress;
        /* Force use of Cached File */
        ImgCache.$promise.then (function () {
            ImgCache.cacheFile ($scope.quest.details.remote_imageFile);
        });
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
        }
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
        /*console.log ($rootScope.quest.details.items);
        console.log (JSON.stringify ($rootScope.quest.details.items));
        console.log ($stateParams.itemId);*/
        $scope.currentItem = $scope.getItemByValue($rootScope.quest.details.items, $stateParams.itemId);
        /*
         ImgCache for hints
         */
        ImgCache.$promise.then (function () {
            ImgCache.cacheFile ($scope.currentItem.remote_image);
        });
        var hints = Array ();
        for (var i = 0; i < $scope.currentItem.hints.length; i++) {
            ImgCache.$promise.then (function (i) {
                ImgCache.cacheFile ($scope.currentItem.hints[i].remote_image);
            });
        }
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


