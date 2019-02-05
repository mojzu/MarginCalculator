# Margin Calculator

Margin and markup calculator with currency conversion.

## Built With

- [Ionic](https://ionicframework.com/)
- [ngrx](https://github.com/ngrx)
- [ECB Exchange Rates](https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html)

## Developer

```Shell
# Clone repository and install dependencies.
$ npm install
$ npx cap sync
# Run linter.
$ npm run lint
# Ionic serve development web server.
$ npm run start
# Ionic build (for production).
$ npm run build|build-prod
$ npx cap copy
# Android release.
$ npm run build-android
$ npx cap update
# Build signed APK using Android Studio.
# (Android Studio) Build -> Generate Signed APK...
# (Android Studio) Select "keystore.jks", key alias "margin-calculator".
# (Android Studio) Select build type, all signature versions.
# (Android Studio) Build output in "android/app/release/app-release.apk"
```

### Release

- [Deploying](https://ionicframework.com/docs/intro/deploying/)

```Shell
# ./release/release.sh
rm -rf release/app.apk
ionic cordova build android --prod --release
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore release/my-release-key.jks platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk my-key-alias
zipalign -v 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk release/app.apk
apksigner verify release/app.apk
```

TODO(H): Ionic 4 upgrade.

### Android Studio

Add to `.bashrc`.

```Shell
# Android SDK tools.
export ANDROID_HOME="/home/$USER/Android/Sdk"
export ANDROID_STUDIO="/home/$USER/android-studio"
export PATH="$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$ANDROID_HOME/build-tools/28.0.2:$ANDROID_STUDIO/gradle/gradle-4.4/bin"
export JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64"
```
