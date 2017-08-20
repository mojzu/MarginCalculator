# MarginCalculator

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

For live reload during development run the following commands in separate terminals.

```Shell
$ yarn run tsc:w
$ yarn run android
```
