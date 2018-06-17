# Margin Calculator

Margin and markup calculator with currency conversion.

## Built With

- [Ionic](https://ionicframework.com/)
- [ngrx](https://github.com/ngrx)

## Developer

```Shell
# Clone repository and install dependencies.
$ npm install
$ cordova platform add android
# Clean compiled files.
$ npm run clean
# Run linter.
$ npm run lint
# Ionic serve development web server.
$ ionic serve
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
