# MarginCalculator

Margin and markup calculator with currency conversion.

## Built With

-   [React Native](https://facebook.github.io/react-native/)
-   [Redux](http://redux.js.org/docs/introduction/)
-   [Fixer.io](http://fixer.io/)

## Developer

Clone repository, install dependencies with `yarn install` and run scripts: `yarn run ...`

| Script      | Description                                                  |
| ----------- | ------------------------------------------------------------ |
| `clean`     | Clean compiled files.                                        |
| `distclean` | Clean and remove Node modules.                               |
| `tsc[:w]`   | Run [TypeScript](https://www.typescriptlang.org/) compiler.  |
| `lint`      | Run [TSLint](https://palantir.github.io/tslint/) on project. |
| `android`   | Run application on Android virtual device.                   |
| `release`   | Build Android release `APK` file.                            |

For live reload during development run the following commands.

```Shell
$ yarn run tsc:w
$ yarn run android
```

To upgrade React Native version.

```Shell
$ sudo yarn global add react-native-git-upgrade
$ react-native-git-upgrade
```
