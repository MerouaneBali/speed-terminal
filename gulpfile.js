const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));

function buildStyles() {
  return gulp
    .src('./src/scss/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./src/css'));
}

function watch() {
  gulp.watch('./src/scss/**/*.scss').on('change', buildStyles);
}

exports.buildStyles = buildStyles;
exports.watch = watch;
