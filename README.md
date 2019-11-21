# GWSimplyMobileApp

```
ref: https://flatuicolors.com/
ref: https://www.flaticon.com

<firebase>
ref: https://medium.com/@doyinolarewaju/firebase-adding-extra-information-to-user-on-sign-up-and-other-tips-4ebe215866e
ref: https://firebase.google.com/docs/reference/js/firebase.User#reload

<Track Player>
ref: https://www.npmjs.com/package/react-native-track-player

ref: https://github.com/filipemerker/flatlist-performance-tips
ref: https://github.com/stoffern/react-native-optimized-flatlist/blob/master/src/OptimizedFlatList.js
ref: http://github.com/invertase/react-native-firebase-docs/blob/master/docs/auth/reference/auth.md
ref: https://stackoverflow.com/questions/40924180/add-loading-screen-when-app-launches
ref: https://stackoverflow.com/questions/38580858/how-to-change-display-name-of-an-app-in-react-native
ref: https://medium.com/react-native-development/change-splash-screen-in-react-native-android-app-74e6622d699
ref: https://medium.com/differential/react-native-basics-using-react-native-router-flux-f11e5128aff9
ref: https://github.com/aksonov/react-native-router-flux/blob/master/docs/API.md
ref: https://github.com/aksonov/react-native-router-flux/blob/master/docs/v3/DETAILED_EXAMPLE.md
ref: https://github.com/GeekyAnts/NativeBase-KitchenSink
ref: https://stackoverflow.com/questions/49113281/is-there-any-solution-to-update-drawer-in-react-native-router-flux-from-another 

ref: https://github.com/tanguyantoine/react-native-music-control

<Lecture for backgroud running>
ref: https://github.com/react-native-kit/react-native-track-player/wiki/Background-Mode

<Lecture for react native>
ref: https://www.youtube.com/watch?v=EWiKV8wUUWM
ref: https://www.youtube.com/watch?v=_awnyW-9aJ8
ref: https://www.youtube.com/watch?v=AslncyG8whg

<Vector Icons>
ref: https://github.com/oblador/react-native-vector-icons

<Swipe to delete>
ref: https://shellmonger.com/2017/08/07/implementing-swipe-right-on-a-react-native-flatlist/
ref: https://medium.com/@bdougie/adding-swipe-to-delete-in-react-native-cfa85a5f5a31

<TTS>
ref: https://github.com/ak1394/react-native-tts
ref: https://dev-yakuza.github.io/en/react-native/react-native-tts/
ref: https://github.com/naoufal/react-native-speech

<inApp store>
ref: https://medium.com/@abhayg772/implementing-in-app-purchase-in-react-native-application-3798ca2de5bb


<Command To fix error when just clone and build>
cd node_modules/react-native/scripts && ./ios-install-third-party.sh && cd ../../../
cd node_modules/react-native/third-party/glog-0.3.5/ && ../../scripts/ios-configure-glog.sh && cd ../../../../

<fix android build duplicate resource>
https://stackoverflow.com/questions/53239705/react-native-error-duplicate-resources-android

doLast {
    def moveFunc = { resSuffix ->
        File originalDir = file("$buildDir/generated/res/react/release/drawable-${resSuffix}");
        if (originalDir.exists()) {
            File destDir = file("$buildDir/../src/main/res/drawable-${resSuffix}");
            ant.move(file: originalDir, tofile: destDir);
        }
    }
    moveFunc.curry("ldpi").call()
    moveFunc.curry("mdpi").call()
    moveFunc.curry("hdpi").call()
    moveFunc.curry("xhdpi").call()
    moveFunc.curry("xxhdpi").call()
    moveFunc.curry("xxxhdpi").call()
}

<fix android>
Error: Your app currently targets API level 26 and must target at least API level 28 to ensure it is built on the latest APIs optimized for security and performance

buildscript {
    ext {
        buildToolsVersion = "27.0.3"
        minSdkVersion = 16
        compileSdkVersion = 27
        targetSdkVersion = 33
        supportLibVersion = "27.1.1"
    }
    repositories {
        google()
        jcenter()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:3.2.1'

        // NOTE: Do not place your application dependencies here; they belong
        // in the individual module build.gradle files
    }
}

<fix android>
Error: this release is not compliant with the google play 64-bit requirement
ndk.abiFilters 'armeabi-v7a','arm64-v8a','x86','x86_64'

<Clean android build>
cd android && ./gradlew cleanBuildCache

```
watchman watch-del-all
{
    "version": "4.9.0",
    "roots": [
        "/Users/yschang/workspace/classona",
        "/Users/yschang/workspace/sample"
    ]
}
➜  react-native start --reset-cache
```