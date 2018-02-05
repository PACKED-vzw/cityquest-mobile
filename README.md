# cityquest-mobile
CityQuest allows cultural organisations to easily create a quest online, and publish it to a mobile app.   Send your visitors around the city to discover items from your collection and the locations they are connected to. Based on hints and media you track down an item, scan the QR code on its location and learn the (hi)story behind it.
 
This is the mobile application, used for following quests. Works on Android and iOS.
 
Documentation may be found at the [AthenaPlus wiki](http://wiki.athenaplus.eu/index.php/CityQuest).
 
Cityquest was created by [PACKED vzw](http://packed.be/) as part of the [AthenaPlus project](http://www.athenaplus.eu/) funded by the European Commission.

## Compilation instructions
### SDK's
To build applications for Android and/or iOS, you will need to install the SDK for either or both of them. Please not that you cannot create iOS-applications on non-Apple platforms.
#### Android
Download the SDK from [http://developer.android.com/sdk/index.html](http://developer.android.com/sdk/index.html).
#### iOS
Install the latest version of XCode from the App Store.
### Install ionic
_Installation instructions are at [http://ionicframework.com/docs/guide/installation.html](http://ionicframework.com/docs/guide/installation.html)._

To install ionic, you will need [node.js](http://nodejs.org) and npm. To compile this Android application, [Cordova](http://cordova.apache.org) must be installed as well.

Execute the following commands:

`npm install -g cordova`

`npm install -g ionic`

### Create project
The Cityquest git repository contains the entire ionic project, so there is no need to execute `ionic start`. You will need however to configure the Android and/or iOS platforms if you want to build the application for this project.

All the following commands must be executed from the directory you downloaded the Cityquest source code to (e.g. `/Users/Cityquest/Workspace/Cityquest`)

```
ionic platform add ios
ionic platform add android
```

### Plugins
You will need to add the following plugins:

* com.phonegap.plugins.barcodescanner
* org.apache.cordova.file
* org.apache.cordova.file-transfer
* org.apache.cordova.device
* org.apache.cordova.network-information

Add them using the following command:

`ionic plugin add *plugin_name*`

### Compilation
_For detailed information on creating Android applications using ionic, see [http://ionicframework.com/docs/guide/publishing.html](http://ionicframework.com/docs/guide/publishing.html)_

To compile and build your applications, use either of the following commands (depending on whether you are building for Android or for iOS):

```
ionic build android
ionic build ios
```

To test your application, use can use `ionic emulate android`. Depending on your Android SDK settings, this will start the Android emulator.
