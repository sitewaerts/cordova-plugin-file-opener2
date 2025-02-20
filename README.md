# A File Opener Plugin for Cordova

[![Latest Stable Version](https://img.shields.io/npm/v/cordova-plugin-file-opener2.svg)](https://www.npmjs.com/package/cordova-plugin-file-opener2) [![Total Downloads](https://img.shields.io/npm/dt/cordova-plugin-file-opener2.svg)](https://npm-stat.com/charts.html?package=cordova-plugin-file-opener2)

This plugin will open a file on your device file system with its default application.

```js
cordova.plugins.fileOpener2.open(
    filePath,
    fileMIMEType,
    {
        error : function(){ },
        success : function(){ }
    }
);
```

## Installation

```shell
$ cordova plugin add cordova-plugin-file-opener2
```

## Requirements

The following platforms and versions are supported by the latest release:

- Android 4.4+ / iOS 9+ / Windows / Electron
- Cordova CLI 7.0 or higher

Cordova CLI 6.0 is supported by 2.0.19, but there are a number of issues, particularly with Android builds (see [232](https://github.com/pwlin/cordova-plugin-file-opener2/issues/232) [203](https://github.com/pwlin/cordova-plugin-file-opener2/issues/203) [207](https://github.com/pwlin/cordova-plugin-file-opener2/issues/207)). Using the [cordova-android-support-gradle-release](https://github.com/dpa99c/cordova-android-support-gradle-release) plugin may help.

### Android

#### AndroidX Support

This plugin supports AndroidX out of the box.


__Note:__ The author of the app has to make sure that the permission is listed in the manifest. 
You may add the following lines to config.xml to achieve this, if you want images, videos and audios managed by other 
apps to be accessible:

Android starting with version 13.0

see https://support.google.com/googleplay/android-developer/answer/14115180
```xml
<platform name="android">
    <config-file target="app/src/main/AndroidManifest.xml" parent="/manifest"
                 xmlns:android="http://schemas.android.com/apk/res/android">
        <uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>
        <uses-permission android:name="android.permission.READ_MEDIA_VIDEO"/>
        <uses-permission android:name="android.permission.READ_MEDIA_AUDIO"/>
    </config-file>
</platform>
```


## fileOpener2.open(filePath, mimeType, options)

Opens a file

### Supported Platforms

- Android 4.4+
- iOS 9+
- Windows
- Electron

### Quick Examples
Open an APK install dialog:

```javascript
cordova.plugins.fileOpener2.open(
    '/Downloads/gmail.apk',
    'application/vnd.android.package-archive'
);
```

Open a PDF document with the default PDF reader and optional callback object:

```js
cordova.plugins.fileOpener2.open(
    '/Download/starwars.pdf', // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Downloads/starwars.pdf
    'application/pdf',
    {
        error : function(e) {
            console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
        },
        success : function () {
            console.log('file opened successfully');
        }
    }
);
```

__Note on Electron:__ Do not forget to enable Node.js in your app by adding `"nodeIntegration": true` to `platforms/electron/platform_www/cdv-electron-settings.json` file, See [Cordova-Electron documentation](https://cordova.apache.org/docs/en/latest/guide/platforms/electron/index.html#customizing-the-application's-window-options).

### Market place installation
Install From Market: to install an APK from a market place, such as Google Play or the App Store, you can use an `<a>` tag in combination with the `market://` protocol:

```html
<a href="market://details?id=xxxx" target="_system">Install from Google Play</a>
<a href="itms-apps://itunes.apple.com/app/my-app/idxxxxxxxx?mt=8" target="_system">Install from App Store</a>
```
or in code:

```js
window.open("[market:// or itms-apps:// link]","_system");
```

## fileOpener2.showOpenWithDialog(filePath, mimeType, options)

Opens with system modal to open file with an already installed app.

### Supported Platforms

- Android 4.4+
- iOS 9+

### Quick Example

```js
cordova.plugins.fileOpener2.showOpenWithDialog(
    '/Downloads/starwars.pdf', // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Downloads/starwars.pdf
    'application/pdf',
    {
        error : function(e) {
            console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
        },
        success : function () {
            console.log('file opened successfully');
        },
        pos : [0, 0] // needed on iPad to avoid ui errors 
    }
);
```
`position` array of coordinates from top-left device screen, use for iOS dialog positioning.

## fileOpener2.uninstall(packageId, callbackContext)

Uninstall a package with its ID. 

__Note__: You need to add `<uses-permission android:name="android.permission.REQUEST_DELETE_PACKAGES" />` to your `AndroidManifest.xml`

### Supported Platforms

- Android 4.4+

### Quick Example
```js
cordova.plugins.fileOpener2.uninstall('com.zynga.FarmVille2CountryEscape', {
    error : function(e) {
        console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
    },
    success : function() {
        console.log('Uninstall intent activity started.');
    }
});
```

## fileOpener2.appIsInstalled(packageId, callbackContext)

Check if an app is already installed.

### Supported Platforms

- Android 4.4+

### Quick Example
```javascript
cordova.plugins.fileOpener2.appIsInstalled('com.adobe.reader', {
    success : function(res) {
        if (res.status === 0) {
            console.log('Adobe Reader is not installed.');
        } else {
            console.log('Adobe Reader is installed.')
        }
    }
});
```
---

## Android APK installation limitation

The following limitations apply when opening an APK file for installation:
- On Android 8+, your application must have the `ACTION_INSTALL_PACKAGE` permission. You can add it by adding this to your app's `config.xml` file:
```xml
<platform name="android">
    <config-file parent="/manifest" target="AndroidManifest.xml" xmlns:android="http://schemas.android.com/apk/res/android">
        <uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES" />
    </config-file>
</platform>
```

- Before Android 7, you can only install APKs from the "external" partition. For example, you can install from `cordova.file.externalDataDirectory`, but **not** from `cordova.file.dataDirectory`. Android 7+ does not have this limitation.

---

## SD card limitation on Android

It is not always possible to open a file from the SD Card using this plugin on Android. This is because the underlying  Android library used [does not support serving files from secondary external storage devices](https://stackoverflow.com/questions/40318116/fileprovider-and-secondary-external-storage). Whether or not your the SD card is treated as a secondary external device depends on your particular phone's set up.

---

## Notes

- For properly opening _any_ file, you must already have a suitable reader for that particular file type installed on your device. Otherwise this will not work.

- [It is reported](https://github.com/pwlin/cordova-plugin-file-opener2/issues/2#issuecomment-41295793) that in iOS, you might need to remove `<preference name="iosPersistentFileLocation" value="Library" />` from your `config.xml`

- If you are wondering what MIME-type should you pass as the second argument to `open` function, [here is a list of all known MIME-types](http://svn.apache.org/viewvc/httpd/httpd/trunk/docs/conf/mime.types?view=co)


---


