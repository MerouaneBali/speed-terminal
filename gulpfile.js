var gulp = require("gulp");
var sass = require("gulp-sass")(require("sass"));

function buildStyles() {
  return gulp
    .src("./public/scss/**/*.scss")
    .pipe(sass.sync().on("error", sass.logError))
    .pipe(gulp.dest("./public/css"));
}

function watch() {
  gulp.watch("./public/scss/**/*.scss").on("change", buildStyles);
}

exports.buildStyles = buildStyles;
exports.watch = watch;
