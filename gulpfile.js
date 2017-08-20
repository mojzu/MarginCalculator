"use strict";
const path = require("path");
const gulp = require("gulp");
const gutil = require("gulp-util");
const clean = require("./gulp/clean.js");
const shell = require("./gulp/shell.js");

// Application package path and file.
const packagePath = path.resolve(__dirname);
const packageJson = require("./package.json");

// Android application paths.
const androidPath = path.resolve(packagePath, "android");
// TODO: Copy app-release.apk file to release directory.

// Delete build files.
gulp.task("clean", (done) => {
  clean.run(packagePath, [
    "dist",
    "*.log",
  ], done);
});

// Clean and delete modules, Jest cache.
gulp.task("distclean", ["clean"], (done) => {
  clean.run(packagePath, ["node_modules", ".jest"], done);
});

// Run TypeScript compiler.
gulp.task("tsc", ["clean"], (done) => shell.run("tsc", packagePath, done));
gulp.task("tsc:w", ["clean"], (done) => shell.run("tsc --watch", packagePath, done));

// Run linter.
gulp.task("lint", (done) => {
  shell.run("tslint -c tslint.json -p tsconfig.json --type-check", packagePath, done);
});

// Run Android application.
gulp.task("android", ["tsc"], (done) => {
  shell.run("react-native run-android", packagePath, done);
});

// Build release application(s).
gulp.task("release-android", ["lint", "tsc"], (done) => {
  shell.run("./gradlew assembleRelease", androidPath, done);
});
gulp.task("release", ["release-android"]);
