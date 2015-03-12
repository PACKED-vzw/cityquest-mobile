# README #

This is the *www* directory of an ionic app. See: http://ionicframework.com/docs/guide/preface.html
Install ionic and replace www folder by this one.

For now no apps were submitted to the play or appstore. For android we used the build debug .apk and placed it under the webroot of cityquest.be (/var/www/cityquest/web/cq.apk) and the ios was tested using the testflight program of apple (https://developer.apple.com/testflight/)

## Installation ##

You will need to install:
1) cordova & ionic using npm
2) sdk for android & ios

### Install ionic ###

http://ionicframework.com/docs/guide/installation.html

### install sdks for android and ios ###
* android: http://developer.android.com/sdk/index.html
* ios: download latest xcode from the App Store

### Install  cordova crosswalk ###

Problems with old version of the android browser ( for versions of android < 4) caused the app to crash at startup. This is fixed by using cordova crosswalk: see http://ionicframework.com/blog/crosswalk-comes-to-ionic/

###Add platforms ###

add ios & android platform

```
ionic platform add ios
```
```
ionic platform add android
```
###Add plugins###

* com.phonegap.plugins.barcodescanner 2.0.1 "BarcodeScanner"
* org.apache.cordova.file 1.3.1 "File"
* org.apache.cordova.file-transfer 0.4.7 "File Transfer"

```
ionic plugin add com.phonegap.plugins.barcodescanner
```
```
ionic plugin add org.apache.cordova.file
```
```
ionic plugin add org.apache.cordova.file-transfer
```


## build ##
to build a new version run following commands in the directory:

for android


```
ionic build android
```


for ios

```
ionic build ios
```


## translation ##

For adding angular translation many options are available. For example:

* http://angular-translate.github.io/
* https://angular-gettext.rocketeer.be/

