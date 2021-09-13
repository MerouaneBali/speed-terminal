const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const jsdoc = require('gulp-jsdoc3');
const browserSync = require('browser-sync').create();
const jsdocConfig = require('./jsdoc.conf.json');

const buildStyles = () =>
  gulp
    .src('./src/scss/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./src/css'));

const generateDocumentation = (cb) =>
  gulp.src(['README.md'], { read: false }).pipe(jsdoc(jsdocConfig, cb));

function watch() {
  browserSync.init({
    notify: false,
    server: {
      baseDir: './docs',
    },
  });

  gulp.watch('./src/scss/**/*.scss').on('change', buildStyles);
  gulp
    .watch(['./src/**/*.js', './src/**/*.jsx'])
    .on('change', generateDocumentation);
  gulp.watch('./docs/**/*.*').on('change', browserSync.reload);
}

exports.buildStyles = buildStyles;
exports.watch = watch;
